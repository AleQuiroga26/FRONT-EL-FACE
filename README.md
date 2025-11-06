# elFace – Proyecto Final React (Práctica Profesionalizante I - JavaScript)

Aplicación web desarrollada con **React + Vite** que se conecta a una **API Flask** para gestionar usuarios (*users*), publicaciones (*posts*) y comentarios (*comments*).
Implementa autenticación con **JWT (Bearer Token)**, control de roles (admin / user) y CRUDs completos, con una interfaz moderna creada con **PrimeReact** y CSS.

---

## Integrantes

- **Santiago Delfino**  - https://github.com/Dsan04
- **Alejandro Quiroga**  - https://github.com/aleQiroga26
- **Santiago Garola** - https://github.com/santigarola

---

## Backend (API Rest Flask)

El proyecto se conecta con la siguiente API:
[Repositorio del backend – API Flask](https://github.com/santigarola/API_Rest_Flask)

---

## Descripción General

**elFace** es una red social minimalista, con diseño retro donde los usuarios pueden:

- Registrarse e iniciar sesión con autenticación JWT
- Crear, editar y eliminar **posts**
- Comentar mediante **comments**
- Acceder a funcionalidades exclusivas según su **rol (admin, moderator o user)**

La aplicación cuenta con un diseño responsive, limpio y fácil de usar, desarrollado con **PrimeReact**.

---

## Tecnologías Principales

- **React + Vite**
- **PrimeReact** (componentes UI)
- **JWT Decode**
- **React Router DOM**
- **Context API** (manejo de sesión)
- **localStorage**

---

## Guía paso a paso para ejecutar el proyecto

Este tutorial está pensado para alguien con conocimientos básicos de consola.
Seguí cada paso en orden para poner el proyecto en marcha.

---

### 1. Requisitos previos

Antes de empezar, asegurate de tener instalado:

- [**Node.js**](https://nodejs.org/) (versión 18 o superior)
- [**npm**](https://www.npmjs.com/) (se instala junto con Node.js)
- [**Git**](https://git-scm.com/)

Podés verificar si están instalados ejecutando estos comandos en la terminal:

```bash
node -v
npm -v
git --version
```

Si alguno no aparece, instalalo desde los enlaces anteriores.

---

### 2. Clonar el repositorio

Elegí una carpeta donde guardar el proyecto y ejecutá en la terminal:

```bash
git clone git@github.com:AleQuiroga26/FRONT-EL-FACE.git
```

Entrá en la carpeta del proyecto:

```bash
cd /FRONT-EL-FACE
```

---

### 3. Instalar las dependencias

Dentro del proyecto, ejecutá:

```bash
npm install
```

Este comando descargará todas las librerías necesarias para que la aplicación funcione.

---

### 4. Ejecutar el backend (localmente)

Si descargaste también la API Flask, asegurate de tenerla corriendo antes de iniciar el frontend.
Dentro de la carpeta del backend ejecutá:

```bash
flask run --reload
```

Esto iniciará el servidor en [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

### 5. Iniciar el servidor de desarrollo de React

En la carpeta de **elFace**, ejecutá:

```bash
npm run dev
```

El proyecto se abrirá automáticamente en tu navegador en la dirección:
[http://localhost:5173](http://localhost:5173)

---

### 6. Probar la aplicación

1. Registrate como nuevo usuario.
2. Iniciá sesión para obtener tu token JWT.
3. Creá, editá o eliminá publicaciones y reseñas.
4. Si sos **admin**, podrás acceder a secciones exclusivas.

---

### 7. Detener el servidor

Cuando quieras cerrar el servidor de desarrollo, presioná en la terminal:

```
Ctrl + C
```

---

## Errores comunes y soluciones

| Problema | Posible causa | Solución |
|-----------|----------------|-----------|
| `npm: command not found` | Node.js no está instalado correctamente | Reinstalá Node desde [nodejs.org](https://nodejs.org) |
| Error de CORS | El backend no permite el origen del frontend | Verificá las configuraciones de CORS en Flask |
| Página en blanco | Error en el código o en las rutas | Revisá la consola del navegador (`F12 > Console`) |

---

## Estructura del proyecto

```📦
┣ 📂 public/             → Archivos públicos y estáticos
 ┣ 📂 src/                → Código fuente principal
 ┃ ┣ 📂 components/       → Componentes reutilizables (botones, formularios, etc.)
 ┃ ┣ 📂 context/          → Contexto de autenticación 
 ┃ ┣ 📂 styles/          → archivos de estilos css 
 ┃ ┣ 📂 utils/            → Utilidades generales
 ┃ ┣ 📜 App.jsx           → Configuración de rutas y layout principal
 ┃ ┣ 📜 main.jsx          → Punto de entrada de la aplicación
 ┣ 📜 index.html          → Archivo HTML base
 ┣ 📜 package.json        → Dependencias y scripts del proyecto
 ┣ 📜 vite.config.js      → Configuración de Vite
 ┣ 📜 eslint.config.js    → Configuración de ESLint
 ┣ 📜 .gitignore          → Archivos ignorados por Git
 ┣ 📜 README.md           → Documentación del proyecto
```

---

## Funcionalidades principales

✅ Registro e inicio de sesión con JWT
✅ CRUD de publicaciones (posts) y reseñas (reviews)
✅ Roles de usuario (admin / user)
✅ Protección de rutas privadas
✅ Interfaz responsive con PrimeReact
✅ Validaciones y mensajes de error claros

---

## Licencia

Proyecto académico desarrollado para **Práctica Profesionalizante I (JavaScript)** – Año 2025.
Uso educativo. Todos los derechos reservados a sus autores.

---

 *Desarrollado por el equipo de elFace con React + Flask.*

