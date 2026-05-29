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