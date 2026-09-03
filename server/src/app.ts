import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import caseRoutes from './routes/caseRoutes';
import documentRoutes from './routes/documentRoutes';
import approvalRoutes from './routes/approvalRoutes';
import userRoutes from './routes/userRoutes';
import { requireAuth, requirePermission } from './middleware/rbacMiddleware';
import { globalSearchController } from './controllers/searchController';
import { getSettingsController, updateSettingsController } from './controllers/settingsController';
import { auditService } from './audit/AuditService';

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/users', userRoutes);

// Global Search Route
app.get('/api/search', requireAuth, globalSearchController);

// System Settings Routes
app.get('/api/settings', requireAuth, getSettingsController);
app.patch('/api/settings', requireAuth, requirePermission('SYSTEM_CONFIGURE'), updateSettingsController);

// Audit Logs Endpoint
app.get('/api/audit-logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    logs: auditService.getLogs(),
  });
});

// Base Health Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    system: 'Police & Legal Secure Digital Document Management System (DMS)',
    version: '1.0.0-ProductionBuild',
    timestamp: new Date().toISOString(),
  });
});

// Root welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({
    system: 'Secure Digital Document Management System API',
    health: '/api/health',
  });
});

export default app;
