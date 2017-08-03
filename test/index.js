/** Import project dependencies */
const test = require('ava');
const randomstring = require('randomstring');

/** Import src/ */
const Scryptify = require('../src');

/** Setting up */
const secret = randomstring.generate(32);
const encrypt = s => Scryptify.encrypt(s, secret);
const decrypt = s => Scryptify.decrypt(s, secret);
const rawData = '5ome_rand0m_m3ss4g3';

/** [START] Main code */
// test('a 256 bytes salt is required', async (t) => {
//   await t.throws(
//     async () => {
//       const ec = await encrypt(rawData, 'haha');
//       console.log({ ec });
//     },
//     Error,
//     'less than 256 bytes salt fails encryption',
//   );
// });

test('encryption works', async (t) => {
  await t.true(await encrypt(rawData, secret).includes(':'), 'Encryption works');
});

test('decryption works', async (t) => {
  const encrypted = await encrypt(rawData, secret);

  await t.is(decrypt(encrypted, secret), rawData, 'Decryption works');
});

test('encryption always produces unique output', async (t) => {
  const encryptedSet = new Set();
  const len = 1e4;

  await Array(len).fill(0).map(async () => {
    await encryptedSet.add(await encrypt(rawData, secret));
  });

  await t.is(encryptedSet.size, len, `${len} unique encrypted data`);
});

test('decryption always works on unique encrypted sets from the same raw data', async (t) => {
  const encryptedSet = new Set();
  const len = 1e4;

  await Array(len).fill(0).map(async () => {
    await encryptedSet.add(await encrypt(rawData, secret));
  });

  await encryptedSet.forEach(async (es) => {
    await t.is(await decrypt(es, secret), rawData, 'decryption works on unique encrypted sets');
  });
});
/** [END] Main code */
