const Users = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('dotenv');

env.config();

const getAllUsers = async (req, res) => {
    const allUsers = await Users.find({}, { "__v": false, "password": false });
    res.status(200).json({ data: allUsers });
};

const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Please enter complete data" });
    }

    const exist = await Users.findOne({ email: email });
    if (exist) {
        return res.status(400).json({ message: "User already exists" });
    } else {
        // Hash password
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new Users({
            name,
            email,
            password: hashed,
            role
        });

        await newUser.save();

        // If the user is an artist, return a temporary token for profile completion
        if (role === "artist") {
            const tempToken = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: "30min" });
            return res.status(201).json({ message: "Artist registered successfully, please complete your profile.", tempToken: tempToken });
        }

        // Regular users get a token immediately
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET_KEY, { expiresIn: "3days" });
        return res.status(201).json({ message: "User registered successfully", token: token });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter your email and password" });
    }

    const user = await Users.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "Wrong email or password" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
        return res.status(404).json({ message: "Wrong email or password" });
    }

    // If the user is an artist and hasn't completed their profile, return a temp token
    if (user.role === "artist" && !user.isProfileCompleted) {
        const tempToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "30min" });
        return res.status(403).json({ message: "Please complete your profile before login", tempToken: tempToken });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "3days" });
    return res.status(200).json({ message: "Logged in successfully", token: token });
};


// Complete artist profile
const completeArtistProfile = async (req, res) => {
    const { bio, profileImage } = req.body;
    const userId = req.user.id;

    if (!bio || !profileImage) {
        return res.status(400).json({ message: "Bio and profile image are required" });
    }

    const artist = await Users.findById(userId);
    if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
    }

    if (artist.role !== "artist") {
        return res.status(403).json({ message: "Only artists can complete their profiles" });
    }

    artist.bio = bio;
    artist.profileImage = profileImage;
    artist.isProfileCompleted = true;
    await artist.save();

    // After profile completion, the artist gets a token
    const token = await jwt.sign({ id: artist._id, role: artist.role }, process.env.JWT_SECRET_KEY, { expiresIn: "3days" });

    return res.status(200).json({ message: "Artist profile completed successfully", token: token });
};

module.exports = {
    getAllUsers,
    register,
    login,
    completeArtistProfile
};
