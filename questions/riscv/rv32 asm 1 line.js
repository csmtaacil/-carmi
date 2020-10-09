//
// r v 3 2    A s s e m b l e   o n e   l i n e
//


import {displayHelp} from "./displayHelp.js";

import {randomInstruction} from "./randomInstruction.js";

let ri = randomInstruction();
let s = ri.str + '</br>';
s += "<input type='checkbox', id='helpMode'>Help";
s += "<div dir='ltr' id='help'></div>";
let eInstruction = document.getElementById("instruction");
eInstruction.innerHTML = s;

let eHelpMode = document.getElementById("helpMode");
eHelpMode.addEventListener("click", setHelpMode); 

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = ri.code.toString(16).padStart(8,"0");
}



function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("helpMode");
	e.checked = helpMode;
	
	e = document.getElementById("help");
	e.innerHTML = "";
	if (helpMode)
		displayHelp(ri);
}


let helpMode = false;

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 
