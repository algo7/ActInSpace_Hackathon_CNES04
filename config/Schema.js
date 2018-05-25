//Require Dependency
const mongoose = require('mongoose');

//Define Shcema as an Object
const Schema = mongoose.Schema;

//Create the Schema
const DBSchema = new Schema({
    Latitude: String,
    Longitude: String,
    FirstLvAdmin: String,
    Country: String,
    Time: Date
});

//Create the Model
const PT = mongoose.model('PT', DBSchema); //Should be PVT (Position, velocity, and time). But we only make use of two.

//Export the Module
module.exports = PT;