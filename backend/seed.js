
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@ecotrack.com";
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      existingAdmin.role = "Admin";
      await existingAdmin.save();

      console.log("Existing account updated to Admin.");
    } else {
      const password = await bcrypt.hash("123456", 10);

      await User.create({
        name: "Admin User",
        email,
        password,
        role: "Admin",
      });

      console.log("Admin account created successfully.");
    }

    console.log("Email: admin@ecotrack.com");
    console.log("Password: 123456");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
