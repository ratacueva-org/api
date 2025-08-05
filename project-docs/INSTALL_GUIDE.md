# Guía de Instalación y Puesta en Marcha - RataCueva API

## 1. Introducción

Esta guía detalla los pasos necesarios para configurar y ejecutar el proyecto RataCueva API en un entorno de desarrollo local. Siguiendo estos pasos, podrás tener una instancia de la API funcionando para realizar pruebas y desarrollo.

---

## 2. Prerrequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu sistema:

*   **Node.js:** Se recomienda la versión 18.x o superior.
    *   Puedes verificar tu versión con el comando: `node -v`
*   **npm (Node Package Manager):** Generalmente se instala junto con Node.js.
    *   Puedes verificar tu versión con: `npm -v`
*   **MongoDB:** La API requiere una instancia de MongoDB para su funcionamiento. Puede ser una instalación local o una base de datos en un servicio en la nube como MongoDB Atlas.
*   **Git:** Para clonar el repositorio.
    *   Puedes verificar tu versión con: `git --version`

---

## 3. Pasos de Instalación

### 3.1. Clonar el Repositorio

Primero, clona el repositorio del proyecto desde GitHub a tu máquina local.

```bash
git clone https://github.com/tu-usuario/ratacueva-api.git
cd ratacueva-api
```

### 3.2. Instalar Dependencias

Una vez dentro del directorio del proyecto, instala todas las dependencias de Node.js listadas en el archivo `package.json`.

```bash
npm install
```

Este comando descargará todas las librerías necesarias, como Express, Mongoose, etc., en la carpeta `node_modules`.

### 3.3. Configurar Variables de Entorno

La API necesita un archivo de variables de entorno para almacenar información sensible como las credenciales de la base de datos y las claves secretas. Deberás crear este archivo manualmente.

1.  En la raíz del proyecto, crea un nuevo archivo llamado `.env`.
2.  Copia el contenido del archivo `.env.example` (si existe) o añade las siguientes variables a tu nuevo archivo `.env`:

    ```env
    # Puerto en el que correrá el servidor
    PORT=3000

    # URI de conexión a tu base de datos MongoDB
    DB_URI=mongodb://localhost:27017/ratacueva

    # Clave secreta para firmar los JSON Web Tokens (JWT)
    JWT_SECRET=tu_clave_secreta_muy_segura

    # Configuración para el envío de correos (ej. con Gmail)
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=tu_correo@gmail.com
    EMAIL_PASS=tu_contraseña_de_aplicacion

    # Credenciales de Cloudinary para el almacenamiento de imágenes
    CLOUDINARY_CLOUD_NAME=tu_cloud_name
    CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret
    ```

**Importante:** Asegúrate de reemplazar los valores de ejemplo (`tu_clave_secreta...`, `tu_correo...`, etc.) con tus propias credenciales y configuraciones.

---

## 4. Ejecutar la Aplicación

Una vez completada la instalación y configuración, puedes iniciar el servidor.

### 4.1. Modo de Desarrollo

Para el desarrollo, se recomienda usar el script `dev`, que utiliza `nodemon` para reiniciar automáticamente el servidor cada vez que detecta un cambio en los archivos.

```bash
npm run dev
```

### 4.2. Modo de Producción

Para un entorno de producción, primero debes compilar los archivos de TypeScript a JavaScript y luego iniciar la aplicación desde los archivos compilados.

1.  **Compilar el proyecto:**

    ```bash
    npm run build
    ```

    Este comando utilizará `tsc` (el compilador de TypeScript) para generar los archivos JavaScript en una carpeta llamada `dist`.

2.  **Iniciar el servidor:**

    ```bash
    npm run start
    ```

    Este comando ejecutará el archivo `dist/index.js`, iniciando la aplicación.

---

## 5. Verificar la Instalación

Si todo ha ido bien, deberías ver un mensaje en tu consola indicando que el servidor se está ejecutando en el puerto que especificaste (por ejemplo, `Servidor corriendo en el puerto 3000`).

Además, puedes acceder a la documentación interactiva de la API (Swagger) en tu navegador para probar los endpoints:

`http://localhost:3000/api/docs` (o el puerto que hayas configurado).

