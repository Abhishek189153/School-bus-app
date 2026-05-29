const Route = require("../models/route.model");

exports.createRoute = async (req, res) => {

    try {

        const route =
            await Route.create(req.body);

        res.status(201).json({
            success: true,
            route
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};