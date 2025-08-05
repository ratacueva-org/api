# Documentación de la API RataCueva

## Introducción

Este documento proporciona una descripción general completa de la API de RataCueva, incluida su estructura, los endpoints disponibles, los roles de usuario y otros detalles relevantes.

## Descripción General de la API

La API de RataCueva es un robusto servicio de backend diseñado para impulsar una plataforma de comercio electrónico de hardware de computadora y videojuegos. Proporciona una amplia gama de funcionalidades, que incluyen autenticación de usuarios, gestión del catálogo de productos, carrito de compras, procesamiento de pedidos y mucho más.

## Tecnologías Utilizadas

*   **Node.js:** Un entorno de ejecución de JavaScript para construir aplicaciones de servidor rápidas y escalables.
*   **Express.js:** Un framework de aplicación web de Node.js minimalista y flexible que proporciona un conjunto robusto de características para aplicaciones web y móviles.
*   **TypeScript:** Un superconjunto tipado de JavaScript que se compila a JavaScript plano.
*   **MongoDB:** Una base de datos NoSQL orientada a documentos.
*   **Mongoose:** Una biblioteca de Modelado de Datos de Objetos (ODM) para MongoDB y Node.js.
*   **JSON Web Tokens (JWT):** Utilizados para crear tokens de acceso para la autenticación.
*   **Swagger:** Una herramienta para diseñar, construir, documentar y consumir APIs RESTful.

## Estructura del Proyecto

El proyecto está organizado en los siguientes directorios principales:

*   `config`: Contiene archivos de configuración, como la conexión a la base de datos.
*   `core`: Incluye los componentes centrales de la aplicación, como el manejo de errores, middlewares y otras utilidades esenciales.
*   `docs`: Contiene la documentación de la API generada con Swagger.
*   `modules`: Este es el directorio principal de la aplicación, donde cada módulo representa una característica específica de la API (por ejemplo, `auth`, `products`, `orders`, etc.).
*   `services`: Contiene servicios que se pueden compartir entre diferentes módulos, como el envío de correos electrónicos o la carga de archivos.

## Roles de Usuario

La API define tres roles de usuario con diferentes niveles de acceso y permisos:

*   `client`: Representa a un usuario regular de la aplicación, que puede navegar por los productos, agregarlos al carrito, realizar pedidos y administrar su propio perfil.
*   `employee`: Tiene todos los permisos de un cliente y también puede administrar productos, pedidos y otras tareas administrativas.
*   `admin`: Tiene acceso completo a todas las funcionalidades de la API, incluida la gestión de usuarios y otras tareas administrativas avanzadas.

## Middlewares

La API utiliza una serie de middlewares para manejar diferentes tareas, como:

*   `authenticate`: Verifica el JWT del usuario para proteger las rutas que requieren autenticación.
*   `authorize`: Comprueba si el usuario tiene el rol requerido para acceder a una ruta específica.
*   `validate`: Valida el cuerpo de la solicitud, los parámetros y las consultas con un esquema predefinido.
*   `upload`: Maneja la carga de archivos, como avatares de usuario o imágenes de productos.
*   `error`: Un manejador de errores centralizado que captura y procesa todos los errores que ocurren in la aplicación.

## Endpoints de la API

A continuación se muestra una lista detallada de todos los endpoints disponibles, organizados por módulo.

### Módulo de Autenticación (Auth)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| POST | /api/auth/register | Registra un nuevo usuario. | Público |
| POST | /api/auth/login | Autentifica a un usuario y devuelve un JWT. | Público |
| GET | /api/auth/verify | Verifica la dirección de correo electrónico de un usuario. | Público |
| POST | /api/auth/forgot-password | Envía un correo electrónico para restablecer la contraseña. | Público |
| POST | /api/auth/reset-password | Restablece la contraseña de un usuario. | Público |
| GET | /api/auth/reactivate | Reactiva la cuenta de un usuario. | Público |

### Módulo de Carrito (Cart)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| GET | /api/cart | Obtiene el carrito de compras del usuario. | client |
| POST | /api/cart | Agrega un artículo al carrito de compras. | client |
| PATCH | /api/cart/items/:itemId | Actualiza un artículo en el carrito de compras. | client |
| DELETE | /api/cart/items/:itemId | Elimina un artículo del carrito de compras. | client |
| DELETE | /api/cart/items | Vacía el carrito de compras. | client |
| POST | /api/cart/sync | Sincroniza el carrito de compras con los datos locales del cliente. | client |

