const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Student = require("../models/student.model");
const Bus = require("../models/bus.model");


exports.createParent = async (req, res) => {

    try {

        const {
            name,
            phone,
            password,
        } = req.body;

        const existingParent =
            await User.findOne({
                phone,
            });

        if (existingParent) {

            return res.status(400).json({
                success: false,
                message: "Parent already exists",
            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const parent =
            await User.create({
                name,
                phone,
                password: hashedPassword,
                role: "PARENT",
                schoolId: req.user.schoolId,
            });

        const parentResponse =
            parent.toObject();

        delete parentResponse.password;

        res.status(201).json({
            success: true,
            parent: parentResponse,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getParents = async (req, res) => {

    try {

       const parents =
        await User.find({
            schoolId: req.user.schoolId,
            role: "PARENT",
        }).select("-password");

        const parentsWithStudents =
        await Promise.all(
            parents.map(
            async (parent) => {

                const students =
                    await Student.find({
                        parentId: parent._id,
                    });

                    return {
                    ...parent.toObject(),
                    studentName:
                        students.length > 0
                        ? students
                            .map(
                                (student) =>
                                `${student.name}(${student.admissionNumber})`
                            )
                            .join(", ")
                        : "N/A",
                    };
            }
            )
        );

        res.status(200).json({
        success: true,
        parents: parentsWithStudents,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.getParentById = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            ).select("-password");

        if (!parent) {

            return res.status(404).json({
                success: false,
                message: "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        res.status(200).json({
            success: true,
            parent,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.updateParent = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            );

        if (!parent) {

            return res.status(404).json({
                success: false,
                message: "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        const updatedParent =
            await User.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                }
            ).select("-password");

        res.status(200).json({
            success: true,
            parent: updatedParent,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

exports.deleteParent = async (req, res) => {

    try {

        const parent =
            await User.findById(
                req.params.id
            );

        if (!parent) {

            return res.status(404).json({
                success: false,
                message: "Parent not found",
            });

        }

        if (
            parent.schoolId.toString() !==
            req.user.schoolId.toString()
        ) {

            return res.status(403).json({
                success: false,
                message: "Access denied",
            });

        }

        await User.findByIdAndDelete(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Parent deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};


exports.getParentDashboard =
async (req, res) => {

 console.log(
    "Parent Dashboard API Hit"
  );

  try {

    const parent =
      await User.findById(
        req.user.id
      );

    const students =
      await Student.find({
        parentId: parent._id,
      })
      .populate(
        "busId",
        "busNumber driverId"
      )
      .populate(
        "routeId",
        "routeName"
      );

    if (
      !students.length
    ) {

      return res.status(404).json({
        success: false,
        message:
          "No student found",
      });

    }

    const firstStudent =
      students[0];

    const bus =
      await Bus.findById(
        firstStudent.busId._id
      ).populate(
        "driverId",
        "name phone",
      );

   


    res.status(200).json({
      success: true,

      studentName:
        firstStudent.name,

      routeName:
        firstStudent.routeId?.routeName,

      pickupStop:
        firstStudent.pickupStop,

      busNumber:
        bus.busNumber,

     vehicleNumber:
        bus.vehicleNumber,

      driverName:
        bus.driverId?.name,

      driverPhone:
        bus.driverId?.phone,

      totalStudents:
        students.length,

      students,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};