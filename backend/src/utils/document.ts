const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const calc = (factor: number) => {
    let total = 0;
    for (let i = 0; i < factor - 1; i += 1) total += Number(cpf[i]) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return calc(10) === Number(cpf[9]) && calc(11) === Number(cpf[10]);
}

export function isValidCnpj(value: string) {
  const cnpj = onlyDigits(value);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const calc = (weights: number[]) => {
    const total = weights.reduce((sum, weight, index) => sum + Number(cnpj[index]) * weight, 0);
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return calc([5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cnpj[12])
    && calc([6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === Number(cnpj[13]);
}

export function normalizeDocument(value: string) {
  return onlyDigits(value);
}

export function isValidCpfOrCnpj(value: string) {
  const digits = onlyDigits(value);
  return digits.length === 11 ? isValidCpf(digits) : isValidCnpj(digits);
}
