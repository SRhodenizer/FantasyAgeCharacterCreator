"use strict";

var premium; //wether or not the account is premium
//sends the password change request

var handleChangePassword = function handleChangePassword(e) {
  e.preventDefault();

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#changePassword").attr("action"), $("#changePassword").serialize(), redirect);
  return false;
}; //sends the goPremium request 


var handlePremium = function handlePremium(e) {
  e.preventDefault();
  sendAjax('POST', '/goPremium', $("#changePassword").serialize(), checkPremium);
  return false;
}; //the react component for the non premium window


var AccountSettingsWindow = function AccountSettingsWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "changePassword",
      name: "passwordForm",
      onSubmit: handleChangePassword,
      action: "/changePassword",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("h3", null, "Change Password"), /*#__PURE__*/React.createElement("label", {
      id: "formLabel",
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      id: "formLabel",
      htmlFor: "pass"
    }, "New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "new password"
    }), /*#__PURE__*/React.createElement("label", {
      id: "formLabel",
      htmlFor: "pass2"
    }, "Retype New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "new password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Change Password"
    }), /*#__PURE__*/React.createElement("input", {
      className: "premiumButton",
      type: "button",
      value: "Activate Premium",
      onClick: handlePremium
    }))
  );
}; //the react component for the premium window 


var PremiumSettingsWindow = function PremiumSettingsWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "changePassword",
      name: "passwordForm",
      onSubmit: handleChangePassword,
      action: "/changePassword",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("h3", null, "Change Password"), /*#__PURE__*/React.createElement("label", {
      id: "formLabel",
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("label", {
      id: "formLabel",
      htmlFor: "pass"
    }, "New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "new password"
    }), /*#__PURE__*/React.createElement("label", {
      id: "formLabel",
      htmlFor: "pass2"
    }, "Retype New Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "new password"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Change Password"
    }), /*#__PURE__*/React.createElement("h3", {
      id: "premium"
    }, "Account is Premium"))
  );
}; //checks if the current user is premium and loads the correct


var checkPremium = function checkPremium(csrf) {
  var data = sendAjax('GET', '/checkPremium', {}, function (data) {
    premium = data.user[0].premium; //console.log(premium); //debug check

    if (data.user[0].premium) {
      createPremiumWindow(csrf);
    } else {
      createAccountWindow(csrf);
    }
  });
}; //makes the account window 


var createAccountWindow = function createAccountWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountSettingsWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; //makes the premium window


var createPremiumWindow = function createPremiumWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(PremiumSettingsWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; //sets up the page 


var setup = function setup(csrf) {
  checkPremium(csrf);
}; //gets the csrf token


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
