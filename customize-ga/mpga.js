require('dotenv').config();
const { setTimeout } = require('timers/promises');

const MEASUREMENT_ID = process.env.MEASUREMENT_ID;
const API_SECRET = process.env.API_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;

const fetchCurrency = async () => {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    const data = await response.json();
    return data;
}

const insertCurrency = async (events) => {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
    const body = { client_id: CLIENT_ID, events }
    fetch(url, {
        method: "POST",
        body: JSON.stringify(body)
    })
        .then((res) => console.log(res.status))
        .catch(console.error);
}

const collect = async (iter = 0) => {
    if (iter < 100) {
        console.log(`Iteration ${iter}`);
        const data = await fetchCurrency();
        const events = data.map((item) => {
            return {
                name: 'generate_lead',
                params: {
                    currency: item.cc,
                    value: item.rate
                }
            }
        })
        await insertCurrency(events);
        await setTimeout(10_000);
        await collect(iter + 1);
    }
}

collect();