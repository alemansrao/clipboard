import crypto from 'crypto';

export function createShareId(length = 4) {
  return crypto.randomBytes(length).toString('base64url').replace(/[^A-Za-z0-9]/g, '').slice(0, length).toUpperCase();
}
