export const HandleMask = (value: string, mask: string) => {
  if (!mask) return value;
  value = value.replace(/\D/g, "");
  const regexToValidCharMask = /[-./() ]/;
  let maskedValue = "";
  let valueIndex = 0;
  for (let char of mask) {
    const isSpecialChar = regexToValidCharMask.test(char);
    if (isSpecialChar) {
      if (value.length > valueIndex) {
        maskedValue += char;
      }
    } else {
      if (value.length > valueIndex) {
        maskedValue += value[valueIndex] || "";
        valueIndex++;
      } else {
        break;
      }
    }
  }
  return maskedValue;
};
