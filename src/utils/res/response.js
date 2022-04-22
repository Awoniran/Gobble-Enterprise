// factory function for json responses
function HttpResponse(res, statCode, data, token) {
   const status = `${statCode}`.startsWith('2') ? 'success' : 'fail';
   res.status(statCode).json({
      status,
      token,
      data,
   });
}

module.exports = HttpResponse;
