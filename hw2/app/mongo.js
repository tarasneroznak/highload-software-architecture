const mongoose = require("mongoose")

const CONNECTION_URL = process.env.MONGO_URL
const MODEL_NAME = "fib_numbers"

mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(error => console.error(error));

const fibNumbersSchema = {
    user: String,
    number: Number,
    result: Number,
};

const FibNumbers = mongoose.model(MODEL_NAME, fibNumbersSchema);

const insertFibNumber = async (user, number, result) => {
    const fibNumber = new FibNumbers({ user, number, result });
    return fibNumber.save();
}

const findByUser = async (user) => {
    return FibNumbers.find({ user }).exec()
}

module.exports = {
    insertFibNumber,
    findByUser
}
