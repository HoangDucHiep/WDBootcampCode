let p1 = rollDice();
let p2 = rollDice();


let p1Dice = document.querySelector(".img1");
let p2Dice = document.querySelector(".img2");

p1Dice.setAttribute("src", `images/dice${p1}.png`);
p2Dice.setAttribute("src", `images/dice${p2}.png`);

let title = document.querySelector("h1");
let message = p1 > p2 ? "Player 1 Wins!" : p1 < p2 ? "Player 2 Wins!" : "Draw!";
title.textContent = message;

function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}