"use strict";
var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  Model = new Schema({
    city: String,
    name: {
      type: String
    },
    lat: {
      type: Number
    },
    lng: Number,
    tel: {
      type: String
    },
    hospital_id: {
      type: 'String',
      index: { unique: true }
    }
  });

Model.index({
  name: 1
});

module.exports = mongoose.model("hospital", Model);
