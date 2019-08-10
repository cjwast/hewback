const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  name: String,
  address1: String,
  webSite: String,
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Venues', venueSchema);