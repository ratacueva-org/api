# RataCueva API — Backend de Ecommerce Gamer

<p align="center">
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-GPL_v3-0298c3?logo=gnu&logoColor=white" alt="GPL v3">
</p>

<p align="center">
  <em>API RESTful backend para gestion de productos, usuarios, pedidos y pagos</em>
</p>

<p align="center">
  <a href="https://github.com/ratacueva-org/ratacueva-api/issues">Reportar error</a>
  ·
  <a href="https://ratacueva.netlify.app/home">Visitar sitio web</a>
</p>

<p align="center">
  <a href="README.md">🇬🇧 English</a> · <a href="README.es.md">🇪🇸 Español</a>
</p>

---

## Acerca de RataCueva API

API REST principal para la plataforma de ecommerce gaming RataCueva. Maneja CRUD de productos, autenticacion de usuarios, procesamiento de pedidos, integracion de pagos y gestion de imagenes via Cloudinary.

### Ecosistema

| Componente | Repositorio | Stack |
|-----------|-----------|-------|
| Backend API (este) | [ratacueva-org/ratacueva-api](https://github.com/ratacueva-org/ratacueva-api) | Express, TypeScript, MongoDB |
| Web App | [ratacueva-org/ratacueva-web](https://github.com/ratacueva-org/ratacueva-web) | Next.js, TypeScript, TailwindCSS |

## Funcionalidades

- CRUD de productos con categorias y gestion de inventario
- Autenticacion de usuarios con JWT
- Procesamiento de pedidos e integracion de pagos
- Carga y gestion de imagenes con Cloudinary
- Validacion de entrada con Zod
- Cabeceras de seguridad con Helmet
- Limitacion de tasa para endpoints de API
- Documentacion Swagger de la API

## Inicio rapido

### Requisitos previos

- Node.js 18+
- npm o yarn
- Instancia de MongoDB (local o Atlas)

### Instalacion

```bash
git clone https://github.com/ratacueva-org/ratacueva-api.git
cd ratacueva-api
npm install
```

### Variables de entorno

Crea un archivo `.env`:

```
PORT=3000
MONGO_URI=tu_cadena_conexion_mongodb
JWT_SECRET=tu_secreto_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Ejecutar

```bash
# Desarrollo
npm run dev

# Produccion
npm start
```

La API estara disponible en `http://localhost:3000`

## Arquitectura

```
├── config/           # Archivos de configuracion
├── core/             # Logica central de la aplicacion
├── modules/          # Modulos de funcionalidad
│   ├── products/     # Gestion de productos
│   ├── users/        # Gestion de usuarios
│   ├── orders/       # Procesamiento de pedidos
│   └── auth/         # Autenticacion
├── services/         # Servicios externos
├── docs/             # Documentacion
└── index.ts          # Punto de entrada
```

## Documentacion de la API

La documentacion Swagger esta disponible en `/api-docs` cuando el servidor esta en ejecucion.

## Contribuciones

Lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las convenciones de ramas, commits y PRs.

## Licencia

Este proyecto esta bajo la licencia GPL v3 — ver [LICENSE](LICENSE) para mas detalles.

## Agradecimientos

**Authors:**

- Serrano Puertos Jorge Christian
- Chavez Moreno Jose Eduardo
- Lopez Valdes Erick Ernesto
- Florentino Altamirano Misrael
