"use strict";

/*Hanjie script file
   Author: Will
   Date: 04/19/23

   Global Variables
   ================
   puzzleCells
      References the TD cells within the Hanjie table grid.
   
   cellBackground
      Stores the current background color of the puzzle cells during the mouseover event.
      
   Function List
   =============
   init()
      Run when the web page is loaded; displays puzzle 1 and loads the event handlers for the web page buttons.
      
   setupPuzzle()
      Sets up a new puzzle, adding the event handlers for every puzzle cell.      

   swapPuzzle(e)
      Swaps one puzzle for another based on the button being clicked by the user. Confirms the change before swapping in the new puzzle.

   setBackground(e)
      Sets the background color of the puzzle cells during the mousedown event

   extendBackground(e)
      Extends the background color of the original puzzle cell during the mouseenter event.
      
   endBackground()
      Ends the action of extending the cell backgrounds in response to the mouseup event.

   drawPuzzle(hint, rating, puzzle)
      Returns a text string of the HTML code to display a hanjie Web table based on the contents of multi-dimensional array, puzzle.	
*/

window.onload= init;

let puzzleCells;
let cellBackground;

// Run when the web page is loaded; displays puzzle 1 and loads the event handlers for the web page buttons.
function init(){
   document.getElementById('puzzleTitle').innerHTML = "Puzzle 1";
   document.getElementById('puzzle').innerHTML = drawPuzzle(puzzle1Hint, puzzle1Rating, puzzle1);
   let puzzleButtons = document.getElementsByClassName("puzzles");
   for(let i = 0; i < puzzleButtons.length; i++){
      puzzleButtons[i].onclick = swapPuzzle;
   }
   setupPuzzle();
   document.addEventListener("mouseup", endBackground);
   document.getElementById("solve").addEventListener("click", function(){
      for( let i = 0; i < puzzleCells.length; i++)
         puzzleCells[i].style.backgroundColor = "";
   });
}

//Swaps one puzzle for another based on the button being clicked by the user. Confirms the change before swapping in the new puzzle.
function swapPuzzle(e){

   if(confirm("You will lose ALL you progress on the puzzle!! \nContinue??")){

      let puzzleID = e.target.id;
      let puzzleTitle = e.target.value;
      document.getElementById('puzzleTitle').innerHTML = puzzleTitle;
      switch(puzzleID){
         case "puzzle1":
            document.getElementById('puzzle').innerHTML = drawPuzzle(puzzle1Hint, puzzle1Rating, puzzle1);
            break;
         case "puzzle2":
            document.getElementById('puzzle').innerHTML = drawPuzzle(puzzle2Hint, puzzle2Rating, puzzle2);
            break;
         case "puzzle3":
            document.getElementById('puzzle').innerHTML = drawPuzzle(puzzle3Hint, puzzle3Rating, puzzle3);
            break;
            default: "puzzle1";
      }
      setupPuzzle();
   }
   document.addEventListener("mouseup", endBackground);
}

//Sets up a new puzzle, adding the event handlers for every puzzle cell. 
function setupPuzzle(){
   puzzleCells  = document.querySelectorAll('table#hanjieGrid td');
   for (let i = 0; i < puzzleCells.length; i++){
      puzzleCells[i].style.backgroundColor = 'rgb(233, 207, 29)';
      puzzleCells[i].onmousedown = setBackgound;
      puzzleCells[i].style.cursor = "url(jpf_pencil.png), pointer";
   }
   //object collections of filled or empty cells 
   let filled = document.querySelectorAll("table#hanjieGrid td.filled");
   let empty = document.querySelectorAll("table#hanjieGrid td.empty");

   //incorrect tile marking logic
   document.getElementById("peek").addEventListener("click", function(){
      //empty tiles marked wrong
      for(let i = 0; i < filled.length; i++){
         if(filled[i].style.backgroundColor === "rgb(255, 255, 255)"){
            filled[i].style.backgroundColor = "rgb(255, 211, 211)";
         }
      }
      //filled tiles marked wrong
      for(let i = 0; i < empty.length; i++){
         if(empty[i].style.backgroundColor === "rgb(101, 101, 101)"){
            empty[i].style.backgroundColor = "rgb(255, 101, 101)";
         }
      }
      //revert back to played_state
      setTimeout(function() {
         for(let i = 0; i < puzzleCells.length; i++ ){
            if(puzzleCells[i].style.backgroundColor ===  "rgb(255, 211, 211)" ){
               puzzleCells[i].style.backgroundColor = "rgb(255, 255, 255)";
            }
            if(puzzleCells[i].style.backgroundColor ===  "rgb(255, 101, 101)" ){
               puzzleCells[i].style.backgroundColor = "rgb(101, 101, 101)";
            }
         } 
      } , 1500);
   });  //end of tile marking logic

   //check for solution logic
   document.getElementById("hanjieGrid").addEventListener("mouseup", function(){
      let solved = true;
      for( let i=0; i<puzzleCells.length; i++){
         if((puzzleCells[i].className === "filled" && puzzleCells[i].style.backgroundColor !== "rgb(101, 101, 101)") || (puzzleCells[i].className === "empty" && puzzleCells[i].style.backgroundColor === "rgb(101, 101, 101)")){
            solved = false;
            break;
         }
      }
      if(solved){
         alert("YOU DID IT!!!");
      }
   });//end of solution logic

}     //end of setupPuzzle()


