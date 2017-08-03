/** Import project dependencies */
const crypto = require('crypto');

/** Setting up */
const IV_LENGTH = 16; // For AES, this is always 16

/** [START] Main code starts here */
class Scryptify {
  static encrypt(text, secret) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secret), iv);
    const cipherInitial = cipher.update(text);
    const encrypted = Buffer.concat([cipherInitial, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  static decrypt(text, secret) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secret), iv);
    const decipherInitial = decipher.update(encryptedText);
    const decrypted = Buffer.concat([decipherInitial, decipher.final()]);

    return decrypted.toString();
  }
}
/** [END] Main code starts here */

module.exports = Scryptify;
