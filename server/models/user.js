import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },

    password: {
        type: String,
        trim: true,
        minlength: 3
    },
    
    profilePicture: {
        type: String,
        required: false,
        trim: true,

    },

    googleId: {
        type: String,
        required: false,
        trim: true,
    },

}, { timestamps: true });  

const User = mongoose.model('User', userSchema);

export default User;