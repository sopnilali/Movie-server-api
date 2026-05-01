import { Prisma, UserStatus } from "@prisma/client"
import httpStatus from 'http-status';
import { paginationHelper } from "../../helper/paginationHelper"
import prisma from "../../helper/prisma"
import { IPaginationOptions } from "../../interface/pagination.type"
import { userSearchAbleFields } from "./user.constant"
import { IUser } from "./user.interface"
import * as bcrypt from 'bcrypt'
import AppError from "../../errors/AppError"
import { FileUploader } from "../../helper/fileUploader";
const UserRegisterIntoDB = async (req: any) => {

    const file = req.file

    if (file) {
        const uploadData = await FileUploader.uploadToCloudinary(file)
        req.body.profilePhoto = uploadData?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12) //  hash password
    req.body.password = hashedPassword

    const result = await prisma.$transaction(async (tx) => {
        const verifyUser = await tx.user.findFirst({
            where: {
                email: req.body.email
            }
        })
        if (verifyUser) {
            throw new AppError(httpStatus.BAD_REQUEST, "User already Created")
        }
        const createUser = prisma.user.create({
            data: req.body
        })
        return createUser
    })
    return result
}

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options)
    const { searchTerm, ...filterData } = params

    const andCondition: Prisma.UserWhereInput[] = [];

    if (params.searchTerm) {
        andCondition.push({
            OR: userSearchAbleFields.map(filed => ({
                [filed]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    }
    if (Object.keys(filterData).length > 0) {
        andCondition.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    const whereConditons: Prisma.UserWhereInput = andCondition.length > 0 ? { AND: andCondition } : {}

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePhoto: true,
            status: true,
            contactNumber: true,
            createdAt: true,
            updatedAt: true
        }

    })
    const total = await prisma.user.count({
        where: whereConditons,
    })

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }

}

const getUserByIdIntoDB = async (id: string) => {
    const verify = await prisma.user.findUnique({
        where: { id },
    })
    if (!verify) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'User Not found!',
        );
    }
    const result = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePhoto: true,
            status: true,
            contactNumber: true,
            createdAt: true,
            updatedAt: true
        }
    })
    return result
}

const deleteUserIntoDB = async (id: string) => {
    await prisma.user.findUniqueOrThrow({
        where: { id }
    });

    const result = await prisma.$transaction(async (tx) => {
        const userReviews = await tx.reviews.findMany({
            where: { userId: id },
            select: { id: true }
        });
        const reviewIds = userReviews.map((review) => review.id);

        if (reviewIds.length > 0) {
            // Remove relations linked to this user's reviews first,
            // otherwise review deletion can fail with FK constraints.
            await tx.like.deleteMany({
                where: {
                    reviewId: {
                        in: reviewIds
                    }
                }
            });

            await tx.comment.deleteMany({
                where: {
                    reviewId: {
                        in: reviewIds
                    }
                }
            });
        }

        // Delete all comments by the user
        await tx.comment.deleteMany({
            where: { userId: id }
        });

        // Delete all likes by the user
        await tx.like.deleteMany({
            where: { userId: id }
        });

        // Delete all reviews by the user
        await tx.reviews.deleteMany({
            where: { userId: id }
        });

        // Delete all payments by the user
        await tx.payment.deleteMany({
            where: { userId: id }
        });

        // Delete all user purchase contents
        await tx.userPurchaseContents.deleteMany({
            where: { userId: id }
        });

        // Finally delete the user
        const deletedUser = await tx.user.delete({
            where: { id }
        });

        return deletedUser;
    });

    return result;
}

const updateUserIntoDB = async (req: any) => {
    const { id } = req.params

    const file = req.file


    const result = await prisma.$transaction(async (tx) => {
        const verifyUser = await tx.user.findUniqueOrThrow({
            where: { id }
        })

        if (file) {
            const uploadData = await FileUploader.uploadToCloudinary(file)
            req.body.profilePhoto = uploadData?.secure_url
        }

        const update = await prisma.user.update({
            where: { id, email: verifyUser.email },
            data: req.body
        })

        return update
    })
    return result
}

const changePasswordIntoDB = async (userData: { id: string }, payload: { oldPassword: string; newPassword: string }) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userData.id
        }
    })

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found")
    }

    const isOldPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password)
    if (!isOldPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect")
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12)

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword
        }
    })

    return null
}

export const UserServices = {
    UserRegisterIntoDB,
    getAllFromDB,
    getUserByIdIntoDB,
    deleteUserIntoDB,
    updateUserIntoDB,
    changePasswordIntoDB
}