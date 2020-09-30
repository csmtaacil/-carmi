//
// c v a r _ c o n t e n t
//
import {Ram} from "./Ram.mjs";
import {DisplayRam} from "./DisplayRam.mjs";


let ram = new Ram;
ram.littleEndian = true;
ram.numPages = Math.pow(2,20); 


let unit = Math.trunc(2 ** Math.trunc(Math.random() * 3));

let value = 2 ** (unit * 8) - 1;

let eUnit0 = document.getElementById("unit0"+unit);
eUnit0.style.display = "inline";

let eUnit1 = document.getElementById("unit1"+unit);
eUnit1.style.display = "inline";


let pageAddress = ram.findUnusedPage();
let address = pageAddress + Math.trunc(Math.random() * 1023) * 4;
if (unit == 1)
	ram.writeB(address+4, value);
else if (unit == 2)
	ram.writeW(address+4, value);
else if (unit == 4)
	ram.writeD(address+4, value);


let esp = address;
let Esp = document.getElementById("esp");
Esp.innerHTML = esp.toString(16);

let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);

displayRam.addressDigits = 8;
displayRam.unit = Math.pow(2,Math.trunc(Math.random() * 3));
displayRam.unitDigits = displayRam.unit * 2;
if (Math.random() < 0.5)
	displayRam.rtl = false;
else
	displayRam.rtl = true;

displayRam.showD(address);
displayRam.showD(address+4);




displayRam.display();

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = value.toString(16);
}

function displayDump() {
	displayRam.display();
}


window.displayAnswer = displayAnswer;
window.displayDump = displayDump;

