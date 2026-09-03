import crypto from 'crypto';

/**
 * Calculates SHA-256 hash of a string or buffer
 */
export function calculateSha256(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Performs a timing-safe equality check between two hex hash strings
 */
export function timingSafeHashCompare(hashA: string, hashB: string): boolean {
  try {
    const bufA = Buffer.from(hashA, 'hex');
    const bufB = Buffer.from(hashB, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch (e) {
    return false;
  }
}
