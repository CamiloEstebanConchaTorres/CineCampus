# CineCampus

## **Developer**

- Camilo Esteban Concha Torres

## Configuracion del archivo `.env`

Crea un archivo llamado `.env` en la raíz de tu proyecto y agrega las siguientes variables de entorno:

```javascript
MONGODB_HOST=mongodb://
MONGODB_USER=camilo
MONGODB_PASS=1111
MONGODB_PORT=33654
MONGODB_CLUSTER=viaduct.proxy.rlwy.net
MONGODB_DBNAME=CineCampus
```

## Instalacion de las dependencias necesarias

 Nos aseguramos de instalar el paquete `mongodb` ejecutando:

```bash
npm install mongodb
```

## Ejecucion del proyecto

Para ejecutar el proyecto, nos aseguramos de que el archivo `.env` esté configurado correctamente y luego ejecutamos el siguiente comando en la consola:

```bash
npm run dev
```



## **1. Selección de Películas:**

**Clase Pelicula**

La clase `Pelicula` extiende la clase `Connect` y proporciona métodos para interactuar con la colección de películas en la base de datos.

**Constructor**

```javascript
constructor()
```

Inicializa la conexión a la base de datos y configura las colecciones necesarias. Utiliza un patrón Singleton para asegurar una única instancia de la clase.

**Métodos**

1. getAllPeliculas()

   Obtiene todas las películas del catálogo.

   - **Retorna:** `Promise<Array<Object>>` - Una promesa que se resuelve en un array de objetos de película.
   - **Formato de respuesta:** Cada objeto contiene `titulo`, `genero`, y `duracion`.

   ```javascript
   let obj = new Pelicula();
   const peliculas = await obj.getAllPeliculas();
   console.log(peliculas);
   
   // Ejemplo de respuesta:
   // [
   //   { titulo: "Inception", genero: "Sci-Fi", duracion: 148 },
   //   { titulo: "The Godfather", genero: "Drama", duracion: 175 },
   //   ...
   // ]
   obj.destructor();
   ```

2. getPeliculaById(id)

   Obtiene los detalles de una película específica, incluyendo sus proyecciones.

   - Parámetros:
     - `id` (string): El identificador único de la película.
   - **Retorna:** `Promise<Object|null>` - Una promesa que se resuelve en un objeto de película con detalles y proyecciones, o null si no se encuentra.
   - **Formato de respuesta:** Objeto con todos los detalles de la película y un array de `proyecciones`.

   ```javascript
   let obj = new Pelicula();
   const pelicula = await obj.getPeliculaById("66a00a936a82374ecd0c82c8");
   console.log(pelicula);
   
   // Ejemplo de respuesta:
   // {
   //   _id: "66a00a936a82374ecd0c82c8",
   //   titulo: "Inception",
   //   genero: "Sci-Fi",
   //   duracion: 148,
   //   sinopsis: "Un ladrón con la rara habilidad de 'extracción'...",
   //   clasificacion: "PG-13",
   //   director: "Christopher Nolan",
   //   proyecciones: [
   //     { fecha: "2024-07-26", hora: "18:00", sala: "Sala 1" },
   //     { fecha: "2024-07-26", hora: "21:00", sala: "Sala 2" },
   //     ...
   //   ]
   // }
   obj.destructor();
   ```

**Uso de la clase**

```javascript
import { Pelicula } from './js/model/pelicula.js';

// Obtener todas las películas
let obj = new Pelicula();
const peliculas = await obj.getAllPeliculas();
console.log(peliculas);

// Importante: Cerrar la conexión después de su uso
obj.destructor();

// Obtener detalles de una película específica
const pelicula = await obj.getPeliculaById("66a00a936a82374ecd0c82c8");
console.log(pelicula);

// Importante: Cerrar la conexión después de su uso
obj.destructor();
```

**Notas importantes:**

- La clase utiliza `ObjectId` de MongoDB para manejar los identificadores únicos de las películas.
- Se establece una conexión con la colección 'pelicula' y 'proyeccion' para obtener información completa.
- Es crucial llamar al método `destructor()` después de usar la instancia para cerrar la conexión a la base de datos.
- Asegúrese de manejar posibles errores utilizando try-catch al llamar a estos métodos asíncronos.