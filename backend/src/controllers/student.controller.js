const Student = require("../models/student.model");

exports.createStudent = async (req, res) => {

    try {

        const student =
            await Student.create(req.body);

        res.status(201).json({
            success: true,
            student
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getStudents = async (req, res) => {
  try {

    const students = await Student.find({
      schoolId: req.user.schoolId,
    })
    .populate("parentId", "name phone")
    .populate("busId", "busNumber");

    res.status(200).json({
      success: true,
      students,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getStudentById = async (
  req,
  res
) => {

  try {

    const student =
      await Student.findById(
        req.params.id
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateStudent = async (
  req,
  res
) => {

  try {

    const student =
      await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      student,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteStudent = async (
  req,
  res
) => {

  try {

    await Student.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Student deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};