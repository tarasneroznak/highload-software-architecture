const { Client } = require('@elastic/elasticsearch')

const CONNECTION_URL = process.env.ELASTIC_URL
const INDEX = 'fib-numbers'

const client = new Client({ node: CONNECTION_URL })

const insertFibUser = async (user, number, result) => {
    return client.index({
        index: INDEX,
        document: { user, number, result }
    })
}

const searchFibUser = async (user) => {
    const result = await client.search({
        index: INDEX,
        q: `user:*${user}*`,
    })
    return result.hits.hits
}

module.exports = {
    insertFibUser,
    searchFibUser
}