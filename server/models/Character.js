const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let CharModel = {};

// mongoose.Types.ObjectIS is a function that converts string ID into Mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const CharSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  race: {
    type: String,
    required: true,
    trim: true,
  },
  class: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: Number,
    min: 1,
    required: true,
  },
  health: {
    type: Number,
    min: 0,
    required: true,
  },
  accuracy: {
    type: Number,
    min: -2,
    required: true,
  },
  communication: {
    type: Number,
    min: -2,
    required: true,
  },
  constitution: {
    type: Number,
    min: -2,
    required: true,
  },
  dexterity: {
    type: Number,
    min: -2,
    required: true,
  },
  fighting: {
    type: Number,
    min: -2,
    required: true,
  },
  intelligence: {
    type: Number,
    min: -2,
    required: true,
  },
  perception: {
    type: Number,
    min: -2,
    required: true,
  },
  strength: {
    type: Number,
    min: -2,
    required: true,
  },
  willpower: {
    type: Number,
    min: -2,
    required: true,
  },
  speed: {
    type: Number,
    min: 0,
    required: true,
  },
  defence: {
    type: Number,
    min: 0,
    required: true,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  background: {
    type: String,
    required: true,
    trim: true,
  },
  inventory: {
    type: Array,
    required: true,
  },
  money: {
    type: Number,
    min: 0,
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

CharSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  level: doc.level,
});

CharSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertID(ownerID),
  };

  return CharModel.find(search).lean().exec(callback);
};

CharSchema.statics.remove = (ownerID, query) => {
  const search = {
    owner: convertID(ownerID),
    name: query,
  };

  return CharModel.collection.deleteOne(search);
};

CharSchema.statics.levelUp = (ownerID, query) => {
  // converts parameters into mongoDB search query
  const search = {
    owner: convertID(ownerID),
    name: query,
  };

  // finds the character you're looking for
  CharModel.collection.findOne(search).then((character) => {
    // sets character to a usable variable
    // makes new attributes to update previous ones
    let newHealth;
    const newLevel = character.level + 1;

    // updates character health based on their new level
    if (character.level < 11) {
      newHealth = character.health + character.constitution
                + (Math.floor(Math.random() * 6) + 1);
    } else {
      newHealth = character.health + character.constitution;
    }

    // needs to have player choice somehow - maybe a popup or redirect?

    // checks the character's class for level up guide
    switch (character.class) {
      case 'Mage':
        break;
      case 'Warrior':
        break;
      case 'Rogue':
        break;
      default:
        break;
    }

    CharModel.collection.updateOne(search,
      { $set: { level: newLevel }, $set: { health: newHealth } });
  });
};

CharModel = mongoose.model('Character', CharSchema);

module.exports.CharModel = CharModel;
module.exports.CharSchema = CharSchema;
