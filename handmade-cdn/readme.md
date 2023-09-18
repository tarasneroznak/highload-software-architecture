# Handmade CDN

Your goal is to create your own cdn for delivering millions of images across the globe.

Set up 6 containers - bind server, load balancer 1, load balancer 2, node1, node2, node3.

Try to implement different balancing approaches.

Implement efficient caching

Write down pros and cons of each approach

# Solution

### Cache ON

|                         |                   |
| ----------------------- | ----------------- |
| Transactions            | 10613 hits        |
| Availability            | 100.00 %          |
| Elapsed time            | 9.63 secs         |
| Data transferred        | 3.02 MB           |
| Response time           | 0.84 secs         |
| Transaction rate        | 1102.08 trans/sec |
| Throughput              | 0.31 MB/sec       |
| Concurrency             | 924.40            |
| Successful transactions | 10615             |
| Failed transactions     | 0                 |
| Longest transaction     | 2.37              |
| Shortest transaction    | 0.00              |

### Cache OFF. Round Robin

|                         |                   |
| ----------------------- | ----------------- |
| Transactions            | 11654 hits        |
| Availability            | 80.98 %           |
| Elapsed time            | 9.51 secs         |
| Data transferred        | 3.38 MB           |
| Response time           | 0.49 secs         |
| Transaction rate        | 1225.45 trans/sec |
| Throughput              | 0.35 MB/sec       |
| Concurrency             | 604.87            |
| Successful transactions | 11654             |
| Failed transactions     | 2737              |
| Longest transaction     | 5.07              |
| Shortest transaction    | 0.00              |

### Cache OFF. Least connected

|                         |                   |
| ----------------------- | ----------------- |
| Transactions            | 11450 hits        |
| Availability            | 85.59 %           |
| Elapsed time            | 10.05 secs        |
| Data transferred        | 3.32 MB           |
| Response time           | 0.58 secs         |
| Transaction rate        | 1139.30 trans/sec |
| Throughput              | 0.33 MB/sec       |
| Concurrency             | 659.05            |
| Successful transactions | 11450             |
| Failed transactions     | 1928              |
| Longest transaction     | 8.71              |
| Shortest transaction    | 0.00              |
