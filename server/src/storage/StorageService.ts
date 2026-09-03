import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StorageUploadResult {
  storageKey: string;
  sha256Hash: string;
  fileSize: number;
}

export class StorageService {
  private baseStoragePath: string;

  constructor() {
    this.baseStoragePath = path.resolve(process.env.STORAGE_PATH || './uploads');
    if (!fs.existsSync(this.baseStoragePath)) {
      fs.mkdirSync(this.baseStoragePath, { recursive: true });
    }
  }

  /**
   * Stores a file buffer, generates a unique storage key, and returns the SHA-256 checksum
   */
  public async uploadFile(buffer: Buffer, originalName: string): Promise<StorageUploadResult> {
    const ext = path.extname(originalName);
    const uniqueName = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(this.baseStoragePath, uniqueName);

    // Compute SHA-256 hash
    const sha256Hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Write file to storage
    await fs.promises.writeFile(filePath, buffer);

    return {
      storageKey: uniqueName,
      sha256Hash,
      fileSize: buffer.length,
    };
  }

  /**
   * Reads a stored file buffer by storage key
   */
  public async getFile(storageKey: string): Promise<Buffer> {
    const filePath = path.join(this.baseStoragePath, storageKey);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File with storage key ${storageKey} not found.`);
    }
    return fs.promises.readFile(filePath);
  }

  /**
   * Verifies the cryptographic integrity of a stored file against a recorded SHA-256 hash
   */
  public async verifyIntegrity(storageKey: string, expectedHash: string): Promise<{ valid: boolean; computedHash: string }> {
    const buffer = await this.getFile(storageKey);
    const computedHash = crypto.createHash('sha256').update(buffer).digest('hex');
    return {
      valid: computedHash.toLowerCase() === expectedHash.toLowerCase(),
      computedHash,
    };
  }
}

export const storageService = new StorageService();
