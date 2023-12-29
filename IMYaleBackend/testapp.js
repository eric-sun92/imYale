const app = require("./app"); // Import your main app
const mockSessionMiddleware = require("./mockSessionMiddleWare.js"); // Import your mock middleware

app.use(mockSessionMiddleware);

module.exports = app;
