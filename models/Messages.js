const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  subject: String,
  body: String,
  submission: {
    type: Schema.Types.ObjectId,
    ref: 'Submissions'
  },
});

module.exports = mongoose.model('Messages', messageSchema);