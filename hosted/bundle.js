"use strict";

var currPage = ''; //wether the page displayed is the char creator or the game page 

var currChar; //the current character being played  

var diceRolls; //output for rolling dice
//function for dice rolls in game, 3d6

var rollDice = function rollDice(mod) {
  var stuntPoints = 0;
  var die1 = Math.floor(Math.random() * 6) + 1;
  var die2 = Math.floor(Math.random() * 6) + 1;
  var die3 = Math.floor(Math.random() * 6) + 1;

  if (die1 === die2) {
    stuntPoints = die3;
  } //makes a json object with toal rolled and stunt points achieved


  var total = {
    roll: die1 + die2 + die3,
    stunt: stuntPoints
  };
  var dice = document.querySelectorAll(".diceImage"); //makes a dice rolling animation

  for (var i = 0; i < dice.length; i++) {
    dice[i].style = "visibility:visible";
  }

  setTimeout(function () {
    for (var _i = 0; _i < dice.length; _i++) {
      dice[_i].style = "visibility:hidden";
    }

    document.querySelector('#diceRolls').innerHTML = total.roll;
  }, 1200);
}; //for adding a character to the list


var handleCharacter = function handleCharacter(e) {
  e.preventDefault();

  if ($("#name").val() == '' || $("#age").val() == '' || $("#level").val() == '') {
    handleError("All fields are required.");
    return false;
  }

  if ($('#level').val() > 20 || $('#level').val() < 1) {
    handleError("Level has to be from 1 to 20.");
    return false;
  }

  sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function () {
    loadCharsFromServer();
  });
  return false;
}; //handles clicking the remove character button


var handleClick = function handleClick(e) {
  e.preventDefault(); //send the ajax for the button's function

  sendAjax('POST', '/remove', {
    _csrf: document.querySelector('#csrf').value,
    query: document.querySelector('#removeCharName').value
  });
  loadCharsFromServer();
  return false;
}; //checks if the current user is premium


var checkPremium = function checkPremium(csrf) {
  var data = sendAjax('GET', '/checkPremium', {}, function (data) {
    var premium = data.user[0].premium;

    if (premium === undefined) {
      premium = false;
    }

    console.log(premium); //debug check

    createCharCreatorWindow(csrf, premium);
  });
}; //levels up the character in play


var levelUp = function levelUp(e) {
  e.preventDefault(); //send the ajax for the button's function

  sendAjax('POST', '/levelUp', {
    _csrf: document.querySelector('#csrf').value,
    query: document.querySelector("#characterName").value
  });
  loadCharsFromServer();
  return false;
}; //forms for influencing the character during game and making character 


