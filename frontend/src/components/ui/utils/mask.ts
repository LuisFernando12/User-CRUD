export const HandleMask = (value: string, mask: string) => {
  if (!mask) return value;
  const regexHasOnlySpecialChar = /^[-./()]+$/;
  if (regexHasOnlySpecialChar.test(value)) return "";
  mask = mask.toUpperCase();
  value = value.replace(/\D/g, "");
  const regexToValidCharMask = /[-./()]/;
  let maskedValue = "";
  let i = 0;
  for (let char of mask) {
    if (regexToValidCharMask.test(char)) {
      maskedValue += char;
    } else {
      maskedValue += value[i] || "";
      i++;
    }
  }
  return maskedValue;
};
