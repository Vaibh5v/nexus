import { Request, Response } from 'express';
import { findSeedUser } from '../seedData';
import { verifyPassword } from '../security/passwordUtils';
import { createSessionToken, getSessionFromRequest, destroySession } from '../security/sessionManager';
import { auditService } from '../audit/AuditService';

const GENERIC_INVALID_CREDENTIALS_MSG = 'Invalid credentials. Please check your details and try again.';

export async function loginController(req: Request, res: Response) {
  try {
    const identifier = (req.body?.identifier || req.body?.email || '').toString().trim();
    const password = (req.body?.password || '').toString();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your official email or employee ID and password.',
      });
    }

    const user = findSeedUser(identifier);

    if (!user) {
      auditService.logEvent({
        action: 'LOGIN_FAILURE',
        entityType: 'USER',
        entityId: identifier,
        result: 'FAILURE',
        details: 'Invalid identifier',
        ipAddress: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: GENERIC_INVALID_CREDENTIALS_MSG,
      });
    }

    if (user.status !== 'ACTIVE') {
      auditService.logEvent({
        action: 'LOGIN_BLOCKED_STATUS',
        userId: user.id,
        entityType: 'USER',
        entityId: user.id,
        result: 'BLOCKED',
        details: `Account status is ${user.status}`,
        ipAddress: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: 'Account access restricted. Please contact system administrator.',
      });
    }

    const isValidPassword = verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      auditService.logEvent({
        action: 'LOGIN_FAILURE',
        userId: user.id,
        entityType: 'USER',
        entityId: user.id,
        result: 'FAILURE',
        details: 'Invalid password',
        ipAddress: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: GENERIC_INVALID_CREDENTIALS_MSG,
      });
    }

    // Issue HttpOnly Cookie Session
    const session = createSessionToken(
      {
        id: user.id,
        employeeId: user.employeeId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        clearanceLevel: user.clearanceLevel,
        permissions: user.permissions,
      },
      res
    );

    auditService.logEvent({
      action: 'LOGIN_SUCCESS',
      userId: user.id,
      entityType: 'USER',
      entityId: user.id,
      result: 'SUCCESS',
      details: `User logged in with role ${user.role}`,
      ipAddress: req.ip,
    });

    return res.json({
      success: true,
      message: 'Identity verified successfully',
      user: session.user,
    });
  } catch (error) {
    console.error('Login Error Exception:', error);
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred during authentication processing.',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export function getCurrentUser(req: Request, res: Response) {
  try {
    const session = getSessionFromRequest(req);

    if (!session) {
      return res.status(401).json({
        authenticated: false,
        message: 'Your session has expired. Please sign in again.',
      });
    }

    return res.json({
      authenticated: true,
      user: session.user,
    });
  } catch (error) {
    console.error('getCurrentUser Error Exception:', error);
    return res.status(500).json({
      authenticated: false,
      message: 'Failed to verify session.',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export function logoutController(req: Request, res: Response) {
  try {
    const session = getSessionFromRequest(req);
    if (session) {
      auditService.logEvent({
        action: 'LOGOUT',
        userId: session.user.id,
        entityType: 'USER',
        entityId: session.user.id,
        result: 'SUCCESS',
        details: 'User logged out',
        ipAddress: req.ip,
      });
    }

    destroySession(req, res);

    return res.json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    console.error('logoutController Error Exception:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to log out session cleanly.',
    });
  }
}
