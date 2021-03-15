/*
Reference
https://kuroeveryday.blogspot.com/2019/04/how-to-detect-click-on-shape-on-canvas.html
*/

const canvas = document.createElement("canvas");
document.getElementById("app").appendChild(canvas);

canvas.width = 1200;
canvas.height = 500;

const ctx = canvax.getContext("2d");
ctx.save();
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.restore();

const BOX_COLOR = "red";
const SIZE = 20;
const ROW = 2;
const COL = 5;
const FLG = new Array(ROW*COL).fill(0);
/*
class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    clicked(ctx) {
        ctx.save();
        ctx.clearRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = BOX_COLOR;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.restore();
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
            const x = 30 * col * 9;
            const y = 30 * row * 9;
            const box = new Box(x, y, SIZE*8, SIZE*8);
            items.push(box);
        }
    }
}

canvas.addEnentListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const point = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };

    for (let i = 0; i < items.length; ++i) {
        if (items[i].textHit(point)) {
            FLG[i] = true;
            items[i].clicked(ctx);
        }
    }
});
*/
function visualize(solutions) {
    
    for (let row = 0; row < ROW; ++row) {
        for (let col = 0; col < COL; ++col) {
            for (let y = 0; y < 8; ++y) {
                for (let x = 0; x < 8; ++x) {
                    let num = row * COL + col;
                    let ind = y * 8 + x;
                    if (solutions[num][ind] === 0) {
                        ctx.fillStyle = "#090";
                    } else {
                        ctx.fillStyle = "#030";
                    }
                    ctx.fillRect(SIZE*(x+col*9), SIZE*(y+row*9), SIZE, SIZE);
                }
            }
        }
    }
}

const solutions = [];
for (let i = 0; i < 10; ++i) {
    solutions[i] = new this.Array(64).fill(i%2);
}
solutions[0][3] = 1;
visualize(solutions);