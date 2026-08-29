/**
 * Centralized Error Handler Middleware for Clash of Clans Express Server
 */
function errorHandler(err, req, res, next) {
  console.error(`[API Error] ${req.method} ${req.url}:`, err.message || err);

  // If error came from Axios (Upstream CoC API response error)
  if (err.response) {
    const status = err.response.status;
    const cocData = err.response.data || {};

    let userMessage = cocData.message || 'An error occurred while communicating with Clash of Clans API.';
    let errorCode = cocData.reason || 'UPSTREAM_ERROR';

    switch (status) {
      case 400:
        errorCode = 'BAD_REQUEST';
        userMessage = 'Invalid tag or request parameters provided.';
        break;
      case 403:
        errorCode = 'FORBIDDEN_IP_OR_TOKEN';
        userMessage = 'Access denied by Clash of Clans API. Please check your API Token and verify that your public IP address is whitelisted in the CoC Developer Portal.';
        break;
      case 404:
        errorCode = 'RESOURCE_NOT_FOUND';
        userMessage = 'The requested player, clan, or war statistics were not found on Clash of Clans servers.';
        break;
      case 429:
        errorCode = 'RATE_LIMITED';
        userMessage = 'Clash of Clans API rate limit exceeded. Please try again shortly.';
        break;
      case 503:
        errorCode = 'MAINTENANCE_BREAK';
        userMessage = 'Clash of Clans servers are currently undergoing a maintenance break. Please check back later.';
        break;
    }

    return res.status(status).json({
      success: false,
      status,
      error: errorCode,
      message: userMessage,
      details: cocData
    });
  }

  // Internal Server / Network Error
  return res.status(500).json({
    success: false,
    status: 500,
    error: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected internal server error occurred.'
  });
}

module.exports = errorHandler;
