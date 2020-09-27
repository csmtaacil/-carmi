export {DisplayRam};

import {Ram} from "./Ram.mjs";

class DisplayRam {
	constructor(elem, ram) {
		this.elem = elem;
		this.ram = ram;
		this.rtl = false;
		this.radix = 16;
		this.addressDigits = 0;
		this.unit = 1;
		this.unitDigits = 0;
		
//		elem.addEventListener('contextmenu', this.contextMenuEvent);
//		elem.addEventListener("resize", this.display);	
	}
	
//	contextMenuEvent(e) {
//		e.preventDefault();
//	}
	
	readValue(key) {
		switch (this.unit) {
		case 1:
			return this.ram.readB(key);
			
		case 2:
			return this.ram.readW(key);
		
		case 4:
			return this.ram.readD(key);
		}
	}
	
	display() {
		let cols = 1024;
		let again = true;
		while (again) {
			let i = 0;
			let s = "";
			let row = "";
			let kMax = 0;
			
			s += "<table id='table' style='text-align: center; font-family: monospace;'>";
			for (let key in this.ram.ram) {
				let k = parseInt(key);
				if (k < kMax) continue;
				if ((i % this.ram.pageSize) == 0) {
					let b;
					if (this.rtl)
						b = "border-left: 1px black solid;";
					else
						b = "border-right: 1px black solid;";
					let row = "<td style='border-bottom: 1px solid black;" + b + "'></td>";
					for (let ii = 0; ii < cols; ii++) {
						let c = "<td style='text-align: center; border-bottom: 1px solid black;'>";
						c += (ii * this.unit).toString(16);
						c += "</td>";
						if (this.rtl) 
							row = c + row;
						else
							row = row + c;
					}
					s += "<tr>";
					s += row;
					s += "</tr>";
				}
				if ((i % cols) == 0) {
					s += "<tr>";

					let b;
					if (this.rtl)
						b = "border-left: 1px black solid;";
					else
						b = "border-right: 1px black solid;";
					
					let c = "<td style='" + b + "'>";
					let ks = k.toString(this.radix);
					if (this.addressDigits > 0) {
						console.log(this.addressDigits);
						ks = ks.padStart(this.addressDigits, "0");
					}
					c += ks;
					c += "</td>";
					
					row = c;
				}
				let toolTip = ((i%cols) * this.unit).toString(this.radix);
				let c = "<td title='" + toolTip + "'>";
				let v = this.readValue(k);
				kMax = k + this.unit;
				let vs = v.toString(this.radix);
				if (this.unitDigits > 0)
					vs = vs.padStart(this.unitDigits, "0");
				c += vs;
				c += "</td>";
				if (this.rtl)
					row = c + row;
				else 
					row = row + c;
				i = i + 1;
				if ((i % cols) == 0) {
					s += row + "</tr>";
					row = "";
				}
			}
			if (row != "") {
				while ((i % cols) != 0) {
					if (this.rtl)
						row = "<td></td>" + row;
					else
						row = row + "<td></td>";
					i++;
				}
				s += row + "</tr>";
			}
			s += "</table>";
			this.elem.innerHTML = s;
		
			let t = document.getElementById('table');
			let cs = t.rows[0].cells;
			let parentRight = this.elem.offsetLeft + this.elem.offsetWidth;
			let tableRight = t.offsetLeft+t.offsetWidth;
			if (tableRight <= parentRight)
				again = false;
			else
				cols = cols / 2;
		}
	}
}