console.log("Hello");
let countdown = 3;
let player = document.getElementById("player");
let rect = player.getBoundingClientRect();
player.style.top = rect.top;
player.style.left = rect.left;
console.log(rect);
console.log(player);
let wallGenerationInterval = setInterval(generateWall, 2000);
let gravity = 2;
let gravitySpeed = 0;
let gravityInterval = setInterval(applyGravity, 100);
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
    console.log("inner height", window.innerHeight)
    console.log("style.top", player.style.top);
    console.log("style.height", player.clientHeight);
    // Do this on the gravity collision detection rather than 

    for (let i =0; i < gravitySpeed; i++) {
        if (collisionDetection(0,1) == -1) {
            break;
        };

    }
}
(function startGame() {
    let startButton = document.getElementById("startButton");
    console.log("Starting in " + countdown);
    countdown -= 1;
    // let startInterval = setInterval(() => {
    //     console.log("Starting in " + countdown);
    //     countdown -= 1;
    //     if (countdown <= -1) {
    //         clearInterval(startInterval);
    //         document.body.removeChild(startButton);
    //     }
    // }, 1000)
    document.addEventListener('keydown', moveSquare);
})()

function moveSquare(event) {
    let rect = player.getBoundingClientRect();
    let dx = 0;
    let dy = 0;
    let moveDistance = 50;
    switch(event.key) {
        case "d":
            dx += 1;
            break;
        
        case "w":
            gravitySpeed = 0;
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
    enemies = document.getElementsByClassName("enemy");
    walls = document.getElementsByClassName("wall");
    let collision = false;
    let dead = false;
    for (let el of enemies) {
        enemy = el.getBoundingClientRect();
    

        /* A collision occurs */
        if (prop.left < enemy.right && prop.right > enemy.left
            && prop.top < enemy.bottom && prop.bottom > enemy.top) {
                console.log("Collision detected!")
                dead = true;
            }
    }

    for (let el of walls) {
        wall = el.getBoundingClientRect();
        /* A collision occurs */
        if (prop.left < wall.right && prop.right > wall.left
            && prop.top < wall.bottom && prop.bottom > wall.top) {
                console.log("Collision detected!")
                collision = true;
            }
    }

    // Better than window.innerHeight because it takes into account the scrollbar consumes space.
    if ((dy > 0) && (parseInt(player.style.top) + parseInt(player.clientHeight) >= parseInt(document.documentElement.clientHeight))){
        gravitySpeed = 0;
        return -1;
    }
    // Don't move the player.
    if (collision) {
        clearInterval(wallGenerationInterval);
        return;
    }
    console.log("LEFT", player.style.left, prop.left)
    console.log("TOP", player.style.top, prop.top)
    console.log(window.pageXOffset, window.pageYOffset)
    console.log("DY is ", dy);
    player.style.top = (window.pageYOffset + prop.top).toString() + "px";
    player.style.left = (window.pageXOffset + prop.left).toString() + "px";
    if (dead) {
        // Game over...
        player.style.backgroundColor = "black";
    }
    else {
        player.style.backgroundColor = "red";
    }
}

function generateWall() {
    let wallHeight = 150;
    let wallWidth = 150;
    //console.log("generating wall");
    let playerC = player.getBoundingClientRect();
    console.log(playerC);
    let wall = document.createElement("div");
    wall.style.height = wallHeight.toString() + "px";
    wall.style.width = wallWidth.toString() + "px";
    wall.style.left = (playerC.right + 100).toString() + "px";
    wall.className = "wall";
    document.body.appendChild(wall);
    console.log("2", playerC)
}
// Issues
/*
- Gravity is faster when rolling off an object because it doesnt reset when you collide on bottom.
- value of 15 hardcoded for scrollbar
*/