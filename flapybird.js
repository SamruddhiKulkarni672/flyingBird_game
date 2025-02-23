//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let birdImgs=[];
let birdImgsIndex=0;

let bird = {
    x: birdX,
    y: birdY,
    height: birdHeight,
    width: birdWidth,
};

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;

//sounds
let hitSound = new Audio("./sfx_hit.wav");
let bgm = new Audio("./bgm_mario.mp3") ;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    // draw image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    // for (let i = 0; i < array.length; i++) {
    //      let birdImg = new Image;
    //      birdImg.src=`./flappybird${i}.png`
    //      birdImgs.push(birdImg)
        
    // }

    //pipeImg loading
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500);
    document.addEventListener("keydown", moveBird);
};


function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        bgm.pause();
        bgm.currentTime= 0;

        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y+= velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    if (bird.y > board.height) {
        gameOver = true;
    }

    // if (bird.y > board.height - bird.height) {
    //     bird.y = board.height - bird.height;
    //     velocityY = 0; // Stop falling when it hits the ground
    // }
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    // context.drawImage(birdImgs[birdImgsIndex], bird.x, bird.y, bird.width, bird.height);
    // birdImgsIndex++;
    // birdImgsIndex %= birdImgs.length


    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            hitSound.play();
            gameOver = true;
        }
    }

    //clear pipes
    if (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }
    // score

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.font = "45px sans-serif";
        context.fillText("GAME OVER", 50, 200);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    };

    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyX") {
        e.preventDefault();  
      if(bgm.paused){
        bgm.play();}
        //JUMP
        velocityY = -6;

        //REST GAME
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return (
        a.x < b.x + b.width &&
         a.x + a.width > b.x &&
          a.y < b.y + b.height &&
           a.y + a.height > b.y
    );
}
