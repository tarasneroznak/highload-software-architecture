const { setTimeout } = require('node:timers/promises');
const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgres://postgres:postgres@localhost:5432/postgres',
});

async function cdp() {
    try {
        await client.connect();
        await client.query("SELECT pg_create_logical_replication_slot('myreplication', 'pgoutput');");
        await client.query("CREATE PUBLICATION mypublication FOR ALL TABLES;");
        await client.query("START_REPLICATION SLOT mypublication LOGICAL 0/0 (proto_version 1)");
        while (true) {
            const { rows } = await client.query('SELECT pg_logical_slot_get_changes($1, NULL, NULL)', ['myreplication']);
            if (rows && rows.length > 0) {
                const [{ pg_logical_slot_get_changes }] = rows
                console.log('Received change:', pg_logical_slot_get_changes);
            }
            await setTimeout(5000);
        }
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

cdp();
