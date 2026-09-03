import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/rbacMiddleware';
import { 
  getAllUsers, 
  findUserById, 
  createUserAccount, 
  updateUserAccount 
} from '../services/userService';

export function listUsersController(req: AuthenticatedRequest, res: Response) {
  try {
    const { search, role, status } = req.query;
    const users = getAllUsers({
      search: search as string,
      role: role as string,
      status: status as string,
    });

    const sanitizedUsers = users.map((u) => {
      const { passwordHash, ...safeUser } = u;
      return safeUser;
    });

    return res.json({
      success: true,
      count: sanitizedUsers.length,
      users: sanitizedUsers,
    });
  } catch (error) {
    console.error('listUsers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user directory.' });
  }
}

export function getUserDetailsController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const user = findUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const { passwordHash, ...safeUser } = user;

    return res.json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    console.error('getUserDetails error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve user details.' });
  }
}

export function createUserController(req: AuthenticatedRequest, res: Response) {
  try {
    const { employeeId, fullName, email, department, role, clearanceLevel, password } = req.body;

    if (!employeeId || !fullName || !email) {
      return res.status(400).json({ success: false, message: 'Employee ID, Full Name, and Email are required.' });
    }

    const newUser = createUserAccount(
      { employeeId, fullName, email, department, role, clearanceLevel, password },
      { id: req.user!.id, fullName: req.user!.fullName }
    );

    const { passwordHash, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: 'User account created successfully.',
      user: safeUser,
    });
  } catch (error: any) {
    console.error('createUser error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to create user account.' });
  }
}

export function updateUserController(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, role, clearanceLevel, department } = req.body;

    const updatedUser = updateUserAccount(
      id,
      { status, role, clearanceLevel, department },
      { id: req.user!.id, fullName: req.user!.fullName }
    );

    const { passwordHash, ...safeUser } = updatedUser;

    return res.json({
      success: true,
      message: 'User account updated successfully.',
      user: safeUser,
    });
  } catch (error: any) {
    console.error('updateUser error:', error);
    return res.status(400).json({ success: false, message: error.message || 'Failed to update user account.' });
  }
}
