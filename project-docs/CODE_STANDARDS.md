# Guía de Estilo y Estándares de Código - RataCueva API

## 1. Introducción

Este documento define los estándares de codificación, las convenciones y las mejores prácticas a seguir durante el desarrollo de la RataCueva API. El objetivo es mantener un código limpio, legible, consistente y fácil de mantener para todos los colaboradores.

---

## 2. Formato del Código

Para mantener un estilo uniforme en todo el proyecto, seguimos estas reglas de formato:

*   **Indentación:** Se utilizan **2 espacios** para la indentación. No usar tabs.
*   **Punto y Coma:** Todas las sentencias deben terminar con punto y coma (`;`).
*   **Comillas:** Usar comillas dobles (`"`) para strings, a menos que las comillas simples (`'`) sean más convenientes en un caso específico.
*   **Líneas en Blanco:** Usar líneas en blanco para separar bloques lógicos de código y mejorar la legibilidad.
*   **Llaves (`{}`):** La llave de apertura de un bloque se coloca en la misma línea que la declaración (clase, función, if, etc.).

```typescript
// Ejemplo de formato
import { Request, Response } from "express";

export const getProfile = async (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({ success: true, data: req.user });
  } else {
    res.status(404).json({ success: false, message: "Usuario no encontrado" });
  }
};
```

---

## 3. Convenciones de Nomenclatura

*   **Variables y Funciones:** Usar `camelCase`.
    *   *Ejemplos:* `const userRole = ...`, `function getProductById() { ... }`

*   **Clases y Tipos (Types):** Usar `PascalCase`.
    *   *Ejemplos:* `class OrderController { ... }`, `type OrderStatus = ...`

*   **Interfaces:** Usar `PascalCase` con el prefijo `I`.
    *   *Ejemplos:* `interface IUser { ... }`, `interface IProduct { ... }`

*   **Archivos:** Usar `kebab-case.ts` (minúsculas y guiones).
    *   *Ejemplos:* `auth.controller.ts`, `role.middleware.ts`

*   **Constantes y Enums:** Usar `PascalCase` para los nombres de los Enums y `UPPER_SNAKE_CASE` para sus valores si son exportados como objetos.
    *   *Ejemplos:*
        ```typescript
        export const OrderStatusValues = {
          PENDING: "pending",
          PROCESSING: "processing",
        } as const;

        type OrderStatusType = (typeof OrderStatusValues)[keyof typeof OrderStatusValues];
        ```

---

## 4. Estructura del Proyecto

El proyecto sigue una arquitectura modular. Cada funcionalidad principal reside en su propio directorio dentro de la carpeta `modules`.

La estructura interna de cada módulo debe ser consistente:

*   **`[module].controller.ts`**: Contiene la lógica de manejo de las solicitudes (`Request`) y respuestas (`Response`) de Express. Su única responsabilidad es orquestar el flujo de datos entre la ruta y el servicio.
*   **`[module].service.ts`**: Contiene la lógica de negocio principal. Interactúa con la base de datos (a través del modelo) y realiza los cálculos o transformaciones necesarias.
*   **`[module].routes.ts`**: Define las rutas de la API para el módulo, asociando cada ruta con su controlador y los middlewares necesarios.
*   **`[module].model.ts`**: Define el esquema de Mongoose y el modelo para la colección de la base de datos.
*   **`[module].schema.ts`**: Define los esquemas de validación con **Zod** para las solicitudes entrantes (cuerpo, parámetros, etc.).

---

## 5. TypeScript y Tipado

*   **Tipado Estricto:** Aprovechar al máximo las capacidades de TypeScript. Evitar el uso de `any` siempre que sea posible.
*   **Interfaces y Tipos:** Usar interfaces (`interface`) para definir la forma de los objetos (especialmente los modelos de la base de datos) y tipos (`type`) para uniones, tuplas o tipos más complejos.
*   **Import/Export:** Utilizar los módulos de ES6 (`import` y `export`).
    *   Usar `export default` para el componente principal de un archivo (ej. el router en `*.routes.ts` o el modelo en `*.model.ts`).
    *   Usar `export` para todo lo demás.

---

## 6. Código Asíncrono

*   **`async/await`**: Preferir siempre el uso de `async/await` sobre el manejo manual de Promesas (`.then()` y `.catch()`) para un código más limpio y legible.
*   **Manejo de Errores:** Toda la lógica asíncrona que pueda fallar (ej. llamadas a la base de datos) debe estar envuelta en un bloque `try...catch` dentro de los servicios, o delegar el manejo de errores al middleware central.

---

## 7. Documentación y Comentarios

*   **Swagger (JSDoc):** Todos los endpoints definidos en los archivos de rutas (`*.routes.ts`) deben estar documentados con comentarios de bloque en formato JSDoc para que `swagger-jsdoc` pueda generar la documentación de la API automáticamente.
*   **Comentarios en el Código:** Añadir comentarios solo cuando sea necesario para explicar lógica compleja (el *porqué* de algo, no el *qué*). Un código bien escrito y con nombres descriptivos debería ser autoexplicativo en la mayoría de los casos.
