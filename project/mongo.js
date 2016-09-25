var mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/hospital');

var Community = require('./models/community');

module.exports = {
  community: Community,
};