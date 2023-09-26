const NAMES = [
  "John",
  "Jane",
  "Jack",
  "Jill",
  "Joe",
  "Jenny",
  "Jim",
  "Jen",
  "Jeff",
  "Jade",
  "Jade",
  "Jade",
  "Jade",
  "Jade",
  "Jade",
  "Jade",
  "Tim",
  "Tina",
  "Tom",
  "Tara",
  "Terry",
  "Tiffany",
  "Trevor",
  "Tanya",
  "Mike",
  "Mary",
  "Mark",
  "Molly",
  "Megan",
  "Morgan",
  "Marty",
  "Mandy",
  "Chris",
  "Christine",
  "Christian",
  "Christina",
  "Cody",
  "Cindy",
  "Caleb",
  "Alex",
  "Alexis",
  "Alexa",
  "Alexander",
  "Amanda",
  "Amy",
  "Adam",
  "Aaron",
  "Ben",
  "Beth",
  "Brenda",
  "Brent",
  "Brett",
  "Brianna",
  "Bryce",
  "Brynn",
];

export const fib = (n) => {
  if (n < 2) {
    return 1;
  }
  return fib(n - 2) + fib(n - 1);
};

export const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randName = () => {
  return NAMES[randInt(0, NAMES.length - 1)];
};
