let currPage = '';

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
   
    if(currPage === 'game'){
        
        return(
            
         <form id="gameForm"
            onSubmit={levelUp}
            name="gameForm"
            action="/levelUp"
            method="POST"
            className="gameForm"
         >
         <input className="removeSubmit" type="button" value="Level Up" onClick={levelUp}/>
         
         <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
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
       <input id="charLevel" type="number" name="level" min="1" max="20" placeholder="Start Level"/>
         
        <label htmlFor="age">Age: </label>
        <input id="charAge" type="text" name="age" placeholder="Character's Age"/>
         
        <input id="csrf" type="hidden" name="_csrf" value={props.csrf} />
        
        <input className="makeSubmit" type="submit" value="Make Character" />
        <input className="removeSubmit" type="button" value="Delete Character" onClick={handleClick}/>
        <input id="removeCharName" type="text" name="removeName" placeholder="Name of Char to Remove"/>
        </form>
    ); 
    }
    
     
};


const CharList = function(props){
    
     if(props.chars.length === 0){
        return(
            <div className="charList">
                <h3 className="empty">No Characters Yet</h3>
            </div>
        );
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
                mp = 'Magic';
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

const loadCharsFromServer = () => {
    sendAjax('GET','/getChars',null, (data)=>{
       ReactDOM.render(
            <CharList chars={data.chars}/>, document.querySelector("#chars")
       ); 
    });  
};

const createCharCreatorWindow = (csrf) =>{
    
    const gameButton = document.querySelector("#gameButton"); 
    
    const character = document.querySelector('#chars');
    character.innerHTML = '';
    
    ReactDOM.render(
        <CharForm csrf={csrf} />, document.querySelector("#makeChar")
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
        currPage = 'game';
        console.log(currPage);
        return false;
    });
    
}

const createGameWindow = (csrf) =>{
    
    const creatorButton = document.querySelector("#creatorButton");
    
    const form = document.querySelector('#makeChar');
    form.innerHTML = '';
    
     ReactDOM.render(
        <CharForm csrf={csrf} />, document.querySelector("#makeChar")
    );
    
    
    ReactDOM.render(
        <CharList chars={[]} />, document.querySelector("#chars")
    );
    
//   ReactDOM.render( 
//       GameForm({csrf}), document.querySelector('#makeChar')
//   );
    
    loadCharsFromServer();
    
     creatorButton.addEventListener("click", (e) =>{
        e.preventDefault();
        createCharCreatorWindow(csrf);
        currPage = 'create';
        console.log(currPage);
        return false;
    });
}


const setup = function(csrf){
    
    createCharCreatorWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) =>{
     setup(result.csrfToken); 
  });  
};

$(document).ready(function(){
   getToken(); 
});

