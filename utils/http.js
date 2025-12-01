// Standard success HTTP response formatter
export const successResponse = (statusCode, data) => ({
  statusCode,
  body: JSON.stringify(data),
});

// Standard error HTTP response formatter
export const errorResponse = (err) => ({
  statusCode: err.statusCode || 500,
  body: JSON.stringify({
    success: false,
    message: err.message || "Internal Server Error",
  }),
});
