import { expect, test } from "vitest";
import { fib } from "./services.js";

test("fib 5", () => {
  expect(fib(5)).toBe(8);
});

test("fib 10", () => {
  expect(fib(10)).toBe(89);
});

test("fib 20", () => {
  expect(fib(20)).toBe(10946);
});
