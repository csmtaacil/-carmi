//
// r v   t o   m a c h i n e   c o d e
//
const Utype  = 1;
const Jtype  = 2;
const Itype  = 3;
const Btype  = 4;
const I2type = 5;

let opCodes = [
["lui",   Utype,  0b0110111],
["auipc", Utype,  0b0010111],
["jal",   Jtype,  0b1101111],
["jalr",  Itype,  0b1100111, 0b000],

["beq",   Btype,  0b1100011,  0b000],
["bne",   Btype,  0b1100011,  0b001],
["blt",   Btype,  0b1100011,  0b100],
["bgeq",  Btype,  0b1100011,  0b101],
["bltu",  Btype,  0b1100011,  0b101],
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
	let imm = -Math.pow(2,19) + 
		Math.trunc(Math.random() * Math.pow(2,20));
	return ({str: imm.toString(10), code: imm});
}

function randomImm12() {
	let imm = -2048 + Math.trunc(Math.random() * 4096);
	return ({str: imm.toString(10), code: imm});
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
		c = v[2] + rd.code * 128 + is.code * Math.pow(2,12);
		return({str: v[0] + "\t" + rd.str + ", " + is.str,
						code: c});
	
	case Jtype:
		rd = randomReg();
		is = randomImm20();
		c = v[2] + rd.code * 128 + is.code * Math.pow(2,12);
		return({str: v[0] + "\t" + rd.str + ", " + is.str,
						code: c});
	
	case Itype:
		rd = randomReg();
		rs1 = randomReg();
		is = randomImm12();
		c = v[2] + rd.code * 128 + v[3]*Math.pow(2,12) +
					is.code * Math.pow(2,20);
		return({str: v[0] + "\t" + rd.str + ", " + 
				 rs1.str +", " + is.str,
						code: c});
						
	case I2type:
		rd = randomReg();
		rs1 = randomReg();
		is = randomImm5();
		c = v[2] + rd.code * 128 + v[3]*Math.pow(2,12) +
					is.code * Math.pow(2,20) +
					v[4] * Math.pow(2,25);
		return({str: v[0] + "\t" + rd.str + ", " + 
				 rs1.str +", " + is.str,
						code: c});


	case Btype:
		rs1 = randomReg();
		rs2 = randomReg();
		is = randomImm12();
		c = v[2] + (is & 15) * 128 + v[3]*Math.pow(2,12) +
					rs1.code * Math.pow(2, 15) + 
					rs2.code * Math.pow(2, 20) + 
					Math.trunc(is.code / 16) * Math.pow(2,25);
		return({str: v[0] + "\t" + rs1.str + ", " + 
				 rs2.str +", " + is.str,
						code: c});
	}

	return (v[0]);
}

let eInstruction = document.getElementById("instruction");
let ri = randomInstruction();
eInstruction.innerHTML = ri.str;

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = ri.code.toString(2).padStart(32,"0");
}

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 
