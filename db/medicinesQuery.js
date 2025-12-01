// generic fetch medicines query
export const fetchMedicinesQuery = ({ id, code, company, limit, page }) => {
  let query = `SELECT * FROM public.medicines`;
  let params = [];

  let countQuery = null;
  let countParams = [];

  // Fetch by ID
  if (id) {
    query += ` WHERE id = $1`;
    params.push(id);

    // Count only this filtered record
    countQuery = `SELECT COUNT(*) AS total FROM public.medicines WHERE id = $1`;
    countParams.push(id);
  }

  // Fetch by CODE
  else if (code) {
    query += ` WHERE code = $1`;
    params.push(code);

    // Count only filtered rows
    countQuery = `SELECT COUNT(*) AS total FROM public.medicines WHERE code = $1`;
    countParams.push(code);
  }

  // Fetch by COMPANY (partial match)
  else if (company) {
    query += ` WHERE LOWER(company) LIKE LOWER($1)`;
    params.push(`%${company}%`);

    // Count for filtered search
    countQuery = `SELECT COUNT(*) AS total FROM public.medicines WHERE LOWER(company) LIKE LOWER($1)`;
    countParams.push(`%${company}%`);
  }

  // Pagination mode → no filters
  else {
    const offset = (page - 1) * limit;

    query += ` ORDER BY launch_date DESC LIMIT $1 OFFSET $2`;
    params.push(limit, offset);

    // Count all rows for pagination
    countQuery = `SELECT COUNT(*) AS total FROM public.medicines`;
  }

  return { query, params, countQuery, countParams };
};