var CharForm = function CharForm(props) {
  if (currPage === 'game') {
    return (/*#__PURE__*/React.createElement("form", {
        id: "gameForm",
        onSubmit: getActiveChar,
        name: "gameForm",
        action: "/getChar",
        method: "POST",
        className: "charForm"
      }, /*#__PURE__*/React.createElement("input", {
        className: "makeSubmit",
        type: "button",
        value: "Level Up",
        onClick: levelUp
      }), /*#__PURE__*/React.createElement("input", {
        className: "makeSubmit",
        type: "button",
        value: "Roll Dice",
        onClick: rollDice
      }), /*#__PURE__*/React.createElement("input", {
        id: "activeName",
        className: "activeName",
        type: "text",
        name: "name",
        placeholder: "Name of Character"
      }), /*#__PURE__*/React.createElement("input", {
        id: "activeNameButton",
        className: "makeSubmit",
        type: "submit",
        value: "Find Character"
      }), /*#__PURE__*/React.createElement("input", {
        id: "csrf",
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      }))
    );
  } else {
    if (props.premium) {
      return (/*#__PURE__*/React.createElement("form", {
          id: "characterForm",
          onSubmit: handleCharacter,
          name: "charForm",
          action: "/maker",
          method: "POST",
          className: "charForm"
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: "name"
        }, "Name: "), /*#__PURE__*/React.createElement("input", {
          id: "charName",
          type: "text",
          name: "name",
          placeholder: "Character's Name"
        }), /*#__PURE__*/React.createElement("label", {
          htmlFor: "race"
        }, "Race: "), /*#__PURE__*/React.createElement("select", {
          id: "charRace",
          name: "race"
        }, /*#__PURE__*/React.createElement("option", {
          value: "null"
        }, "Select Race"), /*#__PURE__*/React.createElement("option", {
          value: "Dwarf"
        }, "Dwarf"), /*#__PURE__*/React.createElement("option", {
          value: "Elf"
        }, "Elf"), /*#__PURE__*/React.createElement("option", {
          value: "Gnome"
        }, "Gnome"), /*#__PURE__*/React.createElement("option", {
          value: "Halfling"
        }, "Halfling"), /*#__PURE__*/React.createElement("option", {
          value: "Human"
        }, "Human"), /*#__PURE__*/React.createElement("option", {
          value: "Orc"
        }, "Orc")), /*#__PURE__*/React.createElement("label", {
          htmlFor: "class"
        }, "Class: "), /*#__PURE__*/React.createElement("select", {
          id: "charClass",
          name: "class"
        }, /*#__PURE__*/React.createElement("option", {
          value: "null"
        }, "Select Class"), /*#__PURE__*/React.createElement("option", {
          value: "Mage"
        }, "Mage"), /*#__PURE__*/React.createElement("option", {
          value: "Warrior"
        }, "Warrior"), /*#__PURE__*/React.createElement("option", {
          value: "Rogue"
        }, "Rogue")), /*#__PURE__*/React.createElement("label", {
          htmlFor: "level"
        }, "Lvl: "), /*#__PURE__*/React.createElement("input", {
          id: "charLevel",
          type: "number",
          name: "level",
          min: "1",
          max: "20",
          placeholder: "Lvl"
        }), /*#__PURE__*/React.createElement("label", {
          htmlFor: "age"
        }, "Age: "), /*#__PURE__*/React.createElement("input", {
          id: "charAge",
          type: "text",
          name: "age",
          placeholder: "Age"
        }), /*#__PURE__*/React.createElement("input", {
          id: "csrf",
          type: "hidden",
          name: "_csrf",
          value: props.csrf
        }), /*#__PURE__*/React.createElement("input", {
          className: "makeSubmit",
          type: "submit",
          value: "Make Character"
        }), /*#__PURE__*/React.createElement("input", {
          className: "removeSubmit",
          type: "button",
          value: "Delete Character",
          onClick: handleClick
        }), /*#__PURE__*/React.createElement("input", {
          id: "removeCharName",
          type: "text",
          name: "removeName",
          placeholder: "Delete Character"
        }))
      );
    } else {
      return (/*#__PURE__*/React.createElement("form", {
          id: "characterForm",
          onSubmit: handleCharacter,
          name: "charForm",
          action: "/maker",
          method: "POST",
          className: "charForm"
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: "name"
        }, "Name: "), /*#__PURE__*/React.createElement("input", {
          id: "charName",
          type: "text",
          name: "name",
          placeholder: "Character's Name"
        }), /*#__PURE__*/React.createElement("label", {
          htmlFor: "race"
        }, "Race: "), /*#__PURE__*/React.createElement("select", {
          id: "charRace",
          name: "race"
        }, /*#__PURE__*/React.createElement("option", {
          value: "null"
        }, "Select Race"), /*#__PURE__*/React.createElement("option", {
          value: "Dwarf"
        }, "Dwarf"), /*#__PURE__*/React.createElement("option", {
          value: "Elf"
        }, "Elf"), /*#__PURE__*/React.createElement("option", {
          value: "Human"
        }, "Human"), /*#__PURE__*/React.createElement("option", {
          value: "Orc"
        }, "Orc")), /*#__PURE__*/React.createElement("label", {
          htmlFor: "class"
        }, "Class: "), /*#__PURE__*/React.createElement("select", {
          id: "charClass",
          name: "class"
        }, /*#__PURE__*/React.createElement("option", {
          value: "null"
        }, "Select Class"), /*#__PURE__*/React.createElement("option", {
          value: "Mage"
        }, "Mage"), /*#__PURE__*/React.createElement("option", {
          value: "Warrior"
        }, "Warrior"), /*#__PURE__*/React.createElement("option", {
          value: "Rogue"
        }, "Rogue")), /*#__PURE__*/React.createElement("label", {
          htmlFor: "level"
        }, "Lvl: "), /*#__PURE__*/React.createElement("input", {
          id: "charLevel",
          type: "number",
          name: "level",
          min: "1",
          max: "20",
          placeholder: "Lvl"
        }), /*#__PURE__*/React.createElement("label", {
          htmlFor: "age"
        }, "Age: "), /*#__PURE__*/React.createElement("input", {
          id: "charAge",
          type: "text",
          name: "age",
          placeholder: "Age"
        }), /*#__PURE__*/React.createElement("input", {
          id: "csrf",
          type: "hidden",
          name: "_csrf",
          value: props.csrf
        }), /*#__PURE__*/React.createElement("input", {
          className: "makeSubmit",
          type: "submit",
          value: "Make Character"
        }), /*#__PURE__*/React.createElement("input", {
          className: "removeSubmit",
          type: "button",
          value: "Delete Character",
          onClick: handleClick
        }), /*#__PURE__*/React.createElement("input", {
          id: "removeCharName",
          type: "text",
          name: "removeName",
          placeholder: "Delete Character"
        }))
      );
    }
  }
}; //displays character information 


