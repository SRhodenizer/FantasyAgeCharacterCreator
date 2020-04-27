const models = require('../models');

// helper function to roll 1 d6
function rollDie() {
  return (Math.floor(Math.random() * 6));
}

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

const gamePage = (req, res) => {
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
      error: 'All fields are required.',
    });
  }

  // sets up arrays for stats, talents and abilities
  const stats = [];
  const talents = [];
  const abilities = [];

  // variables for starting health and starting inventory
  let startHealth;
  const inv = [];
  const lang = [];

  // gets stats with die rolls
  for (let i = 0; i < 9; i++) {
    // make each stat a JSON object with an array of focuses
    stats[i] = {
      focus: [],
    };
    stats[i].value = rollDie() + rollDie() + rollDie() + 3;
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
    switch (stats[i].value) {
      case 3:
        stats[i].mod = -2;
        break;
      case 4:
      case 5:
        stats[i].mod = -1;
        break;
      case 6:
      case 7:
      case 8:
        stats[i].mod = 0;
        break;
      case 9:
      case 10:
      case 11:
        stats[i].mod = 1;
        break;
      case 12:
      case 13:
      case 14:
        stats[i].mod = 2;
        break;
      case 15:
      case 16:
      case 17:
        stats[i].mod = 3;
        break;
      case 18:
        stats[i].mod = 4;
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
      stats[2].mod += 1;
      moveSpeed = 8 + stats[3].mod;
      lang.push('Common');
      lang.push('Dwarvish');

      // add values based on racial selection table
      for (let i = 0; i < 2; i++) {
        const diceRoll = rollDie() + rollDie();
        switch (diceRoll) {
          case 2:
            stats[8].mod += 1;
            break;
          case 3:
          case 4:
            stats[5].focus.push('Historical Lore');
            break;
          case 5:
            stats[2].focus.push('Stamina');
            break;
          case 6:
            if (talents.includes({
              name: 'Axes',
              level: 'Weapon Group',
            })) {
              stats[4].focus.push('Axes');
            } else {
              talents.push({
                name: 'Axes',
                level: 'Weapon Group',
              });
            }
            break;
          case 7:
          case 8:
            stats[4].mod += 1;
            break;
          case 9:
            stats[7].focus.push('Smithing');
            break;
          case 10:
          case 11:
            stats[5].focus.push('Engineering');
            break;
          case 12:
            stats[7].mod += 1;
            break;
          default:
            break;
        }
      }
      break;
    case 'Elf':
      stats[3].mod += 1;
      moveSpeed = 12 + stats[3].mod;
      lang.push('Common');
      lang.push('Elven');

      // add values based on racial selection table
      for (let i = 0; i < 2; i++) {
        const diceRoll = rollDie() + rollDie();
        switch (diceRoll) {
          case 2:
            stats[1].mod += 1;
            break;
          case 3:
          case 4:
            stats[5].focus.push('Cultural Lore');
            break;
          case 5:
            stats[6].focus.push('Hearing');
            break;
          case 6:
            if (talents.includes({
              name: 'Bows',
              level: 'Weapon Group',
            })) {
              stats[0].focus.push('Bows');
            } else {
              talents.push({
                name: 'Bows',
                level: 'Weapon Group',
              });
            }
            break;
          case 7:
          case 8:
            stats[0].mod += 1;
            break;
          case 9:
            stats[3].focus.push('Initiative');
            break;
          case 10:
          case 11:
            stats[1].focus.push('Persuasion');
            break;
          case 12:
            stats[6].mod += 1;
            break;
          default:
            break;
        }
      }
      break;
    case 'Gnome':
      stats[3].mod += 1;
      moveSpeed = 8 + stats[3].mod;
      lang.push('Common');
      lang.push('Gnomish');

      // add values based on racial selection table
      for (let i = 0; i < 2; i++) {
        const diceRoll = rollDie() + rollDie();
        switch (diceRoll) {
          case 2:
            stats[2].mod += 1;
            break;
          case 3:
          case 4:
            stats[3].focus.push('Traps');
            break;
          case 5:
            stats[5].focus.push('Evaluation');
            break;
          case 6:
            stats[6].focus.push('Hearing');
            break;
          case 7:
          case 8:
            stats[8].mod += 1;
            break;
          case 9:
            stats[5].focus.push('Arcane Lore');
            break;
          case 10:
          case 11:
            stats[1].focus.push('Bargaining');
            break;
          case 12:
            stats[5].mod += 1;
            break;
          default:
            break;
        }
      }
      break;
    case 'Halfling':
      stats[3].mod += 1;
      moveSpeed = 8 + stats[3].mod;
      lang.push('Common');
      lang.push('Halfling');

      // add values based on racial selection table
      for (let i = 0; i < 2; i++) {
        const diceRoll = rollDie() + rollDie();
        switch (diceRoll) {
          case 2:
            stats[6].mod += 1;
            break;
          case 3:
          case 4:
            stats[1].focus.push('Persuasion');
            break;
          case 5:
            stats[3].focus.push('Initiative');
            break;
          case 6:
            stats[8].focus.push('Courage');
            break;
          case 7:
          case 8:
            stats[1].mod += 1;
            break;
          case 9:
            stats[6].focus.push('Hearing');
            break;
          case 10:
          case 11:
            stats[7].focus.push('Climbing');
            break;
          case 12:
            stats[0].mod += 1;
            break;
          default:
            break;
        }
      }
      break;
    case 'Human':
      stats[4].mod += 1;
      moveSpeed = 10 + stats[3].mod;
      lang.push('Common');

      // add values based on racial selection table
      for (let i = 0; i < 2; i++) {
        const diceRoll = rollDie() + rollDie();
        switch (diceRoll) {
          case 2:
            stats[5].mod += 1;
            break;
          case 3:
          case 4:
            stats[2].focus.push('Stamina');
            break;
          case 5:
            stats[6].focus.push('Searching');
            break;
          case 6:
            stats[1].focus.push('Persuasion');
            break;
          case 7:
          case 8:
            stats[2].mod += 1;
            break;
          case 9:
            stats[1].focus.push('Deception');
            break;
          case 10:
          case 11:
            stats[0].focus.push('Brawling');
            break;
          case 12:
            stats[7].mod += 1;
            break;
          default:
            break;
        }
      }
      break;
    case 'Orc':
      stats[7].mod += 1;
      moveSpeed = 10 + stats[3].mod;
      lang.push('Common');
      lang.push('Orcish');

      // add values based on racial selection table
      for (let i = 0; i < 2; i++) {
        const diceRoll = rollDie() + rollDie();
        switch (diceRoll) {
          case 2:
            stats[2].mod += 1;
            break;
          case 3:
          case 4:
            stats[6].focus.push('Smelling');
            break;
          case 5:
            stats[3].focus.push('Stealth');
            break;
          case 6:
            stats[7].focus.push('Intimidation');
            break;
          case 7:
          case 8:
            stats[4].mod += 1;
            break;
          case 9:
            if (talents.includes({
              name: 'Bludgeons',
              level: 'Weapon Group',
            })) {
              stats[4].focus.push('Bludgeons');
            } else {
              talents.push({
                name: 'Bludgeons',
                level: 'Weapon Group',
              });
            }
            break;
          case 10:
          case 11:
            stats[0].focus.push('Brawling');
            break;
          case 12:
            stats[8].mod += 1;
            break;
          default:
            break;
        }
      }
      break;
    default:
      break;
  }


  // sets up starting inventory for all characters
  inv[0] = 'backpack';
  inv[1] = "traveler's clothes";
  inv[2] = 'waterskin';

  // a variable for mage's mp score
  let mp;

  // sets health and starting inventory based on class
  switch (req.body.class) {
    case 'Mage':
      startHealth = 20 + stats[2].mod + rollDie() + 1;
      inv[3] = 'arcane device';
      abilities.push('Arcane Blast');
      mp = 10 + stats[8].mod + rollDie();
      talents.push({ name: 'Staves', level: 'Weapon Group' });
      talents.push({ name: 'Brawling', level: 'Weapon Group' });

      // add starting talents and arcanas
      break;
    case 'Warrior':
      startHealth = 30 + stats[2].mod + rollDie() + 1;
      inv[3] = 'heavy leather armor';
      talents.push({ name: 'Brawling', level: 'Weapon Group' });

      // add chosen weapon groups first

      // then chosen weapon talents

      talents.push({ name: 'Armor Training', level: 'Novice' });
      break;
    case 'Rogue':
      startHealth = 25 + stats[2].mod + rollDie() + 1;
      inv[3] = 'leather armor';
      talents.push({ name: 'Staves', level: 'Weapon Group' });
      talents.push({ name: 'Brawling', level: 'Weapon Group' });
      talents.push({ name: 'Light Blades', level: 'Weapon Group' });

      abilities.push("Rogue's Armor");

      // add chosen starting talent

      break;
    default:
      break;
  }

  // gets two dice rolls for background tables
  const sc = rollDie() + 1;
  const fate = rollDie() + 1;
  // the character's backstory and starting money
  let backstory;
  let startMon;

  // outer switch represents table 1, inner switches represent table 2
  switch (sc) {
    case 1:
      startMon = 15 + (rollDie() + 1)
                + (rollDie() + 1) + (rollDie() + 1);
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
      startMon = 25 + (rollDie() + 1)
                + (rollDie() + 1) + (rollDie() + 1);
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
      startMon = 50 + (rollDie() + 1)
                + (rollDie() + 1) + (rollDie() + 1);
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
      startMon = 100 + (rollDie() + 1)
                + (rollDie() + 1) + (rollDie() + 1);
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
  const def = 10 + stats[3].mod;

  const characterData = {
    // form data
    name: req.body.name,
    age: req.body.age,
    health: startHealth,
    level: req.body.level,
    class: req.body.class,
    race: req.body.race,
    // stats
    accuracy: stats[0],
    communication: stats[1],
    constitution: stats[2],
    dexterity: stats[3],
    fighting: stats[4],
    intelligence: stats[5],
    perception: stats[6],
    strength: stats[7],
    willpower: stats[8],
    // values based on class
    speed: moveSpeed,
    defence: def,
    background: backstory,
    // attribites for change during gameplay
    inventory: inv,
    talents,
    languages: lang,
    money: startMon,
    owner: req.session.account._id,
  };

  // sets the unrequired mp if the player is a mage
  if (req.body.class === 'Mage') {
    characterData.magicPoints = mp;
  }

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
module.exports.gamePage = gamePage;
module.exports.getCharacters = getCharacters;
module.exports.make = makeChar;
module.exports.remove = removeChar;
module.exports.levelUp = levelUp;
