import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/rbacMiddleware';
import { getAllCases, findCaseById, createCaseRecord, updateCaseRecord } from '../services/caseService';

export function listCasesController(req: AuthenticatedRequest, res: Response) {
  try {
    const { status, priority, caseType, search } = req.query;

    const cases = getAllCases({
      status: status as string,
      priority: priority as string,
      caseType: caseType as string,
      search: search as string,
    });

    return res.json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    console.error('listCases error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve cases.' });
  }
}

export function getCaseDetailsController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const caseRecord = findCaseById(id);

    if (!caseRecord) {
      return res.status(404).json({ success: false, message: 'Case record not found.' });
    }

    return res.json({
      success: true,
      case: caseRecord,
    });
  } catch (error) {
    console.error('getCaseDetails error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve case details.' });
  }
}

export function createCaseController(req: AuthenticatedRequest, res: Response) {
  try {
    const { title, description, caseType, priority, department, confidentiality } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Case Title is required.' });
    }

    const newCase = createCaseRecord(
      { title, description, caseType, priority, department, confidentiality },
      {
        id: req.user!.id,
        fullName: req.user!.fullName,
        employeeId: req.user!.employeeId,
      }
    );

    return res.status(201).json({
      success: true,
      message: 'Case record created successfully.',
      case: newCase,
    });
  } catch (error) {
    console.error('createCase error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create case.' });
  }
}

export function updateCaseController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCase = updateCaseRecord(id, updates, {
      id: req.user!.id,
      fullName: req.user!.fullName,
      employeeId: req.user!.employeeId,
    });

    if (!updatedCase) {
      return res.status(404).json({ success: false, message: 'Case record not found.' });
    }

    return res.json({
      success: true,
      message: 'Case record updated successfully.',
      case: updatedCase,
    });
  } catch (error) {
    console.error('updateCase error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update case.' });
  }
}
