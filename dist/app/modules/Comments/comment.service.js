"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentServices = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const prisma_1 = __importDefault(require("../../helper/prisma"));
const addComment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: {
            id: payload.userId,
        },
    });
    const isUserBlockedOrDeleted = (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status) === client_1.UserStatus.BLOCKED ||
        (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.status) === client_1.UserStatus.DELETED;
    if (!isUserExist || isUserBlockedOrDeleted) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found or blocked/deleted");
    }
    const result = yield prisma_1.default.comment.create({
        data: payload,
    });
    return result;
});
const getAllComments = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.comment.findMany();
    return result;
});
const updateComment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.comment.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
});
const deleteComment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.comment.delete({
        where: {
            id,
        },
    });
    return result;
});
const getSingleComment = (id_1, ...args_1) => __awaiter(void 0, [id_1, ...args_1], void 0, function* (id, page = 1, limit = 5) {
    const skip = (page - 1) * limit;
    const [comments, total] = yield Promise.all([
        prisma_1.default.comment.findMany({
            where: {
                reviewId: id,
                parentId: null,
            },
            include: {
                user: true,
                replies: {
                    include: {
                        user: true,
                        replies: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma_1.default.comment.count({
            where: {
                reviewId: id,
                parentId: null,
            }
        })
    ]);
    return {
        data: comments,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
});
const getCommentsByParentId = (parentId_1, ...args_1) => __awaiter(void 0, [parentId_1, ...args_1], void 0, function* (parentId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [comments, total] = yield Promise.all([
        prisma_1.default.comment.findMany({
            where: {
                parentId: parentId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        profilePhoto: true
                    }
                },
                replies: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profilePhoto: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        }),
        prisma_1.default.comment.count({
            where: {
                parentId: parentId,
            }
        })
    ]);
    return {
        data: comments,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
});
exports.CommentServices = {
    addComment,
    getAllComments,
    updateComment,
    deleteComment,
    getSingleComment,
    getCommentsByParentId
};
