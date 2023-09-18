const { writeFileSync } = require('fs');

const fib = (n) => {
    if (n < 2) {
        return 1;
    }
    return fib(n - 2) + fib(n - 1);
};

const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const names = [
    'John', 'Jane', 'Jack', 'Jill', 'Joe', 'Jenny', 'Jim',
    'Jen', 'Jeff', 'Jade', 'Jade', 'Jade', 'Jade', 'Jade', 'Jade', 'Jade',
    'Tim', 'Tina', 'Tom', 'Tara', 'Terry', 'Tiffany', 'Trevor', 'Tanya',
    'Mike', 'Mary', 'Mark', 'Molly', 'Megan', 'Morgan', 'Marty', 'Mandy',
    'Chris', 'Christine', 'Christian', 'Christina', 'Cody', 'Cindy', 'Caleb',
    'Alex', 'Alexis', 'Alexa', 'Alexander', 'Amanda', 'Amy', 'Adam', 'Aaron',
    'Ben', 'Beth', 'Brenda', 'Brent', 'Brett', 'Brianna', 'Bryce', 'Brynn',
];

const data = names.map((name) => {
    const number = randInt(30, 35);
    const result = fib(number);
    return `http://127.0.0.1/api POST ${JSON.stringify({ name, number, result })}`
})

writeFileSync('load-test-data.txt', data.join('\n'));