import {opCodes, regs, Utype, Itype,Btype,Rtype,Jtype,I2type, Stype} from "./riscv32_isa.js";

import {helpBtype}  from "./helpBtype.js";
import {helpItype}  from "./helpItype.js";
import {helpI2type} from "./helpI2type.js";
import {helpJtype}  from "./helpJtype.js";
import {helpRtype}  from "./helpRtype.js";
import {helpUtype}  from "./helpUtype.js";
import {helpStype}  from "./helpStype.js";

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


export function displayHelp(ri) {
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
