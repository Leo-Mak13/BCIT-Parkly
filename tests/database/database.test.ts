import { describe, it, after } from "node:test";
import assert from "node:assert/strict";
import { pool, create_session, get_session, delete_session } from "../../src/models/authModel.js"

describe('create_session and delete session', () => {
    
    it("should create and retrieve a session", async () => {
        const id = crypto.randomUUID();
        const secret_hash = Buffer.from("test-secret");
        const created_at = new Date();
        // create session
        try {
    
            await create_session(id,secret_hash,created_at);
            // retrieve session
            const rows: any = await get_session(id);
            // check result exists
            assert.ok(rows.length > 0);
            // check session id
            assert.equal(rows[0].id, id);
        } finally {
             await delete_session(id);
        }

    });

    it("should delete session", async () => {
        const id = crypto.randomUUID();
        const secret_hash = Buffer.from("delete-test");
        const created_at = new Date();
        // create first
        await create_session(id,secret_hash,created_at);
        // delete session
        await delete_session(id);
        // try retrieve again
        const rows: any = await get_session(id);
        // should be empty
        assert.deepEqual(rows, []);
    });

})

after(async () => {
    await pool.end(); 
});