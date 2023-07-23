# Nginx Fine Tuning

- Configure nginx that will cache only images, that were requested at least twice
- Add ability to drop nginx cache by request. You should drop cache for specific file only ( not all cache )

# Solution

To implement caching, the [ngx_cache_purge](https://github.com/FRiCKLE/ngx_cache_purge) library was used, which seems to me to be the most elegant way, it imitates the ary premium version, so it looks concise, but requires nginx compilation.

Another option was to use `openresty` and lua scripts, it was also possible to cache but without caching for two requests.

## How to use

```bash
$ docker compose up
```

### `ngx_cache_purge`

```bash
$ curl http://localhost:8000/image1.jpg
$ curl http://localhost:8000/image2.png
$ curl http://localhost:8000/image3.gif
```

#### Purge

```bash
$ curl -X PURGE http://localhost:8000/image1.jpg
```

```bash
$ curl http://localhost:8000/purge/image1.jpg
```


### `openresty + lua`

```bash
$ curl http://localhost:8001/image1.jpg
$ curl http://localhost:8001/image2.png
$ curl http://localhost:8001/image3.gif
```

#### Purge

```bash
$ curl http://localhost:8000/purge/image1.jpg
```