"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCPF = validateCPF;
exports.formatCPF = formatCPF;
function validateCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11)
        return false;
    if (/^(\d)\1{10}$/.test(cleaned))
        return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i), 10) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11)
        remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(9), 10))
        return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i), 10) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11)
        remainder = 0;
    if (remainder !== parseInt(cleaned.charAt(10), 10))
        return false;
    return true;
}
function formatCPF(cpf) {
    return cpf.replace(/\D/g, '');
}
//# sourceMappingURL=validateCPF.js.map