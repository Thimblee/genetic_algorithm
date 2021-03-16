const topLink = document.getElementById("top");
let scrollValue;
console.log(topLink);

window.addEventListener("scroll", () => {
    scrollValue = document.scrollingElement.scrollTop;
    
    if (scrollValue >= 3900) {
        topLink.style.display = "inline";
    } else if (scrollValue < 3900) {
        topLink.style.display = "none";
    }
});