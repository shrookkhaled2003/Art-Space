const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
        set: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Invalid Email Address"],
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role: {
        type: String,
        enum: ["user", "artist"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    bio: {
        type: String,
        trim: true,
        default: "",
    },
    profileImage: {
        type: String,
        default: "",
    },
    isProfileCompleted: {
        type: Boolean,
        default: false,
    }
});

// Remove unnecessary fields if the user is not an artist
userSchema.pre("save", function (next) {
    if (this.role !== "artist") {
        this.bio = undefined;
        this.profileImage = undefined;
        this.isProfileCompleted = undefined;
    }
    next();
});

module.exports = mongoose.model("User", userSchema);
