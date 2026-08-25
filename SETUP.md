# SETUP — Instalación completa en un servidor nuevo (desde cero)

Guía para que un agente de IA (o una persona) monte este proyecto en **cualquier servidor nuevo**:
conexión SSH, claves, Node/pm2, git, nginx, SSL, GitHub Actions y verificación final.

> **Antes de empezar, lee `DEPLOY.md`** — este documento instala el servidor; el otro explica la operación diaria (subir APK, deploys).

---

## 0. Datos que el agente debe recopilar ANTES de empezar

Pedir al usuario y anotar en un lugar seguro (nunca en el chat si son secretos):

| Variable | Ejemplo | ¿Secreto? |
|---|---|---|
| `<IP>` — IP del servidor nuevo | `203.0.113.10` | no |
| `<USER>` — usuario SSH | `root` (o uno con sudo) | no |
| Acceso inicial | contraseña **o** clave existente | **sí** (rotar después) |
| `<DOMINIO>` — dominio del sitio | `misitio.app` | no |
| `<EMAIL>` — para Let's Encrypt | `tucorreo@x.com` | no |
| `<OWNER>/<REPO>` — repo GitHub | `sotosam38/movistar` *(ejemplo — será el repo NUEVO de la persona)* | no |
| `<PATH>` — ruta del proyecto en el servidor | `/root/movistar` | no |
| `<PM2_NAME>` — nombre del proceso pm2 | `web` | no |
| `<PROYECTO>` — nombre corto para las claves | `movistar` | no |

**Regla de seguridad:** nunca pedir contraseñas por chat. Si solo hay acceso por contraseña,
usar `SSH_ASKPASS` (sin pty) o pedir al usuario que ejecute él mismo el `ssh-copy-id` (sección 1).

---

## 0.5 Traspaso: el proyecto va a un repo GitHub NUEVO (de otra persona)

Antes de instalar, el dueño del proyecto lo entrega y **la nueva persona lo sube a SU PROPIO GitHub**:

1. **Crear su repo nuevo** en GitHub (privado o público, como prefiera) — sin inicializarlo con README.
2. **Subir el proyecto** desde la copia que recibió:
   ```bash
   # Opción A — conservar el historial de commits:
   git remote add nueva-origin git@github.com:<NUEVO_OWNER>/<NUEVO_REPO>.git
   git push -u nueva-origin main

   # Opción B — historial limpio (recomendado para un traspaso):
   rm -rf .git
   git init && git add -A && git commit -m "init: proyecto Movistar 5G"
   git branch -M main
   git remote add origin git@github.com:<NUEVO_OWNER>/<NUEVO_REPO>.git
   git push -u origin main
   ```
   > En la opción B, la identidad de los commits será la que configure la nueva persona:
   > `git config user.name "..."` y `git config user.email "..."`.

3. **Lo que viaja automáticamente en el proyecto:** el código (100% portable — el dominio se
   adapta solo desde el host de cada petición), el workflow `.github/workflows/deploy.yml` y los
   docs `DEPLOY.md` / `SETUP.md`.

4. **Lo que NO viaja y hay que entregar aparte:**
   - **El APK actual** (está fuera de git por diseño) → pasarlo por separado y subirlo al servidor
     siguiendo `DEPLOY.md` §5.
   - **La clave SSH** que dará acceso al servidor nuevo (se crea en la sección 1).

5. **Permisos:** los comandos de `gh` de este documento (deploy key en §5 y secretos en §9)
   requieren **admin sobre el repo NUEVO**. Los ejecuta la persona dueña del repo, o le da
   acceso de colaborador/admin al agente que haga la instalación.

6. **Los docs describen el servidor ACTUAL como ejemplo** (`movistar5g.app`, IP, etc.). Al
   instalar en otro servidor, los valores reales van en las secciones de esta guía; actualizar
   `DEPLOY.md` §1 con los datos del nuevo servidor cuando se confirme.

---

## 1. Conexión inicial y claves SSH (máquina del agente → servidor)

```bash
# 1.1 Verificar que el puerto 22 está abierto
nc -z -w 5 <IP> 22 && echo "PUERTO 22 ABIERTO" || echo "REVISAR FIREWALL/HOSTING"

# 1.2 Generar el par de claves del agente (en la máquina local)
ssh-keygen -t ed25519 -f ~/.ssh/<PROYECTO>_deploy -N "" -C "deploy-<PROYECTO>"

# 1.3a Instalar la clave pública en el servidor — opción A (el usuario la instala él mismo):
ssh-copy-id -i ~/.ssh/<PROYECTO>_deploy.pub <USER>@<IP>

# 1.3b Opción B (sin pty, usando SSH_ASKPASS — solo si el usuario acepta pasar la contraseña una vez):
# crear /tmp/askpass.sh con: echo '<PASSWORD>'
chmod 600 /tmp/askpass.sh
SSH_ASKPASS=/tmp/askpass.sh SSH_ASKPASS_REQUIRE=force DISPLAY=:0 ssh -o StrictHostKeyChecking=accept-new <USER>@<IP> \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && touch ~/.ssh/authorized_keys && \
   grep -qF '$(cat ~/.ssh/<PROYECTO>_deploy.pub)' ~/.ssh/authorized_keys || \
   echo '$(cat ~/.ssh/<PROYECTO>_deploy.pub)' >> ~/.ssh/authorized_keys; chmod 600 ~/.ssh/authorized_keys"
rm -f /tmp/askpass.sh   # ELIMINAR SIEMPRE el archivo con la contraseña

# 1.4 Verificar login sin contraseña
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes -o StrictHostKeyChecking=accept-new <USER>@<IP> \
  'echo OK; hostname; whoami'
```

