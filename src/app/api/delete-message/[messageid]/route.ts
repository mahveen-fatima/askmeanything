import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, 
    { params }: { params: Promise<{ messageid: string }> }) {

    const {messageid} = await params

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id: session.user._id},
            {$pull: {messages: {_id: messageid}}}
        )

        if(updateResult.modifiedCount == 0) {
            return NextResponse.json({
            success: false,
            message: "Message not found or already deleted"
        }, {status: 404})
        }

        return NextResponse.json({
            success: true,
            message: "Message deleted"
        }, {status: 200})
    } catch (error) {
        console.error("Error deleting message: ", error)
        return NextResponse.json({
            success: false,
            message: "Error deleting message"
        }, {status: 500})
    }


    
}