//Sets the background color of the puzzle cells during the mousedown event
function setBackgound(e){
let cursorType;
   if(e.shiftKey){
      cellBackground = "rgb(233, 207, 29)"; 
      cursorType = "url(jpf_eraser.png), cell";
      } else if (e.altKey) {
         cellBackground = "rgb(255, 255, 255)"
         cursorType = "url(jpf_cross.png), crosshair";       
      } else {
         cellBackground = "rgb(101,101, 101)";
         cursorType = "url(jpf_pencil.png), pointer";
         }     
   e.target.style.backgroundColor = cellBackground;
   for (let i=0; i < puzzleCells.length; i++){
      puzzleCells[i].addEventListener("mouseenter", extendBackground);
      puzzleCells[i].style.cursor = cursorType;
   }
   e.preventDefault();
}

//Extends the background color of the original puzzle cell during the mouseenter event.
function extendBackground(e){
   e.target.style.backgroundColor = cellBackground; 
   
}

//Ends the action of extending the cell backgrounds in response to the mouseup event.
function endBackground(){
   for (let i = 0; i < puzzleCells.length; i++){
   puzzleCells[i].removeEventListener("mouseenter", extendBackground);
   puzzleCells[i].style.cursor = "url(jpf_pencil.png), pointer";
   }
}
 










/* ================================================================= */
//Returns a text string of the HTML code to display a hanjie Web table based on the contents of multi-dimensional array, puzzle.
function drawPuzzle(hint, rating, puzzle) {
   
   /* Initial HTML String for the Hanjie Puzzle */
   var htmlString = "";

   /* 
   puzzle is a multidimensional array containing the Hanjie puzzle layout. Marked cells are indicated by the # character. Empty cells are indicated by an empty text string. First, determine the number of rows and columns in the puzzle
    */

   var totalRows = puzzle.length;
   var totalCols = puzzle[0].length;

   /* 
   Loop through the rows to create the rowCount array containing the totals for each row in the puzzle
    */

   var rowCount = [];
   var spaceCount;
   for (var i = 0; i < totalRows; i++) {
      rowCount[i]="";
      spaceCount = 0;

      for (var j = 0; j < totalCols; j++) {
         if (puzzle[i][j] === "#") {
            spaceCount++;
            if (j === totalCols-1) {
               rowCount[i] += spaceCount + "&nbsp;&nbsp;";
            }
         } else {
            if (spaceCount > 0) {
               rowCount[i] += spaceCount + "&nbsp;&nbsp;";
               spaceCount = 0;
            } 
         }    
      }

   }

   /* 
   Loop through the columns to create the colCount array containing the totals for each column in the puzzle
    */

   var colCount = [];
   for (var j = 0; j < totalCols; j++) {
      colCount[j]="";
      spaceCount = 0;

      for (var i = 0; i < totalRows; i++) {
         if (puzzle[i][j] === "#") {
            spaceCount++;
            if (i === totalRows-1) {
               colCount[j] += spaceCount + "<br />";
            }
         } else {
            if (spaceCount > 0) {
               colCount[j] += spaceCount + "<br />";
               spaceCount = 0;
            } 
         }    
      }

   }

   /* 
   Create a Web table with the id, hanjieGrid, containing headers with the row and column totals. Each marked cell has the class name, marked; each empty cell has the class name, empty 
   */

   htmlString = "<table id='hanjieGrid'>";
   htmlString += "<caption>" + hint + " (" + rating + ")</caption>";
   htmlString += "<tr><th></th>";

   for (var j = 0; j < totalCols; j++) {
      htmlString += "<th class='cols'>" + colCount[j] + "</th>";
   }
   htmlString += "</tr>";

   for (var i = 0; i < totalRows; i++) {
      htmlString += "<tr><th class='rows'>&nbsp;" + rowCount[i]+"</th>";

      for (var j = 0; j<totalCols; j++) {
         if (puzzle[i][j] === "#") {
            htmlString += "<td  class='filled'></td>";
         }
         else {
            htmlString += "<td class='empty'></td>";
         }
      }

      htmlString += "</tr>";
   }

   htmlString += "</table>";

   return htmlString;
}