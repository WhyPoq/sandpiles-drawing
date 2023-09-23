
/*
    Utilities
*/
function sqrt(x) {
    return Math.sqrt(x);
}

/*
    Drawing functions
*/
let canvas;
let ctx;

let width;
let height;

function triangle(x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
}

function fill(color) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
}

function drawTri(x, y, s) {
    let s3 = s * sqrt(3);
    triangle(x - s / 2, y + s3 / 6, x, y - s3 / 3, x + s / 2, y + s3 / 6);
}

function drawTriU(x, y, s) {
    let s3 = s * sqrt(3);
    triangle(x - s / 2, y - s3 / 3, x, y + s3 / 6, x + s / 2, y - s3 / 3);
}


/*
    Actual program
*/

const W_COUNT = 41;
let w;
let h;

let side;

let curPiles = []
let touchedPiles = []
let updated = []

let xStep;
let yStep;
let offsetX;
let offsetY;

function startCanvas() {
    canvas = document.getElementById("drawing-canvas");
    ctx = canvas.getContext("2d");

    let scale = window.devicePixelRatio;
    canvas.width = canvas.scrollWidth * scale;
    canvas.height = canvas.scrollHeight * scale;
    width = canvas.width;
    height = canvas.height;

    setup(W_COUNT);
}

function generate(startSand, maxIters){
    genSand = startSand;
    genIters = maxIters;

    clearPiles();

    pourSand(startSand);
    compute(maxIters);

    drawGrid();
}

function clearPiles(){
    updated = [];
    for(let y = 0; y < h; y++){
        for(let x = 0; x < w; x++){
            curPiles[x][y] = 0;
        }
    }
}

function setup(wCount) {
    w = wCount;
    h = Math.floor((w + 2) / sqrt(3));

    side = (2 * width) / (w + 2);

    xStep = side / 2.0
    yStep = side * sqrt(3) / 2.0

    offsetX = (width - ((w - 1) * xStep + side)) / 2.0 + side / 2.0;
    offsetY = (height - h * yStep) / 2.0 + side * sqrt(3) / 3.0;

    for (let x = 0; x < w; x++) {
        let column1 = [];
        let column2 = [];
        for (let y = 0; y < h; y++) {
            column1.push(0)
            column2.push(0)
        }
        curPiles.push(column1);
        touchedPiles.push(column2);
    }
}

function drawGrid() {
    canvas.style.backgroundColor = selectedColorSceme[0];
    fill(selectedColorSceme[0]);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    offsetX = (width - ((w - 1) * xStep + side)) / 2.0 + side / 2.0;
    offsetY = (height - h * yStep) / 2.0 + side * sqrt(3) / 3.0;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            pickColor(x, y);

            if ((x + y) % 2 == 0) {
                drawTri(x * xStep + offsetX, y * yStep + offsetY, side);
            }
            else {
                drawTriU(x * xStep + offsetX, y * yStep + offsetY, side);
            }
        }
    }
}

function pickColor(x, y) {
    let val = curPiles[x][y];
    fill(selectedColorSceme[Math.min(val, selectedColorSceme.length - 1)]);
}

function pourSand(startSand) {
    updated = [];
    pos = { x: Math.floor(w / 2), y: Math.floor(h / 2)};
    curPiles[pos.x][pos.y] = startSand;
    if(curPiles[pos.x][pos.y] >= 3){
        updated.push({ x: pos.x, y: pos.y });
    }
}

function compute(iters) {
    noEffectSand(false);
    noEffectIters(false);
    
    for (let i = 0; i < iters; i++) {
        if(updated.length == 0){
            noEffectIters(true);
            break;
        }
        colapse();
    }
    if(curPiles[Math.floor(w / 2)][Math.floor(h / 2)] > 3){
        noEffectSand(true);
    }
}

function touch(x, y, touched) {
    if (touchedPiles[x][y] == 0) {
        touched.push({ x: x, y: y })
        touchedPiles[x][y] = 1
    }
}

function colapse() {
    let touched = [];
    for (let i = 0; i < updated.length; i++) {
        let x = updated[i].x;
        let y = updated[i].y;

        curPiles[x][y] -= 3;
        touch(x, y, touched);

        if (x - 1 >= 0) {
            curPiles[x - 1][y] += 1;
            touch(x - 1, y, touched);
        }
        if (x + 1 < w) {
            curPiles[x + 1][y] += 1;
            touch(x + 1, y, touched);
        }

        if ((x + y) % 2 == 0) {
            if (y + 1 < h) {
                curPiles[x][y + 1] += 1;
                touch(x, y + 1, touched);
            }
        }
        else {
            if (y - 1 >= 0) {
                curPiles[x][y - 1] += 1;
                touch(x, y - 1, touched);
            }
        }
    }

    updated = [];
    for (const value of touched) {
        if (curPiles[value.x][value.y] >= 3) {
            updated.push({ x: value.x, y: value.y });
        }
        touchedPiles[value.x][value.y] = 0;
    }
}


addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
        generateButton();
    }
});