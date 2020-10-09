//
// r v 3 2    D i s a s s e m b l e   o n e   l i n e
//

import {opCodes, regs, Utype, Itype,Btype,Rtype,Jtype,I2type, Stype} from "./riscv32_isa.js";

import {helpBtype}  from "./helpBtype.js";
import {helpItype}  from "./helpItype.js";
import {helpI2type} from "./helpI2type.js";
import {helpJtype}  from "./helpJtype.js";
import {helpRtype}  from "./helpRtype.js";
import {helpUtype}  from "./helpUtype.js";
import {helpStype}  from "./helpStype.js";

import {disasmBtype} from "./disasmBtype.js";
import {disasmItype} from "./disasmItype.js";
import {disasmRtype} from "./disasmRtype.js";
import {disasmStype} from "./disasmStype.js";

import {regNum} from "./regNum.js";

import {randomInstruction} from "./randomInstruction.js";

let iType = [];

iType[0] = "Unrecognized";
iType[Btype] = "Btype";
iType[Itype] = "Itype";
iType[I2type] = "i2type";
iType[Jtype] = "Jtype";
iType[Rtype] = "Rtype";
iType[Utype] = "Utype";
iType[Stype] = "Stype";


function getType(op) {
	let p = [];
	p[0] = Math.trunc(op % 128);
	p[1] = Math.trunc(Math.trunc(op / 4096) % 8);
	p[2] = Math.trunc(Math.trunc(op / (2**25)) % 128);
	//console.log(op.toString(16).padStart(8,"0"),
	//			p[0].toString(2).padStart(7,"0"),
	//			p[1].toString(2).padStart(3,"0"));
	for (let i = 0; i < opCodes.length; i++) {
		let v = opCodes[i];
		let j;
		for (j = 2; j < v.length; j++) {
			if (p[j-2] != v[j])
				break;
		}
		if (j == v.length)
			return (v[1]);
	}
	return (0);
}


function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = ri.str;
}

function displayHelp() {
	let eHelp = document.getElementById("help");
	let rs1, rs2, rd, s;
	let type = getType(ri.code);
	switch (type) {
	case Btype:
		s = helpBtype(ri);
		break;

	case Itype:
		s = helpItype(ri);
		break;

	case I2type:
		s = helpI2type(ri);
		break;

	case Jtype:
		s = helpJtype(ri);
		break;

	case Utype:
		s = helpUtype(ri);
		break;
	
	case Rtype:
		s = helpRtype(ri);
		break;
		
	case Stype:
		s = helpStype(ri);
		break;
		
	default:
		s = "<table><tr><td>";
		s += iType[type];
		s += "</td></tr>";
		s += "</table>";
	}
	eHelp.innerHTML = s;
}


function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("helpMode");
	e.checked = helpMode;
	
	e = document.getElementById("help");
	e.innerHTML = "";
	if (helpMode)
		displayHelp();
}


function disAsm(str) {
	let s = str.trim();
	let i;
	for (i = 0; i < s.length; i++) {
		let c = s.charAt(i);
		if (! ( 'a' <= c  && c <= 'z'  ||
				  'A' <= c  && c <= 'Z'))
			break;
	}
	let mnem = s.substring(0, i);
	s = s.substring(i, s.length);

	for (i = 0; i < opCodes.length; i++) {
		if (mnem == opCodes[i][0])
			break;
	}
	if (i == opCodes.length)
		return undefined;


	let v = opCodes[i];
	
	let regStr, rs1, rs2;
	switch (v[1]) {

	case Btype:
		return disasmBtype(mnem, s);

	case Itype:
		return disasmItype(mnem, s);

	case Rtype:
		return disasmRtype(mnem, s);
		
	case Stype:
		return disasmStype(mnem, s);

	default:
		return (mnem);
	}
}


let ri = randomInstruction();
let s = ri.code.toString(16).padStart(8,"0") + '</br>';
s += "<input type='checkbox', id='helpMode'>Help";
s += "<div dir='ltr' id='help'></div>";
let eInstruction = document.getElementById("instruction");

let t = disAsm(ri.str);

eInstruction.innerHTML = s + "<br/>" + t;

let eHelpMode = document.getElementById("helpMode");
eHelpMode.addEventListener("click", setHelpMode); 



let helpMode = false;


let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 
