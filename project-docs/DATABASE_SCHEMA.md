# Esquema de la Base de Datos - RataCueva API

## Introducción

Este documento detalla el esquema de la base de datos MongoDB utilizada por la RataCueva API. Cada sección corresponde a una colección en la base de datos y describe los campos, tipos de datos y relaciones de cada modelo.

---

## 1. Colección `users`

Almacena la información de los usuarios registrados en la plataforma.

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Sí | Identificador único del usuario. |
| `name` | `String` | Sí | Nombre(s) del usuario. |
| `lastName` | `String` | Sí | Apellido paterno del usuario. |
| `secondLastName` | `String` | Sí | Apellido materno del usuario. |
| `email` | `String` | Sí | Dirección de correo electrónico (única y en minúsculas). |
| `password` | `String` | Sí | Contraseña hasheada del usuario. |
| `role` | `String` | Sí | Rol del usuario (`client`, `employee`, `admin`). Por defecto: `client`. |
| `phone` | `String` | No | Número de teléfono del usuario. |
| `addresses` | `Array<Address>` | No | Lista de direcciones de envío del usuario. |
| `paymentMethods` | `Array<PaymentMethod>` | No | Lista de métodos de pago del usuario. |
| `avatarUrl` | `String` | No | URL de la imagen de perfil del usuario. |
| `favorites` | `Array<ObjectId>` | No | Lista de IDs de productos marcados como favoritos. Refiere a `products`. |
| `isVerified` | `Boolean` | Sí | Indica si el usuario ha verificado su correo. Por defecto: `false`. |
| `isDeleted` | `Boolean` | No | Indica si la cuenta del usuario está marcada como eliminada. Por defecto: `false`. |
| `verificationToken` | `String` | No | Token para la verificación de correo electrónico. |
| `verificationTokenExpires` | `Date` | No | Fecha de expiración del `verificationToken`. |
| `passwordResetToken` | `String` | No | Token para el reseteo de contraseña. |
| `passwordResetTokenExpires` | `Date` | No | Fecha de expiración del `passwordResetToken`. |
| `lastLoginAt` | `Date` | No | Fecha y hora del último inicio de sesión. |
| `createdAt` | `Date` | Sí | Fecha y hora de creación del documento. |
| `updatedAt` | `Date` | Sí | Fecha y hora de la última actualización del documento. |

### Subdocumento `Address`

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `postalCode` | `String` | Sí | Código Postal. |
| `street` | `String` | Sí | Calle. |
| `externalNumber` | `String` | No | Número exterior. |
| `internalNumber` | `String` | No | Número interior. |
| `neighborhood` | `String` | No | Colonia o barrio. |
| `city` | `String` | Sí | Ciudad o municipio. |
| `state` | `String` | Sí | Estado o provincia. |
| `country` | `String` | Sí | País. |
| `isDefault` | `Boolean` | No | Indica si es la dirección por defecto. |
| `fullAddress` | `String` | No | Dirección completa formateada. |
| `locality` | `String` | No | Localidad. |
| `deliveryInstructions` | `String` | No | Instrucciones adicionales de entrega. |
| `addreessType` | `String` | No | Tipo de dirección (`home`, `work`). |
| `recipientName` | `String` | No | Nombre del destinatario. |
| `recipientPhone` | `String` | No | Teléfono del destinatario. |

### Subdocumento `PaymentMethod`

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `type` | `String` | Sí | Tipo de método de pago (`credit_card`, `debit_card`, `paypal`, `oxxo_cash`). |
| `last4` | `String` | No | Últimos 4 dígitos de la tarjeta. |
| `provider` | `String` | No | Proveedor del servicio (ej. Visa, Mastercard). |
| `expiration` | `String` | No | Fecha de expiración en formato `MM/YY`. |

---

## 2. Colección `products`

