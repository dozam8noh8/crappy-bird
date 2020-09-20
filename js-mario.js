

createGameState();
let player = document.getElementById("player");
// Set initial styling.
let rect = player.getBoundingClientRect();
player.style.top = rect.top;
player.style.left = rect.left;

let gravity = 5;
let gravitySpeed = 0;
let gravityInterval = setInterval(applyGravity, 100);
let screenScrollingInterval = setInterval(scrollScreen,50);
let wallGenerationInterval = setInterval(generateWall, 2500);


function scrollScreen() {
    window.scrollBy(12.5, 0);
    collisionDetection(12.5,0);
}
document.addEventListener('click', logClicks);
function logClicks(event) {
    console.log(event.clientX)
    console.log(event.clientY);
}
function applyGravity() {
    gravitySpeed += gravity;
    let playerC = player.getBoundingClientRect();
    //window.scrollBy(50, 0)
    // TRY DOCUMENT.DOCUMENTELEMENT.CLIENTHEIGHT
    // console.log("inner height", window.innerHeight)
    // console.log("style.top", player.style.top);
    // console.log("style.height", player.clientHeight);
    // Do this on the gravity collision detection rather than 

    for (let i =0; i < gravitySpeed; i++) {
        if (collisionDetection(0,1) == -1) {
            break;
        };

    }
}
(function startGame() {
    let startButton = document.getElementById("startButton");
    // console.log("Starting in " + countdown);
    // countdown -= 1;
    // let startInterval = setInterval(() => {
    //     console.log("Starting in " + countdown);
    //     countdown -= 1;
    //     if (countdown <= -1) {
    //         clearInterval(startInterval);
    //         document.body.removeChild(startButton);
    //     }
    // }, 1000)
    document.addEventListener('keydown', getPlayerMove);
})()

function getPlayerMove(event) {
    let rect = player.getBoundingClientRect();
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
    for (let i = 0; i < moveDistance; i++){
        collisionDetection(dx,dy);
    }
}

function collisionDetection(dx, dy) {
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
    let collision = false;
    let dead = false;

    // Check if there is collision with any enemies. If so, game over.
    for (let el of enemies) {
        enemy = el.getBoundingClientRect();
    

        /* A collision occurs */
        if (prop.left < enemy.right && prop.right > enemy.left
            && prop.top < enemy.bottom && prop.bottom > enemy.top) {
                console.log("Collision detected!")
                dead = true;
            }
    }

    // Check if there is collision with walls, if so, cant move into walls.
    for (let el of walls) {
        wall = el.getBoundingClientRect();
        /* A collision occurs */
        if (prop.left < wall.right && prop.right > wall.left
            && prop.top < wall.bottom && prop.bottom > wall.top) {
                console.log("Collision detected!")
                collision = true;
            }
    }

    let finishEl = document.getElementById('finish');
    let finish = finishEl.getBoundingClientRect()
    if (prop.left < finish.right && prop.right > finish.left
        && prop.top < finish.bottom && prop.bottom > finish.top) {
            console.log("You win!")
            winner = true;
            collision = true;
        }

    // Better than window.innerHeight because it takes into account the scrollbar consumes space.
    // If the player is going downwards and is at the bottom of the 
    if ((dy > 0) && (parseInt(player.style.top) + parseInt(player.clientHeight) >= parseInt(document.documentElement.clientHeight))){
        gravitySpeed = 0;
        return -1;
    }
    // Don't move the player.
    if (collision) {
        clearInterval(gravityInterval);
        clearInterval(wallGenerationInterval);
        clearInterval(screenScrollingInterval);
        makeWinScreen();
        return -1;
    }

    // Move the player to the computed position plus the page offset (So once we've scrolled we don't get teleported back).
    player.style.top = (window.pageYOffset + prop.top).toString() + "px";
    player.style.left = (window.pageXOffset + prop.left).toString() + "px";
    if (dead) {
        // Game over...
        player.style.backgroundColor = "black";
    }
    else {
        player.style.backgroundColor = "yellow";
    }
}

function generateWall() {
    console.log(document.documentElement.clientWidth, window.pageXOffset)
    let minWallHeight = 150;
    let maxWallHeight = 700;

    let topWallHeight = minWallHeight + Math.random() * (maxWallHeight - minWallHeight);
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
}
function makeWinScreen() {
    document.documentElement.innerHTML = '';
    document.removeEventListener('click', getPlayerMove );
    let youWin = document.createElement("span");
    youWin.style.textContent = "You win!"
    youWin.style.backgroundColor = "blue";
    youWin.style.top = "50%";
    youWin.style.left = "50%";
}
// Issues
/*
- Gravity is faster when rolling off an object because it doesnt reset when you collide on bottom.
- Used a big div to artificially increase screen width. I want it to scroll without the div.\
- Scroll starts wherever it was when you ended last game
- Remove walls that are passed.
*/
//Levels should have the same random seed


function createGameState() {
    // Create player
    let player = document.createElement("div");
    player.style.position = "absolute";
    player.style.top = "50%";
    player.style.bottom = "0%";
    player.style.backgroundColor = "yellow";
    player.style.height = "100px";
    player.style.width = "100px";
    player.id = "player";
    document.body.appendChild(player);

    // Create finish flag
    let finishFlag = document.createElement("div");
    finishFlag.style.bottom = "0%";
    finishFlag.style.backgroundColor = "blue";
    finishFlag.style.height = "150px";
    finishFlag.style.width = "150px";
    finishFlag.style.position = "absolute";
    finishFlag.id = "finish";
    document.body.appendChild(finishFlag);

}

// Apparently this gets the scrollbar width.
//Element.offsetWidth - Element.clientWidth