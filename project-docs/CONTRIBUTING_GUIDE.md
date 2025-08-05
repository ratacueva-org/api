# Guía de Contribución - Flujo de Trabajo con Git

## 1. Introducción

Este documento describe el flujo de trabajo de Git que utilizamos para el desarrollo de la RataCueva API. Hemos adoptado el **GitHub Flow**, un modelo ligero y basado en ramas que nos permite desarrollar nuevas funcionalidades, corregir errores y mantener la rama principal (`main`) siempre estable y lista para ser desplegada.

Seguir este flujo es fundamental para mantener el código organizado y facilitar la colaboración.

---

## 2. Principios Clave

1.  **La rama `main` es sagrada:** Cualquier código en la rama `main` debe estar en un estado funcional y haber sido probado. Nunca se debe hacer un `commit` directamente a `main`.
2.  **El desarrollo se hace en ramas:** Todo nuevo trabajo, sin importar si es una nueva funcionalidad, una corrección de error o una mejora, debe realizarse en su propia rama descriptiva.

---

## 3. El Flujo de Trabajo Paso a Paso

### Paso 1: Sincronizar tu Repositorio Local

Antes de empezar a trabajar, asegúrate de que tu rama `main` local esté actualizada con la última versión del repositorio remoto.

```bash
git checkout main
git pull origin main
```

### Paso 2: Crear una Nueva Rama

Crea una nueva rama a partir de `main`. El nombre de la rama debe ser descriptivo y seguir nuestras convenciones.

```bash
git checkout -b <nombre-de-la-rama>
```

#### Convenciones para Nombres de Ramas

Utiliza los siguientes prefijos para nombrar tus ramas según el tipo de trabajo que estés realizando:

*   **`feat/`**: Para nuevas funcionalidades.
    *   *Ejemplo:* `git checkout -b feat/social-login-with-google`

*   **`fix/`**: Para correcciones de errores (bugs).
    *   *Ejemplo:* `git checkout -b fix/user-password-reset-token-error`

*   **`docs/`**: Para añadir o mejorar la documentación.
    *   *Ejemplo:* `git checkout -b docs/add-database-schema-guide`

*   **`refactor/`**: Para cambios en el código que no añaden funcionalidades ni corrigen errores (ej. mejorar rendimiento, limpiar código).
    *   *Ejemplo:* `git checkout -b refactor/simplify-product-controller`

*   **`style/`**: Para cambios de formato o estilo que no afectan la lógica del código.
    *   *Ejemplo:* `git checkout -b style/apply-linter-rules-to-auth-module`

### Paso 3: Desarrollar y Hacer Commits

Realiza tu trabajo en la nueva rama. Haz commits pequeños y atómicos, cada uno representando un paso lógico en tu trabajo. Escribe mensajes de commit claros y descriptivos.

```bash
# ...haces cambios en el código...
git add .
git commit -m "feat: Agrega el endpoint para registro de usuarios"
```

### Paso 4: Subir la Rama a GitHub

Cuando hayas terminado tu trabajo (o si quieres tener una copia de seguridad remota), sube tu rama a GitHub.

```bash
git push origin <nombre-de-la-rama>
```

### Paso 5: Abrir un Pull Request (PR)

Una vez que tu rama esté en GitHub, ve al repositorio y abre un **Pull Request**.

*   **Rama base:** `main`
*   **Rama de comparación:** `<nombre-de-la-rama>`

En la descripción del PR, explica qué cambios has hecho y por qué. Si tu PR resuelve un *issue* existente, menciónalo con `Closes #issue-number`.

### Paso 6: Revisión de Código y Aprobación

Un miembro del equipo revisará tu Pull Request. Es posible que se soliciten cambios o se hagan comentarios. Colabora en la discusión y realiza los commits adicionales que sean necesarios en tu rama. El `push` de nuevos commits actualizará automáticamente el PR.

### Paso 7: Fusionar (Merge) el PR

Una vez que el Pull Request sea aprobado, el encargado del repositorio lo fusionará con la rama `main`.

### Paso 8: Limpieza

Después de que tu rama se haya fusionado, puedes eliminarla de tu repositorio local para mantenerlo limpio.

```bash
git checkout main
git branch -d <nombre-de-la-rama>
```

¡Y eso es todo! El ciclo comienza de nuevo para la siguiente funcionalidad o corrección.
