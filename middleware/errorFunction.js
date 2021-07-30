module.exports = {
  errorFunction: function (handler) {
    return async (req, res, next) => {
      try {
        await handler(req, res);
      } catch (ex) {
        next(ex); // error.js
      }
    };
  }
}