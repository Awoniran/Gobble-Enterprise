function HttpResponse(res, statCode, data, token) {
  const statusMessage = `${statCode}`.startsWith('2') ? 'success' : 'fail';
  res.status(statCode).json({
    status: statusMessage,
    token,
    data,
  });
}

module.exports = HttpResponse;
