import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose"
import { Role } from "@/app/generated/prisma/enums";
import { RequestUserType } from "@/types/request";

export async function GetUser(request : NextRequest) : Promise<RequestUserType | null> {
    
    const loginToken = request.cookies.get("login-token")?.value
    const secret = new TextEncoder().encode(process.env.JWT_KEY)
    
    try{
        const tokenData = await jose.jwtVerify(
            loginToken || "",
            secret
        )
        const user = tokenData.payload as unknown  as RequestUserType

        return user

    }catch{

        return null
    }
}

export function isAdmin(user: RequestUserType | null): boolean {
    return user?.role === Role.ADMIN;
}

export async function isPrivileges (request : RequestUserType | null, requiredPrivileges : string) : Promise<boolean | null> {
    
   if(request?.privilages.includes(requiredPrivileges)) {
        return true
    }else{
        return false
}

}
