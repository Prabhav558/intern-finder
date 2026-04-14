import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { config } from './config/index.js';
import authRoutes from './routes/auth.routes.js';
import studentRoutes from './routes/student.routes.js';
import opportunityRoutes from './routes/opportunity.routes.js';

// Initialize Express app
const app = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: config.NEXT_PUBLIC_APP_URL,
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: config.NEXT_PUBLIC_APP_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/opportunities', opportunityRoutes);

app.use('/api/admin', (req, res) => {
  res.json({ message: 'Admin routes coming soon' });
});

app.use('/api/applications', (req, res) => {
  res.json({ message: 'Application routes coming soon' });
});

app.use('/api/notifications', (_req, res) => {
  res.json({ message: 'Notification routes coming soon' });
});

// Socket.io event handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    code: err.code || 'INTERNAL_ERROR',
  });
});

// Start server
const PORT = config.PORT;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log(`📝 Environment: ${config.NODE_ENV}`);
});

export { app, io };
