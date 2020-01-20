import { handler } from "../../../src/lambdas/log-input";

test("the response to be null", () => {
  handler({ data: "Foo bar" }).then(response => {
    expect(response).toBeNull();
  });
});