var CharList = function CharList(props) {
  //if there are no characters 
  if (props.chars.length === 0) {
    //and you're on the create page 
    if (currPage === 'create') {
      return (/*#__PURE__*/React.createElement("div", {
          className: "charList"
        }, /*#__PURE__*/React.createElement("h3", {
          className: "empty"
        }, "No Characters Yet"))
      ); //or youre on the game page 
    } else {
      return (/*#__PURE__*/React.createElement("div", {
          className: "charList"
        }, /*#__PURE__*/React.createElement("h3", {
          className: "empty"
        }, "Select Character to Display"))
      );
    }
  } //node for each character


  var charNodes;

  if (currPage === 'game') {
    //if it's the game page display all the stats and stuff
    charNodes = props.chars.map(function (_char) {
      //changes the logo based on character class 
      var image;
      var mp;

      switch (_char["class"]) {
        case 'Warrior':
          image = '/assets/img/warrior.png';
          break;

        case 'Mage':
          mp = 'Magic:';
          image = '/assets/img/wizard.png';
          break;

        case 'Rogue':
          image = '/assets/img/rogue.jpg';
          break;

        default:
          break;
      } //maps the character's inventory into an unordered list


      var inv = _char.inventory.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      }); //maps each of the character's stat attributes into unordered lists 


      var acc = _char.accuracy.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var com = _char.communication.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var con = _char.constitution.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var dex = _char.dexterity.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var fig = _char.fighting.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var intel = _char.intelligence.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var per = _char.perception.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var str = _char.strength.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var wil = _char.willpower.focus.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item)
        );
      });

      var talent = _char.talents.map(function (item, key) {
        return (/*#__PURE__*/React.createElement("li", {
            key: item
          }, item.name, " (", item.level, ")")
        );
      }); //returns react html for all the stats


      return (/*#__PURE__*/React.createElement("div", {
          key: _char._id,
          className: "char"
        }, /*#__PURE__*/React.createElement("img", {
          src: image,
          alt: "class logo",
          className: "classLogo"
        }), /*#__PURE__*/React.createElement("div", {
          className: "stats"
        }, /*#__PURE__*/React.createElement("h5", null, "Accuracy: ", _char.accuracy.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, acc), /*#__PURE__*/React.createElement("h5", null, "Communication: ", _char.communication.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, com), /*#__PURE__*/React.createElement("h5", null, "Constitution: ", _char.constitution.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, con), /*#__PURE__*/React.createElement("h5", null, "Dexterity: ", _char.dexterity.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, dex), /*#__PURE__*/React.createElement("h5", null, "Fighting: ", _char.fighting.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, fig), /*#__PURE__*/React.createElement("h5", null, "Intelligence: ", _char.intelligence.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, intel), /*#__PURE__*/React.createElement("h5", null, "Perception: ", _char.perception.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, per), /*#__PURE__*/React.createElement("h5", null, "Strength: ", _char.strength.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, str), /*#__PURE__*/React.createElement("h5", null, "Willpower: ", _char.willpower.mod), /*#__PURE__*/React.createElement("h5", null, "Focuses"), /*#__PURE__*/React.createElement("ul", {
          className: "focus"
        }, wil)), /*#__PURE__*/React.createElement("div", {
          className: "heading"
        }, /*#__PURE__*/React.createElement("h3", {
          className: "hp"
        }, "Health: ", _char.health), /*#__PURE__*/React.createElement("h3", {
          className: "mp"
        }, mp, " ", _char.magicPoints), /*#__PURE__*/React.createElement("h3", {
          className: "name"
        }, "Name: ", _char.name), /*#__PURE__*/React.createElement("input", {
          id: "characterName",
          type: "hidden",
          name: "name",
          value: _char.name
        }), /*#__PURE__*/React.createElement("h3", {
          className: "class"
        }, "Level ", _char.level, " ", _char.race, " ", _char["class"]), /*#__PURE__*/React.createElement("h3", {
          className: "past"
        }, "Background: ", _char.background), /*#__PURE__*/React.createElement("h3", {
          className: "def"
        }, "Defence: ", _char.defence), /*#__PURE__*/React.createElement("h3", {
          className: "speed"
        }, "Movement Speed: ", _char.speed)), /*#__PURE__*/React.createElement("div", {
          className: "talent"
        }, /*#__PURE__*/React.createElement("h3", null, "Talents"), /*#__PURE__*/React.createElement("ul", null, talent)), /*#__PURE__*/React.createElement("div", {
          className: "inventory"
        }, /*#__PURE__*/React.createElement("h3", null, "Inventory"), /*#__PURE__*/React.createElement("h4", {
          className: "money"
        }, "Current Money(SP): ", _char.money), /*#__PURE__*/React.createElement("ul", null, inv)))
      );
    }); //if it's the creator screen simply make a list of all made characters 
  } else {
    charNodes = props.chars.map(function (_char2) {
      return (/*#__PURE__*/React.createElement("p", null, _char2.name, ", the Level ", _char2.level, " ", _char2.race, " ", _char2["class"], ".")
      );
    });
  } //then return the div of char nodes to render 


  return (/*#__PURE__*/React.createElement("div", {
      className: "charList"
    }, charNodes)
  );
}; //gets all characters from the server


