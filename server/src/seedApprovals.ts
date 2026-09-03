export interface ApprovalRecord {
  id: string;
  documentId: string;
  documentTitle: string;
  caseNumber: string;
  category: string;
  classification: string;
  submittedBy: {
    id: string;
    fullName: string;
    employeeId: string;
  };
  reviewer?: {
    id: string;
    fullName: string;
    employeeId: string;
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  sha256Hash: string;
  createdAt: string;
  updatedAt: string;
}

export const initialApprovals: ApprovalRecord[] = [
  {
    id: 'app_101',
    documentId: 'doc_102',
    documentTitle: 'Forensic Server Network Packet Capture & Memory Image',
    caseNumber: 'CASE-2026-00101',
    category: 'FORENSIC_REPORT',
    classification: 'HIGHLY_CONFIDENTIAL',
    submittedBy: {
      id: 'usr_investigator',
      fullName: 'Inspector D. Sharma',
      employeeId: 'EMP-1002',
    },
    reviewer: {
      id: 'usr_legal',
      fullName: 'Legal Officer A. Roy',
      employeeId: 'EMP-1003',
    },
    status: 'PENDING',
    sha256Hash: '9a87f5d4e3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app_102',
    documentId: 'doc_103',
    documentTitle: 'Sworn Witness Deposition — Network Administrator',
    caseNumber: 'CASE-2026-00102',
    category: 'WITNESS_STATEMENT',
    classification: 'CONFIDENTIAL',
    submittedBy: {
      id: 'usr_investigator',
      fullName: 'Inspector D. Sharma',
      employeeId: 'EMP-1002',
    },
    reviewer: {
      id: 'usr_reviewer',
      fullName: 'Reviewer M. Kulkarni',
      employeeId: 'EMP-1004',
    },
    status: 'PENDING',
    sha256Hash: '4b3a2f1e0d9c8b7a69a87f5d4e3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'app_103',
    documentId: 'doc_101',
    documentTitle: 'First Information Report (FIR #9042/2026)',
    caseNumber: 'CASE-2026-00101',
    category: 'FIR',
    classification: 'HIGHLY_CONFIDENTIAL',
    submittedBy: {
      id: 'usr_investigator',
      fullName: 'Inspector D. Sharma',
      employeeId: 'EMP-1002',
    },
    reviewer: {
      id: 'usr_admin',
      fullName: 'Administrator V. Gaikar',
      employeeId: 'EMP-1001',
    },
    status: 'APPROVED',
    comments: 'FIR verified with IPC Sections 43/66. Recommended for judicial processing.',
    sha256Hash: '3636c0f08dab64d43ff5691ff5dbde2161178a72f6213af83ab633ba39d08519',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
