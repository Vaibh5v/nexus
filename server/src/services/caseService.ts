import { initialCases, CaseRecord } from '../seedCases';
import { auditService } from '../audit/AuditService';

let casesStore: CaseRecord[] = [...initialCases];

export function getAllCases(filters?: { status?: string; priority?: string; caseType?: string; search?: string }) {
  let result = [...casesStore];

  if (filters?.status && filters.status !== 'ALL') {
    result = result.filter((c) => c.status === filters.status);
  }

  if (filters?.priority && filters.priority !== 'ALL') {
    result = result.filter((c) => c.priority === filters.priority);
  }

  if (filters?.caseType && filters.caseType !== 'ALL') {
    result = result.filter((c) => c.caseType === filters.caseType);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
    );
  }

  return result;
}

export function findCaseById(id: string): CaseRecord | null {
  return casesStore.find((c) => c.id === id || c.caseNumber === id) || null;
}

export function createCaseRecord(data: Partial<CaseRecord>, user: { id: string; fullName: string; employeeId: string }) {
  const count = casesStore.length + 101;
  const caseNumber = `CASE-2026-${String(count).padStart(5, '0')}`;
  
  const newCase: CaseRecord = {
    id: `case_${Date.now()}`,
    caseNumber,
    title: data.title || 'Untitled Investigation Case',
    description: data.description || '',
    caseType: data.caseType || 'FIR',
    status: data.status || 'ACTIVE',
    priority: data.priority || 'MEDIUM',
    department: data.department || 'Digital Records & Investigation Division',
    assignedOfficer: {
      id: user.id,
      fullName: user.fullName,
      employeeId: user.employeeId,
    },
    confidentiality: data.confidentiality || 'CONFIDENTIAL',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [
      {
        id: `tl_${Date.now()}`,
        title: 'Case Registered & Assigned',
        description: `New case initiated by ${user.fullName} (${user.employeeId}).`,
        timestamp: new Date().toISOString(),
        actor: `${user.fullName} (${user.employeeId})`,
      },
    ],
    tasks: [],
  };

  casesStore.unshift(newCase);

  auditService.logEvent({
    action: 'CASE_CREATE',
    userId: user.id,
    entityType: 'CASE',
    entityId: newCase.caseNumber,
    result: 'SUCCESS',
    details: `Case "${newCase.title}" created with status ${newCase.status}`,
  });

  return newCase;
}

export function updateCaseRecord(id: string, updates: Partial<CaseRecord>, user: { id: string; fullName: string; employeeId: string }) {
  const caseRecord = findCaseById(id);
  if (!caseRecord) return null;

  const prevStatus = caseRecord.status;
  Object.assign(caseRecord, updates, { updatedAt: new Date().toISOString() });

  if (updates.status && updates.status !== prevStatus) {
    caseRecord.timeline.unshift({
      id: `tl_${Date.now()}`,
      title: `Status Changed to ${updates.status}`,
      description: `Case status updated from ${prevStatus} to ${updates.status}.`,
      timestamp: new Date().toISOString(),
      actor: `${user.fullName} (${user.employeeId})`,
    });
  }

  auditService.logEvent({
    action: 'CASE_UPDATE',
    userId: user.id,
    entityType: 'CASE',
    entityId: caseRecord.caseNumber,
    result: 'SUCCESS',
    details: `Case updated. Status: ${caseRecord.status}`,
  });

  return caseRecord;
}
