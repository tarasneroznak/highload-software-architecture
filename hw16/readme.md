# Mysql Slow Query Log

Set up MySQL with slow query log

Configure ELK to work with mysql slow query log

Configure GrayLog2 to work with mysql slow query log

Set different thresholds for long_query_time ( 0, 1 , 10 ) and compare performance

# Solution

![graylog](./assets/graylog.png)

![elastic](./assets/elastic.png)

### long_query_time 0

![cpu-1](./assets/cpu-1.png)

![ram-1](./assets/ram-1.png)

### long_query_time 1

![cpu-2](./assets/cpu-2.png)

![ram-2](./assets/ram-2.png)

### long_query_time 10

![cpu-3](./assets/cpu-3.png)

![ram-3](./assets/ram-3.png)
