import { getMedicineRecordsService } from "../functions/medicineService.js";

export const handler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};

    const { id, code, company } = queryParams;

    const limit = Number(queryParams.limit) || 10;
    const page = Number(queryParams.page) || 1;

    const result = await getMedicineRecordsService({
      id,
      code,
      company,
      limit,
      page,
    });
    // If nothing found (ID / code / company)
    if ((id || code || company) && (!result || !result.length)) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          message: "Record not found",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data: result,
      }),
    };
  } catch (err) {
    console.error("❌ Handler Error:", err);

    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        success: false,
        message: err.message || "Internal Server Error",
        error: process.env.DEBUG === "true" ? err.stack : undefined, // optional
      }),
    };
  }
};
