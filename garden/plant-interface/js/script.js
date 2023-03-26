/**
scifi plant comms - plant interface
Leonardo Morales

This is the plant interface of the Scifi Plant Comms 2player cooperative game.
*/

"use strict";

let state = 'seedID' // possible states are 'seedID', 'growthPhase00', 'growthPhase01', 'growthPhase02'

let seeds = [];
/**
Description of preload
*/
function preload() {

}


/**
Description of setup
*/
function setup() {
    createCanvas(1500, 800);

}


/**
Description of draw()
*/
function draw() {
    if (state === `seedID`) {
        seedID();
      } else if (state === `growthPhase00`) {
        growthPhase00();
      } else if (state === `growthPhase01`) {
        growthPhase01();
      } else if (state === `growthPhase02`) {
        growthPhase02();
      } 
    }

function seedID() {

};

function growthPhase00() {

};

function growthPhase01() {

};

function growthPhase02() {

};