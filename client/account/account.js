const handleChangePassword = (e) => {
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


const AccountSettingsWindow = (props) =>{
      return ( 
          
        <form id = "changePassword" name = "passwordForm"
            onSubmit = {handleChangePassword}
            action = "/changePassword"
            method = "POST"
            className = "mainForm" 
        >
        <h3>Change Password</h3>
        <label id="formLabel" htmlFor="username">Username: </label>
        <input id="user" type="text" name="username" placeholder="username"/>
        <label id="formLabel" htmlFor="pass">New Password: </label>
        <input id="pass" type="password" name="pass" placeholder="new password"/>
        <label id="formLabel" htmlFor="pass2">Retype New Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="new password"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};


const setup = function(csrf){
    ReactDOM.render(
        <AccountSettingsWindow csrf={csrf} />,
        document.querySelector("#content")
    ); 
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) =>{
     setup(result.csrfToken); 
  });  
};

$(document).ready(function(){
   getToken(); 
});


