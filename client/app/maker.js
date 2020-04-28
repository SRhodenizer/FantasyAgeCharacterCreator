let currPage = ''; //wether the page displayed is the char creator or the game page 
let currChar; //the current character being played  
let diceRolls;//output for rolling dice

//function for dice rolls in game, 3d6
const rollDice = (mod) =>{
    
  let stuntPoints = 0;
    
  let die1 = (Math.floor(Math.random() * 6)+1);
  let die2 = (Math.floor(Math.random() * 6)+1);
  let die3 = (Math.floor(Math.random() * 6)+1);
    
  if(die1 === die2){
      stuntPoints = die3;
  }

    //makes a json object with toal rolled and stunt points achieved
  let total = {roll:die1+die2+die3,stunt:stuntPoints};

    let dice = document.querySelectorAll(".diceImage");
    
    //makes a dice rolling animation
    for(let i = 0; i < dice.length;i++){
        dice[i].style="visibility:visible";
    }

    setTimeout(()=>{
        
        for(let i = 0; i < dice.length;i++){
             dice[i].style="visibility:hidden";
        }
        document.querySelector('#diceRolls').innerHTML = total.roll;
        
    },1200);
    
};


//for adding a character to the list
const handleCharacter = (e) => {
    e.preventDefault();
    
    if($("#name").val() == '' || $("#age").val() == ''|| $("#level").val() == ''){
        handleError("All fields are required.");
        return false;
    }
    
    if($('#level').val() > 20 || $('#level').val() < 1){
        handleError("Level has to be from 1 to 20.");
        return false;
    }
    
    sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(),function(){
         loadCharsFromServer();
    });

    return false;
};

//handles clicking the remove character button
const handleClick = (e) =>{
    e.preventDefault();
    
    //send the ajax for the button's function
    sendAjax('POST','/remove', {_csrf: document.querySelector('#csrf').value,query:document.querySelector('#removeCharName').value});
    
    loadCharsFromServer();
    
    return false;
};

//checks if the current user is premium
const checkPremium = (csrf) =>{
    let data = sendAjax('GET','/checkPremium',{},function(data){ 
         let premium = data.user[0].premium;
         if(premium === undefined){
             premium = false;
         }
         console.log(premium); //debug check
        
        createCharCreatorWindow(csrf, premium);
    }); 
};

//levels up the character in play
const levelUp = (e) =>{
    e.preventDefault();
    //send the ajax for the button's function
    sendAjax('POST','/levelUp', {_csrf: document.querySelector('#csrf').value,query:document.querySelector("#characterName").value})  
       
    loadCharsFromServer();
    
    return false;
};

//forms for influencing the character during game and making character 
const CharForm = (props) => {
   
    if(currPage === 'game'){
        
        return(
            
         <form id="gameForm"
            onSubmit={getActiveChar}
            name="gameForm"
            action="/getChar"
            method="POST"
            className="charForm"
         >
         <input className="makeSubmit" type="button" value="Level Up" onClick={levelUp}/>
         <input className="makeSubmit" type="button" value="Roll Dice" onClick={rollDice}/>
         <input id="activeName" className="activeName" type="text" name="name" placeholder="Name of Character"/>
         <input id="activeNameButton" className="makeSubmit" type="submit" value="Find Character" />
         
         
         <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
         </form>
        );
 
    }else{
            
        if(props.premium){
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
        <input id="charLevel" type="number" name="level" min="1" max="20" placeholder="Lvl"/>
         
        <label htmlFor="age">Age: </label>
        <input id="charAge" type="text" name="age" placeholder="Age"/>
         
        <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
        
        <input className="makeSubmit" type="submit" value="Make Character" />
        <input className="removeSubmit" type="button" value="Delete Character" onClick={handleClick}/>
        <input id="removeCharName" type="text" name="removeName" placeholder="Delete Character"/>
        </form>
    ); 
        }else{
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
        <input id="charLevel" type="number" name="level" min="1" max="20" placeholder="Lvl"/>
         
        <label htmlFor="age">Age: </label>
        <input id="charAge" type="text" name="age" placeholder="Age"/>
         
        <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
        
        <input className="makeSubmit" type="submit" value="Make Character" />
        <input className="removeSubmit" type="button" value="Delete Character" onClick={handleClick}/>
        <input id="removeCharName" type="text" name="removeName" placeholder="Delete Character"/>
        </form>
    ); 
        }
        
        
    }
    
     
};

