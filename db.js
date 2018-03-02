const mongoose = require('mongoose');

module.exports = () => {
  console.log('--- Preparing MongoDB Storage');
  let authStr = '';

  if (process.env.mongoUser){
    authStr = encodeURIComponent(process.env.mongoUser);

    if (process.env.mongoPass) authStr += ':' + encodeURIComponent(process.env.mongoPass);
    authStr += '@';
  }

  let url = 'mongodb://' + authStr + process.env.mongoHost + ':' + process.env.mongoPort + '/' + process.env.mongoDb;

  mongoose.connect(url, err => {
    if (err) {
      console.error('WARNING: MongoDB Connection Error: ', err);
      console.error('Attempted authentication string: ' + url);
    } else {
      console.log('--- \tConnected to MongoDB');
    }
  });
}
