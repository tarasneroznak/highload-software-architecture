# GOAL!!!

Describe solution that solves peak loadings problem for biggest european football website https://goal.com

- Analyze all types of pages on the site
- Analyze and list possible sources of peak loadings
- Describe possible solution for each type

# Solution

## Pages

- Static content

  - News page
  - Players information
  - Last clubs' news and information
  - Match history results
  - Articles
  - Match results
  - ...

- Real time 
    
    - Live score
    - Match overview

## Sources

- Bot activity
- External attacks
- Concurrent resources usage
- Live score polling

## Possible solutions

- Schedule resources

```txt
Preparation for championships and matches according to the schedule. Allocate resources to specific regions when matches are played there. Or dynamically scale resources during championship matches.
```

- Caching + CDN

```txt
Everything that is on the main page. Because there is no personalization for users, this is easy to do.
Hot news. News from the main page and news from the last days. You can also track requests for older news.

Use CDN caching for static content.
```

- Load Balancer

```txt
To reduce the load from bots, create rules on the balancer that let bots pass with a certain frequency, the content of which is updated frequently on pages.
```

- DDoS

```txt
Use existing protection tools like Cloudflare
```
