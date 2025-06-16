import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Express } from "express";

const allowedOrigins = [
  "http://localhost:3000",           // Frontend local
  "https://app.ratacueva.com",       // Froducción
  "https://admin.ratacueva.com"      // Panel de admin
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No autorizado por CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP cada 15 minutos
  message: {
    message: "Demasiadas peticiones desde esta IP. Intenta más tarde.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 
// Aplica seguridad global a la app
export const applySecurityMiddleware = (app: Express) => {
  app.use(helmet());                // Protección de cabeceras
  app.use(cors(corsOptions));      // Protección de origen
  app.use(globalRateLimiter);      // Protección general por IP
};
