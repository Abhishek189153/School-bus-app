const School = require("../models/school.model");

exports.createSchool = async (req, res) => {

    try {

        const school = await School.create(req.body);

        res.status(201).json({
            success: true,
            school
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.getSchools = async (req, res) => {

    try {

        const schools = await School.find();

        res.status(200).json({
            success: true,
            schools
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};