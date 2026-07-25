const School = require("../models/school.model");
// const User = require("../models/user.model");
// const bcrypt = require("bcryptjs");

exports.createSchool = 
async (req, res) => {

  try {

    const {
      schoolName,
      address,
      phone,
      email,
    } = req.body;

    // Check if school already exists
    const existingSchool = await School.findOne({
      schoolName,
    });

    if (existingSchool) {

      return res.status(400).json({
        success: false,
        message: "School already exists",
      });

    }

    // Create School
    const school = await School.create({

      schoolName,

      address,

      phone,

      email,

    });

    res.status(201).json({

      success: true,

      message: "School created successfully",

      school,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

exports.getSchools =
async (req, res) => {

  try {

    const schools =
      await School.find();

    res.json({

      success: true,

      schools,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

exports.getSchool =
async (req, res) => {

  try {

    const school =
      await School.findById(
        req.params.id
      );

    res.json({

      success: true,

      school,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

exports.updateSchool =
async (req, res) => {

  try {

    const school =
      await School.findByIdAndUpdate(

        req.params.id,

        req.body,

        {
          new: true,
        }

      );

    res.json({

      success: true,

      school,

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};

exports.deleteSchool =
async (req, res) => {

  try {

    await School.findByIdAndDelete(
      req.params.id
    );

    res.json({

      success: true,

      message:
        "School deleted",

    });

  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};