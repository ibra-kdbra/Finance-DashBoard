import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            min: 2,
            max: 50,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50,
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
