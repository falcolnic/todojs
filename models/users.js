const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    title: {
        type : String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now
    }
});
module.exports = mongoose.model("User", userSchema);