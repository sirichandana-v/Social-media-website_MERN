const User = require("../models/user");

exports.register = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                error: "User already exists"
            })
        }
        user = await User.create({
            name,
            email,
            password,
            profilePicture: {
                public_id: "sample",
                url: "sample"
            }
        });

        res.status(201).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            message: err.message
        });
    }
}