Contiene todos los productos disponibles en la tienda.

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Sí | Identificador único del producto. |
| `name` | `String` | Sí | Nombre del producto. |
| `description` | `String` | Sí | Descripción detallada del producto. |
| `price` | `Number` | Sí | Precio del producto. |
| `stock` | `Number` | Sí | Cantidad de unidades disponibles en inventario. |
| `brand` | `String` | No | Marca del producto. |
| `images` | `Array<String>` | Sí | Lista de URLs de las imágenes del producto. |
| `videos` | `Array<String>` | No | Lista de URLs de los videos del producto. |
| `section` | `String` | Sí | Sección principal a la que pertenece el producto (ej. `Components`). |
| `category` | `String` | Sí | Categoría del producto dentro de la sección (ej. `Graphics Cards`). |
| `subcategory` | `String` | No | Subcategoría del producto (ej. `High-end GPUs`). |
| `specs` | `Object` | No | Objeto con especificaciones técnicas clave-valor. |
| `discountPercentage` | `Number` | No | Porcentaje de descuento aplicado al producto. |
| `rating` | `Number` | No | Calificación promedio del producto (basada en reseñas). |
| `reviewCount` | `Number` | No | Cantidad de reseñas que ha recibido el producto. |
| `isFeatured` | `Boolean` | No | Indica si el producto es destacado. Por defecto: `false`. |
| `isNewProduct` | `Boolean` | No | Indica si el producto es nuevo. Por defecto: `false`. |
| `createdAt` | `Date` | Sí | Fecha y hora de creación del documento. |
| `updatedAt` | `Date` | Sí | Fecha y hora de la última actualización del documento. |

---

## 3. Colección `carts`

Almacena los carritos de compra de los usuarios.

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Sí | Identificador único del carrito. |
| `userId` | `ObjectId` | Sí | ID del usuario al que pertenece el carrito. Refiere a `users`. |
| `items` | `Array<CartItem>` | No | Lista de artículos en el carrito. |
| `createdAt` | `Date` | Sí | Fecha y hora de creación del documento. |
| `updatedAt` | `Date` | Sí | Fecha y hora de la última actualización del documento. |

### Subdocumento `CartItem`

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Sí | Identificador único del item dentro del carrito. |
| `productId` | `ObjectId` | Sí | ID del producto agregado. Refiere a `products`. |
| `quantity` | `Number` | Sí | Cantidad del producto. |
| `priceAtAddition` | `Number` | Sí | Precio del producto al momento de ser agregado. |
| `selectedVariation` | `String` | No | Variación seleccionada del producto (ej. color, tamaño). |

---

## 4. Colección `orders`

Guarda el historial de todos los pedidos realizados.

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Sí | Identificador único del pedido. |
| `userId` | `ObjectId` | Sí | ID del usuario que realizó el pedido. Refiere a `users`. |
| `items` | `Array<OrderItem>` | Sí | Lista de productos incluidos en el pedido. |
| `subtotal` | `Number` | Sí | Suma de los precios de los productos. |
| `shippingCost` | `Number` | Sí | Costo del envío. |
| `taxAmount` | `Number` | Sí | Monto de impuestos. |
| `discountAmount` | `Number` | No | Monto del descuento aplicado. |
| `totalAmount` | `Number` | Sí | Monto total del pedido. |
| `currency` | `String` | Sí | Moneda del pedido (ej. `MXN`). |
| `orderStatus` | `String` | Sí | Estado general del pedido (ej. `pending`, `shipped`, `delivered`). |
| `paymentStatus` | `String` | Sí | Estado del pago (ej. `pending`, `paid`, `failed`). |
| `shippingStatus` | `String` | Sí | Estado del envío (ej. `pending`, `shipped`, `delivered`). |
| `shippingAddress` | `Address` | Sí | Dirección de envío (copia de la dirección al momento de la compra). |
| `billingAddress` | `Address` | No | Dirección de facturación. |
| `paymentDetails` | `OrderPaymentDetails` | Sí | Detalles no sensibles del pago. |
| `trackingNumber` | `String` | No | Número de seguimiento del envío. |
| `shippingProvider` | `String` | No | Proveedor de logística (ej. `FedEx`). |
| `estimatedDeliveryDate` | `Date` | No | Fecha estimada de entrega. |
| `shippedAt` | `Date` | No | Fecha en que se realizó el envío. |
| `deliveredAt` | `Date` | No | Fecha en que se entregó el pedido. |
| `notes` | `String` | No | Notas internas sobre el pedido. |
| `createdAt` | `Date` | Sí | Fecha y hora de creación del documento. |
| `updatedAt` | `Date` | Sí | Fecha y hora de la última actualización del documento. |

