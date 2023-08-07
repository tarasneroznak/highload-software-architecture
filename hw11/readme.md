# Index & Autocomplete

Create ES index that will serve autocomplete needs with leveraging typos and errors (max 3 typos if word length is bigger than 7).

Please use english voc. Ang look at google as a ref.

# Solution

Create index

```js
await client.indices.create({
    index: 'autocomplete',
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
```

Search

```js
const field = query.length > 7 ? 'word.ngram' : 'word.standard';
const minimumShouldMatch = `${parseInt(((query.length - 3) / query.length) * 100)}%`
const body = {
    index: DEFAULT_INDEX,
    query: {
        match: {
            [field]: {
                query,
                minimum_should_match: minimumShouldMatch
            }
        }
    }
}
```

Result for query

- origin word - `abacination`
- word with typos - `aboconatoon`

```json
{
  "took": 32,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 10000,
      "relation": "gte"
    },
    "max_score": 0.42211115,
    "hits": [
      {
        "_index": "autocomplete",
        "_id": "i6id0YkB6apWbT6fNZrk",
        "_score": 0.42211115,
        "_source": {
          "word": "bronchoconstriction\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "oaic0YkB6apWbT6fky55",
        "_score": 0.42201915,
        "_source": {
          "word": "anomalogonatous\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "Gqic0YkB6apWbT6fiShh",
        "_score": 0.42201915,
        "_source": {
          "word": "anatomicopathological\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "D6ic0YkB6apWbT6fnjaS",
        "_score": 0.42192224,
        "_source": {
          "word": "antinationalization\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "Gaic0YkB6apWbT6fiShg",
        "_score": 0.42181998,
        "_source": {
          "word": "anatomicopathologic\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "Maic0YkB6apWbT6fiSiE",
        "_score": 0.42181998,
        "_source": {
          "word": "anatomopathological\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "hKic0YkB6apWbT6fz1bF",
        "_score": 0.42181998,
        "_source": {
          "word": "autocondensation\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "jKid0YkB6apWbT6fNZrl",
        "_score": 0.42181998,
        "_source": {
          "word": "bronchoconstrictor\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "Fqic0YkB6apWbT6fiSha",
        "_score": 0.42171192,
        "_source": {
          "word": "anatomicobiological\r"
        }
      },
      {
        "_index": "autocomplete",
        "_id": "HKic0YkB6apWbT6fiShl",
        "_score": 0.4215976,
        "_source": {
          "word": "anatomicophysiological\r"
        }
      }
    ]
  }
}
```