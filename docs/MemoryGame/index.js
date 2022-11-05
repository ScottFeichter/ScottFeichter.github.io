"use strict"

// ------------------------------FUNCTION JUNCTION----------------------------------

// function logSubmit(event) {
//     log.textContent = "Player Generated!"
//     event.preventDefault();
//
// }

function getToday() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

function clearContent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


// ------------------------------ACTION JACKSON----------------------------------

window.addEventListener("load", (event) => {

    // const container = document.querySelector(".container");
    // const header = document.querySelector(".header");
    const info = document.getElementById("info");
    // const controls = document.querySelector(".controls");
    // const current = document.querySelector(".current");
    // const alltime = document.querySelector(".alltime");
    const gameplay = document.querySelector(".gameplay");
    // const deck = document.querySelector(".deck");
    // const instructions = document.querySelector(".instructions");
    // const footer = document.querySelector(".footer");



    const theForm = document.getElementById("player");
    let formFlag = false;

    console.log("value of theForm: ", theForm);


    const start = document.getElementById("start");
    const reset = document.getElementById("reset");

// ------------------------------FORMARD MOTION----------------------------------

    theForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // creates player--------------------------------------------------------
        const player = {
            name: document.getElementById("name").value,
            DOB: document.getElementById("DOB").value,
            today: getToday(),
            currentScore: 0
        };
        console.log("event: ", event);
        console.log("value of player: ", player);




        // sets score------------------------------------------------------------
        let currentScore = document.getElementById("currentScore");
        currentScore.innerHTML = player.currentScore.toString();
        console.log("player.currentScore: ", player.currentScore);
        console.log("currentScore: ", currentScore.innerHTML);

        formFlag = true;

        alert(`
        Hello ${player.name}! 
        
        Are you ready to play?
        
        Look below the board for instructions.
        
        Press the Start button to begin`);


        document.getElementById("instructionsH2").innerHTML = "Press Start to Begin";

        // changed info to greeting------NOT WORKING :(-----------------------------------------

        // if (formFlag) {
        //     theForm.reset();
        //     let savedInfoChild = info.removeChild(theForm);
        //
        //     let helloPlayer = document.createElement("legend");
        //     helloPlayer.innerText = "Your Info";
        //
        //     let helloPlayerText = document.createElement(`p`);
        //
        //     helloPlayerText.innerText = `Hello ${player.name}!
        // Are you ready to play?
        // Look below the board for instructions.
        // Press the Start button to begin`;
        //
        //     info.appendChild(helloPlayer);
        //     info.appendChild(helloPlayerText);
        //
        // };


        start.addEventListener("click", function() {
            // reveals cardFronts
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 6; j++) {
                    let id = i.toString() + j.toString();
                    let ele = document.getElementById(id);
                    ele.style.opacity = 1;
                }
            }

            // instruction change
            document.getElementById("instructionsH2").innerHTML = `Click a card to reveal its color. 
            Match cards to win.
            Each incorrect adds to score.
            Lowest score is best.`;

            // assign value
            let cardColors = ["black", "blue", "green", "none", "orange", "purple", "red", "white", "yellow"];
            let cardCountAssignment = {
                black: 0,
                blue: 0,
                green: 0,
                none: 0,
                orange: 0,
                purple: 0,
                red: 0,
                white: 0,
                yellow: 0,
            };
            let cardColorAssignment = {};

            for (let i = 0; i < 18; i++) {
                let idxColor = getRandomInteger(0, 9);
                if (cardCountAssignment[cardColors[idxColor]] >= 2) {
                    i--;
                    continue;
                }

                let sizeRow = 3;
                let sizeColumn = 6;
                let idxRow = getRandomInteger(0, sizeRow)
                let idxColumn = getRandomInteger(0, sizeColumn);
                let k = idxRow.toString() + idxColumn.toString();


                if (cardColorAssignment[k]) {
                    i--;
                    continue;
                } else {
                    cardColorAssignment[k] = cardColors[idxColor];
                    cardCountAssignment[cardColors[idxColor]]++;
                };
                console.log(cardColorAssignment);
                console.log(cardCountAssignment);
                debugger;

            };




        });
    });
});





//
// let scores = {
//     best: 0,
//     "2nd": 0,
//     "3rd": 0,
//     "4th": 0,
//     "5th": 0,
//     "6th": 0,
//     "7th": 0,
//     "8th": 0,
//     "9th": 0,
//     "10th": 0
// }
//
// let scoresDates = {
//     best: undefined,
//     "2nd": undefined,
//     "3rd": undefined,
//     "4th": undefined,
//     "5th": undefined,
//     "6th": undefined,
//     "7th": undefined,
//     "8th": undefined,
//     "9th": undefined,
//     "10th": undefined
// }
//
//
//
// if (currentScore > scores.best) {
//     scores.best = currentScore;
//     congratsBest(player);
// } else if (currentScore === scores["2nd"]) {
//
// }
//
//
// function congratsBest(player, score) {
//     let congrats = "Yowsers! ${player.currentScore)!! You did it ${player.name}!!! You have the record for highest score!!!! Congratulations!!!!!";
//     alert(congrats);
// }
//
// function congratsTie(player, score) {
//     let congrats = "Yowsers! ${player.currentScore)!! You did it ${player.name}!!! You have the record for highest score!!!! Congratulations!!!!!";
//     alert(congrats);
// }
//
//
//
//
//
