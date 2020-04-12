const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'},350);
    
    if($("#domoName").val() == '' || $("#domoAge").val() == ''|| $("#domoLevel").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(),function(){
       loadDomosFromServer(); 
    });
    
    return false;
};

const handleClick = (e) =>{
    e.preventDefault();
    
    //send the ajax for the button's function
    sendAjax('POST','/removeDomo', {_csrf: document.querySelector('#csrf').value,query:document.querySelector('#removeDomoName').value});
    
    loadDomosFromServer();
    
    return false;
};

const DomoForm = (props) => {
    return(
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <label htmlFor="level">Lvl: </label>
        <input id="domoLevel" type="text" name="level" placeholder="Domo Level"/>
        <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        <input className="removeDomoSubmit" type="button" value="Remove Domo" onClick={handleClick}/>
        <input id="removeDomoName" type="text" name="removeName" placeholder="Domo Name to Remove"/>
        </form>
    );  
};

const DomoList = function(props){
    if(props.domos.length === 0){
        return(
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = props.domos.map(function(domo){
        return(
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoLevel">Level: {domo.level}</h3>
            </div>
            
        );
    });
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET','/getDomos',null, (data)=>{
       ReactDOM.render(
            <DomoList domos={data.domos}/>, document.querySelector("#domos")
       ); 
    });  
};

const setup = function(csrf){
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    
    loadDomosFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) =>{
     setup(result.csrfToken); 
  });  
};

$(document).ready(function(){
   getToken(); 
});

