import crypto from 'crypto';

export interface DocumentVersionRecord {
  id: string;
  documentId: string;
  versionNumber: number;
  fileName: string;
  mimeType: string;
  fileSize: number;
  storageKey: string;
  sha256Hash: string;
  uploadedById: string;
  uploadedByFullName: string;
  uploadedAt: string;
  changeLog?: string;
}

export interface DocumentRecord {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  description: string;
  category: 'FIR' | 'POLICE_REPORT' | 'WITNESS_STATEMENT' | 'INVESTIGATION_RECORD' | 'CHARGE_SHEET' | 'COURT_FILING' | 'EVIDENCE' | 'FORENSIC_REPORT' | 'LEGAL_NOTICE' | 'JUDGMENT' | 'OTHER';
  classification: 'INTERNAL' | 'CONFIDENTIAL' | 'HIGHLY_CONFIDENTIAL' | 'RESTRICTED';
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  currentVersionNumber: number;
  versions: DocumentVersionRecord[];
  createdAt: string;
  updatedAt: string;
}

const generateSampleSha256 = (seed: string) => {
  return crypto.createHash('sha256').update(`seed_file_content_${seed}`).digest('hex');
};

export const initialDocuments: DocumentRecord[] = [
  {
    id: 'doc_101',
    caseId: 'case_101',
    caseNumber: 'CASE-2026-00101',
    title: 'First Information Report (FIR #9042/2026)',
    description: 'Digitized copy of initial FIR filed under IPC Section 43/66 IT Act.',
    category: 'FIR',
    classification: 'HIGHLY_CONFIDENTIAL',
    status: 'APPROVED',
    currentVersionNumber: 1,
    versions: [
      {
        id: 'ver_101_1',
        documentId: 'doc_101',
        versionNumber: 1,
        fileName: 'FIR_9042_Digitized_Scan.pdf',
        mimeType: 'application/pdf',
        fileSize: 1048576,
        storageKey: 'sample_fir_9042.pdf',
        sha256Hash: generateSampleSha256('fir_9042'),
        uploadedById: 'usr_investigator',
        uploadedByFullName: 'Inspector D. Sharma',
        uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        changeLog: 'Initial FIR submission',
      },
    ],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc_102',
    caseId: 'case_101',
    caseNumber: 'CASE-2026-00101',
    title: 'Forensic Server Network Packet Capture & Memory Image',
    description: 'Cryptographic memory dump and PCAP analysis file for breach evidence.',
    category: 'FORENSIC_REPORT',
    classification: 'HIGHLY_CONFIDENTIAL',
    status: 'UNDER_REVIEW',
    currentVersionNumber: 1,
    versions: [
      {
        id: 'ver_102_1',
        documentId: 'doc_102',
        versionNumber: 1,
        fileName: 'Forensic_Memory_Image_Dump.pcap',
        mimeType: 'application/octet-stream',
        fileSize: 5242880,
        storageKey: 'sample_memory_dump.pcap',
        sha256Hash: generateSampleSha256('memory_dump_2026'),
        uploadedById: 'usr_investigator',
        uploadedByFullName: 'Inspector D. Sharma',
        uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        changeLog: 'Initial forensic capture',
      },
    ],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'doc_103',
    caseId: 'case_102',
    caseNumber: 'CASE-2026-00102',
    title: 'Sworn Witness Deposition — Network Administrator',
    description: 'Witness deposition statement recorded during preliminary investigation.',
    category: 'WITNESS_STATEMENT',
    classification: 'CONFIDENTIAL',
    status: 'SUBMITTED',
    currentVersionNumber: 1,
    versions: [
      {
        id: 'ver_103_1',
        documentId: 'doc_103',
        versionNumber: 1,
        fileName: 'Deposition_SysAdmin_Deposition.pdf',
        mimeType: 'application/pdf',
        fileSize: 458752,
        storageKey: 'sample_deposition.pdf',
        sha256Hash: generateSampleSha256('deposition_statement'),
        uploadedById: 'usr_investigator',
        uploadedByFullName: 'Inspector D. Sharma',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        changeLog: 'Deposition transcript',
      },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
