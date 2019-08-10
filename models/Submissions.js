const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  show: {
    type: Schema.Types.ObjectId,
    ref: 'Shows'
  },
  artistName: String,
  artistEmail: String,
  website: String,
  instagram: String,
  fullyDescription: String,
  imagesLink: String,
  additionalLink: String,
  status: String,
  isSummited: Boolean,
},
  {
    timestamps: true
  });

module.exports = mongoose.model('Submissions', submissionSchema);