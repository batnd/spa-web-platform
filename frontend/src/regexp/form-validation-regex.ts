const nameValidationRegexp = /^([А-Я][а-я]+\s?)(\s[А-Я][а-я]+)*$/;
const emailValidationRegexp = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordValidationRegexp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[0-9A-Za-z]{8,}$/;

export { nameValidationRegexp, emailValidationRegexp, passwordValidationRegexp };
