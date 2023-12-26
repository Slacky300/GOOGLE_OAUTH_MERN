import express from 'express';
import { register, login, verifyemail, getUserDetail, getUsers } from '../controllers/user.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import validateToken from '../middlewares/isLoggedIn.js';


const userRouter = express.Router();


userRouter.route('/register').post(register);
userRouter.route('/verifyemail/:tokenId').get(verifyemail);
userRouter.route('/login').post(login);
userRouter.route('/get-user-detail').get(validateToken, getUserDetail)
userRouter.get('/get-all-users', getUsers)

userRouter.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

userRouter.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        
        failureRedirect: process.env.FAILURE_REDIRECT,
    }), (req,res) => {
        
        const token = jwt.sign({ email: req.user.email, id: req.user._id, key: req.user.key }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.redirect(`${process.env.SUCCESS_REDIRECT}/${token}`)
    }
);
export default userRouter;