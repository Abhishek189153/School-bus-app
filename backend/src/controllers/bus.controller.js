const Bus = require("../models/bus.model");

exports.createBus = async (req, res) => {

    try {

        const bus =
            await Bus.create(req.body);

        res.status(201).json({
            success: true,
            bus
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};