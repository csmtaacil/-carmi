export {DisplayRam};

import {Ram} from "Ram.mjs";

class DisplayRam {
	constructor(elem, ram) {
		this.elem = elem;	// Where to show
		this.ram = ram;		// What to show	
		this.rtl = false;	// Direction of dump
		this.radix = 16;	// Radix of dump
		this.addressDigits = 0;	// Minimal number of digits
		this.unit = 1;		// dump unit (1,2,4)
		this.unitDigits = 0;	// dump unit minimal digits
		this.showControls = false;
		this.importantAddresses = null;
		this.displayedAddress = null;	// Should be private
		
//		elem.addEventListener('contextmenu', this.contextMenuEvent);
//		elem.addEventListener("resize", this.display);	
	}
	
	clearImportantAddresses() {
		this.importantAddresses = null;
		this.displayedAddresses = null;	// Should be private
	}
	
	showD(addr) {
		this.addImportantAddress(addr);
		this.addImportantAddress(addr+1);
		this.addImportantAddress(addr+2);
		this.addImportantAddress(addr+3);
	}
	
	addImportantAddress(addr) {
		if (this.importantAddresses == null) {
			this.importantAddresses = [];
			this.displayedAddresses = [];
		}
 		
		this.importantAddresses.push(addr);
		let before = Math.trunc(Math.random() * 30);
		let after  = Math.trunc(Math.random() * 30);
		for (let i = 0; i <= before; i++)
			if (addr-i >= 0) this.displayedAddresses.push(addr-i);

		for (let i = 0; i <= after; i++)
			this.displayedAddresses.push(addr+i);
	
		this.displayedAddresses.sort( (function (a,b) {
			return a-b;
		})
		);
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
		if (this.displayedAddresses == null)
			return;

//		console.log(this.displayedAddresses);
		let cols = 1024;
		let again = true;
		
		while (again) {
			let s = "";
			let row = "";
			
			let addrMax = 0;
			let prevAddrLine = -1;
			let rowNums = 0;
			
			s += "<table id='table' style='text-align: center; font-family: monospace;'>";
			for (let idx = 0; idx < this.displayedAddresses.length; idx++) {
				let addr = this.displayedAddresses[idx];
				if (addr < addrMax) continue;
				let m = ~(cols * this.unit - 1);
				let addrLine = addr & m;
//				console.log(addr.toString(16), m.toString(16), addrLine.toString(16));

				if (addrLine != prevAddrLine + cols * this.unit  ||  rowNums > 10) {
					let emptyRow = "<tr style='background-color: white;'><td></td>";
					for (let i = 0; i < cols; i++)
						emptyRow += "<td></td>";
					emptyRow += "</tr>";
					s += emptyRow;
					s += "<tr>";
					let b;
					if (this.rtl)
						b = "border-left: 1px black solid;";
					else
						b = "border-right: 1px black solid;";
					let row = "<td style='border-bottom: 1px solid black; border-top: 1px solid black;" + b + "'></td>";
					for (let ii = 0; ii < cols; ii++) {
						let c = "<td style='text-align: center; border-bottom: 1px solid black; border-top:1px solid black;	'>";
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
					rowNums = 0;
				}
				rowNums++;
				prevAddrLine = addrLine;

				s += "<tr>";

				let b;
				if (this.rtl)
					b = "border-left: 1px black solid;";
				else
					b = "border-right: 1px black solid;";
					
				let c = "<td style='" + b + "'>";
				let addr_s = addrLine.toString(this.radix);
				if (this.addressDigits > 0) {
					addr_s = addr_s.padStart(this.addressDigits, "0");
				}
				c += addr_s;
				c += "</td>";
				row = c;	

				for (let off = 0; off < cols*this.unit; off += this.unit) {
					let toolTip = off.toString(this.radix);
					let c = "<td title='" + toolTip + "'>";
					let v = this.readValue(addrLine + off);
					let vs = "";
					if (v != undefined) {
						vs = v.toString(this.radix);
						if (this.unitDigits > 0)
							vs = vs.padStart(this.unitDigits, "0");
					}
					c += vs;
					c += "</td>";
					if (this.rtl)
						row = c + row;
					else 
						row = row + c;
				}
				addrMax = addrLine + cols * this.unit;
				s += row + "</tr>";
			}

			this.elem.innerHTML = s;
		
			let t = document.getElementById('table');
			let cs = t.rows[0].cells;
			let parentRight = this.elem.offsetLeft + this.elem.offsetWidth;
			let tableRight = t.offsetLeft+t.offsetWidth;
			if (tableRight <= parentRight || cols < 4)
				again = false;
			else
				cols = cols / 2;
			
		}
	}
}