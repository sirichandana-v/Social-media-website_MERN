const User = require("../models/user");

exports.register = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await User.findOne({ email })
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

        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(201).cookie("token", token, options).json({
            success: true,
            user,
            token,
        });
    } catch (err) {
        res.status(400).json({
            status: false,
            message: err.message
        });
    }
}

exports.login = async(req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                error: "User not found"
            })
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                error: "Incorrect password"
            })
        }
        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token,
        });
    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });
    }

}