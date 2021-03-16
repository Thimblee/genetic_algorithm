/*
Reference
https://kuroeveryday.blogspot.com/2019/04/how-to-detect-click-on-shape-on-canvas.html
*/
"use strict"

window.onload = function() {

const canvas = document.createElement("canvas");
document.getElementById("app").appendChild(canvas);

const GENERATION = document.getElementById("generation");
const RET= document.getElementById("ret");
const INIT = document.getElementById("init");
const NEXT = document.getElementById("next");
const alert = document.getElementById('alert');

canvas.width = 1200;
canvas.height = 400;
const ctx = canvas.getContext("2d");
ctx.lineWidth = 10;

const BOX_COLOR = "green";
const MAIN_COLOR = "blue";
const SUB_COLOR = "lightgray";
const SIZE = 20;
const ROW = 2;
const COL = 5;
const FLG = new Array(ROW*COL).fill(0);
const items = [];

let NOW_G = 1;
let solutions = [];

const seed = 1;
class Random {
    constructor(seed = 88675123) {
        this.seed = seed;
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = seed;
    }

    next() {
        let t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }

    randint(min, max) {
        const r = Math.abs(this.next());
        return min + (r % (max - min));
    }

    reset() {
        this.x = 123456789;
        this.y = 362436069;
        this.z = 521288629;
        this.w = this.seed;
    }
}
const random = new Random(seed);

class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    clicked(ctx) {
        ctx.strokeStyle = BOX_COLOR;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    unclicked(ctx) {
        ctx.strokeStyle = "#FFF";
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }

    textHit(point) {
        return (this.x <= point.x && point.x <= this.x + this.w) &&
               (this.y <= point.y && point.y <= this.y + this.h); 
    }
}

function makeBox() {
    for (let row = 0; row < ROW; ++row) {
        for (let col = 0; col < COL; ++col) {
            const x = SIZE * col * 9;
            const y = SIZE * row * 9;
            const box = new Box(x+5, y+5, SIZE*8+10, SIZE*8+10);
            items.push(box);
        }
    }
}

function represent(solutions) {

    let ret = [];
    for (let i = 0; i < ROW * COL; ++i) {
        let tmp = [];
        for (let y = 0; y < 8; ++y) {
            for (let x = 0; x < 4; ++x) {
                tmp.push(solutions[i][y*4+x]);
            }
            for (let x = 3; x >= 0; --x) {
                tmp.push(solutions[i][y*4+x]);
            }
        }
        ret.push(tmp);
    }
    return ret;
}

function visualize(solutions) {
    
    for (let row = 0; row < ROW; ++row) {
        for (let col = 0; col < COL; ++col) {
            for (let y = 0; y < 8; ++y) {
                for (let x = 0; x < 8; ++x) {
                    let num = row * COL + col;
                    let ind = y * 8 + x;
                    if (solutions[num][ind] === 0) {
                        ctx.fillStyle = MAIN_COLOR;
                    } else {
                        ctx.fillStyle = SUB_COLOR;
                    }
                    ctx.fillRect(10+SIZE*(x+col*9), 10+SIZE*(y+row*9), SIZE, SIZE);
                }
            }
        }
    }
}

function randomtwo(max) {
    const first = random.randint(0, max);
    let second = random.randint(0, max);
    while (second == first) {
        second = random.randint(0, max);
    }
    return [first, second];
}

function crossover(sol1, sol2) {
    const thres = random.randint(0, 32);
    let new_solution = [];
    for (let i = 0; i < 32; ++i) {
        if (i < thres) new_solution.push(sol1[i]);
        else new_solution.push(sol2[i]);
    }
    return new_solution;
}

function mutation(solution) {
    const mut = random.randint(0, 32);
    let new_solution = solution.concat();
    new_solution[mut] = (new_solution[mut] + 1) % 2;
    return new_solution;
}

function new_generation(parents, mut_n=10) {
    let new_solutions = [];
    const len = parents.length;
    for (let i = 0; i < 10; ++i) {
        let couple = randomtwo(len);
        let child = crossover(parents[couple[0]], parents[couple[1]]);
        new_solutions.push(child);
    }
    for (let i = 0; i < mut_n; ++i) {
        new_solutions[i] = mutation(new_solutions[i]);
    }
    return new_solutions;
}

function paintBorder(e) {
    const rect = canvas.getBoundingClientRect();
    const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    for (let i = 0; i < items.length; ++i) {
        if (items[i].textHit(point)) {
            if (FLG[i] == false) {
                FLG[i] = true;
                items[i].clicked(ctx);
            } else {
                FLG[i] = false;
                items[i].unclicked(ctx);
            }
        }
    }
}

function ret() {
    window.location.href = "index.html";
    window.open("index.html", "_blank");
}

function init() {
    NOW_G = 1;
    GENERATION.textContent = "1st Generation";
    solutions = [];
    for (let i = 0; i < FLG.length; ++i) {
        FLG[i] = false;
        items[i].unclicked(ctx);
    }
    for (let i = 0; i < 10; ++i) {
        let array = [];
        for (let j = 0; j < 32; ++j) {
            array.push(random.randint(0, 2));
        }
        solutions.push(array);
    }
    visualize(represent(solutions));
}

function next() {
    let cnt = 0;
    FLG.forEach(a => {
        if (a == true) ++cnt;
    })
    if (cnt < 2) {
        alert.textContent = "select at least two";
        return;
    }

    NOW_G++;
    if (NOW_G == 2) GENERATION.textContent = "2nd Generation";
    else if (NOW_G == 3) GENERATION.textContent = "3rd Generation";
    else GENERATION.textContent = `${NOW_G}th Generation`; 
    alert.textContent = "";

    let parents = [];
    for (let i = 0; i < ROW*COL; ++i) {
        if (FLG[i] == true) {
            parents.push(solutions[i]);
        }
    }
    for (let i = 0; i < FLG.length; ++i) {
        FLG[i] = false;
        items[i].unclicked(ctx);
    }
    solutions = new_generation(parents);
    visualize(represent(solutions));
}

function keyDown(e) {
    if (e.key === 'R') random.reset();
}

function main() {
    makeBox();
    init();
    canvas.addEventListener("click", e => {
        paintBorder(e);
    });
    RET.onclick = function() {
        ret();
    }
    INIT.onclick = function() {
        init();
    }
    NEXT.onclick = function() {
        next();
    }
    document.addEventListener('keydown', keyDown);
}

main();
}