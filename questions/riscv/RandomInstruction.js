import {opCodes, regs, Utype, Itype,Btype,Rtype,Jtype,I2type, Stype} from "./riscv32_isa.js";

import{randomReg} from "./randomReg.js";
import{randomItype} from "./randomItype.js";
import{randomStype} from "./randomStype.js";
import{randomImm12} from "./randomImm12.js";

function randomImm20() {
	let imm = (-(2**19)) + 
		Math.trunc(Math.random() * Math.pow(2,20));
	let immc = imm;
	if (immc < 0)
		immc = (2**20) + immc;
	return ({str: imm.toString(10), code: immc});
}

function randomImm11() {
	let imm = -1024 + Math.trunc(Math.random() * 2048);
	let immc = imm;
	if (immc < 0)
		immc = 2048 + immc;
	return ({str: imm.toString(10), code: immc});
}


function randomImm5() {
	let imm = Math.trunc(Math.random() * 32);
	return ({str: imm.toString(10), code: imm});
}

export function randomInstruction() {
	let idx = Math.trunc(Math.random() * opCodes.length);
	let v = opCodes[idx];
	
	let rd, rs1, rs2, c, is;
	switch (v[1]) {
	case Btype:
		rs1 = randomReg();
		rs2 = randomReg();
		is = randomImm12();
		c = is.code;
		if (c > (2**11)) {
			c -= (2**12);
		}
		is.str = (c*2).toString(10);
		
		c = is.code;
		let b11  = Math.trunc(c / 2048) % 2;
		let b10  = Math.trunc(c / 1024) % 2;
		let b9_4 = Math.trunc(c / 16) % 64;
		let b3_0 = c % 16;
		
		let i0 = b11  * 64 + b9_4;
		let i1 = b3_0 * 2 + b10;
		
		c = v[2] + 
			i1 * (2**7) +
			v[3] * (2**12) +
			rs1.code * (2**15) + 
			rs2.code * (2**20) + 
			i0 * (2**25);
			
		return({str: v[0] + "\t" + rs1.str + ", " + 
				 rs2.str +", " + is.str,
					code: c, type: v[1]});
	
	
	case Itype:
		return (randomItype(v));
						
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


	case Jtype:
		rd = randomReg();
		is = randomImm20();
		c = v[2] + rd.code * 128 + is.code * Math.pow(2,12);
		return({str: v[0] + "\t" + rd.str + ", " + is.str,
						code: c, type: v[1]});
						
	case Utype:
		rd = randomReg();
		is = randomImm20();
		c = v[2] + rd.code * 128 + is.code * (2**12);
		return({str: v[0] + "\t" + rd.str + ", " + is.str,
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

	case Stype:
		return(randomStype(v));
	}

	return (v[0]);
}
