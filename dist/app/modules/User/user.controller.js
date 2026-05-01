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
exports.UserController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../helper/catchAsync");
const user_service_1 = require("./user.service");
const pick_1 = __importDefault(require("../../utils/pick"));
const user_constant_1 = require("./user.constant");
const sendResponse_1 = __importDefault(require("../../helper/sendResponse"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const RegisterUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.UserRegisterIntoDB(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "User Register Successfully",
        data: result
    });
}));
const getAllUserData = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_constant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = yield user_service_1.UserServices.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Users data fetched!",
        meta: result.meta,
        data: result.data
    });
}));
const getUserById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserServices.getUserByIdIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User data fetched!",
        data: result
    });
}));
const DeleteUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield user_service_1.UserServices.deleteUserIntoDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Delete user Successfully!"
    });
}));
const UpdateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.updateUserIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "User update successfully!!",
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
const changePassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not Authorized");
    }
    const result = yield user_service_1.UserServices.changePasswordIntoDB({ id: userId }, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        message: "Password changed successfully!",
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
exports.UserController = {
    RegisterUser,
    getAllUserData,
    getUserById,
    DeleteUser,
    UpdateUser,
    changePassword
};
