"use strict";

var handleCharacter = function handleCharacter(e) {
  e.preventDefault();

  if ($("#name").val() == '' || $("#age").val() == '' || $("#level").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function () {
    loadCharsFromServer();
  });
  return false;
};

var handleClick = function handleClick(e) {
  e.preventDefault(); //send the ajax for the button's function

  sendAjax('POST', '/remove', {
    _csrf: document.querySelector('#csrf').value,
    query: document.querySelector('#removeCharName').value
  });
  loadCharsFromServer();
  return false;
};

var levelUp = function levelUp(e) {
  e.preventDefault(); //send the ajax for the button's function

  sendAjax('POST', '/levelUp', {
    _csrf: document.querySelector('#csrf').value,
    query: document.querySelector('#removeCharName').value
  }, function () {
    loadCharsFromServer();
  });
  return false;
};

var CharForm = function CharForm(props) {
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
      type: "text",
      name: "level",
      placeholder: "Character's Level"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "age"
    }, "Age: "), /*#__PURE__*/React.createElement("input", {
      id: "charAge",
      type: "text",
      name: "age",
      placeholder: "Character's Age"
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
      value: "Level Up",
      onClick: levelUp
    }), /*#__PURE__*/React.createElement("input", {
      className: "removeSubmit",
      type: "button",
      value: "Delete Character",
      onClick: handleClick
    }), /*#__PURE__*/React.createElement("input", {
      id: "removeCharName",
      type: "text",
      name: "removeName",
      placeholder: "Name of Char to Remove"
    }))
  );
};

var CharList = function CharList(props) {
  if (props.chars.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "charList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "empty"
      }, "No Characters Yet"))
    );
  }

  var charNodes = props.chars.map(function (_char) {
    //changes the logo based on character class 
    var image;

    switch (_char["class"]) {
      case 'Warrior':
        image = '/assets/img/warrior.png';
        break;

      case 'Mage':
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
    });

    return (/*#__PURE__*/React.createElement("div", {
        key: _char._id,
        className: "char"
      }, /*#__PURE__*/React.createElement("img", {
        src: image,
        alt: "class logo",
        className: "classLogo"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "name"
      }, "Name: ", _char.name), /*#__PURE__*/React.createElement("h3", {
        className: "age"
      }, "Age: ", _char.age), /*#__PURE__*/React.createElement("h3", {
        className: "level"
      }, "Health: ", _char.health), /*#__PURE__*/React.createElement("h3", {
        className: "level"
      }, "Defence: ", _char.defence), /*#__PURE__*/React.createElement("h3", {
        className: "level"
      }, "Race: ", _char.race), /*#__PURE__*/React.createElement("h3", {
        className: "level"
      }, "Background: ", _char.background), /*#__PURE__*/React.createElement("h3", {
        className: "level"
      }, "Class: ", _char["class"]), /*#__PURE__*/React.createElement("h3", {
        className: "level"
      }, "Level: ", _char.level), /*#__PURE__*/React.createElement("h3", {
        className: "speed"
      }, "Movement Speed: ", _char.speed), /*#__PURE__*/React.createElement("h3", {
        className: "stats"
      }, " Stats: "), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Accuracy: ", _char.accuracy), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Communication: ", _char.communication), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Constitution: ", _char.constitution), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Dexterity: ", _char.dexterity), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Fighting: ", _char.fighting), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Intelligence: ", _char.intelligence), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Perception: ", _char.perception), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Strength: ", _char.strength), /*#__PURE__*/React.createElement("p", {
        className: "stats"
      }, "Willpower: ", _char.willpower), /*#__PURE__*/React.createElement("h4", null, "Current Money(SP): ", _char.money), /*#__PURE__*/React.createElement("h4", null, "Inventory"), /*#__PURE__*/React.createElement("ul", null, inv))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "charList"
    }, charNodes)
  );
};

var loadCharsFromServer = function loadCharsFromServer() {
  sendAjax('GET', '/getChars', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
      chars: data.chars
    }), document.querySelector("#chars"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(CharForm, {
    csrf: csrf
  }), document.querySelector("#makeChar"));
  ReactDOM.render( /*#__PURE__*/React.createElement(CharList, {
    chars: []
  }), document.querySelector("#chars"));
  loadCharsFromServer();
};

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
  $("#domoMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#domoMessage").animate({
    width: 'hide'
  }, 350);
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
