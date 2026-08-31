const School = require("../models/school.model");
const User = require("../models/user.model");
const Student = require("../models/student.model");
const Bus = require("../models/bus.model");

exports.getDashboard = async (req, res) => {
  try {
    // =========================================================
    // PAGINATION
    // =========================================================

    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(req.query.limit, 10) || 5,
        1
      ),
      50
    );

    const skip = (page - 1) * limit;

    // =========================================================
    // SEARCH
    // =========================================================

    const search = (req.query.search || "").trim();

    const schoolMatch = {};

    if (search) {
      schoolMatch.schoolName = {
        $regex: search,
        $options: "i",
      };
    }

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
      // -------------------------------------------------------
      // Total schools
      // -------------------------------------------------------

      School.countDocuments(),

      // -------------------------------------------------------
      // Total school administrators
      // -------------------------------------------------------

      User.countDocuments({
        role: "SCHOOL_ADMIN",
      }),

      // -------------------------------------------------------
      // Total students
      // -------------------------------------------------------

      Student.countDocuments(),

      // -------------------------------------------------------
      // Total buses
      // -------------------------------------------------------

      Bus.countDocuments(),

      // -------------------------------------------------------
      // Schools
      // Search + pagination + student/bus counts
      // -------------------------------------------------------

      School.aggregate([
        // =====================================================
        // SEARCH
        // =====================================================

        {
          $match: schoolMatch,
        },

        // =====================================================
        // SORT
        // =====================================================

        {
          $sort: {
            createdAt: -1,
            _id: -1,
          },
        },

        // =====================================================
        // PAGINATION
        // =====================================================

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
                    $eq: [
                      "$schoolId",
                      "$$schoolId",
                    ],
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
                    $eq: [
                      "$schoolId",
                      "$$schoolId",
                    ],
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
                  $arrayElemAt: [
                    "$studentStats.count",
                    0,
                  ],
                },
                0,
              ],
            },

            totalBuses: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    "$busStats.count",
                    0,
                  ],
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
    // SEARCH RESULT COUNT
    // =========================================================

    const filteredSchools = await School.countDocuments(
      schoolMatch
    );

    // =========================================================
    // TOTAL NUMBER OF PAGES
    // =========================================================

    const totalPages = Math.ceil(
      filteredSchools / limit
    );

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

      // Schools for current page
      schools,

      // Pagination
      pagination: {
        page,
        limit,

        // Total matching schools
        totalSchools: filteredSchools,

        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },
    });
  } catch (err) {
    console.error(
      "Dashboard Error:",
      err
    );

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};