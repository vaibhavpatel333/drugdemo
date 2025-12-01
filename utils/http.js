
// Standard success HTTP response formatter
export const successResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": false
  },
  body: JSON.stringify(data),
});

export const errorResponse = (err) => ({
  statusCode: err.statusCode || 500,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": false
  },
  body: JSON.stringify({
    success: false,
    message: err.message || "Internal Server Error",
  }),
});