var loadCharsFromServer = function loadCharsFromServer() {
  sendAjax('GET', '/getChars', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
      chars: data.chars
    }), document.querySelector("#chars"));
  });
}; //gets a character based on an input string 


var getActiveChar = function getActiveChar(e) {
  e.preventDefault();
  sendAjax('POST', '/getChar', $("#gameForm").serialize(), function (data) {
    currChar = data;
    ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
      chars: data
    }), document.querySelector("#chars")); //document.querySelector('#activeName').remove();
    //document.querySelector('#activeNameButton').remove();
  });
}; //makes the character creation screen 


var createCharCreatorWindow = function createCharCreatorWindow(csrf, premium) {
  //sets current page to the creator
  currPage = 'create'; //hides the dice roll panel

  document.querySelector('#output').style = 'visibility:hidden'; //gets the game nav button

  var gameButton = document.querySelector("#gameButton"); //gets rid of old chars data

  var character = document.querySelector('#chars');
  character.innerHTML = ''; //loads the charform

  ReactDOM.render( /*#__PURE__*/React.createElement(CharForm, {
    csrf: csrf,
    premium: premium
  }), document.querySelector("#makeChar")); //gets the chars

  loadCharsFromServer(); //loads the chars recieved

  ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
    chars: []
  }), document.querySelector("#chars")); //sets up the event listener for the game button

  gameButton.addEventListener("click", function (e) {
    e.preventDefault();
    createGameWindow(csrf);
    return false;
  });
}; //makes the gameplay screen


var createGameWindow = function createGameWindow(csrf) {
  //sets the current page to the game screen
  currPage = 'game'; //shows the dice out put div

  document.querySelector('#output').style = 'visibility:visible'; //gets the nav button

  var creatorButton = document.querySelector("#creatorButton"); //hides old chars 

  var form = document.querySelector('#makeChar');
  form.innerHTML = ''; //renders the char form 

  ReactDOM.render( /*#__PURE__*/React.createElement(CharForm, {
    csrf: csrf
  }), document.querySelector("#makeChar")); //renders the chars 

  ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
    chars: []
  }), document.querySelector("#chars")); //sets up nav event listener 

  creatorButton.addEventListener("click", function (e) {
    e.preventDefault();
    checkPremium(csrf);
    return false;
  });
}; //setup function for page redirects 


var setup = function setup(csrf) {
  checkPremium(csrf);
}; //gets csrfTokens on launch


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
