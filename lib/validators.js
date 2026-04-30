export function validateSignupInput(payload) {
  const userName = String(payload?.userName || '').trim();
  const email = String(payload?.email || '').trim().toLowerCase();
  const password = String(payload?.password || '');

  if (userName.length < 3 || userName.length > 50) {
    throw new Error('Invalid username. Use 3 to 50 characters.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email address.');
  }

  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  if (password.length < 8 || !hasLetter || !hasNumber || /\s/.test(password)) {
    throw new Error('Invalid password. Use at least 8 characters with one letter and one number and no spaces.');
  }

  return { userName, email, password };
}

export function validatePostContent(content) {
  const value = String(content || '').trim();
  if (!value) {
    throw new Error('Invalid content. Content is required.');
  }
  if (value.length > 5000) {
    throw new Error('Invalid content. Maximum length is 5000 characters.');
  }
  return value;
}

export function validateFavoriteFlag(value) {
  if (typeof value !== 'boolean') {
    throw new Error('Invalid favorite value.');
  }
  return value;
}