### Módulo de Favoritos (Favorites)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| GET | /api/favorites | Obtiene los productos favoritos del usuario. | client |
| POST | /api/favorites/:productId | Agrega un producto a los favoritos del usuario. | client |
| DELETE | /api/favorites/:productId | Elimina un producto de los favoritos del usuario. | client |

### Módulo de Pedidos (Orders)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| POST | /api/orders | Crea un nuevo pedido. | client |
| GET | /api/orders | Obtiene una lista de pedidos. | client, employee, admin |
| GET | /api/orders/:orderId | Obtiene los detalles de un pedido específico. | client, employee, admin |
| PATCH | /api/orders/:orderId/cancel | Cancela un pedido. | client, employee, admin |
| PATCH | /api/orders/:orderId/status | Actualiza el estado de un pedido. | employee, admin |
| PATCH | /api/orders/:orderId/payment-status | Actualiza el estado de pago de un pedido. | employee, admin |

### Módulo de Ensamblaje de PC (PC Build)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| POST | /api/build-pc | Crea un nuevo ensamblaje de PC. | client |

### Módulo de Productos (Products)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| GET | /api/products | Obtiene una lista de todos los productos. | Público |
| GET | /api/products/:id | Obtiene los detalles de un producto específico. | Público |
| POST | /api/products | Crea un nuevo producto. | employee, admin |
| PUT | /api/products/:id | Actualiza un producto. | employee, admin |
| PATCH | /api/products/:id/stock | Actualiza el stock de un producto. | employee, admin |
| PATCH | /api/products/:id/discount | Actualiza el descuento de un producto. | employee, admin |
| PATCH | /api/products/:id/is-featured | Actualiza el estado de destacado de un producto. | employee, admin |
| PATCH | /api/products/:id/is-new | Actualiza el estado de nuevo de un producto. | employee, admin |
| DELETE | /api/products/:id | Elimina un producto. | employee, admin |

### Módulo de Reseñas (Reviews)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| GET | /api/reviews | Obtiene una lista de todas las reseñas. | Público |
| GET | /api/reviews/:id | Obtiene los detalles de una reseña específica. | Público |
| POST | /api/reviews | Crea una nueva reseña. | client |
| PUT | /api/reviews/:id | Actualiza una reseña. | client |
| DELETE | /api/reviews/:id | Elimina una reseña. | client, admin |

### Módulo de Envíos (Shipping)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| POST | /api/shipping | Crea un nuevo envío. | employee, admin |
| GET | /api/shipping | Obtiene una lista de todos los envíos. | employee, admin |
| GET | /api/shipping/:shipmentId | Obtiene los detalles de un envío específico. | client, employee, admin |
| PATCH | /api/shipping/:shipmentId/status | Actualiza el estado de un envío. | employee, admin |
| GET | /api/shipping/track/:trackingNumber | Rastrea un envío por su número de seguimiento. | client, employee, admin |

### Módulo de Usuarios (Users)

| Método | Endpoint | Descripción | Roles Permitidos |
| --- | --- | --- | --- |
| GET | /api/users/employees | Obtiene una lista de todos los empleados. | admin |
| GET | /api/users/me | Obtiene el perfil del usuario. | client, employee, admin |
| PATCH | /api/users/me | Actualiza el perfil del usuario. | client, employee, admin |
| PATCH | /api/users/change-password | Cambia la contraseña del usuario. | client, employee, admin |
| DELETE | /api/users/delete | Elimina la cuenta del usuario. | client, employee, admin |
| PUT | /api/users/upload-avatar | Sube el avatar de un usuario. | client, employee, admin |
| GET | /api/users/addresses | Obtiene las direcciones del usuario. | client, employee, admin |
| POST | /api/users/addresses | Agrega una nueva dirección. | client, employee, admin |
| PATCH | /api/users/addresses/:id | Actualiza una dirección. | client, employee, admin |
| DELETE | /api/users/addresses/:id | Elimina una dirección. | client, employee, admin |
| PATCH | /api/users/addresses/:id/set-default | Establece una dirección como predeterminada. | client, employee, admin |
| GET | /api/users/payment-methods | Obtiene los métodos de pago del usuario. | client, employee, admin |
| POST | /api/users/payment-methods | Agrega un nuevo método de pago. | client, employee, admin |
| PATCH | /api/users/payment-methods/:id | Actualiza un método de pago. | client, employee, admin |
| DELETE | /api/users/payment-methods/:id | Elimina un método de pago. | client, employee, admin |