export {Ram};

class Ram {
	
	constructor() {
		this.ram = {};
		this.littleEndian = true;
		this.pageSize = 4096;
	}
	
	writeB(addr, val) {
		this.ram[addr] = val & 255;
	}
	
	readB(addr) {
		return (this.ram[addr]);
	}
	
	readW(addr) {
		let al,ah;
		if (this.littleEndian) {
			al = addr;
			ah = addr+1;
		} else {
			al = addr+1;
			ah = addr;
		}
		let l = this.ram[al];
		let h = this.ram[ah];
		return ((h<<8) + l);
	}	

	writeW(addr, v) {
		let vl = v & 255;
		let vh = (v>>8) & 255; 
		let al, ah;
		if (this.littleEndian) {
			al = addr;
			ah = addr+1;
		} else {
			al = addr+1;
			ah = addr;
		}
		this.ram[al] = vl;
		this.ram[ah] = vh;
	}	

	readD(addr) {
		let a0, a1, a2, a3;
		if (this.littleEndian) {
			a0 = addr;
			a1 = addr+1;
			a2 = addr+2;
			a3 = addr+3;
		} else {
			a3 = addr;
			a2 = addr+1;
			a1 = addr+2;
			a0 = addr+3;
		}
		let b0 = this.ram[a0];
		let b1 = this.ram[a1];
		let b2 = this.ram[a2];
		let b3 = this.ram[a3];
		
		let v = b3;
		v = (v * 256) + b2;
		v = (v * 256) + b1;
		v = (v * 256) + b0;
		return (v);
	}	

	writeD(addr, v) {
		let a0, a1, a2, a3;
		if (this.littleEndian) {
			a0 = addr;
			a1 = addr+1;
			a2 = addr+2;
			a3 = addr+3;
		} else {
			a3 = addr;
			a2 = addr+1;
			a1 = addr+2;
			a0 = addr+3;
		}
		
		let b0 = v & 255;
		v = Math.trunc(v / 256);
		let b1 = v & 255;
		v = Math.trunc(v / 256);
		let b2 = v & 255;
		v = Math.trunc(v / 256);
		let b3 = v & 255;
	
		this.ram[a0] = b0;
		this.ram[a1] = b1;
		this.ram[a2] = b2;
		this.ram[a3] = b3;
	}
	
	findUnusedPage() {
		return (Math.trunc(Math.random()*1024) * this.pageSize);
	}
}