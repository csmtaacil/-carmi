export const Utype  = 1;
export const Jtype  = 2;
export const Itype  = 3;
export const Btype  = 4;
export const I2type = 5;
export const Rtype  = 6;

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

export {opCodes, regs};
