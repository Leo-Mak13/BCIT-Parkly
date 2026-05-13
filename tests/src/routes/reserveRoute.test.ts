import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import { pool } from "../../../database/database.js";
import reserveRoute from "../../../src/routes/reserveRoute.js";

async function getTestReservation() {
  const [rows]: any = await pool.query(
    "SELECT reservation_id, customer_id FROM reservations LIMIT 1",
  );

  assert.ok(rows.length > 0);
  return rows[0];
}

function makeApp() {
  const app = express();

  app.use(cookieParser());
  app.engine("ejs", (_file, options: any, callback) => {
    callback(null, JSON.stringify(options));
  });
  app.set("view engine", "ejs");
  app.set("views", "views");
  app.use("/reserve", reserveRoute);

  return app;
}

describe("reserveRoute database integration tests", () => {
  it("GET /reserve/:customer_id renders a customer's reservations", async () => {
    const testReservation = await getTestReservation();

    const response = await request(makeApp()).get(
      `/reserve/${testReservation.customer_id}`,
    );
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.reservations));
    assert.ok(body.reservations.length > 0);
    assert.ok(body.reservations[0].reservation_id);
  });

  it("GET /reserve/view/:reservation_id renders one reservation", async () => {
    const testReservation = await getTestReservation();

    const response = await request(makeApp()).get(
      `/reserve/view/${testReservation.reservation_id}`,
    );
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.reservation));
    assert.ok(body.reservation.length > 0);
    assert.ok(body.reservation[0].stall_location);
  });
});

after(async () => {
  await pool.end();
});
