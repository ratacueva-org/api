# Manual de Usuario - RataCueva API

## 1. Introducción

Bienvenido a la guía de usuario de la RataCueva API. Este documento está diseñado para desarrolladores que construirán aplicaciones cliente (como una aplicación web o móvil) utilizando esta API.

Aquí encontrarás una explicación de los conceptos clave, los flujos de trabajo más comunes y cómo interactuar con los diferentes endpoints para aprovechar al máximo la plataforma.

---

## 2. Conceptos Clave

### 2.1. Autenticación y JWT

La mayoría de los endpoints de la API requieren que el usuario esté autenticado. Nuestro sistema de autenticación se basa en **JSON Web Tokens (JWT)**.

El flujo es el siguiente:

1.  Un usuario se registra y verifica su correo, o inicia sesión con sus credenciales.
2.  La API devuelve un `token` JWT.
3.  Para todas las solicitudes posteriores a endpoints protegidos, el cliente debe incluir este token en el encabezado `Authorization` con el prefijo `Bearer`.

**Ejemplo de encabezado:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Si el token no se proporciona, es inválido o ha expirado, la API responderá con un error `401 Unauthorized`.

### 2.2. Roles de Usuario

La API gestiona tres tipos de roles, cada uno con diferentes niveles de permiso:

*   **`client`**: El rol estándar para los clientes de la tienda. Pueden comprar, escribir reseñas, gestionar su perfil, etc.
*   **`employee`**: Un rol con permisos elevados para gestionar el inventario de productos, los pedidos de los clientes y otras tareas administrativas.
*   **`admin`**: El rol con los máximos privilegios, capaz de gestionar usuarios, roles y todas las demás facetas de la API.

El acceso a ciertos endpoints (especialmente los de creación, actualización o eliminación de recursos como productos y pedidos) está restringido por rol.

### 2.3. Manejo de Errores

La API utiliza códigos de estado HTTP estándar para comunicar el resultado de una solicitud. Las respuestas de error suelen seguir una estructura predecible:

```json
{
  "error": "Nombre del Error",
  "message": "Descripción legible del error."
}
```

**Códigos de estado comunes:**

*   `200 OK`: La solicitud fue exitosa.
*   `201 Created`: El recurso fue creado exitosamente.
*   `400 Bad Request`: La solicitud es inválida (ej. faltan campos, los datos no pasan la validación).
*   `401 Unauthorized`: No se proporcionó un token de autenticación válido.
*   `403 Forbidden`: El usuario está autenticado pero no tiene los permisos (rol) necesarios para acceder al recurso.
*   `404 Not Found`: El recurso solicitado no existe.
*   `409 Conflict`: La solicitud no se pudo procesar debido a un conflicto (ej. un recurso que se intenta crear ya existe).
*   `500 Internal Server Error`: Ocurrió un error inesperado en el servidor.

---

## 3. Flujos de Usuario Comunes

### 3.1. Registro y Primer Inicio de Sesión

1.  **Registro:** El usuario envía sus datos al endpoint `POST /api/auth/register`.
2.  **Verificación:** La API envía un correo electrónico de verificación. El usuario debe hacer clic en el enlace, que a su vez llama al endpoint `GET /api/auth/verify` con un token único.
3.  **Inicio de Sesión:** Una vez verificado, el usuario puede iniciar sesión enviando su email y contraseña a `POST /api/auth/login`.
4.  **Obtención del JWT:** La respuesta exitosa de login incluirá el `token` JWT, que el cliente debe almacenar de forma segura para futuras solicitudes.

### 3.2. Explorar y Comprar Productos

1.  **Listar Productos:** Para mostrar el catálogo, se utiliza `GET /api/products`. Este endpoint es público y ofrece múltiples parámetros de consulta para filtrar (por `category`, `brand`, `price`), ordenar (`sortBy`) y paginar (`page`, `limit`).
2.  **Ver Detalles:** Para ver la información completa de un solo producto, se usa `GET /api/products/:id`.
3.  **Añadir al Carrito:** Un usuario autenticado (rol `client`) puede añadir productos a su carrito con `POST /api/cart`, especificando el `productId` y la `quantity`.
4.  **Ver y Modificar Carrito:** El contenido del carrito se puede ver con `GET /api/cart` y modificar con los endpoints `PATCH /api/cart/items/:itemId` y `DELETE /api/cart/items/:itemId`.

### 3.3. Proceso de Compra (Checkout)

1.  **Crear Pedido:** Una vez que el usuario está listo para comprar, el cliente debe recopilar la información del carrito, la dirección de envío y los detalles de pago, y enviarlos al endpoint `POST /api/orders`.
2.  **Confirmación:** Si el pedido se crea con éxito, la API devolverá el objeto completo del pedido con el estado `pending` o `processing`, dependiendo del resultado del pago.

### 3.4. Seguimiento de Pedidos y Envíos

1.  **Ver Mis Pedidos:** Un cliente puede ver su historial de pedidos con `GET /api/orders`.
2.  **Detalles del Pedido:** Para ver los detalles completos, incluido el estado actual, se usa `GET /api/orders/:orderId`.
3.  **Rastrear Envío:** Cuando un pedido es enviado, el objeto del pedido incluirá un `trackingNumber`. Este número se puede usar con el endpoint `GET /api/shipping/track/:trackingNumber` para obtener el historial de seguimiento detallado.

### 3.5. Gestión del Perfil

Un usuario autenticado puede gestionar toda su información personal a través de los siguientes endpoints:

*   **Datos Personales:** `GET /api/users/me` para obtener el perfil y `PATCH /api/users/me` para actualizarlo.
*   **Direcciones:** `GET /api/users/addresses` para listar, `POST /api/users/addresses` para añadir, y `PATCH`/`DELETE` en `/api/users/addresses/:id` para modificar o eliminar.
*   **Métodos de Pago:** Gestión similar a las direcciones, pero a través de los endpoints `/api/users/payment-methods`.
*   **Contraseña:** Se puede cambiar la contraseña con `PATCH /api/users/change-password`.

---

## 4. Guía Rápida de Endpoints por Rol

| Módulo | Acciones Principales | Rol Principal | Notas |
| --- | --- | --- | --- |
| **Auth** | Registro, Login, Verificación | `Público` | Abierto para todos los usuarios. |
| **Products** | Listar, Ver detalles | `Público` | La creación y modificación está restringida. |
| **Cart** | Añadir, modificar, ver carrito | `client` | Cada cliente gestiona su propio carrito. |
| **Favorites** | Añadir, quitar, ver favoritos | `client` | Cada cliente gestiona sus propios favoritos. |
| **Orders** | Crear, ver historial propio | `client` | La gestión de todos los pedidos es para `employee`/`admin`. |
| **Reviews** | Crear, modificar, eliminar reseña propia | `client` | Los `admin` también pueden eliminar reseñas. |
| **Users** | Gestionar perfil propio | `client` | La gestión de otros usuarios es para `admin`. |
| **Shipping** | Rastrear envío | `client` | La creación y gestión de envíos es para `employee`/`admin`. |
