
let board = document.getElementById('board');
let Score1 = document.getElementById('Score1');
let Score2 = document.getElementById('Score2');
let level = document.getElementById('speed');
let Up = document.getElementById('up');
let Down = document.getElementById('down');
let Left = document.getElementById('left');
let Right = document.getElementById('right');
let Pause = document.getElementById('pause');
let wallhit = document.getElementById('wallhit');
let wallinside = document.getElementById('wallinside');

let rowcol =18;


const clicksound = new Audio('./audio/diceclick.mp3')
const gameoversound = new Audio('./audio/crash3.wav')
const eatsound = new Audio('./audio/hiss.wav')
// const backsound = new Audio('/audio/tabla.wav')
const victory = new Audio('./audio/yes.wav')

let inputDir = { x: 0, y: 0 };
let score = 0;
let setspeed;
let hiscoreval = 0;
let lastpainttime = 0;
// let snakeArr = [{ x: 13, y: 15 }]
let snakeArr = [{ x:Math.round(rowcol/2), y: Math.round(rowcol/2) }]

let food = { x: Math.round(rowcol/2)-2, y: Math.round(rowcol/2)-2 };



//Game functin
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastpainttime) / 1000 < 1 / (setspeed * 1)) {
        return;
    }
    lastpainttime = ctime;
    gameEngine();
}



function iscollapsed(snake) {

    //if you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }

    //if you hit the wall
    if (wallhit.checked) {
        if (snake[0].x >= rowcol || snake[0].x <= 0 || snake[0].y >= rowcol|| snake[0].y <= 0) {
            return true;
        }
    }
    return false;
};

function gameEngine() {
    // backsound.play();
    // part 1: upadting snake array & food
    if (iscollapsed(snakeArr)) {
        gameoversound.play();
        // backsound.pause();
        inputDir = { x: 0, y: 0 };
        alert("GAMEOVER click ok to play again");
        // snakeArr = [{ x: 13, y: 15 }];
        snakeArr = [{ x:Math.round(rowcol/2), y: Math.round(rowcol/2) }]
        // backsound.play();
        score = 0;
    }

    //if you have eaten the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        eatsound.play();
        score += 1;
        Score1.innerText = `Score: ${score}`;

        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            Score2.innerHTML = "Hi score: " + hiscoreval;
            victory.play();
        }

        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 1;
        let b = rowcol;
        food = { x: Math.floor((b - a + 1) * Math.random())+a, y: Math.floor((b - a+1) * Math.random())+1 }
    }


    // move the snake

    if (inputDir.x === inputDir.y) {
        // to pause snake
    }

    else if (snakeArr.length >= 2 && snakeArr[0].x + inputDir.x == snakeArr[1].x && snakeArr[0].y + inputDir.y == snakeArr[1].y) {
        inputDir.x = 0;
        inputDir.y = 0;
    }

    else {
        for (let i = snakeArr.length - 2; i >= 0; i--) {
            snakeArr[i + 1] = { ...snakeArr[i] };
        }
    }

    // wallinside
    if (wallinside.checked) {
        if (snakeArr[0].x + inputDir.x == 0) {
            snakeArr[0].x = rowcol+1;
        }
        else if (snakeArr[0].y + inputDir.y == 0) {
            snakeArr[0].y = rowcol+1;
        }
        else if (snakeArr[0].y + inputDir.y == rowcol+1) {
            snakeArr[0].y = 0;
        }
        else if (snakeArr[0].x + inputDir.x == rowcol+1) {
            snakeArr[0].x = 0;
        }
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;


    //part 2: display the snake 
    board.innerHTML = "";
    snakeArr.forEach((val, index) => {
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = val.y;
        snakeElement.style.gridColumnStart = val.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        }
        else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

}

//code run from here
let hiscore = localStorage.getItem('hiscore');
if (hiscore === null) {
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
}
else {
    Score2.innerHTML = "Hi score: " + hiscore;
    hiscoreval = hiscore;
}


setspeed = localStorage.getItem('speed');
if (setspeed === null) {
    localStorage.setItem("speed", JSON.stringify(parseInt(level.value)));
    setspeed = parseInt(level.value);
}
else {
    level.value = parseInt(setspeed);
    setspeed = parseInt(setspeed);
}

level.addEventListener('blur', () => {
    localStorage.setItem("speed", JSON.stringify(parseInt(level.value)));
    location.reload();
})

window.requestAnimationFrame(main);
window.addEventListener('keydown', e => {
    // inputDir = { x: 0, y: 1 }//start the game
    clicksound.play();
    console.log(e.key);
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        case "w":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "s":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "a":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "d":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        case "Enter":
            inputDir.x = 0;
            inputDir.y = 0;
            break;
        case " ":
            inputDir.x = 0;
            inputDir.y = 0;
            break;
        default:
            break;
    }
})

Up.addEventListener('click', () => {
    clicksound.play();
    inputDir.x = 0;
    inputDir.y = -1;
});
Down.addEventListener('click', () => {
    clicksound.play();
    inputDir.x = 0;
    inputDir.y = 1;
});
Left.addEventListener('click', () => {
    clicksound.play();
    inputDir.x = -1;
    inputDir.y = 0;
});
Right.addEventListener('click', () => {
    clicksound.play();
    inputDir.x = 1;
    inputDir.y = 0;
});
Pause.addEventListener('click', () => {
    inputDir.x = 0;
    inputDir.y = 0;
    clicksound.play();
});