# Parroquia de la Inmaculada Concepción

Sitio web bilingüe (español e inglés) de la Parroquia de la Inmaculada Concepción, La Unión, Cartago.

- Las páginas en español están en `/` y las de inglés en `/en`.
- Tiene un **panel de administración** para editar textos, horarios de misa, contacto, la galería de historia y los proyectos sin tocar código.
- Tecnologías: [Next.js](https://nextjs.org) (React), [Tailwind CSS](https://tailwindcss.com), [Prisma](https://www.prisma.io) con PostgreSQL y [Auth.js](https://authjs.dev) para el inicio de sesión.

Si nunca has levantado un proyecto así, sigue la guía de abajo en orden. Cada paso explica qué hace y por qué.

---

## Índice

1. [Qué necesitas instalar](#1-qué-necesitas-instalar)
2. [Bajar el proyecto](#2-bajar-el-proyecto)
3. [Instalar las dependencias](#3-instalar-las-dependencias)
4. [Crear el archivo `.env`](#4-crear-el-archivo-env)
5. [Levantar la página](#5-levantar-la-página)
6. [Entrar al panel de administración](#6-entrar-al-panel-de-administración)
7. [Cada vez que hagas `git pull`](#7-cada-vez-que-hagas-git-pull)
8. [Problemas comunes](#8-problemas-comunes)
9. [Usar tu propia base de datos (opcional)](#9-usar-tu-propia-base-de-datos-opcional)
10. [Comandos útiles](#10-comandos-útiles)
11. [Integraciones opcionales](#11-integraciones-opcionales)
12. [Dónde está cada cosa](#12-dónde-está-cada-cosa)

---

## 1. Qué necesitas instalar

Solo se instala una vez por computadora.

| Programa | Para qué sirve | Dónde conseguirlo |
| --- | --- | --- |
| **Node.js 24 o más nuevo** | Ejecuta el proyecto y trae `npm`, que instala las librerías. | [nodejs.org](https://nodejs.org) (descarga la versión **LTS**) |
| **Git** | Baja el código y lo mantiene actualizado. | [git-scm.com](https://git-scm.com) |
| **Un editor** (recomendado) | Para ver y editar archivos, como el `.env`. | [Visual Studio Code](https://code.visualstudio.com) |

Para comprobar que Node quedó bien instalado, abre una **terminal** y escribe:

```bash
node -v
```

Debe mostrar `v24.x.x` o un número mayor. Si sale una versión menor (por ejemplo `v20`), instala la LTS más reciente y **abre una terminal nueva**.

> **¿Qué es la terminal?** En Windows es "PowerShell" o "Símbolo del sistema" (búscalo en el menú Inicio). En Mac es la app "Terminal". En VS Code también puedes abrir una con el menú **Terminal → New Terminal**, y ya queda ubicada en la carpeta del proyecto.

---

## 2. Bajar el proyecto

**Si es la primera vez**, clona el repositorio y entra a la carpeta:

```bash
git clone https://github.com/santivalverde4/Web-Parroquia-Inmaculada-Concepcion.git
cd Web-Parroquia-Inmaculada-Concepcion
```

**Si ya lo tenías**, entra a la carpeta del proyecto y trae los últimos cambios:

```bash
git pull
```

> Todos los comandos de esta guía se escriben **dentro de la carpeta del proyecto** (la que tiene el archivo `package.json`).

---

## 3. Instalar las dependencias

```bash
npm install
```

Este comando hace dos cosas:

1. Descarga todas las librerías del proyecto en la carpeta `node_modules`. Puede tardar uno o dos minutos la primera vez.
2. Genera automáticamente el "cliente de Prisma" en `app/generated/prisma`, que es el código que usa la página para hablar con la base de datos. Esa carpeta **no está en git**, así que sin este paso la página no levanta.

Hazlo aunque ya tengas una carpeta `node_modules` de antes.

---

## 4. Crear el archivo `.env`

El archivo `.env` guarda las **contraseñas y llaves** del proyecto: la conexión a la base de datos, la clave de las sesiones y la llave de YouTube. Por seguridad **no está en git**, así que cada persona crea el suyo.

### 4.1 Copia el archivo de ejemplo

En la carpeta del proyecto hay un archivo llamado `.env.example`. Cópialo con el nombre `.env`:

**Windows (PowerShell o CMD):**

```bash
copy .env.example .env
```

**Mac o Linux:**

```bash
cp .env.example .env
```

### 4.2 Llena los valores

Abre `.env` con tu editor. **Pídele estos valores por mensaje privado al administrador del proyecto** y reemplázalos:

```env
DATABASE_URL="..."
DIRECT_URL="..."
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
YOUTUBE_API_KEY="..."
YOUTUBE_CHANNEL_ID="..."
```

Las demás líneas déjalas como están.

| Variable | Qué es |
| --- | --- |
| `DATABASE_URL` | Dirección de la base de datos PostgreSQL que comparte el equipo. |
| `DIRECT_URL` | La misma base de datos, pero con conexión directa (Prisma la usa para las migraciones). |
| `AUTH_SECRET` | Clave secreta para firmar las sesiones del panel de administración. |
| `NEXTAUTH_URL` | Dirección donde corre la página en tu computadora. En local es `http://localhost:3000`. |
| `YOUTUBE_API_KEY` y `YOUTUBE_CHANNEL_ID` | Sirven para mostrar la lista de videos del canal en la página de Videos. |
| `SEED_ADMIN_...` | Solo se usan para crear el primer administrador. **No los necesitas** si usas la base de datos del equipo. |
| `FACEBOOK_...` y `GOOGLE_MAPS_API_KEY` | Opcionales. Pueden quedar vacíos (ver [Integraciones opcionales](#11-integraciones-opcionales)). |

> ⚠️ **Nunca subas el `.env` a git** ni lo compartas en chats públicos. Ya está en el `.gitignore` para que no se suba por accidente.
>
> ⚠️ **No corras `npm run db:seed` ni `npm run db:deploy`** si usas la base de datos del equipo. Ya está configurada, y el seed puede cambiar la contraseña del administrador.

---

## 5. Levantar la página

```bash
npm run dev
```

Cuando la terminal muestre algo como `Local: http://localhost:3000`, abre en tu navegador:

- **Sitio en español:** <http://localhost:3000>
- **Sitio en inglés:** <http://localhost:3000/en>

Mientras la terminal siga abierta, la página está corriendo. Si cambias un archivo, se actualiza sola en el navegador.

Para **detenerla**, ve a la terminal y presiona `Ctrl + C`.

> La primera vez que abres cada página puede tardar unos segundos, porque se compila en ese momento. Después es rápido.

---

## 6. Entrar al panel de administración

Abre <http://localhost:3000/admin/login> e ingresa con la cuenta de administrador. Pídele el correo y la contraseña al administrador del proyecto, también por privado.

El panel está organizado en pestañas:

| Pestaña | Qué se edita | Dónde se ve |
| --- | --- | --- |
| Portada | Título y texto de bienvenida | Página de inicio |
| Horarios y servicios | Misas, servicios y horario de oficina | Inicio y Ubicación |
| Contacto | Teléfono, WhatsApp, correo y dirección | Pie de página y Ubicación |
| Historia | Relato y fotos de la galería | Página de Historia |
| Proyectos | Proyectos en marcha y a futuro | Página de Proyectos |

Todo lo que se guarda en el panel queda en la base de datos **compartida**: si lo cambias, tus compañeros también lo verán. Lo que nunca se ha editado muestra el contenido de respaldo que está en el código, así la página nunca se ve vacía.

---

## 7. Cada vez que hagas `git pull`

Después de traer cambios nuevos, corre:

```bash
npm install
```

Si alguien agregó o actualizó una librería, así la recibes. Si no hubo cambios, termina en segundos.

---

## 8. Problemas comunes

**`Cannot find module '@/app/generated/prisma/client'` (o algo parecido con "prisma")**
Falta el cliente de Prisma. Corre:

```bash
npx prisma generate
```

y vuelve a levantar con `npm run dev`.

**`Port 3000 is in use`**
Ya hay otra terminal con la página abierta. Ciérrala, o levanta en otro puerto:

```bash
npm run dev -- -p 3001
```

y abre <http://localhost:3001>.

**El panel dice "Configure DATABASE_URL y AUTH_SECRET…", o no aparecen los textos y horarios del equipo**
La página no está leyendo tu `.env`. Revisa que:

- El archivo se llame exactamente `.env`, sin `.txt` al final. Ojo: Windows a veces esconde las extensiones.
- Esté en la carpeta principal, al lado de `package.json`.
- Los valores no tengan espacios de más ni comillas repetidas.

Después detén la página (`Ctrl + C`) y vuelve a correr `npm run dev`: el `.env` solo se lee al arrancar.

**La página de Videos muestra un solo reproductor en vez de la lista de videos**
Falta `YOUTUBE_API_KEY` en el `.env`, o está mal copiada. No es un error: sin la llave, la página muestra el reproductor del canal.

**`npm run type-check` muestra un error dentro de la carpeta `.next`**
Son tipos viejos que Next.js generó antes. Corre `npm run dev` una vez (se regeneran solos) o borra la carpeta `.next`.

**Las letras se ven distintas a las de mis compañeros**
Las fuentes se descargan de Google Fonts al compilar. Revisa tu conexión a internet y vuelve a levantar la página.

---

## 9. Usar tu propia base de datos (opcional)

Solo hace falta si quieres hacer pruebas sin tocar los datos del equipo, o si estás montando el proyecto desde cero.

1. Crea una base de datos PostgreSQL gratuita en [Neon](https://neon.tech) (o Vercel Postgres).
2. Copia la **URL con pool** en `DATABASE_URL` y la **URL directa** en `DIRECT_URL`. Si tu proveedor da una sola URL, pon la misma en las dos.
3. Genera tu propio `AUTH_SECRET`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

   Copia el resultado en `AUTH_SECRET`.
4. Crea las tablas:

   ```bash
   npm run db:deploy
   ```

5. En el `.env`, llena `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` (una contraseña larga y única) y `SEED_ADMIN_NAME`. Después crea tu administrador:

   ```bash
   npm run db:seed
   ```

6. Levanta la página con `npm run dev`. Arranca sin contenido editado, así que verás el contenido de respaldo hasta que edites algo en el panel.

---

## 10. Comandos útiles

| Comando | Qué hace |
| --- | --- |
| `npm install` | Instala las librerías y genera el cliente de Prisma. |
| `npm run dev` | Levanta la página en modo desarrollo (<http://localhost:3000>). |
| `npm run build` | Compila la versión de producción. Sirve para comprobar que todo compila antes de publicar. |
| `npm run start` | Corre la versión compilada (primero hay que hacer `npm run build`). |
| `npm run type-check` | Revisa errores de tipos de TypeScript. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm run format` | Da formato a todo el código con Prettier. |
| `npm run db:deploy` | Aplica las migraciones (crea o actualiza las tablas). Solo con tu propia base de datos. |
| `npm run db:seed` | Crea o actualiza la cuenta de administrador. Solo con tu propia base de datos. |

**Antes de hacer push**, conviene correr:

```bash
npm run type-check
npm run lint
npm run build
```

---

## 11. Integraciones opcionales

Si una integración no está configurada, su página muestra contenido de respaldo y el resto del sitio funciona igual. Las llaves solo se usan en el servidor, salvo la de Google Maps (ver abajo).

- **YouTube** (`YOUTUBE_API_KEY`, `YOUTUBE_CHANNEL_ID`): muestra el video más reciente y la lista de videos anteriores en la página de Videos.
- **Facebook** (`FACEBOOK_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`): reemplaza las noticias de ejemplo por las publicaciones reales de la página de Facebook.
- **Google Maps** (`GOOGLE_MAPS_API_KEY`): el mapa de la página de Ubicación **funciona sin llave**. Con la llave pasa a la Maps Embed API oficial, que es gratuita. Esa llave queda visible en el HTML del mapa, así que en Google Cloud hay que restringirla al dominio del sitio y a la "Maps Embed API". Las coordenadas del templo están en `lib/services/maps.ts`.

---

## 12. Dónde está cada cosa

```
app/
  (es)/               Páginas en español (/ y /historia, /videos, …)
  en/                 Páginas en inglés (/en, /en/historia, …)
  admin/              Inicio de sesión y panel de administración
  api/                Rutas internas (inicio de sesión, YouTube, Facebook)
components/           Piezas de la interfaz, una por sección (HomePage, NoticiasSection, …)
lib/
  services/           Lectura de la base de datos y de las APIs externas
  history.ts          Contenido de respaldo de la página de Historia
  news.ts             Noticias y actividades de ejemplo
  projects.ts         Proyectos de ejemplo
  parishInfo.ts       Horarios y contacto de respaldo
prisma/
  schema.prisma       Estructura de la base de datos
  migrations/         Historial de cambios de la base de datos
public/images/        Fotografías del sitio
```

> El contenido marcado como **PLACEHOLDER** en `lib/news.ts`, `lib/projects.ts`, `lib/history.ts` y `lib/parishInfo.ts` es de ejemplo para la demo. Hay que confirmarlo con la parroquia antes de publicar el sitio.
