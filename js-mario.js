
(function playGame() {
    createGameState();
    let player = document.getElementById("player");
    // Set initial styling.
    let rect = player.getBoundingClientRect();
    player.style.top = rect.top;
    player.style.left = rect.left;
    let gameOver = false;
    let win = false;
    let gravity = 5;
    let gravitySpeed = 0;
    let gravityInterval = setInterval(applyGravity, 100);
    let screenScrollingInterval = setInterval(scrollScreen,50);
    let wallGenerationInterval = setInterval(generateWall, 5000);
    
    
    function scrollScreen() {
        window.scrollBy(12.5, 0);
        doMove(12.5,0);
    }
    
    function applyGravity() {
        gravitySpeed += gravity;
        let playerC = player.getBoundingClientRect();
        //window.scrollBy(50, 0)
        // TRY DOCUMENT.DOCUMENTELEMENT.CLIENTHEIGHT
        // Do this on the gravity collision detection rather than 
    
        for (let i =0; i < gravitySpeed; i++) {
            if (gameOver || win) {
                break;
            }
            doMove(0,1);
    
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
        // Don't move the player.
        if (gameOver) {
            clearInterval(gravityInterval);
            clearInterval(wallGenerationInterval);
            clearInterval(screenScrollingInterval);
            document.removeEventListener('keydown', getPlayerMove );
            makeEndScreen("YOU LOSE");
            return -1;
        }
        if (win) {
            clearInterval(gravityInterval);
            clearInterval(wallGenerationInterval);
            clearInterval(screenScrollingInterval);
            document.removeEventListener('keydown', getPlayerMove );
            makeEndScreen("YOU WIN!");
            return -1;
        }
    
        // Move the player to the computed position plus the page offset
        // (So once we've scrolled we don't get teleported back).
        player.style.top = (window.pageYOffset + prop.top).toString() + "px";
        player.style.left = (window.pageXOffset + prop.left).toString() + "px";
    
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
    function generateWall() {
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

        // Create Game width
        //<div class="gameScreen" style="width: 500vw; height: 1px; background-color: black;"> </div>
        let width = document.createElement("div");
        width.style.width = "400vw";
        width.style.backgroundColor = "black";
        width.style.height = "1px";
        document.body.appendChild(width);

    }
    
    
    function makeEndScreen(text) {
        console.log("Making loss screen");
        // Use promises for this? Or an interval that counts then clears itself.
        (function flashPlayer() {
            setTimeout(() => {
                player.style.backgroundColor = "white"
                setTimeout(() => {
                    player.style.backgroundColor = "black"
                    setTimeout(() => {
                        player.style.backgroundColor = "white"
                        setTimeout(() => {
                            // Clears the whole DOM.
                            document.body.innerHTML = '';
                            
                            createEndScreenElements(text);
                        }, 1000)
                    }, 300);
                }, 200);
            }, 100);
    
        })();
        
    }
    function createEndScreenElements(text) {
        let endText = document.createElement("span");
        endText.style.position = "absolute";
        endText.style.backgroundColor = "blue";
        endText.style.fontSize = "400%";
        endText.style.top = "50%";
        endText.style.left = "50%";
        endText.textContent = text;
        document.body.appendChild(endText);
    
        let endButton = document.createElement("button");
        endButton.textContent = "Play again";
        endButton.style.height = "10vh";
        endButton.style.top = "60%";
        endButton.style.left = "50%";
        endButton.style.position = "absolute";
        endButton.onclick = playGame;
        document.body.appendChild(endButton);
        document.body.backgroundColor = "#000022";
        let imageUrl = "Vanishing-Stripes.svg";
        document.body.style.backgroundImage = "url('" + imageUrl + "')";

        console.log(document.body.style.backgroundImage);
        
    }
})()

// Apparently this gets the scrollbar width.
//Element.offsetWidth - Element.clientWidth


// Document.documentElement.clientHeight is Better than window.innerHeight because it takes into account the scrollbar consumes space.


// Issues
/*
- Gravity is faster when rolling off an object because it doesnt reset when you collide on bottom.
- Used a big div to artificially increase screen width. I want it to scroll without the div.\
- Scroll starts wherever it was when you ended last game
- Remove walls that are passed.
*/
//Levels should have the same random seed