// @ts-check

/** Import project dependencies */
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'crypto';

/** Setting up */
const IV_LENGTH = 16; /** For AES, this is always 16 */

export function encryptSync(
  text: string,
  secret: string
) {
  if (typeof text !== 'string') {
    throw new TypeError('text is not a string');
  } else if (typeof secret !== 'string') {
    throw new TypeError('secret is not a string');
  } else if (text.length < 1) {
    throw new Error('Invalid length of text. Must be at least 1 character long');
  } else if (secret.length !== 32) {
    throw new Error('Invalid length of secret. Must be 256 bytes or 32 characters long');
  }

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secret), iv);
  const cipherInitial = cipher.update(Buffer.from(text));
  const encrypted = Buffer.concat([cipherInitial, cipher.final()]);

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSync(
  text: string,
  secret: string
) {
  if (typeof text !== 'string') {
    throw new TypeError('text is not a string');
  } else if (typeof secret !== 'string') {
    throw new TypeError('secret is not a string');
  } else if (text.length < 1) {
    throw new Error('Invalid length of text. Must be at least 1 character long');
  } else if (secret.length !== 32) {
    throw new Error('Invalid length of secret. Must be 256 bytes or 32 characters long');
  }

  const [iv, encrypted] = text.split(':');
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(secret),
    Buffer.from(iv, 'hex')
  );
  const decipherInitial = decipher.update(Buffer.from(encrypted, 'hex'));
  const decrypted = Buffer.concat([decipherInitial, decipher.final()]);

  return decrypted.toString();
}

export async function encrypt(
  text: string,
  secret: string
) {
  try {
    return encryptSync(text, secret);
  } catch (e) {
    throw e;
  }
}

export async function decrypt(
  text: string,
  secret: string
) {
  try {
    return decryptSync(text, secret);
  } catch (e) {
    throw e;
  }
}

export default {
  encryptSync,
  decryptSync,

  encrypt,
  decrypt,
};
