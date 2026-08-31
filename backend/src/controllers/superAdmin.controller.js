const School = require("../models/school.model");
const User = require("../models/user.model");
const Student = require("../models/student.model");
const Bus = require("../models/bus.model");

exports.getDashboard = async (req, res) => {
  try {
    // =========================================================
    // PAGINATION
    // =========================================================

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 5, 1),
      50
    );

    const skip = (page - 1) * limit;

    // =========================================================
    // DASHBOARD TOTALS + PAGINATED SCHOOLS
    // =========================================================

    const [
      totalSchools,
      totalAdmins,
      totalStudents,
      totalBuses,
      schools,
    ] = await Promise.all([
      // Total schools
      School.countDocuments(),

      // Total school administrators
      User.countDocuments({
        role: "SCHOOL_ADMIN",
      }),

      // Total students
      Student.countDocuments(),

      // Total buses
      Bus.countDocuments(),

      // =======================================================
      // GET ONLY THE SCHOOLS FOR THE CURRENT PAGE
      // =======================================================

      School.aggregate([
        {
          $sort: {
            createdAt: -1,
            _id: -1,
          },
        },

        {
          $skip: skip,
        },

        {
          $limit: limit,
        },

        // =====================================================
        // COUNT STUDENTS FOR EACH SCHOOL
        // =====================================================

        {
          $lookup: {
            from: "students",
            let: {
              schoolId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$schoolId", "$$schoolId"],
                  },
                },
              },
              {
                $count: "count",
              },
            ],
            as: "studentStats",
          },
        },

        // =====================================================
        // COUNT BUSES FOR EACH SCHOOL
        // =====================================================

        {
          $lookup: {
            from: "buses",
            let: {
              schoolId: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$schoolId", "$$schoolId"],
                  },
                },
              },
              {
                $count: "count",
              },
            ],
            as: "busStats",
          },
        },

        // =====================================================
        // CREATE SIMPLE COUNTS
        // =====================================================

        {
          $addFields: {
            totalStudents: {
              $ifNull: [
                {
                  $arrayElemAt: ["$studentStats.count", 0],
                },
                0,
              ],
            },

            totalBuses: {
              $ifNull: [
                {
                  $arrayElemAt: ["$busStats.count", 0],
                },
                0,
              ],
            },
          },
        },

        // =====================================================
        // REMOVE INTERNAL LOOKUP ARRAYS
        // =====================================================

        {
          $project: {
            studentStats: 0,
            busStats: 0,
          },
        },
      ]),
    ]);

    // =========================================================
    // TOTAL NUMBER OF PAGES
    // =========================================================

    const totalPages = Math.ceil(totalSchools / limit);

    // =========================================================
    // RESPONSE
    // =========================================================

    res.json({
      success: true,

      // Overall dashboard statistics
      totalSchools,
      totalAdmins,
      totalStudents,
      totalBuses,

      // Paginated school list
      schools,

      // Pagination information
      pagination: {
        page,
        limit,
        totalSchools,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (err) {
    console.error("Dashboard Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};