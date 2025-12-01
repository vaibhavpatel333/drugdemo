import { getMedicineRecordsService } from "../servicesFunctions/medicineService.js";
import { errorResponse, successResponse } from "../utils/http.js";

export const handler = async (event) => {
  try {
    const query = event?.queryStringParameters || {};

    // Convert fetchAll flag to boolean
    const fetchAll = query.fetchAll === "true";

    // Only apply limit/page when NOT fetching all
    const limit =
      !fetchAll && query.limit !== undefined ? Number(query.limit) : 10;

    const page = !fetchAll ? Number(query.page) || 1 : null;

    const result = await getMedicineRecordsService({
      id: query.id,
      code: query.code,
      company: query.company,
      fetchAll,
      limit,
      page,
    });

    if ((query.id || query.code || query.company) && !result.rows.length) {
      return successResponse(404, {
        success: false,
        message: "Record not found",
      });
    }

    return successResponse(200, {
      success: true,
      total: result.total,
      page: query.fetchAll === "true" ? null : result.page,
      limit: query.fetchAll === "true" ? null : result.limit,
      data: result.rows,
    });

  } catch (err) {
    console.error("❌ Handler Error:", err);
    return errorResponse(err);
  }
};
