/** Import project dependencies */
import test from 'ava';

/** Import src/ */
import scryptify from '../';

/** Setting up */
const secret = '94qkPWQRouw5ouD9mVG2SHoDud3Mf8zw';
const encrypt = scryptify.encrypt;
const decrypt = scryptify.decrypt;
const rawData = '5ome_rand0m_m3ss4g3';

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
  try {
    t.true(
      /^([a-z0-9]+)\:(?:[a-z0-9]+)$/i.test(await encrypt(rawData, secret)),
      'Encryption works'
    );
  } catch (e) {
    t.fail(e);
  }
});

test('decryption works', async (t) => {
  try {
    const encrypted = await encrypt(rawData, secret);
    const decrypted = await decrypt(encrypted, secret);

    t.is(decrypted, rawData, 'Decryption works');
  } catch (e) {
    t.fail(e);
  }
});

test('encryption always produces unique output', async (t) => {
  try {
    const encryptedSet = new Set();
    const len = 1e4;

    await Promise.all(Array(len).fill(0).map(async () => {
      await encryptedSet.add(await encrypt(rawData, secret));
    }));

    t.is(encryptedSet.size, len, `${len} unique encrypted data`);
  } catch (e) {
    t.fail(e);
  }
});

test('decryption always works on unique encrypted sets from the same raw data', async (t) => {
  try {
    const encryptedSet = new Set();
    const len = 1e4;

    await Promise.all(Array(len).fill(0).map(async () => {
      await encryptedSet.add(await encrypt(rawData, secret));
    }));

    await Promise.all([...encryptedSet].map(async (es) => {
      t.is(await decrypt(es, secret), rawData, 'decryption works on unique encrypted sets');
    }));
  } catch (e) {
    t.fail(e);
  }
});
