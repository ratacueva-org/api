# Así colaboramos en RataCueva 🐭

---

## Nuestro flujo (GitHub Flow)

Simple y directo:

1.  Crea tu **rama** desde `main`.
2.  Haz **commits** en inglés (conventional commits).
3.  Abre un **pull request (PR)**.
4.  Obtén **aprobación**.
5.  **Mergea** y listo.

---

## Nomenclatura: ramas y commits

### Ramas

| Prefijo     | Uso                | Ejemplos                    |
| :---------- | :----------------- | :-------------------------- |
| `feat/`  | Nuevas funciones   | `feature/user-onboarding`   |
| `fix/`   | Corrección de bugs | `bugfix/login-validation`   |
| `refactor/` | Mejoras de código  | `refactor/database-queries` |
| `chore/`    | Mantenimiento      | `chore/update-dependencies` |
| `docs/`     | Documentación      | `docs/api-endpoints`        |

### Commits (tipo: asunto)

| Tipo        | Descripción                 | Ejemplo                            |
| :---------- | :-------------------------- | :--------------------------------- |
| `feat:`     | Nuevas funciones            | `feat: Implement user auth`        |
| `fix:`      | Corrección de bugs          | `fix: Correct cart calc error`     |
| `refactor:` | Reestructuración del código | `refactor: Modularize order logic` |
| `chore:`    | Mantenimiento               | `chore: Update Node.js version`    |
| `docs:`     | Cambios en la documentación | `docs: Update install guide`       |

---

## 🚀 Cómo contribuir (paso a paso)

1.  **Actualiza `main`:**

    ```bash
    git switch main
    git pull origin main
    ```

    _No uses `--rebase` a menos que sepas bien lo que haces._

2.  **Crea tu rama:**

    ```bash
    git branch feat/la-funcionalidad
    git switch feat/la-funcionalidad
    ```

    _Ej: `git branch feat/user-settings` y `git switch feat/user-settings`._

3.  **Trabaja y haz commits:**

    - Desarrolla tu código.
    - Haz commits **pequeños y lógicos** con conventional commits.

    ```bash
    git add .
    git commit -m "feat: Add save button"
    ```

4.  **Envía tu rama a GitHub:**

    ```bash
    git push -u origin feat/la-funcionalidad
    ```

    _Solo la primera vez. Luego, `git push`._

5.  **Abre un pull request (PR):**
    - Ve a GitHub.
    - **Título del PR:** Claro, sigue convención del commit principal (ej. `feat: add contact form`).
    - **Descripción:**
      - **Qué:** Resumen de cambios.
      - **Por qué:** Justificación.
      - **Cómo probar:** Pasos para el revisor.
      - **Notas:** Cualquier extra (ej. "breaking changes").

---

## ✅ Requisitos del PR

Para mergear tu PR:

- **Aprobación:** De un miembro del equipo.
- **Sin conflictos:** Con `main`.
- **Documentación:** Actualizada si es necesario.
- **Nomenclatura correcta:** Ramas y commits.

---

## 💬 Revisión

- **Tiempo:** Revisores intentarán responder en **menos de 48 horas**.
- **Feedback:** Sé constructivo.
- **Actualiza:** Si te piden cambios, responde y actualiza tu PR.

---

## ⚠️ Reglas clave

### Antes de mergear

- **¡No merge directo a `main` (siempre vía PR).**
- **¡No merge código que no compile.**
- **¡No merge si rompe funcionalidad existente.**
- **Obligatorio:** Usa la nomenclatura de ramas y commits.

### Después de mergear

- **Elimina tu rama** en GitHub.
- Notifica al equipo sobre cambios importantes.

---

## ❓ ¿Dudas?

- Abre un **Issue**.
- Contacta a cualquier miembro del equipo.
