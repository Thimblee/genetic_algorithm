window.onload = function() {
    const canvas = document.getElementById("pixelArt");

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 5;

    function visualize(solutions) {
        const rows = 2;
        const cols = 5;
        const size = 25;
        for (let row = 0; row < rows; ++row) {
            for (let col = 0; col < cols; ++col) {
                for (let y = 0; y < 8; ++y) {
                    for (let x = 0; x < 8; ++x) {
                        let num = row * cols + col;
                        let ind = y * 8 + x;
                        if (solutions[num][ind] === 0) {
                            ctx.fillStyle = "#090";
                        } else {
                            ctx.fillStyle = "#030";
                        }
                        ctx.fillRect(size*(x+col*9), size*(y+row*9), size, size);
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
}