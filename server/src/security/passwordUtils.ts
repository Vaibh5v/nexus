import crypto from 'crypto';

const SALT_PREFIX = 'police_dms_salt_';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, SALT_PREFIX + salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedCombinedHash: string | null): boolean {
  if (!password || !storedCombinedHash) return false;

  if (!storedCombinedHash.includes(':')) {
    const legacyHash = crypto.createHash('sha256').update(password + 'gov-sec-salt-9021').digest('hex');
    return crypto.timingSafeEqual(Buffer.from(legacyHash), Buffer.from(storedCombinedHash));
  }

  const [salt, originalHash] = storedCombinedHash.split(':');
  const computedHash = crypto.pbkdf2Sync(password, SALT_PREFIX + salt, 10000, 64, 'sha512').toString('hex');

  const computedBuffer = Buffer.from(computedHash, 'hex');
  const originalBuffer = Buffer.from(originalHash, 'hex');

  if (computedBuffer.length !== originalBuffer.length) return false;
  return crypto.timingSafeEqual(computedBuffer, originalBuffer);
}
