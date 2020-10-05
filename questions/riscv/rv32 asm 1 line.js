//
// r v   t o   m a c h i n e   c o d e
//
const Utype  = 1;
const Jtype  = 2;
const Itype  = 3;
const Btype  = 4;
const I2type = 5;
const Rtype  = 6;

let iType = ["", "Utype", "Jtype", "Itype", "Btype",
             "I2type", "Rtype"];

let opCodes = [
["lui",   Utype,  0b0110111],
["auipc", Utype,  0b0010111],
["jal",   Jtype,  0b1101111],
["jalr",  Itype,  0b1100111, 0b000],

["beq",   Btype,  0b1100011,  0b000],
["bne",   Btype,  0b1100011,  0b001],
["blt",   Btype,  0b1100011,  0b100],
["bgeq",  Btype,  0b1100011,  0b101],
["bltu",  Btype,  0b1100011,  0b110],
["bgeu",  Btype,  0b1100011,  0b111],

["lb",    Itype,  0b0000011,  0b000],
["lh",    Itype,  0b0000011,  0b001],
["lw",    Itype,  0b0000011,  0b100],
["lbu",   Itype,  0b0000011,  0b101],
["lhu",   Itype,  0b0000011,  0b110],

["addi",  Itype,  0b0010011,  0b000],
["slti",  Itype,  0b0010011,  0b010],
["sltiu", Itype,  0b0010011,  0b011],
["xori",  Itype,  0b0010011,  0b100],
["ori",   Itype,  0b0010011,  0b110],
["andi",  Itype,  0b0010011,  0b111],

["slli",  I2type, 0b0010011,  0b001, 0b0000000],
["slri",  I2type, 0b0010011,  0b101, 0b0000000],
["srai",  I2type, 0b0010011,  0b101, 0b0100000],

["add",   Rtype,  0b0110011,  0b000, 0b0000000],
["sub",   Rtype,  0b0110011,  0b000, 0b0100000],
["sll",   Rtype,  0b0110011,  0b001, 0b0000000],
["slt",   Rtype,  0b0110011,  0b010, 0b0000000],
["sltu",  Rtype,  0b0110011,  0b011, 0b0000000],
["xor",   Rtype,  0b0110011,  0b100, 0b0000000],
["srl",   Rtype,  0b0110011,  0b101, 0b0000000],
["sra",   Rtype,  0b0110011,  0b101, 0b0100000],
["or",    Rtype,  0b0110011,  0b110, 0b0000000],
["and",   Rtype,  0b0110011,  0b111, 0b0000000],
];

let regs = 
[ ["zero"],
  ["ra"],
  ["sa"],
  ["gp"],
  ["tp"],
  ["t0"],
  ["t1"],
  ["t2"],
  ["s0", "fp"],
  ["s1"],
  ["a0"],
  ["a1"],
  ["a2"],
  ["a3"],
  ["a4"],
  ["a5"],
  ["a6"],
  ["a7"],
  ["s2"],
  ["s3"],
  ["s4"],
  ["s5"],
  ["s6"],
  ["s7"],
  ["s8"],
  ["s9"],
  ["s10"],
  ["s11"],
  ["t3"],
  ["t4"],
  ["t5"],
  ["t6"]
];

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

function helpRtype(ri) {
	let s = "<table>";
	s += '<tr style="border-bottom: solid 1px black;">';
	s += "<td>Rtype</td>";
	s += "<td></td>";
	s += "<td>rs2</td>";
	s += "<td>rs1</td>";
	s += "<td></td>";
	s += "<td>rd</td>";
	s += "<td></td>";
	s += "</tr>";
	for (let i = 0; i < 2; i++) {

		
		s += "<td></td>";
		s += "<td>";
		s += Math.trunc(Math.trunc(ri.code / (2**25)) % 128)
					.toString(2).padStart(7,"0");
		s += "</td>";

		let rs2 = Math.trunc(Math.trunc(ri.code / (2**20)) % 32);
		s += "<td>";
		if (i == 0)
			s += rs2.toString();
		else
			s += regs[rs2];
		s += "</td>";
		
		let rs1 = Math.trunc(Math.trunc(ri.code / (2**15)) % 32);
		s += "<td>";
		if (i == 0)
			s += rs1.toString();
		else
			s += regs[rs1];
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(Math.trunc(ri.code /4096 ) % 8)
				.toString(2).padStart(3,"0");
		s += "</td>";

		let rd = Math.trunc(Math.trunc(ri.code / (2**7)) % 32);
		s += "<td>";
		if (i == 0)
			s += rd.toString();
		else
			s += regs[rd];
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(ri.code % 128).toString(2).padStart(7,"0");
		s += "</td>";
		s += "</tr>";
	}
	s += "</table>";
	return(s);
}