//displays character information 
const CharList = function(props){
    
     if(props.chars.length === 0){
         if(currPage === 'create'){
            return(
                <div className="charList">
                <h3 className="empty">No Characters Yet</h3>
                </div>
            );
         }else{
            return(
                <div className="charList">
                <h3 className="empty">Select Character to Display</h3>
                </div>
            );
         }
       
    }
    
    let charNodes;
    
    if(currPage === 'game'){
    charNodes = props.chars.map(function(char){
        //changes the logo based on character class 
        let image;
        let mp;
        switch(char.class){
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
        }
        
        //maps the character's inventory into an unordered list
        let inv = char.inventory.map((item, key)=>
            <li key={item}>{item}</li> 
        );
        
         let acc = char.accuracy.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
        let com = char.communication.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
         let con = char.constitution.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
         let dex = char.dexterity.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
         let fig = char.fighting.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
         let intel = char.intelligence.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
         let per = char.perception.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
         let str = char.strength.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
         let wil = char.willpower.focus.map((item, key)=>
            <li key={item}>{item}</li>                        
        );
        
        let talent = char.talents.map((item, key)=>
            <li key={item}>{item.name} ({item.level})</li>
        );
        
        return(
            <div key={char._id} className="char">
                <img src={image} alt="class logo" className="classLogo" />
            
               <div className = 'stats'>
                     <h5>Accuracy: {char.accuracy.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{acc}</ul>
                     <h5>Communication: {char.communication.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{com}</ul>
                     <h5>Constitution: {char.constitution.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{con}</ul>
                     <h5>Dexterity: {char.dexterity.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{dex}</ul>
                     <h5>Fighting: {char.fighting.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{fig}</ul>
                     <h5>Intelligence: {char.intelligence.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{intel}</ul>
                     <h5>Perception: {char.perception.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{per}</ul>
                     <h5>Strength: {char.strength.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{str}</ul>
                     <h5>Willpower: {char.willpower.mod}</h5>
                     <h5>Focuses</h5>
                     <ul className ='focus'>{wil}</ul>
                </div>
            
                <div className='heading'>
                    <h3 className="hp">Health: {char.health}</h3>
                    <h3 className="mp">{mp} {char.magicPoints}</h3>
                    <h3 className="name">Name: {char.name}</h3>
                    <input id="characterName" type="hidden" name="name" value={char.name} />
                    <h3 className="class">Level {char.level} {char.race} {char.class}</h3>
                    <h3 className="past">Background: {char.background}</h3>
                    <h3 className="def">Defence: {char.defence}</h3>
                    <h3 className="speed">Movement Speed: {char.speed}</h3>
                </div>
            
                <div className='talent'>
                    <h3>Talents</h3>
                    <ul>{talent}</ul>
                </div>
            
                <div className='inventory'>
                    <h3>Inventory</h3>
                    <h4 className='money'>Current Money(SP): {char.money}</h4>
                    <ul>{inv}</ul>
                </div>
            </div>
            
        );
    });
    }else{
        charNodes =  props.chars.map(function(char){
            return <p>{char.name}, the Level {char.level} {char.race} {char.class}.</p>
        });
    }
    
    return (
        <div className="charList">  
            {charNodes}
        </div>
    );
};

//gets all characters from the server
const loadCharsFromServer = () => {
    sendAjax('GET','/getChars',null, (data)=>{
       ReactDOM.render(
            <CharList chars={data.chars}/>, document.querySelector("#chars")
       ); 
    });  
};

//gets a character based on an input string 
const getActiveChar = (e) =>{
  e.preventDefault();
  sendAjax('POST','/getChar',$("#gameForm").serialize(),function (data){
       currChar = data;
       ReactDOM.render(
            <CharList chars={data}/>, document.querySelector("#chars")
       );
      //document.querySelector('#activeName').remove();
      //document.querySelector('#activeNameButton').remove();
  });  
};

//makes the character creation screen 
const createCharCreatorWindow = (csrf, premium) =>{
    
    currPage = 'create';
    
    const gameButton = document.querySelector("#gameButton"); 
    
    const character = document.querySelector('#chars');
    character.innerHTML = '';
    
    ReactDOM.render(
        <CharForm csrf={csrf}  premium={premium} />, document.querySelector("#makeChar")
    );
    
    ReactDOM.render(
        <h2>Characters Made </h2>, document.querySelector("#chars")
    );
    
    loadCharsFromServer();
    
     ReactDOM.render(
        <CharList chars={[]} />, document.querySelector("#chars")
    );
    
    gameButton.addEventListener("click", (e) =>{
        e.preventDefault();
        createGameWindow(csrf);
        
        return false;
    });
    
}

//makes the gameplay screen
const createGameWindow = (csrf) =>{
    
    currPage = 'game';
    
    document.querySelector('#output').style='visibility:visible';
    
    const creatorButton = document.querySelector("#creatorButton");
    
    const form = document.querySelector('#makeChar');
    form.innerHTML = '';
    
     ReactDOM.render(
        <CharForm csrf={csrf}/>, document.querySelector("#makeChar")
    );
    
    
    ReactDOM.render(
        <CharList chars={[]} />, document.querySelector("#chars")
    );
    
    //loadCharsFromServer();
    
     creatorButton.addEventListener("click", (e) =>{
        e.preventDefault();
        checkPremium(csrf);
        return false;
    });
}


//setup function for page redirects 
const setup = function(csrf){  
    checkPremium(csrf);
};

//gets csrfTokens on launch
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) =>{
     setup(result.csrfToken); 
  });  
};

$(document).ready(function(){
   getToken(); 
});

