"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const client_1 = require("@prisma/client");
const fileUploader_1 = require("../../helper/fileUploader");
const auth_validation_1 = require("../Auth/auth.validation");
const router = express_1.default.Router();
router.post("/register", fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.createUserValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.RegisterUser(req, res, next);
});
router.get("/", user_controller_1.UserController.getAllUserData);
router.get("/:id", user_controller_1.UserController.getUserById);
router.patch("/change-password", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(auth_validation_1.authValidation.changePasswordValidationSchema), user_controller_1.UserController.changePassword);
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), fileUploader_1.FileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.UserValidation.updateUserValidation.parse(JSON.parse(req.body.data));
    return user_controller_1.UserController.UpdateUser(req, res, next);
});
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), user_controller_1.UserController.DeleteUser);
exports.UserRoutes = router;
