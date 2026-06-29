import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import credorRoutes from './routes/credor.routes';
import devedorRoutes from './routes/devedor.routes';
import tituloRoutes from './routes/titulo.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/credores', credorRoutes);
app.use('/api/devedores', devedorRoutes);
app.use('/api/titulos', tituloRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

export default app;
