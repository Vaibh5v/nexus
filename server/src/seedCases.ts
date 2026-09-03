export interface CaseRecord {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  caseType: 'FIR' | 'Investigation' | 'Criminal' | 'Civil' | 'Court' | 'Forensic' | 'Other';
  status: 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'PENDING_COURT' | 'CLOSED' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  department: string;
  assignedOfficer: {
    id: string;
    fullName: string;
    employeeId: string;
  };
  confidentiality: 'INTERNAL' | 'CONFIDENTIAL' | 'HIGHLY_CONFIDENTIAL' | 'RESTRICTED';
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  timeline: {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    actor: string;
  }[];
  tasks: {
    id: string;
    title: string;
    assignedTo: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate: string;
  }[];
}

export const initialCases: CaseRecord[] = [
  {
    id: 'case_101',
    caseNumber: 'CASE-2026-00101',
    title: 'State vs. Critical Infrastructure Cyber Breach',
    description: 'Investigation into unauthorized access and data exfiltration attempt targeting municipal infrastructure network.',
    caseType: 'FIR',
    status: 'ACTIVE',
    priority: 'CRITICAL',
    department: 'Digital Records & Investigation Division',
    assignedOfficer: {
      id: 'usr_investigator',
      fullName: 'Inspector D. Sharma',
      employeeId: 'EMP-1002',
    },
    confidentiality: 'HIGHLY_CONFIDENTIAL',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        id: 'tl_1',
        title: 'FIR Registered & Digitized',
        description: 'First Information Report filed under IPC Section 43/66 IT Act.',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        actor: 'Inspector D. Sharma (EMP-1002)',
      },
      {
        id: 'tl_2',
        title: 'Forensic Vault Custody Established',
        description: 'Server access logs and packet captures locked with SHA-256 integrity hash.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        actor: 'Officer R. Verma (EMP-1003)',
      },
    ],
    tasks: [
      {
        id: 'tsk_1',
        title: 'Extract server memory image & generate SHA-256 checksum',
        assignedTo: 'Officer R. Verma',
        status: 'COMPLETED',
        dueDate: '2026-09-05',
      },
      {
        id: 'tsk_2',
        title: 'Record witness deposition from network administrator',
        assignedTo: 'Inspector D. Sharma',
        status: 'IN_PROGRESS',
        dueDate: '2026-09-10',
      },
    ],
  },
  {
    id: 'case_102',
    caseNumber: 'CASE-2026-00102',
    title: 'Financial Fraud & Corporate Misappropriation',
    description: 'Forensic audit of forged transaction records and unauthorized bank wire transfers.',
    caseType: 'Investigation',
    status: 'UNDER_REVIEW',
    priority: 'HIGH',
    department: 'Economic Offenses Wing',
    assignedOfficer: {
      id: 'usr_investigator',
      fullName: 'Inspector D. Sharma',
      employeeId: 'EMP-1002',
    },
    confidentiality: 'CONFIDENTIAL',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        id: 'tl_3',
        title: 'Case Transferred to Legal Review Board',
        description: 'Charge sheet draft submitted for judicial review.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        actor: 'Legal Officer A. Roy (EMP-1003)',
      },
    ],
    tasks: [
      {
        id: 'tsk_3',
        title: 'Review supplementary charge sheet draft',
        assignedTo: 'Legal Officer A. Roy',
        status: 'IN_PROGRESS',
        dueDate: '2026-09-12',
      },
    ],
  },
  {
    id: 'case_103',
    caseNumber: 'CASE-2026-00103',
    title: 'Forensic Analysis of Counterfeit Land Records',
    description: 'Document authenticity audit for forged property registry seals.',
    caseType: 'Forensic',
    status: 'ACTIVE',
    priority: 'MEDIUM',
    department: 'Forensic Vault & Evidence Division',
    assignedOfficer: {
      id: 'usr_admin',
      fullName: 'Administrator V. Gaikar',
      employeeId: 'EMP-1001',
    },
    confidentiality: 'CONFIDENTIAL',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        id: 'tl_4',
        title: 'Original Deed Inspection Completed',
        description: 'Ink composition and paper fiber analysis report attached.',
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        actor: 'Administrator V. Gaikar (EMP-1001)',
      },
    ],
    tasks: [
      {
        id: 'tsk_4',
        title: 'Issue final handwriting comparison report',
        assignedTo: 'Administrator V. Gaikar',
        status: 'PENDING',
        dueDate: '2026-09-15',
      },
    ],
  },
];