**Verificado cuando:** el paso 1.4 devuelve `OK` sin pedir contraseña.

---

## 2. Actualizar sistema + paquetes base + firewall

```bash
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  apt update && apt upgrade -y
  apt install -y git curl build-essential nginx ufw
  # Firewall (¡no cerrar el SSH!):
  ufw allow OpenSSH
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
  ufw status
'
```

**Verificado cuando:** `ufw status` muestra OpenSSH, 80 y 443 permitidos, y `git --version` responde.

---

## 3. Node (nvm) + npm + pm2

```bash
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  # nvm (usar la última versión de https://github.com/nvm-sh/nvm/releases)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
  nvm install 24 && nvm alias default 24
  npm install -g pm2
  node -v && npm -v && pm2 -v
  # pm2 persistente ante reinicios (ejecutar el comando que imprima)
  pm2 startup systemd -u <USER> --hp /home/<USER>
'
```

> **Nota:** en sesiones SSH no interactivas, `node`/`pm2` NO están en el PATH. Siempre:
> `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"` — o usar el binario absoluto `/root/.nvm/versions/node/v24.x.x/bin/...`

**Verificado cuando:** `node -v` → v24.x, `pm2 -v` → responde.

---

## 4. Swap (obligatorio en servidores con < 2 GB de RAM — el build de Next lo necesita)

```bash
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
  free -h
'
```

**Verificado cuando:** `free -h` muestra `Swap` con ~2G.

---

## 5. Deploy key (servidor → GitHub, SOLO LECTURA)

El servidor necesita leer el repo sin tokens. Se crea una deploy key por repo:

```bash
# 5.1 Generar la clave (en el servidor o local y copiarla con SCP)
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  ssh-keygen -t ed25519 -f /root/.ssh/github_deploy -N "" -C "github-readonly" -q
  cat /root/.ssh/github_deploy.pub
'
# 5.2 Agregar la PÚBLICA al repo (desde la máquina con `gh` autenticado al dueño del repo):
gh api -X POST repos/<OWNER>/<REPO>/keys -f title="<PROYECTO>-server-readonly" \
  -f key="<PEGAR_AQUI_LA_PUBLICA>" -F read_only=true

# 5.3 Configurar el servidor para usar esa clave con github.com:
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  chmod 600 /root/.ssh/github_deploy
  cat > /root/.ssh/config <<EOF
Host github.com
  HostName github.com
  User git
  IdentityFile /root/.ssh/github_deploy
  IdentitiesOnly yes
EOF
  chmod 600 /root/.ssh/config
'
```

**Verificado cuando:** `ssh ... 'GIT_SSH_COMMAND="ssh -o BatchMode=yes" git ls-remote git@github.com:<OWNER>/<REPO>.git'` lista refs sin pedir nada.

---

## 6. Clonar el proyecto + instalar + build de prueba

```bash
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
  cd /root  # o el home del usuario
  git clone git@github.com:<OWNER>/<REPO>.git <PATH-BASE>   # ej: movistar
  cd <PATH>
  git remote set-url origin git@github.com:<OWNER>/<REPO>.git
  npm install --no-audit --no-fund
  npm run build
'
```

> ⚠️ **El APK NO viene del repo** (está en `.gitignore` por diseño). El botón de descarga dará 404
> hasta subir el APK manualmente — ver `DEPLOY.md` §4–5.

**Verificado cuando:** el build termina con `✓ Compiled successfully` y lista las rutas.

---

## 7. pm2: crear el proceso `web`

```bash
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"
  cd <PATH>
  pm2 start npm --name <PM2_NAME> -- start
  pm2 save
  sleep 3
  curl -s -o /dev/null -w "localhost: HTTP %{http_code}\n" http://127.0.0.1:3000
'
```

**Verificado cuando:** `curl` responde **200** y `pm2 status` muestra `<PM2_NAME>` `online`.

---

## 8. nginx + dominio + SSL (Let's Encrypt)

