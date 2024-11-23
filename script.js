import { INIT } from "./init.js";
INIT();

function setCharacter(src) {
    let image = document.getElementById("character");
    image.src = src;
}