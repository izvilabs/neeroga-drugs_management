import prisma from "@/lib/prisma";
import { GetUser, isPrivileges } from "@/utils/authentication";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest){

    const id = request.nextUrl.searchParams.get("id")
    const user = await GetUser(request)
    const hasPrivilage = isPrivileges(user , "user:read")

    if(id == null){
        return NextResponse.json({message : "user is not found"},{status : 404})
    }

    if(user?.id != id){
        return NextResponse.json({message : "only user view own account"},{status : 403})
    }

    try{
        const user = await prisma.user.findUnique(
            {
                where : {
                    id : id
                },
            },   
        )
        
    return NextResponse.json({message : "user fetch is successfull", user : user },{ status : 200})
    
    }catch(error){

        return NextResponse.json({message : "internal server error"},{status : 500})
    }
}