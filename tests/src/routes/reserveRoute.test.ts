import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";
import { pool } from "../../../database/database.js";
import reserveRoute from "../../../src/routes/reserveRoute.js";

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

async function getRouteReservation(app: express.Express) {
  for (let customerId = 1; customerId <= 20; customerId++) {
    const response = await request(app).get(`/reserve/${customerId}`);
    const body = JSON.parse(response.text);

    if (body.reservations.length > 0) {
      return {
        customerId: String(customerId),
        reservationId: String(body.reservations[0].reservation_id),
        reservations: body.reservations,
      };
    }
  }

  throw new Error("No test reservations were found.");
}

describe("reserveRoute database integration tests", () => {
  it("GET /reserve/:customer_id renders a customer's reservations", async () => {
    const app = makeApp();
    const testReservation = await getRouteReservation(app);

    const response = await request(app).get(`/reserve/${testReservation.customerId}`);
    const body = JSON.parse(response.text);

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body.reservations));
    assert.ok(body.reservations.length > 0);
    assert.ok(body.reservations[0].reservation_id);
  });

  it("GET /reserve/view/:reservation_id renders one reservation", async () => {
    const app = makeApp();
    const testReservation = await getRouteReservation(app);

    const response = await request(app).get(
      `/reserve/view/${testReservation.reservationId}`,
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