```bash
# 8.0 ¡Primero! El dominio debe apuntar al servidor (registro A):
dig +short <DOMINIO>        # debe devolver <IP>

# 8.1 Configurar el sitio (proxy a Next en el puerto 3000):
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  cat > /etc/nginx/sites-available/<DOMINIO> <<EOF
server {
    server_name <DOMINIO> www.<DOMINIO>;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
  ln -sf /etc/nginx/sites-available/<DOMINIO> /etc/nginx/sites-enabled/
  nginx -t && systemctl reload nginx
  curl -s -o /dev/null -w "http: %{http_code}\n" http://<DOMINIO>
'
# 8.2 SSL con Certbot (agrega SSL + redirect automáticamente):
ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> '
  apt install -y certbot python3-certbot-nginx
  certbot --nginx -d <DOMINIO> -d www.<DOMINIO> --non-interactive --agree-tos -m <EMAIL> --redirect
  systemctl status certbot.timer | head -3   # renovación automática
'
```

**Verificado cuando:** `curl https://<DOMINIO>` → **200** y el certificado es válido.

---

## 9. GitHub Actions: secretos + primer deploy automático

```bash
# 9.1 Secretos del repo — IMPORTANTE: `gh` debe estar autenticado con una cuenta con
#     ADMIN sobre el repo NUEVO (ver §0.5). Si el agente no tiene ese acceso, los ejecuta
#     la persona dueña del repo.
gh secret set SERVER_HOST    -b "<IP>"          -R <OWNER>/<REPO>
gh secret set SERVER_USER    -b "<USER>"        -R <OWNER>/<REPO>
gh secret set SERVER_SSH_KEY -b "$(cat ~/.ssh/<PROYECTO>_deploy)" -R <OWNER>/<REPO>   # ← la PRIVADA
gh secret set DEPLOY_PATH    -b "<PATH>"        -R <OWNER>/<REPO>
gh secret set PM2_NAME       -b "<PM2_NAME>"    -R <OWNER>/<REPO>

# 9.2 El workflow ya vive en el repo (.github/workflows/deploy.yml).
# Disparar el primer deploy manualmente:
gh workflow run deploy.yml -R <OWNER>/<REPO>
# 9.3 Ver el resultado:
gh run watch $(gh run list -R <OWNER>/<REPO> --limit 1 --json databaseId --jq '.[0].databaseId') -R <OWNER>/<REPO> --exit-status
```

**Verificado cuando:** el run termina **verde** y `https://<DOMINIO>` responde 200.

---

## 10. Checklist final (todo el sistema)

| # | Verificación | Comando |
|---|---|---|
| 1 | SSH sin contraseña | `ssh -i ~/.ssh/<PROYECTO>_deploy -o BatchMode=yes <USER>@<IP> 'echo OK'` |
| 2 | Node/npm/pm2 | `... 'export PATH=/root/.nvm/versions/node/v24.19.0/bin:$PATH; node -v; pm2 -v'` |
| 3 | pm2 `web` online | `... 'export PATH=...; pm2 status'` |
| 4 | App local | `... 'curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000'` → 200 |
| 5 | nginx + SSL | `curl -sI https://<DOMINIO>` → 200 |
| 6 | Deploy automático | push a `main` → Actions verde → sitio actualizado |
| 7 | APK sirviéndose | subir APK (DEPLOY.md §5) → `https://<DOMINIO>/<apk>.apk` → 200 |
| 8 | pm2 sobrevive reinicios | `pm2 startup` + `pm2 save` hechos |
| 9 | Firewall | `ufw status` → OpenSSH, 80, 443 |
| 10 | Renovación SSL | `systemctl status certbot.timer` → activo |

---

## 11. Seguridad post-instalación (recomendado)

- **Rotar la contraseña** del servidor si alguna vez pasó por un chat (en Vultr: panel → Access; o `passwd`).
- (Opcional, avanzado) deshabilitar login por contraseña en `/etc/ssh/sshd_config`:
  `PasswordAuthentication no` → `systemctl restart ssh`.
- **Nunca** poner tokens en remotes git (`https://TOKEN@...`). El remote debe ser `git@github.com:...`.
- Los secretos viven en GitHub Secrets y en el llavero local — no en archivos del repo.

---

## 12. Errores comunes y sus causas

| Síntoma | Causa probable | Solución |
|---|---|---|
| `nc` al puerto 22 falla | Firewall del hosting bloquea | Abrir en el panel del proveedor (Vultr/DigitalOcean/etc.) |
| Build muere / OOM | RAM < 2GB sin swap | Hacer §4 (swap) |
| `certbot` falla | DNS aún no apunta | Esperar propagación: `dig +short <DOMINIO>` |
| Deploy en rojo, "exit status 7" en health check | La app aún arrancaba | El workflow ya usa `--retry`; si persiste, revisar `pm2 logs web` |
| `gh` no autenticado | Falta `gh auth login` | Autenticarse como dueño/admin del repo |
| `npm warn allow-scripts sharp` | npm 11 bloquea scripts | Normal; verificar que las imágenes cargan; si no, `npm approve-scripts` |
| Botón de descarga 404 | APK no subido aún | Ver `DEPLOY.md` §5 — el APK no viaja por git |
