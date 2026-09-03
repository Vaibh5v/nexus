import { hashPassword } from './security/passwordUtils';

export interface SeedUser {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  status: string;
  clearanceLevel: string;
  passwordHash: string;
  permissions: string[];
}

const defaultHash = hashPassword('password123');

export const SEED_PERMISSIONS = [
  'CASE_CREATE',
  'CASE_VIEW',
  'CASE_UPDATE',
  'CASE_DELETE',
  'DOCUMENT_UPLOAD',
  'DOCUMENT_VIEW',
  'DOCUMENT_DOWNLOAD',
  'DOCUMENT_UPDATE',
  'DOCUMENT_DELETE',
  'DOCUMENT_SHARE',
  'DOCUMENT_APPROVE',
  'USER_CREATE',
  'USER_UPDATE',
  'AUDIT_VIEW',
  'REPORT_VIEW',
  'SYSTEM_CONFIGURE',
];

export const SEED_USERS: SeedUser[] = [
  {
    id: 'usr_superadmin',
    employeeId: 'EMP-1000',
    fullName: 'System Super Admin',
    email: 'superadmin@example.com',
    department: 'Digital Systems Command',
    role: 'SUPER_ADMIN',
    status: 'ACTIVE',
    clearanceLevel: 'Level 4 - Top Secret',
    passwordHash: defaultHash,
    permissions: SEED_PERMISSIONS,
  },
  {
    id: 'usr_admin',
    employeeId: 'EMP-1001',
    fullName: 'Administrator V. Gaikar',
    email: 'admin@example.com',
    department: 'Administration Command',
    role: 'ADMIN',
    status: 'ACTIVE',
    clearanceLevel: 'Level 4 - Top Secret',
    passwordHash: defaultHash,
    permissions: SEED_PERMISSIONS,
  },
  {
    id: 'usr_investigator',
    employeeId: 'EMP-1002',
    fullName: 'Inspector D. Sharma',
    email: 'investigator@example.com',
    department: 'Digital Records & Investigation Division',
    role: 'INVESTIGATOR',
    status: 'ACTIVE',
    clearanceLevel: 'Level 3 - Confidential & Classified',
    passwordHash: defaultHash,
    permissions: ['CASE_VIEW', 'CASE_CREATE', 'CASE_UPDATE', 'DOCUMENT_UPLOAD', 'DOCUMENT_VIEW', 'DOCUMENT_DOWNLOAD', 'DOCUMENT_SHARE'],
  },
  {
    id: 'usr_legal',
    employeeId: 'EMP-1003',
    fullName: 'Legal Officer A. Roy',
    email: 'legal@example.com',
    department: 'Legal & Prosecution Division',
    role: 'LEGAL_OFFICER',
    status: 'ACTIVE',
    clearanceLevel: 'Level 3 - Legal Confidential',
    passwordHash: defaultHash,
    permissions: ['CASE_VIEW', 'DOCUMENT_VIEW', 'DOCUMENT_DOWNLOAD', 'DOCUMENT_APPROVE', 'DOCUMENT_SHARE'],
  },
  {
    id: 'usr_reviewer',
    employeeId: 'EMP-1004',
    fullName: 'Reviewer M. Kulkarni',
    email: 'reviewer@example.com',
    department: 'Judicial Review Board',
    role: 'REVIEWER',
    status: 'ACTIVE',
    clearanceLevel: 'Level 3 - Classified Review',
    passwordHash: defaultHash,
    permissions: ['CASE_VIEW', 'DOCUMENT_VIEW', 'DOCUMENT_APPROVE'],
  },
  {
    id: 'usr_auditor',
    employeeId: 'EMP-1005',
    fullName: 'Auditor S. Joshi',
    email: 'auditor@example.com',
    department: 'Internal Audit & Compliance Command',
    role: 'AUDITOR',
    status: 'ACTIVE',
    clearanceLevel: 'Level 4 - Audit Compliance',
    passwordHash: defaultHash,
    permissions: ['CASE_VIEW', 'DOCUMENT_VIEW', 'AUDIT_VIEW', 'REPORT_VIEW'],
  },
  {
    id: 'usr_viewer',
    employeeId: 'EMP-1006',
    fullName: 'Constable P. Pawar',
    email: 'viewer@example.com',
    department: 'Station General Registry',
    role: 'VIEWER',
    status: 'ACTIVE',
    clearanceLevel: 'Level 1 - Internal Only',
    passwordHash: defaultHash,
    permissions: ['CASE_VIEW', 'DOCUMENT_VIEW'],
  },
];

export function findSeedUser(identifier: string): SeedUser | null {
  const query = identifier.toLowerCase().trim();
  return SEED_USERS.find(
    (u) => u.email.toLowerCase() === query || u.employeeId.toLowerCase() === query
  ) || null;
}