### Subdocumentos `OrderItem` y `OrderPaymentDetails`

*   **OrderItem:** Es una copia de los detalles del producto al momento de la compra para mantener la integridad histórica del pedido.
*   **OrderPaymentDetails:** Almacena información de referencia del pago, como el ID de la transacción, pero nunca datos sensibles.

---

## 5. Colección `reviews`

Contiene las reseñas y calificaciones que los usuarios han hecho sobre los productos.

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Sí | Identificador único de la reseña. |
| `user` | `ObjectId` | Sí | ID del usuario que escribió la reseña. Refiere a `users`. |
| `userName` | `String` | Sí | Nombre del usuario al momento de la reseña. |
| `product` | `ObjectId` | Sí | ID del producto reseñado. Refiere a `products`. |
| `text` | `String` | No | Contenido de la reseña. |
| `images` | `Array<String>` | No | URLs de imágenes subidas con la reseña. |
| `videos` | `Array<String>` | No | URLs de videos subidos con la reseña. |
| `rating` | `Number` | Sí | Calificación dada (de 0.5 a 5.0). |
| `createdAt` | `Date` | Sí | Fecha y hora de creación del documento. |
| `updatedAt` | `Date` | Sí | Fecha y hora de la última actualización del documento. |

---

## 6. Colección `shipments`

Almacena la información de logística y seguimiento para cada envío asociado a un pedido.

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `_id` | `ObjectId` | Sí | Identificador único del envío. |
| `orderId` | `ObjectId` | Sí | ID del pedido asociado. Refiere a `orders`. |
| `trackingNumber` | `String` | Sí | Número de seguimiento proporcionado por el transportista. |
| `shippingProvider` | `String` | Sí | Nombre del transportista (ej. `FedEx`, `DHL`). |
| `currentStatus` | `String` | Sí | Estado actual del envío (ej. `in_transit`, `delivered`). |
| `shippingAddress` | `Address` | Sí | Dirección de envío. |
| `items` | `Array` | Sí | Lista de productos en el envío. |
| `estimatedDeliveryDate` | `Date` | No | Fecha estimada de entrega. |
| `trackingEvents` | `Array<TrackingEvent>` | No | Historial de eventos de seguimiento. |
| `createdAt` | `Date` | Sí | Fecha y hora de creación del documento. |
| `updatedAt` | `Date` | Sí | Fecha y hora de la última actualización del documento. |

### Subdocumento `TrackingEvent`

| Campo | Tipo de Dato | Requerido | Descripción |
| --- | --- | --- | --- |
| `status` | `String` | Sí | Estado del evento (ej. `picked_up`, `in_transit`). |
| `timestamp` | `Date` | Sí | Fecha y hora del evento. |
| `location` | `String` | No | Ubicación donde ocurrió el evento. |
| `notes` | `String` | No | Notas adicionales sobre el evento. |

---

## 7. Colección `pcbuilds` (Nota)

El archivo `build-pc.model.ts` parece definir interfaces (`BuildPcProduct`, `AddBuildPcInput`) para la entrada de datos de la API, pero no define un esquema de Mongoose (`Schema`) ni un modelo (`mongoose.model`). Esto significa que, actualmente, **no existe una colección `pcbuilds` en la base de datos**. Los datos de ensamblajes de PC se procesan en la lógica de la API pero no se persisten en una colección dedicada.
