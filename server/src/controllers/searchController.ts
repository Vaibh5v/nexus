import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/rbacMiddleware';
import { getAllCases } from '../services/caseService';
import { getAllDocuments } from '../services/documentService';
import { getAllUsers } from '../services/userService';

export function globalSearchController(req: AuthenticatedRequest, res: Response) {
  try {
    const q = (req.query.q as string || '').trim().toLowerCase();

    if (!q) {
      return res.json({
        success: true,
        query: '',
        results: { cases: [], documents: [], users: [] },
      });
    }

    const matchedCases = getAllCases({ search: q }).slice(0, 5);
    const matchedDocuments = getAllDocuments({ search: q }).slice(0, 5);
    const matchedUsers = getAllUsers({ search: q }).slice(0, 5).map((u) => {
      const { passwordHash, ...safe } = u;
      return safe;
    });

    return res.json({
      success: true,
      query: q,
      results: {
        cases: matchedCases,
        documents: matchedDocuments,
        users: matchedUsers,
      },
    });
  } catch (error) {
    console.error('globalSearch error:', error);
    return res.status(500).json({ success: false, message: 'Failed to perform global search.' });
  }
}
