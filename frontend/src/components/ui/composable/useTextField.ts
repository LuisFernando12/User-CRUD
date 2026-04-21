export function useTextField() {
  const setTextFieldError = (fieldRef: HTMLInputElement) => {
    fieldRef.classList.remove("focus:ring-blue-500");
    fieldRef.classList.add("focus:ring-red-500");
    fieldRef.focus();
  };
  return {
    setTextFieldError,
  };
}
