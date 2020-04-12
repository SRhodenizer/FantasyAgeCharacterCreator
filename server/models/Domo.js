const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectIS is a function that converts string ID into Mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  level: {
    type: Number,
    min: 1,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
});

DomoSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return DomoModel.find(search).select('name age level').lean().exec(callback);
};

DomoSchema.statics.removeDomo = (ownerID, query) => {
  const search = {
    owner: convertID(ownerID),
    name: query,
  };

  console.log('Made it server side');

  // why doesn't this delete
  return DomoModel.collection.deleteOne(search);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
