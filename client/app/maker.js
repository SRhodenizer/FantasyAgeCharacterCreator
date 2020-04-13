const handleCharacter = (e) => {
    e.preventDefault();
    
    if($("#name").val() == '' || $("#age").val() == ''|| $("#level").val() == ''){
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(),function(){
       loadCharsFromServer(); 
    });
    
    return false;
};

const handleClick = (e) =>{
    e.preventDefault();
    
    //send the ajax for the button's function
    sendAjax('POST','/remove', {_csrf: document.querySelector('#csrf').value,query:document.querySelector('#removeCharName').value});
    
    loadCharsFromServer();
    
    return false;
};

const levelUp = (e) =>{
    e.preventDefault();
    
    //send the ajax for the button's function
    sendAjax('POST','/levelUp', {_csrf: document.querySelector('#csrf').value,query:document.querySelector('#removeCharName').value},function(){  
       
        loadCharsFromServer();
    
    });
    
    
    return false;
};

const CharForm = (props) => {
    return(
        <form id="characterForm"
            onSubmit={handleCharacter}
            name="charForm"
            action="/maker"
            method="POST"
            className="charForm"
        >
         
        <label htmlFor="name">Name: </label>
        <input id="charName" type="text" name="name" placeholder="Character's Name"/>
         
        <label htmlFor="race">Race: </label>
        <select id="charRace" name="race">
            <option value="null">Select Race</option>
            <option value="Dwarf">Dwarf</option>
            <option value="Elf">Elf</option>
            <option value="Gnome">Gnome</option>
            <option value="Halfling">Halfling</option>
            <option value="Human">Human</option>
            <option value="Orc">Orc</option>
        </select>
         
        <label htmlFor="class">Class: </label>
        <select id="charClass" name="class">
            <option value="null">Select Class</option>
            <option value="Mage">Mage</option>
            <option value="Warrior">Warrior</option>
            <option value="Rogue">Rogue</option>
        </select>
         
        <label htmlFor="level">Lvl: </label>
        <input id="charLevel" type="text" name="level" placeholder="Character's Level"/>
         
        <label htmlFor="age">Age: </label>
        <input id="charAge" type="text" name="age" placeholder="Character's Age"/>
         
        <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
        
        <input className="makeSubmit" type="submit" value="Make Character" />
        <input className="removeSubmit" type="button" value="Level Up" onClick={levelUp}/>
        <input className="removeSubmit" type="button" value="Delete Character" onClick={handleClick}/>
        <input id="removeCharName" type="text" name="removeName" placeholder="Name of Char to Remove"/>
        </form>
    );  
};

const CharList = function(props){
    if(props.chars.length === 0){
        return(
            <div className="charList">
                <h3 className="empty">No Characters Yet</h3>
            </div>
        );
    }
    
    const charNodes = props.chars.map(function(char){
        //changes the logo based on character class 
        let image;
        switch(char.class){
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
        }
        
        //maps the character's inventory into an unordered list
        let inv = char.inventory.map((item, key)=>
            <li key={item}>{item}</li> 
        );
        
        
        return(
            <div key={char._id} className="char">
                <img src={image} alt="class logo" className="classLogo" />
                <h3 className="name">Name: {char.name}</h3>
                <h3 className="age">Age: {char.age}</h3>
                <h3 className="level">Health: {char.health}</h3>
                <h3 className="level">Defence: {char.defence}</h3>
                <h3 className="level">Race: {char.race}</h3>
                <h3 className="level">Background: {char.background}</h3>
                <h3 className="level">Class: {char.class}</h3>
                <h3 className="level">Level: {char.level}</h3>
                <h3 className="speed">Movement Speed: {char.speed}</h3>
                <h3 className="stats"> Stats: </h3>
                <p className="stats">Accuracy: {char.accuracy.mod}</p>
                <p className="stats">Communication: {char.communication.mod}</p>
                <p className="stats">Constitution: {char.constitution.mod}</p>
                <p className="stats">Dexterity: {char.dexterity.mod}</p>
                <p className="stats">Fighting: {char.fighting.mod}</p>
                <p className="stats">Intelligence: {char.intelligence.mod}</p>
                <p className="stats">Perception: {char.perception.mod}</p>
                <p className="stats">Strength: {char.strength.mod}</p>
                <p className="stats">Willpower: {char.willpower.mod}</p>
                <h4>Current Money(SP): {char.money}</h4>
                <h4>Inventory</h4>
                <ul>{inv}</ul>
            </div>
            
        );
    });
    
    return (
        <div className="charList">
            {charNodes}
        </div>
    );
};

const loadCharsFromServer = () => {
    sendAjax('GET','/getChars',null, (data)=>{
       ReactDOM.render(
            <CharList chars={data.chars}/>, document.querySelector("#chars")
       ); 
    });  
};

const setup = function(csrf){
    ReactDOM.render(
        <CharForm csrf={csrf} />, document.querySelector("#makeChar")
    );
    
    ReactDOM.render(
        <CharList chars={[]} />, document.querySelector("#chars")
    );
    
    loadCharsFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) =>{
     setup(result.csrfToken); 
  });  
};

$(document).ready(function(){
   getToken(); 
});

