# BST and Counting Sort

1. Implement class for Balanced Binary Search Tree that can insert, find and delete elements.
1. Generate 100 random datasets and measure complexity
1. Implement Counting Sort algorithm
1. Figure out when Counting Sort doesn’t perform.

# Solution

## Counting sort

Here results for all types of samples

- random - all items are random
- sorted - random sorted values
- same - same value for all sample
- step - value is increased by step parameter

All types work fine except in case when we have huge differences between the min and max values in sample, for example, I push `4_294_967_295` number and after that get `JavaScript heap out of memory` and if decrease max element time of execution still spent a lot of time.

![counting-sort-all](./assets/counting-sort-all.png)

Below result by type

1. random

![counting-sort](./assets/counting-sort.png)

2. sorter

![counting-sort-sorted](./assets/counting-sort-sorted.png)

3. same

![counting-sort-same](./assets/counting-sort-same.png)

4. step

![counting-sort-same](./assets/counting-sort-step.png)

## BST

Here results for BST methods

![bst](./assets/bst.png)

### BST insert

```
count - 10000
type - random
```

![bst-insert](./assets/bst-insert.png)

### BST find

```
count - 10000
type - random
```

![bst-find](./assets/bst-find.png)

### BST delete

```
count - 10000
type - random
```

![bst-delete](./assets/bst-delete.png)
