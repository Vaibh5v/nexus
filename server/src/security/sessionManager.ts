import crypto from 'crypto';
import { Response, Request } from 'express';

export interface UserSessionData {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  clearanceLevel: string;
  permissions: string[];
}

export interface ActiveSession {
  sessionId: string;
  user: UserSessionData;
  expiresAt: number;
}

const activeSessions = new Map<string, ActiveSession>();
export const SESSION_COOKIE_NAME = 'police_dms_session';
const SESSION_TIMEOUT_MS = (parseInt(process.env.SESSION_TIMEOUT_MINUTES || '30')) * 60 * 1000;

export function createSessionToken(user: UserSessionData, res: Response): ActiveSession {
  const sessionId = 'sid_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TIMEOUT_MS;

  const session: ActiveSession = {
    sessionId,
    user,
    expiresAt,
  };

  activeSessions.set(sessionId, session);

  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TIMEOUT_MS,
    path: '/',
  });

  return session;
}

export function getSessionFromRequest(req: Request): ActiveSession | null {
  const sessionId = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : null;
  if (!sessionId) return null;

  const session = activeSessions.get(sessionId);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(sessionId);
    return null;
  }

  // Sliding session extension
  session.expiresAt = Date.now() + SESSION_TIMEOUT_MS;
  return session;
}

export function destroySession(req: Request, res: Response): void {
  const sessionId = req.cookies ? req.cookies[SESSION_COOKIE_NAME] : null;
  if (sessionId) {
    activeSessions.delete(sessionId);
  }

  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    path: '/',
  });
}
