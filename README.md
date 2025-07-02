# RataCueva API

Este es el repositorio del backend para RataCueva, un ecommerce gamer especializado en la venta de videojuegos, componentes de PC, PCs armadas y otros productos relacionados.

Esta API se encarga de gestionar los productos, usuarios, órdenes y la lógica de negocio de la plataforma.

## Tecnologías utilizadas

  * **Runtime:** [Node.js](https://nodejs.org/)
  * **Framework:** [Express.js](https://expressjs.com/)
  * **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
  * **Base de Datos:** [MongoDB](https://www.mongodb.com/) con [Mongoose](https://mongoosejs.com/) como ODM.
  * **Manejo de Imágenes:** [Cloudinary](https://cloudinary.com/)
  * **Autenticación:** JWT (JSON Web Tokens)
  * **Validaciones:** Zod

-----

## Instalación

1.  Clona este repositorio:

    ```bash
    git clone https://github.com/tu-usuario/ratacueva-api
    ```

2.  Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

3.  Crea un archivo `.env` en la raíz del proyecto. Este archivo contendrá las variables de entorno necesarias.

    ```env
    # Puerto del servidor
    PORT=3000

    # Base de Datos
    MONGO_URI=tu_string_de_conexion_a_mongodb

    # JSON Web Token
    JWT_SECRET=tu_secreto_para_jwt

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=tu_cloud_name
    CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret
    ```

4.  Inicia el servidor en modo de desarrollo:

    ```bash
    npm run dev
    ```

    O para producción:

    ```bash
    npm start
    ```

-----

## Contribución

Si deseas contribuir a este proyecto, por favor sigue los siguientes pasos:

1.  Haz un fork del repositorio.
2.  Crea una nueva rama para tu funcionalidad o corrección de errores.
3.  Realiza tus cambios y haz un commit.
4.  Envía un pull request para revisión.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
