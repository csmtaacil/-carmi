export {DisplayRam};

import {Ram} from "./Ram.mjs";

class DisplayRam {
	constructor(elem, ram) {
		this.elem = elem;
		this.ram = ram;
		this.rtl = false;
		this.radix = 16;
		this.leadZ = false;
		
		this.unit = 1;
		
		elem.addEventListener('contextmenu', this.contextMenuEvent);
	}
	
	contextMenuEvent(e) {
		e.preventDefault();
	}
	
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
			
			s += "<table id='table' style='text-align: right; font-family: monospace;'>";
			for (let key in this.ram.ram) {
				let k = parseInt(key);
				if (k < kMax) continue;
				if ((i % this.ram.pageSize) == 0) {
					let row = "<td></td>";
					for (let ii = 0; ii < cols; ii++) {
						let c = "<td>";
						c += ii * this.unit;
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
					
					let c = "<td>";
					c += k.toString(this.radix);
					c += "</td>";
					
					row = c;
				}
				let toolTip = ((i%cols) * this.unit).toString(this.radix);
				let c = "<td title='" + toolTip + "'>";
				let v = this.readValue(k);
				kMax = k + this.unit;
				c += v.toString(this.radix);
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