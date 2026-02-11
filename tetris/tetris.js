const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

canvas.width = 300;
canvas.height = 600;

const scale = 30;

// Samurai Themed Colors for Tetrominoes (IRIS Palette)
const colors = [
    null,
    "#BC002D", // IRIS Red (I)
    "#E2E2E2", // Silver (J)
    "#D4AF37", // Gold (L)
    "#1A1A1A", // Ink (O)
    "#8B0000", // Dark Red (S)
    "#666666", // Grey (T)
    "#BC002D", // IRIS Red (Z)
];

function createPiece(type) {
    if (type === "I") {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === "L") {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === "J") {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0],
        ];
    } else if (type === "O") {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === "Z") {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    } else if (type === "S") {
        return [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0],
        ];
    } else if (type === "T") {
        return [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0],
        ];
    }
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(
                    (x + offset.x) * scale,
                    (y + offset.y) * scale,
                    scale,
                    scale,
                );

                // Block Border
                context.strokeStyle = "rgba(255, 255, 255, 0.1)";
                context.lineWidth = 1;
                context.strokeRect(
                    (x + offset.x) * scale,
                    (y + offset.y) * scale,
                    scale,
                    scale,
                );
            }
        });
    });
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "rgba(255, 255, 255, 0.03)";
    context.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += scale) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }
    for (let y = 0; y <= canvas.height; y += scale) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    drawMatrix(arena, { x: 0, y: 0 });
    drawMatrix(player.matrix, player.pos);
}


function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
        }
    }
    if (dir > 0) {
        matrix.forEach((row) => row.reverse());
    } else {
        matrix.reverse();
    }
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(offset) {
    player.pos.x += offset;
    if (collide(arena, player)) {
        player.pos.x -= offset;
    }
}

function playerReset() {
    const pieces = "TJLOSZI";
    player.matrix = createPiece(pieces[(pieces.length * Math.random()) | 0]);
    player.pos.y = 0;
    player.pos.x =
        ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);
    if (collide(arena, player)) {
        arena.forEach((row) => row.fill(0));
        player.score = 0;
        player.level = 1;
        updateScore();
    }
}

function playerRotate(dir) {
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;

        if (player.score >= player.level * 100) {
            player.level++;
        }
    }
}

function updateScore() {
    scoreElement.innerText = player.score.toString().padStart(4, "0");
    levelElement.innerText = player.level;
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    const currentInterval = dropInterval / (1 + (player.level - 1) * 0.2);
    if (dropCounter > currentInterval) {
        playerDrop();
    }

    draw();
    requestAnimationFrame(update);
}

const arena = createMatrix(10, 20);

const player = {
    pos: { x: 0, y: 0 },
    matrix: null,
    score: 0,
    level: 1,
};

// Sakura Petals Generator
function createSakura() {
    const container = document.getElementById("sakura-container");
    const count = 30;

    for (let i = 0; i < count; i++) {
        const petal = document.createElement("div");
        petal.className = "petal";

        const size = Math.random() * 12 + 8;
        const startX = Math.random() * 100;
        const duration = Math.random() * 8 + 7;
        const delay = Math.random() * 10;

        petal.style.width = `${size}px`;
        petal.style.height = `${size * 0.7}px`;
        petal.style.left = `${startX}%`;
        petal.style.animation = `drift ${duration}s ease-in-out -${delay}s infinite`;

        container.appendChild(petal);
    }
}

// Mouse Tracking for Background Spotlight
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.body.style.setProperty('--mouse-x', `${x}%`);
    document.body.style.setProperty('--mouse-y', `${y}%`);
});

// Game Actions
function actionLeft() {
    playerMove(-1);
}

function actionRight() {
    playerMove(1);
}

function actionRotate() {
    playerRotate(1);
}

function actionDrop() {
    playerDrop();
}

function actionHardDrop() {
    while (!collide(arena, player)) {
        player.pos.y++;
    }
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
    updateScore();
    dropCounter = 0;
}

document.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (key === 'a') {
        actionLeft();
    } else if (key === 'd') {
        actionRight();
    } else if (key === 's') {
        actionDrop();
    } else if (key === 'w') {
        actionRotate();
    } else if (key === ' ') {
        actionHardDrop();
    }
});

const btnLeft = document.getElementById('left-btn');
const btnRight = document.getElementById('right-btn');
const btnRotate = document.getElementById('rotate-btn');
const btnDrop = document.getElementById('drop-btn');
const btnHardDrop = document.getElementById('hard-drop-btn');

btnLeft.addEventListener('click', actionLeft);
btnRight.addEventListener('click', actionRight);
btnRotate.addEventListener('click', actionRotate);
btnDrop.addEventListener('click', actionDrop);
btnHardDrop.addEventListener('click', actionHardDrop);

[
    { el: btnLeft, fn: actionLeft },
    { el: btnRight, fn: actionRight },
    { el: btnRotate, fn: actionRotate },
    { el: btnDrop, fn: actionDrop },
    { el: btnHardDrop, fn: actionHardDrop }
].forEach(touch => {
    touch.el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        touch.fn();
    });
});

createSakura();
playerReset();
updateScore();
update();
