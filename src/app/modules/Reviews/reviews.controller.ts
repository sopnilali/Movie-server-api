import { catchAsync } from "../../helper/catchAsync";
import sendResponse from "../../helper/sendResponse";
import { ReviewsService } from "./reviews.service";
import httpStatus from "http-status";

const addReviews = catchAsync(async (req, res) => {
  const result = await ReviewsService.addReviews(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Reviews added successfully",
    data: result,
  });
});
const getAllReviews = catchAsync(async (req, res) => {
  const result = await ReviewsService.getAllReviews();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});

const getAllReviewsById = catchAsync(async (req, res) => {
  const {contentId} = req.params
  const result = await ReviewsService.getAllReviewByContentId(contentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews fetched successfully",
    data: result,
  });
});
const updateReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewsService.updateReview(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Review updated successfully",
    data: result,
  });
});
const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewsService.deleteReview(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully",
    // data: result
  });
});

const getReviewStats = catchAsync(async (req, res) => {
  const result = await ReviewsService.getReviewStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review statistics retrieved successfully",
    data: result
  });
});

export const ReviewsController = {
  addReviews,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewStats,
  getAllReviewsById
};
