// mockSessionMiddleware.js
function mockSessionMiddleware(req, res, next) {
  req.session = {
    user: {
      user: {
        profile: "mockProfileId",
        // ... other mock session data ...
      },
    },
  };
  next();
}

module.exports = mockSessionMiddleware;
