/*
Reference
https://kuroeveryday.blogspot.com/2019/04/how-to-detect-click-on-shape-on-canvas.html
*/
"use strict"

window.onload = function() {

const canvas = document.createElement("canvas");
document.getElementById("app").appendChild(canvas);

canvas.width = 1200;
canvas.height = 500;

const ctx = canvas.getContext("2d");

ctx.save();
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.restore();

const BOX_COLOR = "green";
const MAIN_COLOR = "blue";
const SUB_COLOR = "lightgray";
const SIZE = 20;
const ROW = 2;
const COL = 5;
const FLG = new Array(ROW*COL).fill(0);

ctx.lineWidth = 10;

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

const items = [];
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
    const first = Math.floor( Math.random() * MAX/2 );
    let second = Math.floor( Math.random() * MAX/2 );
    while (second == first) {
        second = Math.floor( Math.random() * MAX/2 );
    }
    return first, second;
}

function crossover(sol1, sol2) {
    const thres = Math.floor( Math.random() * (ROW * COL)/2 );
    let new_solution = [];
    for (let i = 0; i < ROW*COL/2; ++i) {
        if (i < thres) new_solution.push(sol1[i]);
        else new_solution.push(sol2[i]);
    }
    return new_solution;
}

function mutation(solution) {
    const mut = Math.floor( Math.random() * (ROW * COL)/2 );
    let new_solution = solution.copy();
    new_solution[mut] = (new_solution[mut] + 1) % 2;
    return new_solution;
}

function new_generation(parents, mut_n=3) {
    let solutions = [];
    const len = parents.length;
    for (let i = 0; i < len; ++i) {
        let a, b = randomtwo(len);
        let child = crossover(parents[a], parents[b]);
        solutions.push(child);
    }
    for (let i = 0; i < mut_n; ++i) {
        solutions[i] = mutation(solutions[i]);
    }
    return solutions;
}

const solutions = [];
for (let i = 0; i < 10; ++i) {
    let array = [];
    for (let j = 0; j < 32; ++j) {
        array.push(Math.floor( Math.random() * 2 ));
    }
    solutions.push(array);
}
visualize(represent(solutions));

makeBox();
canvas.addEventListener("click", e => {
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
});

}