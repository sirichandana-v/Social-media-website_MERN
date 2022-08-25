const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please enter a name"]
    },

    email: {
        type: String,
        required: [true, "Please enter a name"],
        unique: [true, "Email already exists"]
    },

    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
    },

    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    }],

    profilePicture: {
        public_id: String,
        url: String,
    },

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],

});


userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {


    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateToken = async function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
}

module.exports = mongoose.model("User", userSchema);