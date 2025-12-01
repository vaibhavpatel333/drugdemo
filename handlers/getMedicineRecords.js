import { getMedicineRecordsService } from "../servicesFunctions/medicineService.js";
import { errorResponse, successResponse } from "../utils/http.js";

export const handler = async (event) => {
  try {
    const query = event?.queryStringParameters || {};

    // Call service layer
    const result = await getMedicineRecordsService({
      id: query.id,
      code: query.code,
      company: query.company,
      limit: Number(query.limit) || 10, // default limit
      page: Number(query.page) || 1,    // default page
    });

    // When searching by ID/CODE/COMPANY → show "not found" if zero results
    if ((query.id || query.code || query.company) && !result.rows.length) {
      return successResponse(404, {
        success: false,
        message: "Record not found",
      });
    }

    // Successful response with pagination metadata
    return successResponse(200, {
      success: true,
      total: result.total,
      page: result.page,
      limit: result.limit,
      data: result.rows, 
    });

  } catch (err) {
    console.error("❌ Handler Error:", err);
    return errorResponse(err);
  }
};
