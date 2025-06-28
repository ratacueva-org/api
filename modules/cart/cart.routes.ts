import { Router } from "express";
import * as cartController from "./cart.controller";
import { authenticate } from "../../core/middlewares/auth.middleware";
import { validate } from "../../core/middlewares/validate.middleware";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema";

const router = Router();

// Todas las rutas protegidas por autenticación
router.use(authenticate);

// Obtener carrito
router.get("/", cartController.getCart);

// Agregar producto
router.post("/", validate(addToCartSchema), cartController.addItem);

// Se usa '/items' como subrecurso para operaciones sobre la colección de ítems

// Actualizar ítem -  - Actualizar cantidad/variación de un ítem ESPECÍFICO en el carrito (requiere el _id del ítem del carrito, NO el productId)
router.patch("/items/:itemId", validate(updateCartItemSchema), cartController.updateItem);

// Eliminar ítem
router.delete("/items/:itemId", cartController.removeItem);

// Vaciar carrito
router.delete("/items", cartController.clearCart);

// Sincronizar carrito con el cliente - Al haber creado un carrito sin haber estado autenticado, se debe sincronizar el carrito con el backend al autenticarse
router.post("/sync", cartController.syncCart);

export default router;