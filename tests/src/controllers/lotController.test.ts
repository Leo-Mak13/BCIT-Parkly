import { describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../../../src/app.js";

describe("GET /", () => {

  it("should return 200 OK", async () => {

    const response =
      await request(app).get("/");
    assert.equal(response.status, 200);
  });

});