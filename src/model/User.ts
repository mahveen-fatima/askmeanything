import mongoose, { Schema, Document } from "mongoose";


// message interface + schema
export interface Message extends Document {
    _id: string;
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema(
    {
        content: {
            type: String,
            required: true
        },

        createdAt: {
        type: Date,
        required: true,
        default: Date.now
        }
    }
)

//user interface + schema

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required."],
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required."],
            unique: true,
            match: [/.+\@.+\..+/, "Please enter a valid email."]
        },
        password: {
            type: String,
            required: [true, "Password is required."],
        },
        isAcceptingMessage: {
            type: Boolean,
            default: true
        },
        messages: [MessageSchema]
    }
)

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))

export default UserModel