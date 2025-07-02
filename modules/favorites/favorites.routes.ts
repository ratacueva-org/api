import { Router } from "express";
import * as favoritesController from "./favorites.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";

const router = Router();

// Todas las rutas están protegidas
router.use(authenticate);

// Obtener productos favoritos del usuario actual
router.get("/", favoritesController.getFavorites);

// Agregar un producto a favoritos
router.post("/:productId", favoritesController.addFavorite);

// Quitar un producto de favoritos
router.delete("/:productId", favoritesController.removeFavorite);

export default router;
