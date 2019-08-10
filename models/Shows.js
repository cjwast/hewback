const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const showSchema = new Schema({
  title: String,
  showType: String,
  venue: {
    type: Schema.Types.ObjectId,
    ref: 'Venues'
  },
  curator: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  applicationDeadLine: Date,
  overview: String,
  fullDescription: String,
  applicationInstructions: String,
  startDate: Date,
  endDate: Date,
  isPublished: Boolean,
  numberOfSubmissions: Number,
  sharedLink: String
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Shows', showSchema);