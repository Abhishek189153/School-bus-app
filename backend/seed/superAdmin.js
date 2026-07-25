const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/user.model");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

async function seedSuperAdmin() {

    const existing = await User.findOne({
        role: "SUPER_ADMIN"
    });

    if (existing) {

        console.log("Super Admin already exists");

        process.exit();

    }

    const password = await bcrypt.hash(
        "admin123",
        10
    );

    await User.create({

        name: "Super Admin",

        email: "admin@schoolbus.com",

        phone: "9999999999",

        password,

        role: "SUPER_ADMIN",

    });

    console.log("Super Admin Created");

    process.exit();

}

seedSuperAdmin();