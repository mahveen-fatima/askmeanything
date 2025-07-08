import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, email, password} = await request.json()
        
    } catch (error) {
        console.error("Error registering user.", error)
        return Response.json(
            {success: false, message: "Error while registering USER."},
            {status: 500}
        )
    }
}