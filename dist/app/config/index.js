"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    jwt: {
        jwt_access_secret: process.env.JWT_ACCESS_SECRET,
        jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
        jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
        jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
        bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    ssl: {
        store_name: process.env.STORE_NAME,
        store_id: process.env.STORE_ID,
        store_password: process.env.STORE_PASSWORD,
        payment_api: process.env.PAYMENT_API,
        validation_api: process.env.VALIDATION_API,
        success_url: process.env.SUCCESS_URL,
        failed_url: process.env.FAILED_URL,
        cancel_url: process.env.CANCEL_URL,
    },
    emailSender: {
        email: process.env.SENDER_EMAIL,
        app_pass: process.env.SENDER_APP_PASS,
    },
    serverApiUrl: process.env.SERVER_API_URL,
    node_env: process.env.PRODUCTION
};
