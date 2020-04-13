const models = require('../models');

const {
  Char,
} = models;

const makerPage = (req, res) => {
  Char.CharModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured',
      });
    }

    return res.render('app', {
      csrfToken: req.csrfToken(),
      chars: docs,
    });
  });
};

const makeChar = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level || !req.body.class || !req.body.race) {
    return res.status(400).json({
      error: 'RAWR! All fields are required.',
    });
  }

  // get basic stat values from dice rolls
  const stats = [];

  for (let i = 0; i < 9; i++) {
    stats[i] = (Math.floor(Math.random() * 6)) + (Math.floor(Math.random() * 6))
            + (Math.floor(Math.random() * 6)) + 3;
  }
  // stats are as follows
  /*
        0 - Accuracy
        1 - Communication
        2 - Constitution
        3 - Dexterity
        4 - Fighting
        5 - Intelligence
        6 - Perception
        7 - Strength
        8 - Willpower
        */


  // converts stat values into their roll modifiers
  for (let i = 0; i < 9; i++) {
    switch (stats[i]) {
      case 3:
        stats[i] = -2;
        break;
      case 4:
      case 5:
        stats[i] = -1;
        break;
      case 6:
      case 7:
      case 8:
        stats[i] = 0;
        break;
      case 9:
      case 10:
      case 11:
        stats[i] = 1;
        break;
      case 12:
      case 13:
      case 14:
        stats[i] = 2;
        break;
      case 15:
      case 16:
      case 17:
        stats[i] = 3;
        break;
      case 18:
        stats[i] = 4;
        break;
      default:
        break;
    }
  }

  // gets a speed value for the character's movement speed
  let moveSpeed = 0;

  // changes stats based on racial features
  switch (req.body.race) {
    case 'Dwarf':
      stats[2] += 1;
      moveSpeed = 8 + stats[3];
      break;
    case 'Elf':
      stats[3] += 1;
      moveSpeed = 12 + stats[3];
      break;
    case 'Gnome':
      stats[3] += 1;
      moveSpeed = 8 + stats[3];
      break;
    case 'Halfling':
      stats[3] += 1;
      moveSpeed = 8 + stats[3];
      break;
    case 'Human':
      stats[4] += 1;
      moveSpeed = 10 + stats[3];
      break;
    case 'Orc':
      stats[7] += 1;
      moveSpeed = 10 + stats[3];
      break;
    default:
      break;
  }

  // class based switch to determine health and other starting values
  let startHealth;
  const inv = [];

  // sets up starting inventory for all characters
  inv[0] = 'backpack';
  inv[1] = "traveler's clothes";
  inv[2] = 'waterskin';

  switch (req.body.class) {
    case 'Mage':
      startHealth = 20 + stats[2] + (Math.floor(Math.random() * 6) + 1);
      inv[3] = 'arcane device';
      break;
    case 'Warrior':
      startHealth = 30 + stats[2] + (Math.floor(Math.random() * 6) + 1);
      inv[3] = 'heavy leather armor';
      break;
    case 'Rogue':
      startHealth = 25 + stats[2] + (Math.floor(Math.random() * 6) + 1);
      inv[3] = 'leather armor';
      break;
    default:
      break;
  }

  // gets two dice rolls for background tables
  const sc = Math.floor(Math.random() * 6) + 1;
  const fate = Math.floor(Math.random() * 6) + 1;
  // the character's backstory and starting money
  let backstory;
  let startMon;

  // outer switch represents table 1, inner switches represent table 2
  switch (sc) {
    case 1:
      startMon = 15 + (Math.floor(Math.random() * 6) + 1)
                + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
      switch (fate) {
        case 1:
          backstory = 'Criminal';
          break;
        case 2:
          backstory = 'Exile';
          break;
        case 3:
          backstory = 'Hermit';
          break;
        case 4:
          backstory = 'Pirate';
          break;
        case 5:
          backstory = 'Radical';
          break;
        case 6:
          backstory = 'Wanderer';
          break;
        default:
          break;
      }
      break;
      // 2 and 3 lead to the same result
    case 2:
    case 3:
      startMon = 25 + (Math.floor(Math.random() * 6) + 1)
                + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
      switch (fate) {
        case 1:
          backstory = 'Artist';
          break;
        case 2:
          backstory = 'Laborer';
          break;
        case 3:
          backstory = 'Performer';
          break;
        case 4:
          backstory = 'Sailor';
          break;
        case 5:
          backstory = 'Soldier';
          break;
        case 6:
          backstory = 'Tradesperson';
          break;
        default:
          break;
      }
      break;
    case 4:
    case 5:
      startMon = 50 + (Math.floor(Math.random() * 6) + 1)
                + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
      switch (fate) {
        case 1:
          backstory = 'Guilder';
          break;
        case 2:
          backstory = 'Initiate';
          break;
        case 3:
          backstory = 'Innkeeper';
          break;
        case 4:
          backstory = 'Merchant';
          break;
        case 5:
          backstory = 'Scribe';
          break;
        case 6:
          backstory = 'Student';
          break;
        default:
          break;
      }
      break;
    case 6:
      startMon = 100 + (Math.floor(Math.random() * 6) + 1)
                + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
      switch (fate) {
        case 1:
          backstory = 'Apprentice';
          break;
        case 2:
          backstory = 'Dilettante';
          break;
        case 3:
          backstory = 'Noble';
          break;
        case 4:
          backstory = 'Official';
          break;
        case 5:
          backstory = 'Scholar';
          break;
        case 6:
          backstory = 'Squire';
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  // gets a starting defence value
  const def = 10 + stats[3];

  const characterData = {
    // form data
    name: req.body.name,
    age: req.body.age,
    health: startHealth,
    level: req.body.level,
    class: req.body.class,
    race: req.body.race,
    // stats - in this system roll 3 d6 and add them together
    accuracy: stats[0],
    communication: stats[1],
    constitution: stats[2],
    dexterity: stats[3],
    fighting: stats[4],
    intelligence: stats[5],
    perception: stats[6],
    strength: stats[7],
    willpower: stats[8],
    speed: moveSpeed,
    defence: def,
    background: backstory,
    inventory: inv,
    money: startMon,
    owner: req.session.account._id,
  };

  const newChar = new Char.CharModel(characterData);

  const charPromise = newChar.save();

  charPromise.then(() => res.json({
    redirect: '/maker',
  }));

  charPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({
        error: 'Character already exists.',
      });
    }
    return res.status(400).json({
      error: 'an error occurred',
    });
  });
  return charPromise;
};

const getCharacters = (request, response) => {
  const req = request;
  const res = response;

  return Char.CharModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An error occured',
      });
    }

    return res.json({
      chars: docs,
    });
  });
};

const removeChar = (request, response) => {
  Char.CharModel.remove(request.session.account._id, request.body.query);
  return response;
};

const levelUp = (request, response) => {
  Char.CharModel.levelUp(request.session.account._id, request.body.query);
  return response;
};

module.exports.makerPage = makerPage;
module.exports.getCharacters = getCharacters;
module.exports.make = makeChar;
module.exports.remove = removeChar;
module.exports.levelUp = levelUp;
