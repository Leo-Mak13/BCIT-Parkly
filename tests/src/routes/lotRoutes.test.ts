import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import { pool } from "../../../database/database.js";
import lotRoutes from "../../../src/routes/lotRoutes.js";

function makeApp() {
  const app = express();

  app.use(cookieParser());
  app.engine("ejs", (_file, options: any, callback) => {
    callback(null, JSON.stringify({
      parkingLots: options.parkingLots,
      user: options.user,
    }));
  });
  app.set("view engine", "ejs");
  app.set("views", "views");
  app.use("/", lotRoutes);

  return app;
}

describe("lotRoutes database integration tests", () => {
  it("GET / returns the home page with parking lot data", async () => {
    const response = await request(makeApp()).get("/");
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.parkingLots));
    assert.ok(body.parkingLots.length > 0);
    assert.ok(body.parkingLots[0].name);
  });
});

after(async () => {
  await pool.end();
});
