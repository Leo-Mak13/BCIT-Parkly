import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../database/database.js";
import {
  mapRowToParkingLot,
  getNumberOfOccupiedStalls,
} from "../../src/models/lotModel.js";
import { getLotAvailability } from "../../src/services/lotService.js";
import {
  create_customer,
  create_user,
  get_customer,
  get_customers,
  get_user,
  get_user_by_id,
} from "../../src/models/userModel.js";

const testEmail = `github-db-user-${Date.now()}@example.com`;
let createdCustomerId: number | null = null;

describe("github database lot functions", () => {
  it("connects mapRowToParkingLot to the test database", async () => {
    const lots = await mapRowToParkingLot();
    const firstLot = lots.get(1);

    assert.ok(lots instanceof Map);
    assert.ok(lots.size > 0);
    assert.equal(firstLot?.name, "BCIT Campus Parking");
    assert.ok(firstLot?.address.street);
  });

  it("connects getNumberOfOccupiedStalls to the test database", async () => {
    const occupiedStalls: any = await getNumberOfOccupiedStalls();

    assert.ok(Array.isArray(occupiedStalls));
    assert.ok(occupiedStalls.length > 0);
    assert.ok(occupiedStalls[0].lot_id);
    assert.ok(occupiedStalls[0].occupied >= 0);
  });

  it("connects getLotAvailability to the test database", async () => {
    const lots = await getLotAvailability();

    assert.ok(Array.isArray(lots));
    assert.ok(lots.length > 0);
    assert.ok(lots[0]?.name);
    assert.ok(lots[0]?.openSpots >= 0);
  });
});

describe("github database user functions", () => {
  it("connects get_customers to the test database", async () => {
    const customers: any = await get_customers();

    assert.ok(Array.isArray(customers));
    assert.ok(customers.length > 0);
    assert.equal(customers[0].email, "jordan.patel@example.com");
  });

  it("connects get_customer to the test database", async () => {
    const customer: any = await get_customer(1);

    assert.ok(Array.isArray(customer));
    assert.equal(customer[0].customer_id, 1);
    assert.equal(customer[0].email, "jordan.patel@example.com");
  });

  it("connects get_user to the test database", async () => {
    const user: any = await get_user("jordan.patel@example.com");

    assert.equal(user.email, "jordan.patel@example.com");
    assert.ok(user.password_hash);
  });

  it("connects get_user_by_id to the test database", async () => {
    const user: any = await get_user_by_id(1);

    assert.equal(user.id, 1);
    assert.equal(user.email, "jordan.patel@example.com");
  });

  it("connects create_customer to the test database", async () => {
    await create_customer("github", testEmail, "6045559999", "student", "tester");

    const [customers]: any = await pool.query(
      "SELECT customer_id FROM customers WHERE email = ?",
      [testEmail],
    );
    createdCustomerId = customers[0].customer_id;

    assert.ok(createdCustomerId);
  });

  it("connects create_user to the test database", async () => {
    const email = `github-db-create-user-${Date.now()}@example.com`;

    await create_customer("github", email, "6045559998", "student", "tester");

    try {
      await create_user(email, "hashed-password");

      const [users]: any = await pool.query(
        "SELECT email, password_hash FROM users WHERE email = ?",
        [email],
      );

      assert.equal(users[0].email, email);
      assert.equal(users[0].password_hash, "hashed-password");
    } finally {
      await pool.query("DELETE FROM users WHERE email = ?", [email]);
      await pool.query("DELETE FROM customers WHERE email = ?", [email]);
    }
  });
});

after(async () => {
  if (createdCustomerId !== null) {
    await pool.query("DELETE FROM customers WHERE email = ?", [testEmail]);
  }

  await pool.end();
});
