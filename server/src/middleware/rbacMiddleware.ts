import { Request, Response, NextFunction } from 'express';
import { getSessionFromRequest, UserSessionData } from '../security/sessionManager';
import { auditService } from '../audit/AuditService';

export interface AuthenticatedRequest extends Request {
  user?: UserSessionData;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const session = getSessionFromRequest(req);

  if (!session) {
    auditService.logEvent({
      action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
      entityType: 'ENDPOINT',
      entityId: req.originalUrl,
      result: 'DENIED',
      details: 'Unauthenticated user attempted to access protected route',
      ipAddress: req.ip,
    });

    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in.',
      code: 'UNAUTHORIZED',
    });
  }

  req.user = session.user;
  next();
}

export function requirePermission(permissionCode: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const hasPerm = req.user.permissions.includes(permissionCode) || req.user.role === 'SUPER_ADMIN';

    if (!hasPerm) {
      auditService.logEvent({
        action: 'PERMISSION_DENIED',
        userId: req.user.id,
        entityType: 'PERMISSION',
        entityId: permissionCode,
        result: 'DENIED',
        details: `User role ${req.user.role} lacks permission ${permissionCode}`,
        ipAddress: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
        code: 'FORBIDDEN',
      });
    }

    next();
  };
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'SUPER_ADMIN') {
      auditService.logEvent({
        action: 'ROLE_ACCESS_DENIED',
        userId: req.user.id,
        entityType: 'ROLE',
        entityId: allowedRoles.join(','),
        result: 'DENIED',
        details: `User role ${req.user.role} not in allowed roles`,
        ipAddress: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied for your role level.',
        code: 'FORBIDDEN',
      });
    }

    next();
  };
}
