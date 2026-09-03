import { SEED_USERS, SeedUser } from '../seedData';
import { hashPassword } from '../security/passwordUtils';
import { auditService } from '../audit/AuditService';

let usersStore: SeedUser[] = [...SEED_USERS];

export function getAllUsers(filters?: { search?: string; role?: string; status?: string }) {
  let result = [...usersStore];

  if (filters?.role && filters.role !== 'ALL') {
    result = result.filter((u) => u.role === filters.role);
  }

  if (filters?.status && filters.status !== 'ALL') {
    result = result.filter((u) => u.status === filters.status);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.employeeId.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
    );
  }

  return result;
}

export function findUserById(id: string): SeedUser | null {
  return usersStore.find((u) => u.id === id || u.employeeId === id || u.email.toLowerCase() === id.toLowerCase()) || null;
}

export function createUserAccount(
  data: {
    employeeId: string;
    fullName: string;
    email: string;
    department: string;
    role: string;
    clearanceLevel?: string;
    password?: string;
    permissions?: string[];
  },
  creatorUser: { id: string; fullName: string }
) {
  const existing = usersStore.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase() || u.employeeId.toLowerCase() === data.employeeId.toLowerCase()
  );

  if (existing) {
    throw new Error('User with this email or employee ID already exists.');
  }

  const userId = `usr_${Date.now()}`;
  const passwordHash = hashPassword(data.password || 'password123');

  const defaultPermissions = data.permissions || [
    'CASE_VIEW',
    'CASE_CREATE',
    'DOCUMENT_VIEW',
    'DOCUMENT_UPLOAD',
  ];

  const newUser: SeedUser = {
    id: userId,
    employeeId: data.employeeId,
    fullName: data.fullName,
    email: data.email,
    department: data.department || 'Digital Records & Investigation Division',
    role: data.role || 'INVESTIGATOR',
    status: 'ACTIVE',
    clearanceLevel: data.clearanceLevel || 'Level 2 - Confidential',
    passwordHash,
    permissions: defaultPermissions,
  };

  usersStore.unshift(newUser);

  auditService.logEvent({
    action: 'USER_CREATE',
    userId: creatorUser.id,
    entityType: 'USER',
    entityId: newUser.id,
    result: 'SUCCESS',
    details: `User account "${newUser.fullName}" (${newUser.employeeId}) created with role ${newUser.role}`,
  });

  return newUser;
}

export function updateUserAccount(
  id: string,
  updates: { status?: string; role?: string; clearanceLevel?: string; department?: string },
  updaterUser: { id: string; fullName: string }
) {
  const user = findUserById(id);
  if (!user) throw new Error('User record not found.');

  if (updates.status) user.status = updates.status;
  if (updates.role) user.role = updates.role;
  if (updates.clearanceLevel) user.clearanceLevel = updates.clearanceLevel;
  if (updates.department) user.department = updates.department;

  auditService.logEvent({
    action: 'USER_UPDATE',
    userId: updaterUser.id,
    entityType: 'USER',
    entityId: user.id,
    result: 'SUCCESS',
    details: `User account "${user.fullName}" updated. Status: ${user.status}, Role: ${user.role}`,
  });

  return user;
}
