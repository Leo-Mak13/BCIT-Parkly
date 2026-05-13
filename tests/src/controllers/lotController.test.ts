import { after, describe, it } from "node:test";
import assert from "node:assert/strict";
import { pool } from "../../../database/database.js";
import { getHomePage } from "../../../src/controllers/lotController.js";

function makeResponse() {
  return {
    viewName: "",
    viewData: null as any,
    render(viewName: string, viewData: any) {
      this.viewName = viewName;
      this.viewData = viewData;
    },
    status(code: number) {
      return {
        send(message: string) {
          return { code, message };
        },
      };
    },
  };
}

describe("lotController database tests", () => {
  it("getHomePage renders main with parking lots from the database", async () => {
    const req = { user: null } as any;
    const res = makeResponse() as any;

    await getHomePage(req, res);

    assert.equal(res.viewName, "main");
    assert.ok(Array.isArray(res.viewData.parkingLots));
    assert.ok(res.viewData.parkingLots.length > 0);
  });
});

after(async () => {
  await pool.end();
});
