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
var import_user = __toESM(require("../services/user"));
const fakeBcrypt = {
  compare(password1, password2) {
    return password1 == password2;
  },
  hash(password) {
    return password;
  }
};
let userList = [];
const fakeUserModel = {};
const fakeUserRepo = {
  async findById(id) {
    return Promise.resolve(userList.find((x) => x._id == id));
  },
  async findOne(user) {
    return Promise.resolve(userList.find((x) => x.email == user.email));
  },
  async updateOne(user) {
    return Promise.resolve(user);
  }
};
describe("user", () => {
  let service;
  beforeAll(() => {
    service = new import_user.default(fakeUserModel, fakeUserRepo, fakeBcrypt);
    userList = [
      {
        _id: 1,
        email: "test@test.com",
        username: "hello",
        password: "test",
        save() {
          return true;
        }
      },
      {
        _id: 2,
        email: "test2@test.com",
        username: "world",
        password: "test",
        save() {
          return true;
        }
      }
    ];
  });
  it("should get a user by ID", async () => {
    let result = await service.getById(2);
    expect(result._id).toBe(2);
  });
  it("should check if a user exists", async () => {
    let result = await service.userExists("test@test.com");
    expect(result).toBeTruthy();
  });
  it("should check if a user exists in a different case", async () => {
    let result = await service.userExists("tesT@test.com");
    expect(result).toBeTruthy();
  });
  it("should check if a user does not exist", async () => {
    let result = await service.userExists("fffff");
    expect(result).toBeFalsy();
  });
  it("should fail to update the password of a user if the passwords do not match", async () => {
    let userId = 1;
    let oldPassword = "yyyy";
    let newPassword = "xxxx";
    try {
      await service.updatePassword(userId, oldPassword, newPassword);
    } catch (err) {
      expect(err.message).toBe("The current password is incorrect.");
    }
  });
});
//# sourceMappingURL=user.spec.js.map
