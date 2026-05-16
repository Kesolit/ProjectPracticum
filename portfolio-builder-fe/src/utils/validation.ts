export type ValidationError = string | null;

export const validateEmail = (email: string): ValidationError => {
  if (!email.trim()) return "Почта обязательна";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Некорректный формат почты";
  return null;
};

export const validatePassword = (password: string): ValidationError => {
  if (!password) return "Пароль обязателен";
  if (password.length < 7) return "Минимум 7 символов";
  if (!/\d/.test(password)) return "Нужна хотя бы одна цифра";
  if (!/[A-Z]/.test(password)) return "Нужна хотя бы одна заглавная буква";
  return null;
};

export const validateName = (name: string, label: string): ValidationError => {
  if (!name.trim()) return `${label} обязательно`;
  if (name.length < 2) return `${label} слишком короткое`;
  return null;
};

export const validatePhone = (phone: string): ValidationError => {
  if (!phone.trim()) return "Номер телефона обязателен";
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) return "Неверный формат номера";
  return null;
};

export const validateConfirmPassword = (password: string, confirm: string): ValidationError => {
  if (password !== confirm) return "Пароли не совпадают";
  return null;
};