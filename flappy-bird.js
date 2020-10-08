var levelWidth = 5000;
var playerClass = new Player();
function createAllScreens () {
    window.menuScreen = new MenuScreen();
    window.endScreen = new EndScreen();
    window.instructionScreen = new InstructionScreen();
}
createAllScreens();
showMainMenu();
function showMainMenu() {
    hideAll();
    window.menuScreen.show();
}
function showEndScreen() {
    hideAll();
    window.endScreen.show();
}
function showInstructions () {
    hideAll();
    window.instructionScreen.show();
}
function hideAll() {
    window.menuScreen.hide();
    window.endScreen.hide();
    window.instructionScreen.hide();
}
function playGame() {
    // Hide the window.menuScreen
    window.menuScreen.hide();
    window.endScreen.hide();
    createGameState();
    document.addEventListener('keydown', getPlayerMove);

    let player = document.getElementById("player");
    let scroller = document.getElementById("scroll-slider");
    // Set initial styling.
    player.style.top = "50%";
    player.style.left = "30%";
    player.style.backgroundColor = "yellow";
    let gameOver = false;
    let win = false;
    let gravity = 5;
    Wall.nextWall = 600;

    let scrollAmount = parseInt(scroller?.value) || 13;
    let gravitySpeed = 0;
    let gravityInterval = setInterval(applyGravity, 100);
    let screenScrollingInterval = setInterval(scrollScreen,50);
    //let wallGenerationInterval = setInterval(generateWall, 3000);
    
    
    function scrollScreen() {
        window.scrollBy(scrollAmount, 0);
        doMove(scrollAmount,0);
    }
    
    function applyGravity() {
        // Add to the gravity to give acceleration effect
        gravitySpeed += gravity;    
        for (let i =0; i < gravitySpeed; i++) {
            if (gameOver || win) {
                break;
            }
            doMove(0,1);
    
        }
    }
    // Get player input of "WASD" and turn it into a movement.
    function getPlayerMove(event) {
        let dx = 0;
        let dy = 0;
        let moveDistance = 40;
        switch(event.key) {
            case "d":
                dx += 1;
                break;
            
            case "w":
                gravitySpeed = 0; // If we flap up, we want to cancel gravity.
                dy -= 1;
                break;
            case "a":
                dx -= 1;
                break;
            case "s":
                dy += 1;
                break;
        }
        // Instead of moving x distance once, we move 1 distance x times. 
        // This means smoother movement but also much more collision detection code to run.
        for (let i = 0; i < moveDistance; i++){
            if (gameOver || win) {
                break;
            };
            doMove(dx,dy);
        }
    }
    
    function doMove(dx, dy) {
        let playerC = player.getBoundingClientRect();
        // Hack for spreading a DomRect object
        let tmp = JSON.parse(JSON.stringify(playerC));
        let prop = {...tmp};
        // We should just change the x coordinate so we dont have to change both left and right.
        prop.left = prop.left + dx;
        prop.right += dx;
        prop.top += dy;
        prop.bottom += dy;
    
        let enemies = document.getElementsByClassName("enemy");
        let walls = document.getElementsByClassName("wall");
        let finishEl = document.getElementById('finish');
    
        gameOver = false;
        win = false;
        if (parseInt(player.style.left) > Wall.getNextWall()) {
            Wall.setNextWall();
            let wall = new Wall();
        }
        // Check if there is collision with any enemies. If so, game over.
        if (checkForCollisions(enemies, prop)) {
            gameOver = true;
            // We lose.
        }
    
        if (checkForCollisions(walls, prop)){
            gameOver = true;
            // We lose.
        }
    
        if (checkForCollisions([finishEl], prop)) {
            win = true;
            // We win.
        }
    
        // If the player is going downwards and is at the bottom of the screen
        if ((dy > 0) && playerBelowScreen()){
            // Reset gravity
            gravitySpeed = 0;
            return -1;
        }
        // Move the player to the computed position plus the page offset
        // (So once we've scrolled we don't get teleported back).
        player.style.top = (window.pageYOffset + prop.top).toString() + "px";
        player.style.left = (window.pageXOffset + prop.left).toString() + "px";
        // Don't move the player.
        if (gameOver) {
            clearInterval(gravityInterval);
            //clearInterval(wallGenerationInterval);
            clearInterval(screenScrollingInterval);
            document.removeEventListener('keydown', getPlayerMove );
            playerClass.dead();
            return -1;
        }
        if (win) {
            clearInterval(gravityInterval);
            //clearInterval(wallGenerationInterval);
            clearInterval(screenScrollingInterval);
            document.removeEventListener('keydown', getPlayerMove );
            playerClass.dead();
            return -1;
        }
    

    
    }
    
    
    
    
    
    function checkForCollisions(objects, prop) {
    
        // Check to see if the player collides with any objects
        for (let object of objects){
            let border = object.getBoundingClientRect();
            // Collision logic for rectangles
            if (prop.left < border.right && prop.right > border.left
                && prop.top < border.bottom && prop.bottom > border.top) {
                    return true;
                }
            }
    
    }
    
    function playerBelowScreen () {
        return (parseInt(player.style.top) + parseInt(player.clientHeight) >= parseInt(document.documentElement.clientHeight))
    }
    
    
    function createGameState() {
        document.body.appendChild(playerClass.element);
    
        // Create finish flag
        let finishFlag = document.createElement("div");
        finishFlag.classList.add('finish-flag');
        finishFlag.style.left = levelWidth.toString() + "px";
        finishFlag.id = "finish";
        document.body.appendChild(finishFlag);

        // Create Game width
        //<div class="gameScreen" style="width: 500vw; height: 1px; background-color: black;"> </div>
        let width = document.createElement("div");
        width.style.width = levelWidth.toString() + "px";
        width.style.backgroundColor = "black";
        width.style.height = "1px";
        document.body.appendChild(width);

    }
}

// Apparently this gets the scrollbar width.
//Element.offsetWidth - Element.clientWidth


// Document.documentElement.clientHeight is Better than window.innerHeight because it takes into account the scrollbar consumes space.


// Issues
/*
- Gravity is faster when rolling off an object because it doesnt reset when you collide on bottom.
- Used a big div to artificially increase screen width. I want it to scroll without the div.\
- Scroll starts wherever it was when you ended last game
- Remove walls that are passed.
- Wall generation should be a function of scrollspeed? Like they should come every x pixels
*/
//Levels should have the same random seed



// Top left bottom right 0.//
// OR remove margin.
// Or 

/* 
Break things down into logical steps
*/