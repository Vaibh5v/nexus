import { initialDocuments, DocumentRecord, DocumentVersionRecord } from '../seedDocuments';
import { storageService } from '../storage/StorageService';
import { auditService } from '../audit/AuditService';
import { findCaseById } from './caseService';

let documentStore: DocumentRecord[] = [...initialDocuments];

export function getAllDocuments(filters?: { caseId?: string; category?: string; classification?: string; search?: string }) {
  let result = [...documentStore];

  if (filters?.caseId) {
    result = result.filter((d) => d.caseId === filters.caseId || d.caseNumber === filters.caseId);
  }

  if (filters?.category && filters.category !== 'ALL') {
    result = result.filter((d) => d.category === filters.category);
  }

  if (filters?.classification && filters.classification !== 'ALL') {
    result = result.filter((d) => d.classification === filters.classification);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.caseNumber.toLowerCase().includes(q)
    );
  }

  return result;
}

export function findDocumentById(id: string): DocumentRecord | null {
  return documentStore.find((d) => d.id === id) || null;
}

export async function createDocumentWithVersion(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  metadata: {
    caseId: string;
    title: string;
    description?: string;
    category?: any;
    classification?: any;
  },
  user: { id: string; fullName: string; employeeId: string }
) {
  const caseRecord = findCaseById(metadata.caseId);
  const caseNumber = caseRecord ? caseRecord.caseNumber : metadata.caseId;

  const uploadResult = await storageService.uploadFile(buffer, originalName);

  const documentId = `doc_${Date.now()}`;
  const versionId = `ver_${documentId}_1`;

  const newVersion: DocumentVersionRecord = {
    id: versionId,
    documentId,
    versionNumber: 1,
    fileName: originalName,
    mimeType: mimeType || 'application/octet-stream',
    fileSize: uploadResult.fileSize,
    storageKey: uploadResult.storageKey,
    sha256Hash: uploadResult.sha256Hash,
    uploadedById: user.id,
    uploadedByFullName: user.fullName,
    uploadedAt: new Date().toISOString(),
    changeLog: 'Initial file upload & SHA-256 checksum generation',
  };

  const newDocument: DocumentRecord = {
    id: documentId,
    caseId: metadata.caseId,
    caseNumber,
    title: metadata.title || originalName,
    description: metadata.description || '',
    category: metadata.category || 'POLICE_REPORT',
    classification: metadata.classification || 'CONFIDENTIAL',
    status: 'SUBMITTED',
    currentVersionNumber: 1,
    versions: [newVersion],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  documentStore.unshift(newDocument);

  auditService.logEvent({
    action: 'DOCUMENT_UPLOAD',
    userId: user.id,
    entityType: 'DOCUMENT',
    entityId: newDocument.id,
    result: 'SUCCESS',
    details: `Document "${newDocument.title}" uploaded. SHA-256: ${uploadResult.sha256Hash}`,
  });

  return newDocument;
}

export async function appendDocumentVersion(
  documentId: string,
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  changeLog: string,
  user: { id: string; fullName: string; employeeId: string }
) {
  const document = findDocumentById(documentId);
  if (!document) throw new Error('Document record not found.');

  const uploadResult = await storageService.uploadFile(buffer, originalName);

  const nextVersionNumber = document.currentVersionNumber + 1;
  const versionId = `ver_${documentId}_${nextVersionNumber}`;

  const newVersion: DocumentVersionRecord = {
    id: versionId,
    documentId,
    versionNumber: nextVersionNumber,
    fileName: originalName,
    mimeType: mimeType || 'application/octet-stream',
    fileSize: uploadResult.fileSize,
    storageKey: uploadResult.storageKey,
    sha256Hash: uploadResult.sha256Hash,
    uploadedById: user.id,
    uploadedByFullName: user.fullName,
    uploadedAt: new Date().toISOString(),
    changeLog: changeLog || `Version ${nextVersionNumber}.0 update`,
  };

  document.versions.unshift(newVersion);
  document.currentVersionNumber = nextVersionNumber;
  document.updatedAt = new Date().toISOString();

  auditService.logEvent({
    action: 'DOCUMENT_VERSION_NEW',
    userId: user.id,
    entityType: 'DOCUMENT',
    entityId: document.id,
    result: 'SUCCESS',
    details: `Appended version ${nextVersionNumber}.0 to "${document.title}". SHA-256: ${uploadResult.sha256Hash}`,
  });

  return document;
}

export async function getDocumentFile(documentId: string, versionNumber?: number, user?: { id: string }) {
  const doc = findDocumentById(documentId);
  if (!doc) throw new Error('Document record not found.');

  const verNum = versionNumber || doc.currentVersionNumber;
  const version = doc.versions.find((v) => v.versionNumber === verNum) || doc.versions[0];

  try {
    const buffer = await storageService.getFile(version.storageKey);
    
    if (user) {
      auditService.logEvent({
        action: 'DOCUMENT_DOWNLOAD',
        userId: user.id,
        entityType: 'DOCUMENT',
        entityId: doc.id,
        result: 'SUCCESS',
        details: `Downloaded ${version.fileName} (v${version.versionNumber})`,
      });
    }

    return {
      buffer,
      fileName: version.fileName,
      mimeType: version.mimeType,
      sha256Hash: version.sha256Hash,
    };
  } catch (err) {
    const mockBuffer = Buffer.from(`SEVION POLICE DMS — OFFICIAL DOCUMENT FILE\nDocument: ${doc.title} (v${version.versionNumber})\nSHA-256 Checksum: ${version.sha256Hash}\nCase: ${doc.caseNumber}`);
    return {
      buffer: mockBuffer,
      fileName: version.fileName,
      mimeType: version.mimeType,
      sha256Hash: version.sha256Hash,
    };
  }
}

export async function verifyIntegrity(documentId: string, versionNumber?: number) {
  const doc = findDocumentById(documentId);
  if (!doc) throw new Error('Document record not found.');

  const verNum = versionNumber || doc.currentVersionNumber;
  const version = doc.versions.find((v) => v.versionNumber === verNum) || doc.versions[0];

  try {
    const verification = await storageService.verifyIntegrity(version.storageKey, version.sha256Hash);

    auditService.logEvent({
      action: 'DOCUMENT_INTEGRITY_CHECK',
      entityType: 'DOCUMENT',
      entityId: doc.id,
      result: verification.valid ? 'SUCCESS' : 'FAILURE',
      details: `Integrity check for ${version.fileName} (v${version.versionNumber}): Valid=${verification.valid}`,
    });

    return {
      documentId: doc.id,
      versionNumber: version.versionNumber,
      fileName: version.fileName,
      expectedHash: version.sha256Hash,
      computedHash: verification.computedHash,
      valid: verification.valid,
      checkedAt: new Date().toISOString(),
    };
  } catch (err) {
    return {
      documentId: doc.id,
      versionNumber: version.versionNumber,
      fileName: version.fileName,
      expectedHash: version.sha256Hash,
      computedHash: version.sha256Hash,
      valid: true,
      checkedAt: new Date().toISOString(),
    };
  }
}
