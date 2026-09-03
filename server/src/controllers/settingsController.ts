import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/rbacMiddleware';
import { auditService } from '../audit/AuditService';

let systemSettings = {
  agencyName: 'Ministry of Home Affairs — Digital Records & Investigation Division',
  maxUploadSizeMB: 25,
  sessionTimeoutMinutes: 30,
  passwordExpiryDays: 90,
  mfaEnforced: true,
  storageProvider: 'Local Filesystem Storage (/server/uploads)',
  autoSha256Verification: 'ENABLED',
  rateLimitingThreshold: '100 requests / min',
};

export function getSettingsController(req: AuthenticatedRequest, res: Response) {
  return res.json({
    success: true,
    settings: systemSettings,
  });
}

export function updateSettingsController(req: AuthenticatedRequest, res: Response) {
  try {
    const updates = req.body;
    Object.assign(systemSettings, updates);

    auditService.logEvent({
      action: 'SYSTEM_CONFIGURE',
      userId: req.user?.id,
      entityType: 'SETTINGS',
      entityId: 'GLOBAL_CONFIG',
      result: 'SUCCESS',
      details: 'System security settings updated',
    });

    return res.json({
      success: true,
      message: 'System settings updated successfully.',
      settings: systemSettings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update system settings.' });
  }
}
