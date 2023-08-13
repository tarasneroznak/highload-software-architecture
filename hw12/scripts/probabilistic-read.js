const { setTimeout } = require('node:timers/promises');
const { getClient } = require('./utils/client');
const { write, flushAll } = require('./utils/write');
const { WRITE_LB_URL, READ_LB_URL } = require('./utils/config');

const looks = new Set();

async function probabilisticRead(key) {
  const rClient = await getClient(READ_LB_URL);
  const wClient = await getClient(WRITE_LB_URL);
  const value = await rClient.get(key);
  if (looks.has(key)) {
    return value;
  }
  const ttl = await rClient.ttl(key);
  const time = Math.floor(Date.now() / 1000);
  const expiry = time + ttl;
  const delta = 10
  const beta = 0.5;
  const random = Math.log(Math.random());
  if (!value || (time - delta * beta * random) >= expiry) {
    console.log('cache miss - read from db', { time, ttl, expiry });
    looks.add(key);
    await setTimeout(2000);
    await wClient.expire(key, 10);
    looks.delete(key);
  }
  await rClient.quit();
  await wClient.quit();
  console.log('cache hit', ttl);
  return value;
}

async function main() {
  await flushAll();
  const keys = await write(1, 'rand');
  for (let i = 0; i < 100; i++) {
    await probabilisticRead(keys[0]);
    await setTimeout(1000);
  }
}
main()