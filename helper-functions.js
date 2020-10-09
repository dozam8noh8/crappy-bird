var localHighscores = [
    {
        name: "Owen",
        score: 999
    },
    {
        name:"Dom",
        score: 0
    }];
    
async function getHighscoresApi() {
    await fetch('https://crappy-bird-a8ef4.firebaseio.com/highscores.json', {
    }).then(data => data.json()).then((data) => {
        data = Object.values(data);
        console.log("data is ", data)
        let highscores = data.map(el => {
            return {
                name: el.name,
                score: el.score
            };
        })
        localHighscores = highscores;
    } );
}

async function updateHighscores(highscore) {
    console.log("Updating", highscore);
    if (localHighscores.length < 10 || highscore.score > localHighscores[localHighscores.length-1]) {
        localHighscores.push(highscore);
        updateHighscoreApi(highscore);
    }

}

async function updateHighscoreApi(highscore){
    await fetch('https://crappy-bird-a8ef4.firebaseio.com/highscores.json', {
        method: "POST",
        body: JSON.stringify(highscore)
    }).then((data) => console.log(data));
}