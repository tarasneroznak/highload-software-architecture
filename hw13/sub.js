const { setTimeout } = require('node:timers/promises');
const redis = require('redis');
const { default: Beanstalkd } = require('beanstalkd');

const beanstalkd = (new Beanstalkd()).connect();

async function redisSub() {
  const redisRdb = redis.createClient({
    url: 'redis://localhost:6379'
  });
  const redisAof = redis.createClient({
    url: 'redis://localhost:6380'
  });
  const redisRdbSubscriber = redisRdb.duplicate();
  const redisAofSubscriber = redisAof.duplicate();
  if (!redisRdbSubscriber.isReady) {
    await redisRdbSubscriber.connect();
  }
  if (!redisAofSubscriber.isReady) {
    await redisAofSubscriber.connect();
  }
  await redisRdbSubscriber.subscribe('topic', (message) => console.log('redis_rdb', message));
  await redisAofSubscriber.subscribe('topic', (message) => console.log('redis_aof', message));
}

async function beanstalkdSub() {
  const reader = async (b) => {
    const a = await b.reserve()
    const payload = a.toString()
    const id = +payload.split(',')[0]
    const msg = payload.split(',').slice(1).join(',')
    console.log('beanstalkd', id, msg);
    await b.destroy(id)
    process.nextTick(() => reader(b))
  }

  const b = await beanstalkd;
  await b.watch('topic')
  await b.ignore('default')
  reader(b)
}

redisSub();
beanstalkdSub();