---
name: despliegue-github-pages
description: Procedimiento para publicar la carpeta src/ del cuestionario en GitHub Pages con GitHub Actions, verificar el despliegue y resolver fallos habituales. Úsala para cualquier tarea de publicación de este proyecto.
---

# Despliegue en GitHub Pages

El workflow `.github/workflows/pages.yml` publica la carpeta `src/` cada vez que hay un push a `main`. No hace falta rama `gh-pages`.

## Requisito de una sola vez (lo hace Elizabeth)

En el repositorio de GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Si no está así, el workflow falla en el paso de despliegue.

## Pasos

1. `git status` y `git diff --stat` para ver qué se publica.
2. `git add src tests handoff` (nunca `git add .` a ciegas).
3. `git commit -m "<descripción en español de lo que cambia>"`.
4. `git push origin main`.
5. Si está disponible la CLI de GitHub: `gh run watch` o `gh run list --workflow=pages.yml --limit 1` hasta que termine. Si no, indica a Elizabeth que lo mire en la pestaña Actions.
6. URL: `https://<usuario>.github.io/<repositorio>/`. Con `gh`: `gh api repos/{owner}/{repo}/pages --jq .html_url`.
7. Comprobación: `curl -sI <URL>` debe devolver 200, y `curl -s <URL>` debe contener el `<title>` de la web.

## Fallos habituales

| Síntoma | Causa probable |
|---|---|
| El job de deploy falla con error de permisos o de entorno | Pages no está configurado con Source: GitHub Actions |
| La web carga pero los módulos JS dan 404 | Rutas absolutas (`/js/...`) en lugar de relativas (`./js/...`) |
| La web muestra una versión antigua | Caché del navegador o de Pages; espera un par de minutos y recarga forzando |
| Push rechazado | Hay commits en remoto que no tienes. Para y avisa; nunca fuerces |

## Versiones del workflow

Antes del primer despliegue, comprueba en la documentación de GitHub Pages si hay versiones mayores nuevas de `actions/checkout`, `actions/configure-pages`, `actions/upload-pages-artifact` y `actions/deploy-pages`, y anótalo en el handoff si conviene actualizar. No lo cambies tú: el workflow está fuera de tu alcance de escritura.
