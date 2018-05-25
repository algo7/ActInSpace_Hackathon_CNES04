//Require Dependency
const mongoose = require('mongoose');

//Define Shcema as an Object
const Schema = mongoose.Schema;

//Create the Schema
const DBSchema = new Schema({
    Latitude: String,
    Longitude: String,
});

//Create the Model
const Position = mongoose.model('Position', DBSchema);

//Export the Module
module.exports = Position;