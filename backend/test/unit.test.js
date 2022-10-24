const request = require("supertest");
const assert = require("assert");

const user = {
  email: "saeedhassana@gmail.com",
  password: "123456",
  username: "saeedhassan",
  studentId: "18-17SW53",
};

const loginCredentials = {
  email: "saeedhassana@gmail.com",
  password: "123456",
};

const alreadyRegisteredUser = {
  email: "dadu@gmail.com",
};

const buyToken = {
  transactionId: "0x01",
  pkrAmount: 1000,
  tokenspayment: 100,
  paymentMethod: "JazzCash",
  hasRecived: false,
  wallletAddress:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
};

describe("Should test the isolated units", () => {
  let server;

  beforeEach(() => {
    server = request.agent("http://127.0.0.1:5000");
  });

  it("should connect to the server", () => {
    assert.ok(server);
  });

  it("Should Register User with Correct Credentials ", function () {
    server
      .post("/users/register")
      .send(user)
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert(res.body.hasOwnProperty("token"));
      });
  });

  // should login with the Correct Credentials
  it("Should Login User with Correct Credentials", function () {
    server
      .post("/users/login")
      .send(loginCredentials)
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert(res.body.hasOwnProperty("token"));
      });
  });

  // Should login with Username
  it("Should Login User with Username", function () {
    server
      .post("/users/login")
      .send({ email: user.username, password: user.password })
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert(res.body.hasOwnProperty("message"));
      });
  });

  // login with the wrong credentials
  it("Should not Login User with Wrong Credentials", function () {
    server
      .post("/users/login")
      .send({ email: "anees", password: "123456" })
      .expect(422)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert(res.body.hasOwnProperty("message"));
        assert(res.body.message.includes("User not found"));
      });
  });

  // User Can buy Tokens at /users/tokens

  it("Should Buy Tokens", function () {
    server
      .post("/users/tokens")
      .send({ ...buyToken, email: user.email })
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert(res.body.hasOwnProperty("message"));
        assert(res.body.message.contains("Token Added"));
      });
  });

  // should retrieve all tokens
  it("Should Retrieve Tokens", function () {
    server
      .get("/users/tokens/all")
      .expect(200)
      .expect("Content-Type", /json/)
      .end(function (_, res) {
        assert(res.body);
      });
  });

  // should bring the user's tokens
  it("Should Retrieve User's Tokens", function () {
    server
      .get(`/users/tokens/${alreadyRegisteredUser.email}`)
      .expect(200)
      .end(function (_, res) {
        assert(res.body);
      });
  });

  // should update the token
  it("Should Update Token", function () {
    server
      .post(`/users/tokens/${alreadyRegisteredUser.email}`)
      .send({ transactionId: buyToken.transactionId })
      .expect(200)
      .end(function (_, res) {
        assert(res.body);
      });
  });
});
