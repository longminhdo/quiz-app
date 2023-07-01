module.exports.createSuccessPayload = (data) => ({
  success: true,
  data,
});

module.exports.createErrorPayload = (data) => ({
  success: false,
  data,
});

// Authorization : Bearer this_is_a_token
module.exports.getTokenFromReq = (req) => req.headers.authorization?.split(' ')[1];
