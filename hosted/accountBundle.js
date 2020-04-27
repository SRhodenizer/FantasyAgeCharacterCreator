"use strict";

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
};

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
    }))
  );
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountSettingsWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
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
