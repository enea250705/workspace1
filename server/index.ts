import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware per consentire richieste dal frontend
app.use(function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  // In produzione, consenti richieste solo dal dominio Vercel
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || 'https://your-vercel-app.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:5000'];
    
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servi i file statici dalla directory dist/public
app.use(express.static(path.join(__dirname, 'public')));

// Gestisci tutte le altre richieste inviando index.html
app.get('*', function handleClientRoutes(req: Request, res: Response, next: NextFunction) {
  // Ignora le richieste API
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

(async () => {
  // Configura il middleware di Vite in modalità di sviluppo
  if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(5000); // Crea un server temporaneo per setupVite
    await setupVite(app, server);
  } else {
    // In produzione, serviamo i file statici
    serveStatic(app);
  }

  // Registra le routes dell'API
  registerRoutes(app);

  // Gestisci gli errori
  app.use(function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  // Configura il server HTTP
  const server = app.listen({
    port: process.env.PORT ? parseInt(process.env.PORT) : 5000,
    host: "0.0.0.0",
  }, () => {
    log(`serving on port ${process.env.PORT || 5000}`);
  });
})();
