const mongoose =  require('mongoose');

const ImageSchema = new mongoose.Schema({
  fileName: String,
  playerName: String,
  sport: String
},{
  timestamps:  { createdAt: '_created', updatedAt: '_updated' },
  versionKey: false
});

module.exports = mongoose.model('Image', ImageSchema);
