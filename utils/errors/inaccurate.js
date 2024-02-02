module.exports = class InaccurateError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};
