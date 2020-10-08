class GameScreen {
    gameScreen;
    constructor() {
        gameScreen = document.createElement("div");
        this.gameScreen.id = "game-screen";
    }
}
class MenuScreen {
    constructor(){
        let container = document.createElement("div");
        this.fullScreenContainer = container;
        container.classList.add('container');
        container.id = "fullscreen-container";
        container.innerHTML = `
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
        <div class="background-square"> </div>
    
        <div class="menu-container">
            <font> Welcome to Crappy Bird </font>
            <button class="menu-button" onclick="playGame()">Play Game</button>
            <button class="menu-button" >Level Select (WIP)</button>
            <button class="menu-button"> View hiscores </button>
            <div>
                <label> Scroll Speed 
                    0 <input type="range" id="scroll-slider" min="0" max="25"> 25    
                </label>
            </div>
        </div>
        
        `
        document.body.appendChild(container);
        this.menuOptions = document.getElementById("menu-container");
    }
    hide() {
        this.fullScreenContainer.style.display = "none";
    }
    show() {
        this.fullScreenContainer.style.display = "flex";
    }
}


class Wall {
    minWallHeight = 150;
    maxWallHeight = 700;
    constructor() {
// If we're within 500 px of the finish line, stop generating walls.
        if (parseInt(player.style.left) > levelWidth - document.documentElement.clientWidth) {
            return;
            //clearInterval(wallGenerationInterval);
        }


        let topWallHeight = this.minWallHeight + Math.random() * (this.maxWallHeight - this.minWallHeight);
        // We will have a 250px gap to squeeze through.
        let botWallHeight = document.documentElement.clientHeight - topWallHeight - 250;
        let wallWidth = 150;

        let playerC = player.getBoundingClientRect();

        // Create TopWall
        let topWall = document.createElement("div");
        topWall.style.height = topWallHeight.toString() + "px";
        topWall.style.width = wallWidth.toString() + "px";
        topWall.style.left = (document.documentElement.clientWidth + window.pageXOffset).toString() + "px";
        topWall.className = "wall";
        topWall.style.top = "0%";
        document.body.appendChild(topWall);

        // Create BottomWall
        let botWall = document.createElement("div");
        botWall.style.height = botWallHeight.toString() + "px";
        botWall.style.width = wallWidth.toString() + "px";
        botWall.style.left = (document.documentElement.clientWidth + window.pageXOffset).toString() + "px";
        botWall.style.bottom = "0%"
        botWall.className = "wall";
        document.body.appendChild(botWall);

        // Remove existing walls that are out of the screen, to decrease collision detection logic.
        this.removePassedWalls()
    }
    removePassedWalls() {
        let walls = document.getElementsByClassName("wall");
        for (let wall of walls){ 
            if (parseInt(wall.style.left) < window.pageXOffset) {
                document.body.removeChild(wall);
            }
        }
    }
    static getNextWall() {
        this.nextWall = this.nextWall || 600;
        return this.nextWall;
    }
    static setNextWall () {
        this.nextWall += 650;
    }
    
}

class Player{
    constructor() {
        // Create player
        this.element = document.createElement("div");
        this.element.classList.add("player");
        this.element.style.top = "50%";
        this.element.style.bottom = "0%";
        //player.style.backgroundImage = `url('flappy.png')`;

        this.element.style.backgroundSize = "contain";
        this.element.id = "player";
    }
    dead() {
        let player = this.element;
        player.style.backgroundColor = "white"
        delay(400).then(() =>  { player.style.backgroundColor = "black" })
        .then(() => delay(400).then(() =>  { player.style.backgroundColor = "white" })        )
        .then(() => delay(400).then(() => { player.style.backgroundColor = "black" }))
        .then(() => delay(400).then(() =>  { 
            player.style.backgroundColor = "white" 
        }))
        .then(() => delay(400).then(() => {
            document.body.innerHTML = '';                // Clears the whole DOM. TODO AVOID DOING THIS
            endScreen = new EndScreen();
            window.menuScreen = new MenuScreen();
            window.menuScreen.hide();
            
        }))



    }
}


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}



class EndScreen {
    text = "You lose";
    container;
    constructor (){
        let container = document.createElement("div");
        container.classList.add("container");

        container.innerHTML = `
            <div class="menu-container">
                <font>  Oh dear, you are dead!  </font>
                <button class="menu-button" onclick="playGame()"> Play again </button>
                <button class="menu-button" onclick="showMainMenu()">Back to main menu</button>
            </div>
        `
        this.container = container;
        document.body.appendChild(container);

    

        
    
    }
    hide() {
        this.container.style.display = 'none';
    }
    toMenu() {
        this.hide();
        window.menuScreen.show();
    }

}
