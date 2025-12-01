import { getDbConnection } from "../db/database.js";
import { fetchMedicinesQuery } from "../db/medicinesQuery.js";

export const getMedicineRecordsService = async (filters) => {
  const db = getDbConnection();

  // Build queries
  const { query, params, countQuery, countParams } = fetchMedicinesQuery(filters);

  // Execute main query
  const result = await db.query(query, params);

  if (!result) {
    const err = new Error("Database returned an invalid response");
    err.statusCode = 500;
    throw err;
  }

  let total = null;

  // Execute count query (with parameters!)
  if (countQuery) {
    const countRes = await db.query(countQuery, countParams);

    if (!countRes || !countRes.rows || !countRes.rows[0]) {
      const err = new Error("Failed to fetch total count for pagination");
      err.statusCode = 500;
      throw err;
    }

    total = Number(countRes.rows[0].total);
  }

  return {
    total,
    page: filters.page,
    limit: filters.limit,
    rows: result.rows || [],
  };
};
