// __mocks__/@react-native-cookies/cookies.js
const CookieManager = {
    clearAll: async () => {},
    get: jest.fn().mockReturnValue({
      "connect.sid": {
        value: "None"
      },
    }),
  };
  
  export default CookieManager;
  