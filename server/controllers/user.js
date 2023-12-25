import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, generateverificationToken } from "../utils/email.js"
import { successFullVerification } from "../utils/emailTemplate.js"
import crypto from "crypto";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from "passport";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, cb) {
        const { email, name, sub, picture } = profile._json;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return cb(null, existingUser);
        const result = await User.create({ email, username: name, googleId: sub , profilePicture: picture, isVerified: true });
        return cb(null, result);
    }
));


// Serialize and deserialize user
passport.serializeUser((user, done) => {
    console.log(`Serialize ${user}`)
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        console.log(`Dese ${user}`)
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});




export const register = async (req, res) => {

    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: `User with email ${email} already exists` });
        const doesUsernameExists = await User.findOne({ username });
        if (doesUsernameExists) return res.status(400).json({ message: `Username ${username} already exists` });
        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = generateverificationToken(email);
        await sendVerificationEmail(email.toLowerCase(), verificationToken, username);
        const keyForEncryption = crypto.randomBytes(16).toString('hex');
        const result = await User.create({ email, password: hashedPassword, username, verificationToken, key: keyForEncryption });
        res.status(201).json({ user: result, message: `Verification email has been sent to ${email}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


export const verifyemail = async (req, res) => {
    try {
        const tokenId = req.params.tokenId;
        console.log(tokenId);
        const user = await User.findOne({ verificationToken: tokenId });
        console.log(user);

        if (!user) {
            return res.status(404).json({ error: 'Invalid verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        const congratulationContent = successFullVerification(user.username);

        res.send(congratulationContent);

    } catch (error) {
        res.status(500).json({ error: 'An error occurred during email verification.' });
        console.log(error);
    }
};

export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) return res.status(404).json({ message: "User doesn't exist" });
        if (existingUser.googleId){
            const token = jwt.sign({ email: existingUser.email, id: existingUser._id, key: existingUser.key }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({ user: existingUser, token: token, message: "Logged in successfully" });
        }
        if (!existingUser.isVerified) return res.status(400).json({ message: `Please verify your ${email} first` });
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id, key: existingUser.key }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ user: existingUser, token: token, message: "Logged in successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserDetail = async (req,res) => {
    try{
        const existingUser = await User.findOne({email: req.user.email});
        console.log(existingUser);
        if(!existingUser.googleId) return res.status(403).json({message: "Account associated with this email is not a google account"})
        if(!existingUser) return res.status(404).json({message: "User not found"})
        const token = jwt.sign({ email: existingUser.email, id: existingUser._id, key: existingUser.key }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ user: existingUser, token: token, message: "Logged in successfully" });
    }catch(e){
        res.status(500).json({message: e})
    }
}
