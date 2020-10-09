class InstructionScreen {
    constructor() {
        let container = document.createElement("div");
        this.fullScreenContainer = container;
        container.classList.add('container');
        container.innerHTML = `
        <div class="menu-container">
            <font> WASD to move </font>
            <font> Dont hit the walls </font>
            <font> Get to the blue square to finish </font>
            <button class="menu-button" onclick="showMainMenu()">Back to main menu</button>
        </div>
        `
        gameScreen.appendChild(this.fullScreenContainer)
    }
    hide () {
        this.fullScreenContainer.style.display = 'none';
    }
    show () {
        this.fullScreenContainer.style.display = 'flex';
    }
}
class GameScreen {
    gameScreen;
    constructor() {
        this.gameScreen = document.createElement("div");
        this.gameScreen.id = "game-screen";
        document.body.appendChild(this.gameScreen);
    }
    hide() {
        this.gameScreen.style.display = "none";
    }
    show() {
        this.gameScreen.style.display = "flex";
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
            <font class="menu-text"> Welcome to Crappy Bird </font>
            <button class="menu-button" onclick="playGame()">Play Game</button>
            <button class="menu-button" onclick="showInstructions()"> Instructions </button>
            <button class="menu-button" disabled="true" >Level Select (WIP)</button>
            <button class="menu-button" onclick="showHighscores()"> View hiscores (WIP)</button>
            <div>
                <label> Difficulty
                    0 <input type="range" id="scroll-slider" min="0" max="25" value="${scrollAmount || 12.5}"> 25    
                </label>
            </div>
        </div>
        
        `
        gameScreen.appendChild(container);
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
    topWall;
    botWall;
    minWallHeight = 150;
    maxWallHeight = document.documentElement.clientHeight - 200;
    scoreConsumed = false; // A wall can only increase score once when a player passes through, once they are passed we set consume to true
    constructor() {

        let topWallHeight = this.minWallHeight + Math.random() * (this.maxWallHeight - this.minWallHeight);
        // We will have a 250px gap to squeeze through.
        let botWallHeight = document.documentElement.clientHeight - topWallHeight - 250;
        // Makes the walls more visible
        if (botWallHeight < 30) {
            botWallHeight = 30;
        }
        let wallWidth = 150;

        let playerC = player.getBoundingClientRect();

        // Create TopWall
        this.topWall = document.createElement("div");
        this.topWall.style.height = topWallHeight.toString() + "px";
        this.topWall.style.width = wallWidth.toString() + "px";
        this.topWall.style.left = (document.documentElement.clientWidth + window.pageXOffset).toString() + "px";
        this.topWall.className = "wall";
        this.topWall.style.top = "0%";
        gameScreen.appendChild(this.topWall);

        // Create BottomWall
        this.botWall = document.createElement("div");
        this.botWall.style.height = botWallHeight.toString() + "px";
        this.botWall.style.width = wallWidth.toString() + "px";
        this.botWall.style.left = (document.documentElement.clientWidth + window.pageXOffset).toString() + "px";
        this.botWall.style.bottom = "0%"
        this.botWall.className = "wall";
        gameScreen.appendChild(this.botWall);

        // Remove existing walls that are out of the screen, to decrease collision detection logic.
        this.removePassedWalls()
    }
    removePassedWalls() {
        for (let wall of walls){ 
            if (parseInt(wall.topWall.style.left) < window.pageXOffset) {
                walls = walls.filter(el => {
                    if (el !== wall) console.log("REMOVING THIS WALL", wall);
                    return el !== wall
                })
                gameScreen.removeChild(wall.topWall);
                gameScreen.removeChild(wall.botWall);

            }
        }
        console.log(walls);
    }
    consumeWallScore() {
        this.scoreConsumed = true;
        addToScore();
    }

    getWalls() {
        return [this.topWall, this.botWall];
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
    async dead() {
        await this.endGame();
        gameScreen.innerHTML = '';                // Clears everything within the gamescreen
        walls = []
        userName = prompt("Enter name for the highscores", "guest");
        let highscoreObj = {
            name: userName,
            highscore: score
        }
        localHighscores.push(highscoreObj);
        createAllScreens();
        hideAll();
        score = 0;
        scoreElement.innerText = score;
        window.endScreen.show();
            
    }
    async win() {
        await this.endGame();
        gameScreen.innerHTML = '';                // Clears everything within the gamescreen
        walls = []
        createAllScreens(true);
        hideAll();
        window.endScreen.show();
    }
    async endGame() {
        let player = this.element;
        player.style.backgroundColor = "white"
        await delay(400);
        player.style.backgroundColor = "black";
        await delay(400);
        player.style.backgroundColor = "white";
        await delay(400);
        player.style.backgroundColor = "black";
        await delay(400);
        player.style.backgroundColor = "white";
        await delay(400);

    }
}


function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}



class EndScreen {
    text = "Oh dear, you are dead!";
    container;
    constructor (endText){
        let container = document.createElement("div");
        this.text = endText
        container.classList.add("container");

        container.innerHTML = `
            <div class="menu-container">
                <font class="menu-text">  ${this.text}  </font>
                <button class="menu-button" onclick="playGame()"> Play again </button>
                <button class="menu-button" onclick="showMainMenu()">Back to main menu</button>
            </div>
        `
        this.container = container;
        gameScreen.appendChild(container);

    

        
    
    }
    hide() {
        this.container.style.display = 'none';
    }
    show() {
        this.container.style.display = 'flex';
    }
    toMenu() {
        this.hide();
        window.menuScreen.show();
    }

}

class HighscoreScreen {
    constructor () {
        this.container = document.createElement("div");
        this.container.classList.add("container");
        this.container.id = "highscores-container";
        this.update();
        this.hide();
        gameScreen.appendChild(this.container);
    }

    highscoresComparator(obj1, obj2) {
        if (obj1.highscore > obj2.highscore) return -1;
        if (obj1.highscore < obj2.highscore) return 1;
        return 0;
    }
    show() {
        this.container.style.display = "flex";
    }
    hide () {
        this.container.style.display = "none";
    }
    update() {
        localHighscores.sort(this.highscoresComparator)

        let html = `
            <font style=" position: absolute; top: 20%; font-size: 100px;"> Highscores! </font>
            <div class="highscores">
        `
        for (let [i,highscore] of localHighscores.entries()) {
            html += `
            <div class="highscore"> 
                <div> ${i+1}.&nbsp; ${highscore.name} </div>
                <div> ${highscore.highscore} </div>
            </div>
            `
            if (i >= 10) break;
        }
        html += `
        <button class="menu-button" onclick="showMainMenu()"> Main Menu </button>
        
        </div>
        `
        this.container.innerHTML = html;
    }
}
