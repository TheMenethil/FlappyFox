// Variables de jeu
var bestScoreSpan = document.getElementById("bestScoreSpan");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var bird = {
    x: 50,
    y: 100,
    w: 30,
    h: 35,
    speed: 0,
    gravity: 0.48,
    jump: 8
};
var pipes = [];
var score = 0;
var scoreX = canvas.width - (65 * canvas.width) / 100;
var isGameOver = false;
var bestScore = localStorage.getItem("bestScore");
const img = new Image();
img.src = 'https://mathis-backert.com/img/logo/logo-mathis-backert.svg';

// Écrire le best score
function writeScore(scoreToWrite) {
    bestScoreSpan.innerHTML = scoreToWrite;
}

// Calculer le best score
function calcScore() {
    bestScore = localStorage.getItem("bestScore");
    if (bestScore !== null) {
        if (score > bestScore) {
            localStorage.setItem('bestScore', score);
        }
    } else {
        localStorage.setItem('bestScore', 0);
    }
    bestScore = localStorage.getItem("bestScore");
    writeScore(bestScore);
}

// Fonctions de dessin
function drawBird() {
    ctx.fillStyle = "#32c0dd";
    ctx.drawImage(img, bird.x, bird.y, bird.w, bird.h);
}
function drawPipes() {
    for (var i = 0; i < pipes.length; i++) {
        ctx.fillStyle = "#005888";
        ctx.fillRect(
            pipes[i].x,
            0,
            pipes[i].w,
            pipes[i].y);
        ctx.fillRect(
            pipes[i].x,
            pipes[i].y + pipes[i].h,
            pipes[i].w,
            canvas.height - pipes[i].y - pipes[i].h);
    }
}
function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "30px 'Varela Round', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Score: " + score, canvas.width/2, 50);
}

// Fonctions de mise à jour
function updateBird() {
    bird.speed += bird.gravity;
    bird.y += bird.speed;
    if (bird.y < 0 || bird.y > canvas.height - bird.h || checkCollision()) {
        clearInterval(game);
        isGameOver = true;
        calcScore();
    }
}
function updatePipes() {
    for (var i = 0; i < pipes.length; i++) {
        pipes[i].x -= 3;
        if (pipes[i].x + pipes[i].w < 0) {
            pipes.splice(i, 1);
            score++;
        }
    }
    if (pipes.length < 1) {
        addPipe();
    }
}
function updateGame() {
    updateBird();
    updatePipes();
}

// Ajout d'un tuyau
function addPipe() {
    var pipe = {
        x: canvas.width,
        y: Math.floor(Math.random() * canvas.height - 200) + 100,
        w: 50,
        h: Math.floor(Math.random() * (300 - 150 + 1)) + 150
    };
    pipes.push(pipe);
}

// Vérification des collisions
function checkCollision() {
    for (var i = 0; i < pipes.length; i++) {
        if (bird.x < pipes[i].x + pipes[i].w && bird.x + bird.w > pipes[i].x && (bird.y < pipes[i].y || bird.y + bird.h > pipes[i].y + pipes[i].h)) {
            return true;
        }
    }
    return false;
}

// Boucle de jeu
var game = setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    drawScore();
    updateGame();
}, 1000/60);

// Réinitialiser le jeu
function resetGame() {
    bird = {
        x: 50,
        y: 100,
        w: 30,
        h: 35,
        speed: 0,
        gravity: 0.5,
        jump: 9
    };
    pipes = [];
    score = 0;
    game = setInterval(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawPipes();
        drawScore();
        updateGame();
    }, 1000/60);
    isGameOver = false;
}

// Événement de saut pour l'oiseau avec espace
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") {
        if (isGameOver) {
            resetGame();
        } else {
            bird.speed = -bird.jump;
        }
    }
});

// Événement de saut pour l'oiseau au clic
canvas.addEventListener("click", function (e) {
    if (isGameOver) {
        resetGame();
    } else {
        bird.speed = -bird.jump;
    }
});

calcScore();
