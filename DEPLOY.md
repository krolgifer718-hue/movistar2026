# DEPLOY — Procedimiento de Actualización

Documento de referencia para cualquier sesión de IA (o persona) que trabaje en este proyecto.
**Leer antes de tocar producción.**

> 📦 **¿Servidor nuevo?** La instalación completa desde cero (SSH, Node, pm2, nginx, SSL, GitHub Actions) está en **[`SETUP.md`](./SETUP.md)**.

---

## 1. Resumen del sistema

| Componente | Detalle |
|---|---|
| Aplicación | Next.js (App Router) + Tailwind + shadcn/ui — repo `github.com/krolgifer718-hue/movistar2026`, rama `main` |
| Producción | VPS Vultr — `root@155.138.230.107` — Ubuntu 26.04 |
| Ruta del proyecto en el servidor | `/root/movistar` |
| Web server | nginx → proxy a `127.0.0.1:3000` |
| Dominio | `https://movistar-app-actualizate.online` (SSL via Let's Encrypt/Certbot) |
| Runtime | Node vía **nvm** (`v24.19.0`), gestor **npm** (NO pnpm), proceso pm2 **`web`** (`next start`) |
| Recursos | 1.6 GB RAM + 4.8 GB swap — el build tarda ~15–20 s |

## 2. Despliegue automático (GitHub Actions)

- Workflow: `.github/workflows/deploy.yml` — se ejecuta en **cada push a `main`** (y manualmente desde Actions → Deploy to Vultr → Run workflow).
- Qué hace: SSH al servidor → `git fetch` + `git reset --hard origin/main` → `npm install` → `next build` → `pm2 restart web` → health check (`curl` con reintentos).
- **Importante:** el `reset --hard` hace que el repo sea la fuente de verdad: los cambios locales del servidor se sobrescriben. El APK no se ve afectado (ver §4).
- Secretos del repo (GitHub → Settings → Secrets): `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`, `DEPLOY_PATH`, `PM2_NAME`.

## 3. Acceso al servidor

- Clave SSH local: `~/.ssh/movistar_deploy` (la misma que el secreto `SERVER_SSH_KEY`).
  ```bash
  ssh -i ~/.ssh/movistar_deploy root@155.138.230.107
  ```
- `node`/`pm2` NO están en el PATH de sesiones no interactivas. Siempre hacer:
  ```bash
  export PATH=/root/.nvm/versions/node/v24.19.0/bin:$PATH
  ```
  (o `source ~/.nvm/nvm.sh`).

## 4. El APK NO está en git (por diseño)

- `*.apk` está en `.gitignore` y **no se trackea** → el repo no crece con cada APK.
- El APK vive **solo en el servidor**: `/root/movistar/public/` — los deploys no lo tocan.
- Se sirve desde la URL raíz: `https://movistar-app-actualizate.online/<nombre.apk>`.

---

## 5. PROCEDIMIENTO: actualizar el APK (tarea más común)

### Reglas antes de tocar nada

1. El usuario copia el APK nuevo a la carpeta local `public/` (normalmente con **nombre nuevo**, ej. `Movistar7G.apk`) y avisa.
2. **Si hay MÁS DE UN `.apk` en `public/` local → avisar al usuario y preguntarle cuál usar. Nunca adivinar.**
3. Comparar el hash (`shasum -a 256`) del APK local con el del servidor: **si son idénticos, avisar al usuario** (no es una versión nueva, no subir).
4. Regla del usuario: el APK viejo del servidor se **elimina** — solo queda el actual.

### Pasos (orden exacto — sin downtime)

1. Verificar APK local: nombre + `shasum -a 256`.
2. **Subir el APK al servidor** (con su nombre):
   ```bash
   scp -i ~/.ssh/movistar_deploy public/<nombre.apk> root@155.138.230.107:/root/movistar/public/<nombre.apk>
   ```
3. **Si el nombre cambió** respecto al href actual: actualizar **los 2 `href`** en `components/movistar/download-section.tsx` (versión escritorio y móvil, líneas ~14 y ~46) → commit → push. El deploy corre solo (build + restart).
   - Si el nombre es el **mismo**: no tocar código (el SCP sobrescribe y se sirve al instante — verificado).
4. **Cuando el deploy termina** (si hubo commit): borrar del servidor los APK anteriores, dejando solo el actual:
   ```bash
   ssh -i ~/.ssh/movistar_deploy root@155.138.221.50 'cd /root/movistar/public && ls -la *.apk && rm -f <apks_anteriores>'
   ```
   *(Se borra al final — nunca antes — para que el botón viejo siga funcionando durante los ~40 s del deploy.)*
5. **Verificar**:
   - `curl -sI https://movistar-app-actualizate.online/<nombre.apk>` → HTTP 200
   - `shasum -a 256` en servidor == hash del local
6. Confirmar al usuario que ya está en línea.

### Caso especial: mismo nombre de siempre (`Movistar5G.apk`)

- SCP sobrescribe → el servidor sirve el contenido nuevo **al instante** (verificado por experimento). Sin commit, sin push, sin restart.

---

## 6. Datos técnicos verificados (no re-testear sin motivo)

- Los archivos de `public/` **no se compilan** en el build (no aparecen en `.next`); el servidor los sirve desde disco en runtime.
- **Archivo nuevo** en `public/` → 404 hasta un `pm2 restart web` (el servidor cachea el índice de archivos al arrancar). El deploy ya hace el restart.
- **Sobrescritura** del mismo nombre → el contenido nuevo se sirve al instante, sin restart.
- Rutas de la app: `/` y `/_not-found` (dinámicas, SSR). Título: "App Mi Movistar | Movistar Perú".
- La página de descarga está en `components/movistar/download-section.tsx` (2 botones).

## 7. Seguridad (reglas fijas)

- **Nunca** escribir contraseñas ni tokens en chats, archivos del repo, remotes de git o logs.
- El remote del servidor usa una **deploy key de solo lectura** (`git@github.com:krolgifer718-hue/movistar2026.git`) — nunca volver a usar tokens embebidos en URLs.
- El token clásico que estuvo filtrado en el remote fue **revocado** por el usuario; no reutilizarlo.
- La contraseña del servidor fue expuesta en un chat: debe estar **rotada**; el acceso real es por clave SSH.
- Commits con la identidad local del repo (`krolgifer718 <krolgifer718@gmail.com>`).
