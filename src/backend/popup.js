import {wikiScraper} from './utils/wikiScraper.js';

document.addEventListener('DOMContentLoaded', ()=>{
    console.log("here");
    // add the listener to the click button
    const stardGameBTN = document.getElementById('stardGameBTN');
    stardGameBTN.addEventListener('click', startGame());
});

// for all attended purposes, startGame is the main function
function startGame(){
    wikiScraper();
}   