import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const {username, email, password} = await request.json()

        const existingUserByEmail = await UserModel.findOne({email})

        if(existingUserByEmail) {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword;
                await existingUserByEmail.save()
            }
         else {
            // adding new user
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                isAcceptingMessage: true,
                messages: [],
            })

            await newUser.save()
        }

        return Response.json({
            success: true,
            message: "User registered successfully"
        }, {status: 201})

    } catch (error) {
        console.error("Error registering user.", error)
        return Response.json(
            {success: false, message: "Error while registering USER."},
            {status: 500}
        )
    }
}