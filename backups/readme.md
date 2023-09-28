# All backed up

1. Take/create the database from your pet project
1. Implement all kinds of repository models (Full, Incremental, Differential, Reverse Delta, CDP)
1. Compare their parameters: size, ability to roll back at specific time point, speed of roll back, cost

# Solution

In this work, a backup solution using the CCC utility was used for types 1, 2, 3. There is nothing special about the implementation, the main difficulty was in the correct configuration of the database and the utility.

For СDP solution, implemented hidden which takes data from pg_logical_slot_get_changes every 5 seconds and simply displays them

| type/metrics | size-1 | size-2 | duration-1       | duration-2       |
| ------------ | ------ | ------ | ---------------- | ---------------- |
| Full         | 29.2MB | 36.3MB | 101577ms         | 102658ms         |
| Incremental  | 29.2MB | 14.6MB | 162956ms         | 101190ms         |
| Differential | 29.2MB | 14.6MB | 162935ms         | 25943ms          |
| CDP          | 29.2MB | 36.3MB | at the same time | at the same time |
