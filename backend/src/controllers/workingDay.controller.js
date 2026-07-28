const WorkingDay = require("../models/workingDay.model");

const getWorkingDays = async (req, res) => {

    try {

        let settings = await WorkingDay.findOne({
            schoolId: req.user.schoolId,
        });

        if (!settings) {

            settings = await WorkingDay.create({

                schoolId: req.user.schoolId,

                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: false,

            });

        }

        res.json({
            success: true,
            workingDays: settings,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch working days.",
        });

    }

};

const updateWorkingDays = async (req, res) => {

    try {

        const settings = await WorkingDay.findOneAndUpdate(

            {
                schoolId: req.user.schoolId,
            },

            req.body,

            {
                new: true,
                upsert: true,
            }

        );

        res.json({

            success: true,

            message: "Working days updated successfully.",

            workingDays: settings,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to update working days.",

        });

    }

};

module.exports = {
    getWorkingDays,
    updateWorkingDays,
};