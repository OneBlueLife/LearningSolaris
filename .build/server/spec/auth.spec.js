"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_auth = __toESM(require("../services/auth"));
const fakeBcrypt = {
  compare(password1, password2) {
    return password1 == password2;
  }
};
const fakeUserModel = {
  async findOne(user) {
    return Promise.resolve([
      {
        _id: 1,
        email: "test@test.com",
        username: "hello",
        password: "test"
      }
    ].find((x) => x.email == user.email));
  }
};
describe("auth", () => {
  let service;
  beforeAll(() => {
    service = new import_auth.default(fakeUserModel, fakeBcrypt);
  });
  it("should compare passwords of a user", async () => {
    let result = await service.login("test@test.com", "test");
    expect(result._id).toBe(1);
  });
  it("should fail if the passwords are not the same", async () => {
    try {
      await service.login("test@test.com", "hello");
      throw new Error("Should have thrown an error");
    } catch (err) {
    }
  });
  it("should fail if the email is not valid", async () => {
    try {
      await service.login("test", "hello");
      throw new Error("Should have thrown an error");
    } catch (err) {
    }
  });
});
//# sourceMappingURL=auth.spec.js.map
