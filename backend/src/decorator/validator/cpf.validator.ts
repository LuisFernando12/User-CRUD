import { registerDecorator, ValidationOptions } from 'class-validator';
function equationCPF(
  startRange: number,
  endRange: number,
  cpfWithoutDigitVerifier: string,
): number {
  let sum = 0;
  let cpfIndex = 0;
  for (let index = startRange; index >= endRange; index -= 1) {
    sum += Number(cpfWithoutDigitVerifier[cpfIndex]) * index;
    cpfIndex += 1;
  }
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
}
export function CPFValidator(
  property?: string,
  validatorOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'CPFValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: validatorOptions?.message || 'Invalid CPF!',
        ...validatorOptions,
      },
      validator: {
        validate(cpf: string): boolean {
          cpf = cpf.replace(/[^\d]+/g, '');
          if (cpf.length !== 11) return false;
          const cpfWithoutDigitVerifier = cpf.slice(0, -2);
          const cpfWithoutLastDigitVerifier = cpf.slice(0, -1);
          const firstDigitVerifier =
            equationCPF(10, 2, cpfWithoutDigitVerifier) === Number(cpf[9]);
          const secondDigitVerifier =
            equationCPF(11, 2, cpfWithoutLastDigitVerifier) === Number(cpf[10]);
          if (!firstDigitVerifier || !secondDigitVerifier) {
            return false;
          }
          return true;
        },
      },
    });
  };
}
