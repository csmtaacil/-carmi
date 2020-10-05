import {regs} from "./riscv32_isa.js"

export function helpBtype(ri) {
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