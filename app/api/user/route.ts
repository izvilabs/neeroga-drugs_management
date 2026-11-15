import { Role, UserStatus } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { userAdminUpdateRequestSchema } from "@/types/dto/userAdminUpdateRequest";
import { userCreationRequestSchema } from "@/types/dto/userCreationRequest";
import { userSelfUpdateSchema } from "@/types/dto/userSelfUpdateRequest";
import { GetUser, isPrivileges } from "@/utils/authentication";
import PageInfoRetrieval from "@/utils/pageInfoRetraval";

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z, { json } from "zod";

//get users
export async function GET(request : NextRequest){

    const user = await GetUser(request)
    const params = PageInfoRetrieval(request)

    if(user == null){
        return NextResponse.json({
            message : "you are not login or your login session is expired"
        })
    }
    const havePrivileges = await isPrivileges(user , "users:read")

    if(!havePrivileges || user.role != Role.ADMIN){
        return NextResponse.json({message : "you are not authorized to access this resource"},{ status : 403})
    }

    const userCount = await prisma.user.count()
    const totlePages = Math.ceil(userCount / params.pageSize)

    if(params.pageNumber > totlePages) {
        return NextResponse.json({message : "page number is out of range"})
    }

    const users = await prisma.user.findMany({
        skip : (params.pageNumber - 1 ) * params.pageSize,
        take : params.pageSize,
        select : {
            id : true,
            firstName : true,
            lastName : true,
            email : true,
            role : true,
            status : true,
            password : false,
            number : true,
            privilages : true,
            lastLogin : true,
        }
    })
    
    return NextResponse.json(
        {
            message : "user fatch successfull",
            users : users,
            pagination : {
                pageNumber : params.pageNumber,
                pageSize : params.pageSize,
                totlePages : totlePages,
                totle : userCount,
            }
        }
    )
}

// user register
export async function POST(request : NextRequest){

    const body = await request.json()

    try{
        const parseBody = userCreationRequestSchema.parse(body) 
      
        const existingUser = await prisma.user.findUnique({
            where : {
                email : parseBody.email 
            }
        })

        if(existingUser != null){
            return NextResponse.json({message : "user already exist"},{status : 409})
        }

        // create new user
        await prisma.user.create({
            data : {
                firstName : parseBody.firstName,
                lastName : parseBody.lastName,
                email : parseBody.email,
                password : await bcrypt.hash(parseBody.password, 12),
                number : parseBody.number,
                profileImage : parseBody.profileImage,
            }
        })
        return NextResponse.json({ message : "user created successfully",},{status : 201})

        }catch(error){

            if(error instanceof z.ZodError){

              return NextResponse.json({message : error.issues[0]?.message || "invalid inputs",},{status : 500})
            }

              return NextResponse.json({message : "invalid inputs", error : error},{status : 500})
            }
    
}

// user update
export async function PUT(request : NextRequest){

    const userId = request.nextUrl.searchParams.get("id")
    const body = await request.json()
 
    try{
        const user = await prisma.user.findUnique({
            where : {
                id : userId || "0000"
            }
        })

        if(user == null){
            return NextResponse.json({message : "you are not login or your login session is expired"},{status : 403})
        }
 
        if(userId == user.id){
            userSelfUpdateSchema.parse(body)
    
            await prisma.user.update({
                where : {
                    id : userId || ""
                },
                data : {
                    firstName : body.firstName || user.firstName,
                    lastName : body.lastName || user.lastName,
                    number : body.number || user.number,
                    profileImage : body.profileImage || user.profileImage,   
                }
            })
            return NextResponse.json({message : "user update successfull"},{status : 200})
           
        }else{

            const hasPrivilages = await isPrivileges(body , "users:edite")

            if(!hasPrivilages){

                return NextResponse.json({message : "you can not edite others user detials",},{status : 401})

            }else{

                userAdminUpdateRequestSchema.parse(body)

                await prisma.user.update({
                    where : {
                        id : userId || ""
                    },
                    data : {
                        firstName : body.firstName || user.firstName,
                        lastName : body.lastName || user.lastName,
                        number : body.number || user.number,
                        profileImage : body.profileImage || user.profileImage,
                        role : body.role || user.role,
                        status : body.status || user.status,
                        privileges : body.privileges || user.privilages,
                    }
                })

                return NextResponse.json({message : "user update is successfull"},{status : 200})   
            }
        }

         }catch(error){

            if(error instanceof z.ZodError){
                return NextResponse.json({message : error.issues[0]?.message || "invalid inputs",},{status : 200})
            }
 
            return NextResponse.json({message : "Server error",error : error},{status : 500})         
        }
}   

//block user
export async function PATCH(request: NextRequest) {
  try {
  
    const userId = request.nextUrl.searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      )
    }

    const admin = await GetUser(request);

    if (!admin) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      )
    }

   
    if (admin.role !== Role.ADMIN) {
      return NextResponse.json(
        { message: "Only administrators can block users" },
        { status: 403 }
      )
    }

    if (userId === admin.id) {
      return NextResponse.json(
        { message: "Admin cannot block their own account" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    if (existingUser.status === UserStatus.BLOCKED) {
      return NextResponse.json(
        { message: "User is already blocked" },
        { status: 409 }
      )
    }

    // Block user
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.BLOCKED,
      },
    })

    return NextResponse.json(
      { message: "User successfully blocked" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Block user error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
