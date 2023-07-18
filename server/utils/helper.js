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

module.exports.formatDateTime = (date) => {
  const formattedDate = date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return formattedDate;
};
