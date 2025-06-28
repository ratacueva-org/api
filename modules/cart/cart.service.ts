import Cart from "./cart.model";
import Product from "../products/product.model";
import mongoose from "mongoose";
import { NotFoundError, BadRequestError } from "../../core/errors/custom-errors";

export const getCartByUser = async (userId: string) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");
  if (!cart || cart.items.length === 0) {
    throw new NotFoundError("No hay artículos en tu carrito.");
  }
  return cart;
};

export const addToCart = async (
  userId: string,
  productId: string,
  quantity: number,
  selectedVariation?: string
) => {

  const product = await Product.findById(productId);
  if (!product) throw new NotFoundError("Producto no disponible.");

  if (product.stock < quantity) {
    throw new BadRequestError(`No hay suficiente stock disponible. Solo quedan ${product.stock} unidades.`);
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.productId.toString() === productId &&
      item.selectedVariation === selectedVariation
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new BadRequestError(`No puedes añadir más. Solo quedan ${product.stock} unidades de este producto.`);
    }
    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      productId: new mongoose.Types.ObjectId(productId),
      quantity,
      priceAtAddition: product.price,
      selectedVariation,
    });
  }

  await cart.save();
  return cart;
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  data: { quantity?: number; selectedVariation?: string }
) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new NotFoundError("Carrito no encontrado");

  const itemIndex = cart.items.findIndex(i => i._id?.toString() === itemId);
  if (itemIndex === -1) throw new NotFoundError("Producto no encontrado en el carrito");

  const item = cart.items[itemIndex];

  if (data.quantity !== undefined) {
    if (data.quantity < 1) throw new BadRequestError("La cantidad debe ser al menos 1.");

    const product = await Product.findById(item.productId);
    if (!product) { // Si el producto original ya no existe
        cart.items.splice(itemIndex, 1); // Remover el ítem del carrito
        await cart.save();
        throw new NotFoundError("Producto asociado al ítem ya no disponible. Ítem eliminado del carrito.");
    }
    if (product.stock < data.quantity) {
      throw new BadRequestError(`No hay suficiente stock disponible. Solo quedan ${product.stock} unidades.`);
    }
    item.quantity = data.quantity;
  }

  if (data.selectedVariation !== undefined)
    item.selectedVariation = data.selectedVariation;

  await cart.save();
  return cart;
};

export const removeFromCart = async (userId: string, itemId: string) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new NotFoundError("Carrito no encontrado");

  // Filtrar por el _id del subdocumento del ítem en el carrito
  cart.items = cart.items.filter((item) => item._id?.toString() !== itemId);

  await cart.save();
};

export const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return;
  cart.items = [];
  await cart.save();
};

export const syncCart = async (userId: string, localItems: any[]) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  for (const localItem of localItems) {
    // Validar y asegurar que localItem.productId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(localItem.productId)) {
        console.warn(`[SyncCart] ID de producto inválido ${localItem.productId}. Omitiendo ítem.`);
        continue;
    }

    const product = await Product.findById(localItem.productId);
    if (!product) {
      console.warn(`[SyncCart] Producto ${localItem.productId} no encontrado. Omitiendo ítem.`);
      continue;
    }

    // Asegurarse de que la cantidad no exceda el stock disponible
    let quantityToAdd = localItem.quantity;
    if (product.stock < quantityToAdd) {
        quantityToAdd = product.stock; // Ajustar a la cantidad máxima disponible
        console.warn(`[SyncCart] Stock insuficiente para ${product.name}. Cantidad ajustada a ${quantityToAdd}.`);
    }
    if (quantityToAdd <= 0) continue; // Si después del ajuste la cantidad es 0 o menos, omitir

    const existing = cart.items.find(
      (item) =>
        item.productId.toString() === localItem.productId &&
        item.selectedVariation === localItem.selectedVariation
    );

    if (existing) {
      const newQuantity = existing.quantity + quantityToAdd;
      if (product.stock < newQuantity) {
          existing.quantity = product.stock;
      } else {
          existing.quantity = newQuantity;
      }
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(localItem.productId),
        quantity: quantityToAdd,
        selectedVariation: localItem.selectedVariation,
        priceAtAddition: product.price, // ¡SIEMPRE OBTENER EL PRECIO DEL BACKEND!
      });
    }
  }
  await cart.save();
  return cart;
};