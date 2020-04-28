let premium;//wether or not the account is premium

//sends the password change request
const handleChangePassword = (e) => {
    e.preventDefault();

    if ($("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields required");
        return false;
    }

    if ($("#pass").val() !== $("#pass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('POST', $("#changePassword").attr("action"), $("#changePassword").serialize(), function(){
        document.querySelector('#passwordChangeLabel').style='visibility:visible';
    });

    return false;
};

//sends the goPremium request 
const handlePremium = (e) =>{
   e.preventDefault();
    
    sendAjax('POST','/goPremium',$("#changePassword").serialize(),checkPremium);
    
    return false;
};

//the react component for the non premium window
const AccountSettingsWindow = (props) =>{
    
    return ( 
        <form id = "changePassword" name = "passwordForm"
            onSubmit = {handleChangePassword}
            action = "/changePassword"
            method = "POST"
            className = "mainForm" 
        >
        <h3>Change Password</h3>
        <h3 id="passwordChangeLabel">Password Changed!</h3>
        <label id="formLabel" htmlFor="pass">New Password: </label>
        <input id="pass" type="password" name="pass" placeholder="new password"/>
        <label id="formLabel" htmlFor="pass2">Retype New Password: </label>
        <input id="pass2" type="password" name="pass2" placeholder="new password"/>
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="Change Password" />
        <input className="premiumButton" type="button" value="Activate Premium" onClick={handlePremium}/>
        </form>
    );
};

//the react component for the premium window 
const PremiumSettingsWindow = (props) =>{
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
        <h3 id="premium">Account is Premium</h3>
        </form>
    );
};


//checks if the current user is premium and loads the correct
const checkPremium = (csrf) =>{
    let data = sendAjax('GET','/checkPremium',{},function(data){ 
         premium = data.user[0].premium;
         //console.log(premium); //debug check
        if(data.user[0].premium){
            createPremiumWindow(csrf)
        }else{
            createAccountWindow(csrf);
        }
    }); 
};

//makes the account window 
const createAccountWindow = (csrf) =>{
     ReactDOM.render(
        <AccountSettingsWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//makes the premium window
const createPremiumWindow = (csrf) =>{
     ReactDOM.render(
        <PremiumSettingsWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

//sets up the page 
const setup = function(csrf){
    checkPremium(csrf);
};

//gets the csrf token
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) =>{
     setup(result.csrfToken); 
  });  
};

$(document).ready(function(){
   getToken(); 
});


