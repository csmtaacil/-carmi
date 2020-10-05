//
// r v 3 2    A s s e m b l e   o n e   l i n e
//

import {opCodes, regs, Utype, Itype,Btype,Rtype,Jtype,I2type} from "./riscv32_isa.js";

import {helpUtype} from "./helpUtype.js";
import {helpItype} from "./helpItype.js";
import {helpBtype} from "./helpBtype.js";
import {helpRtype} from "./helpRtype.js";

let iType = ["", "Utype", "Jtype", "Itype", "Btype",
             "I2type", "Rtype"];


function getType(op) {
	let p = [];
	p[0] = Math.trunc(op % 128);
	p[1] = Math.trunc(Math.trunc(op / 4096) % 8);
	p[2] = Math.trunc(Math.trunc(op / (2**25))% 128);

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

function randomReg() {
	let reg = Math.trunc(Math.random() * 32);
	if (Math.random() < 0.5)
		return ({str:"x" + reg, code: reg});
	let v = regs[reg];
	if (v.length == 1)
		return ({str:v[0], code:reg});
	if (Math.random() < 0.5)
		return ({str: v[0], code: reg});
	return ({str: v[1], code: reg});
}

function randomImm20() {
	let imm = (-(2**19)) + 
		Math.trunc(Math.random() * Math.pow(2,20));
	let immc = imm;
	if (immc < 0)
		immc = (2**20) + immc;
	return ({str: imm.toString(10), code: immc});
}

function randomImm12() {
	let imm = -2048 + Math.trunc(Math.random() * 4096);
	let immc = imm;
	if (immc < 0)
		immc = (2**12) + immc;
	return ({str: imm.toString(10), code: immc});
}

function randomImm5() {
	let imm = Math.trunc(Math.random() * 32);
	return ({str: imm.toString(10), code: imm});
}

function randomInstruction() {
	let idx = Math.trunc(Math.random() * opCodes.length);
	let v = opCodes[idx];
	
	let rd, rs1, rs2, c, is;
	switch (v[1]) {
	case Utype:
		rd = randomReg();
		is = randomImm20();
		c = v[2] + rd.code * 128 + is.code * (2**12);
		return({str: v[0] + "\t" + rd.str + ", " + is.str,
						code: c, type: v[1]});
	
	case Jtype:
		rd = randomReg();
		is = randomImm20();
		c = v[2] + rd.code * 128 + is.code * Math.pow(2,12);
		return({str: v[0] + "\t" + rd.str + ", " + is.str,
						code: c, type: v[1]});
	
	case Itype:
		rd = randomReg();
		rs1 = randomReg();
		is = randomImm12();
		c = v[2] + rd.code * 128 + v[3]*Math.pow(2,12) +
				 + rs1.code * (2**15) +
					is.code * Math.pow(2,20);
		return({str: v[0] + "\t" + rd.str + ", " + 
				 rs1.str +", " + is.str,
				code: c, type: v[1]});
						
	case I2type:
		rd = randomReg();
		rs1 = randomReg();
		is = randomImm5();
		c = v[2] + rd.code * 128 + v[3]*Math.pow(2,12) +
					is.code * Math.pow(2,20) +
					v[4] * Math.pow(2,25);
		return({str: v[0] + "\t" + rd.str + ", " + 
				 rs1.str +", " + is.str,
						code: c, type: v[1]});


	case Btype:
		rs1 = randomReg();
		rs2 = randomReg();
		is = randomImm12();
		c = v[2] + (is % 16) * 128 + v[3]*Math.pow(2,12) +
					rs1.code * Math.pow(2, 15) + 
					rs2.code * Math.pow(2, 20) + 
					Math.trunc(is.code / 16) * (2**25);
		return({str: v[0] + "\t" + rs1.str + ", " + 
				 rs2.str +", " + is.str,
					code: c, type: v[1]});
						
	case Rtype:
		rd = randomReg();
		rs1 = randomReg();
		rs2 = randomReg();
		c = v[2] + rd.code * 128 + 
			v[3] * 4096 + 
			rs1.code * 2**15 +
			rs2.code * 2**20 +
			v[4] * 2**25;
		return({str: v[0] + "\t" + rd.str + ", " + 
				 rs1.str +", " + rs2.str,
						code: c, type:v[1]});
	}

	return (v[0]);
}

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

	case Utype:
		s = helpUtype(ri);
		break;
	
	case Rtype:
		s = helpRtype(ri);
		break;
		
	default:
		s = "<table><tr><td>";
		s += iType[type];
		s += "</td></tr>";
		s += "</table>";
	}
	eHelp.innerHTML = s;
}







let helpMode = false;


setHelpMode();  // Debug

function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("helpMode");
	e.checked = helpMode;
	
	e = document.getElementById("help");
	e.innerHTML = "";
	if (helpMode)
		displayHelp();
}


let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 
