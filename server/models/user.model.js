import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "provide name"]
    },
    email: {
        type: String,
        required: [true, "provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "provide password"]
    },
    avatar: {
        type: String,
        default: ""
    },
    mobile: {
        type: Number,
        default: null
    },
    refresh_token: {
        type: String,
        default: ""
    },
    // ADDED: Email verification fields
    verify_email: {
        type: String,
        default: ""
    },
    verify_email_expiry: {
        type: Date,
        default: null
    },
    email_verify: {
        type: Boolean,
        default: false
    },
    // ADDED: Password reset fields
    forgot_password_otp: {
        type: String,
        default: ""
    },
    forgot_password_expiry: {
        type: Date,
        default: null
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    }
}, {
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;