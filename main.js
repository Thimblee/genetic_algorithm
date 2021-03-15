window.onload = function() {
    const canvas = document.getElementById("pixelArt")

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#090";
    ctx.strokeStyle = "#030";
    ctx.lineWidth = 5;
    ctx.fillRect(10, 10, 80, 120);
}