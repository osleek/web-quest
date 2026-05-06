const OPERATOR_NAME_REGEX = /^[a-zA-Zа-яА-ЯёЁ0-9_]{2,32}$/;

export function validateOperatorName(s) {
  if (!s || typeof s !== 'string') {
    return { valid: false, error: 'Введите имя оператора.' };
  }
  if (s.length < 2) {
    return { valid: false, error: 'Имя должно содержать минимум 2 символа.' };
  }
  if (s.length > 32) {
    return { valid: false, error: 'Имя не должно превышать 32 символа.' };
  }
  if (!OPERATOR_NAME_REGEX.test(s)) {
    return { valid: false, error: 'Допустимы только буквы (рус/лат), цифры и подчёркивание (_).' };
  }
  return { valid: true, error: null };
}
