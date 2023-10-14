import * as U from "./utils";
import * as T from "./type";

test("get subdomain", () => {
  expect(U.getSubdomain(T.Env.dev)).toEqual("dev");
  expect(U.getSubdomain(T.Env.test)).toEqual("test");
  expect(U.getSubdomain(T.Env.prod)).toEqual("app");
});

test("get domain", () => {
  expect(U.getHost(T.Env.dev, "nexys", "io")).toEqual("https://dev.nexys.io");
});