function helpBtype(ri) {
	let s = "<table>";
	s += '<tr style="border-bottom: solid 1px black;">';
	s += "<td>Btype</td>";
	s += "<td></td>";
	s += "<td>rs2</td>";
	s += "<td>rs1</td>";
	s += "<td></td>";
	s += "<td>rd</td>";
	s += "<td></td>";
	s += "</tr>";
	for (let i = 0; i < 2; i++) {

		s += "<td></td>";
		s += "<td>";
		s += Math.trunc(Math.trunc(ri.code / (2**25)) % 128)
					.toString(2).padStart(7,"0");
		s += "</td>";

		let rs2 = Math.trunc(Math.trunc(ri.code / (2**20)) % 32);
		s += "<td>";
		if (i == 0)
			s += rs2.toString();
		else
			s += regs[rs2];
		s += "</td>";
		
		let rs1 = Math.trunc(Math.trunc(ri.code / (2**15)) % 32);
		s += "<td>";
		if (i == 0)
			s += rs1.toString();
		else
			s += regs[rs1];
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(Math.trunc(ri.code /4096 ) % 8)
				.toString(2).padStart(3,"0");
		s += "</td>";

		let v = Math.trunc(Math.trunc(ri.code / 128) % 32);
		s += "<td>";
		s += v.toString(2).padStart(5,"0");
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(ri.code % 128).toString(2).padStart(7,"0");
		s += "</td>";
		s += "</tr>";
	}
	s += "</table>";
	return(s);
}

function helpItype(ri) {
	let s = "<table>";
	s += '<tr style="border-bottom: solid 1px black;">';
	s += "<td>Itype</td>";
	s += "<td></td>";
	s += "<td>rs1</td>";
	s += "<td></td>";
	s += "<td>rd</td>";
	s += "<td></td>";
	s += "</tr>";
	for (let i = 0; i < 2; i++) {

		s += "<td></td>";
		s += "<td>";
		let v = Math.trunc(Math.trunc(ri.code / (2**20)) % 4096)
		if (v >= 2048)
			v -= 4096;
		s += v.toString(10);
		s += "</td>";

		let rs1 = Math.trunc(Math.trunc(ri.code / (2**15)) % 32);
		s += "<td>";
		if (i == 0)
			s += rs1.toString();
		else
			s += regs[rs1];
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(Math.trunc(ri.code /4096 ) % 8)
				.toString(2).padStart(3,"0");
		s += "</td>";

		let rd = Math.trunc(Math.trunc(ri.code / 128) % 32);
		s += "<td>";
		if (i == 0)
			s += "x" + rd.toString(10);
		else
			s += regs[rd];
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(ri.code % 128).toString(2).padStart(7,"0");
		s += "</td>";
		s += "</tr>";
	}
	s += "</table>";
	return(s);
}


function helpUtype(ri) {
	let s = "<table>";
	s += '<tr style="border-bottom: solid 1px black;">';
	s += "<td>Utype</td>";
	s += "<td></td>";
	s += "<td>rd</td>";
	s += "<td></td>";
	s += "</tr>";
	for (let i = 0; i < 2; i++) {
		s += "<td></td>";
		s += "<td>";
		let v = Math.trunc(Math.trunc(ri.code / 4096) % (2**20));
		if (v >= (2**19))
			v = v - (2**20);
		s += v.toString(10);
		s += "</td>";

		let rd = Math.trunc(Math.trunc(ri.code / (2**7)) % 32);
		s += "<td>";
		if (i == 0)
			s += rd.toString();
		else
			s += regs[rd];
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(ri.code % 128).toString(2).padStart(7,"0");
		s += "</td>";
		s += "</tr>";
	}
	s += "</table>";
	return(s);
}

let helpMode = false;


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
