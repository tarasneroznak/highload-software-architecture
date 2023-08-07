const { readFile } = require('node:fs/promises')
const { Client } = require('@elastic/elasticsearch')

const INSER_COUNT = 50000
const DEFAULT_INDEX = 'autocomplete'

function connect() {
    return new Client({ node: 'http://localhost:9200' });
}

async function search(client, q) {
    const result = await client.search(q)
    console.log(result.hits.hits.map(({ _source, _score }) => [_score, _source.word]));
}

async function insertData(client, index) {
    const words = (await readFile('./words.txt', 'utf-8')).split('\n')
    const count = INSER_COUNT ?? words.length;
    for (let i = 0; i < count; i++) {
        const word = words[i];
        if (word) {
            await client.index({ index, document: { word } })
        }
    }
}

async function createIndex(client) {
    if (await client.indices.exists({ index: DEFAULT_INDEX })) {
        return 
    }
    await client.indices.create({
        index: DEFAULT_INDEX,
        body: {
            settings: {
                index: {
                    max_ngram_diff: 19
                },
                analysis: {
                    filter: {
                        ngram_filter: {
                            type: "ngram",
                            min_gram: 1,
                            max_gram: 20
                        },
                        more_than_7_filter: {
                            type: 'length',
                            min: 8,
                            max: 99
                        },
                    },
                    analyzer: {
                        ngram_analyzer: {
                            type: "custom",
                            tokenizer: "standard",
                            filter: [
                                "lowercase",
                                "ngram_filter",
                                "more_than_7_filter"
                            ]
                        }
                    }
                }
            }
        },
        mappings: {
            properties: {
                word: {
                    type: "text",
                    fields: {
                        standard: {
                          type: "text",
                          analyzer: "standard"
                        },
                        ngram: {
                          type: "text",
                          analyzer: "ngram_analyzer"
                        }
                      }
                }
            }
        },
    })
    await insertData(client, DEFAULT_INDEX)
}

function getQueries(query) {
    return [
        {
            name: 'ngram_1',
            query: {
                index: DEFAULT_INDEX,
                query: {
                    match: {
                        word: {
                            query,
                            fuzziness: 2
                        }
                    }
                },
            }
        },
        {
            name: 'ngram_3',
            query: {
                index: DEFAULT_INDEX,
                "size" : 100,
                query: {
                    match: {
                        [query.length > 7 ? 'word.ngram' : 'word.standard']: {
                            query,
                            minimum_should_match: `${parseInt(((query.length - 3) / query.length) * 100)}%`
                        }
                    }
                }
            }
        },
    ]
}

async function main() {
    const arg = process.argv[2];
    if (!arg) {
        console.error('ERROR: please provide a query');
        return null;
    }
    const client = connect()
    await createIndex(client);

    for (const { name, query } of getQueries(arg)) {
        console.log(name);
        await search(client, query);
    }
}

main()
