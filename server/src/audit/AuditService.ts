import crypto from 'crypto';

export interface AuditEventParams {
  action: string;
  userId?: string;
  entityType: string;
  entityId: string;
  result?: 'SUCCESS' | 'FAILURE' | 'DENIED' | 'BLOCKED';
  details?: string;
  ipAddress?: string;
}

export class AuditService {
  private memoryLogs: any[] = [];

  public logEvent(params: AuditEventParams) {
    const record = {
      id: `aud_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      eventId: `EVT-${Date.now()}`,
      action: params.action,
      userId: params.userId || 'ANONYMOUS',
      entityType: params.entityType,
      entityId: params.entityId,
      result: params.result || 'SUCCESS',
      details: params.details || '',
      ipAddress: params.ipAddress || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };

    this.memoryLogs.push(record);
    console.log(`[AUDIT ENGINE] [${record.action}] User: ${record.userId} | Entity: ${record.entityType}:${record.entityId} | Result: ${record.result}`);

    if (this.memoryLogs.length > 1000) {
      this.memoryLogs.shift();
    }

    return record;
  }

  public getLogs() {
    return [...this.memoryLogs].reverse();
  }
}

export const auditService = new AuditService();
