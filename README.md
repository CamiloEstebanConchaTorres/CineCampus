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



## **2. Compra de Boletos**

La funcionalidad de compra de boletos se divide en dos clases principales: `Proyeccion` y `Boleto`.

**Clase Proyeccion**

Esta clase maneja la verificación de disponibilidad de asientos.

**Métodos**

1. verificarDisponibilidadAsientos(proyeccionId)

   Verifica la disponibilidad de asientos para una proyección específica.

   - Parámetros:

     - `proyeccionId` (string): El identificador único de la proyección.

   - **Retorna:** `Promise<Object>` - Una promesa que se resuelve en un objeto con detalles de disponibilidad.

   - Formato de respuesta:

     ```javascript
     {
       total: number,
       disponibles: number,
       ocupados: number,
       reservados: number,
       detalles: {
         disponibles: Array,
         ocupados: Array,
         reservados: Array
       }
     }
     ```

   ```javascript
   let obj = new Proyeccion();
   const disponibilidad = await obj.verificarDisponibilidadAsientos("66a00c936a82374ecd0c82e5");
   console.log(disponibilidad);
   obj.destructor();
   ```

**Clase Boleto**

Esta clase maneja la compra de boletos.

**Métodos**

1. comprarBoleto(proyeccionId, asientoId, usuarioId, precio, descuento, metodoPago)

   Realiza la compra de un boleto para una proyección específica.

   - Parámetros:

     - `proyeccionId` (string): El identificador único de la proyección.
     - `asientoId` (string): El identificador único del asiento.
     - `usuarioId` (string): El identificador único del usuario.
     - `precio` (number): El precio original del boleto.
     - `descuento` (number): El descuento aplicado al boleto.
     - `metodoPago` (string): El método de pago utilizado.

   - **Retorna:** `Promise<Object>` - Una promesa que se resuelve en un objeto con detalles de la compra.

   - Formato de respuesta:

     ```javascript
     {
       message: string,
       boleto: Object,
       asientoActualizado: Object,
       compra: Object
     }
     ```

   ```javascript
   let obj = new Boleto();
   const result = await obj.comprarBoleto(
     "66a00c936a82374ecd0c82e5",
     "66a12a131c85a1dbadd68b3f",
     "66a00d936a82374ecd0c8304",
     15,
     0,
     "tarjeta"
   );
   console.log(result);
   obj.destructor();
   ```

**Uso de las clases**

```javascript
import { Proyeccion } from './js/model/proyeccion.js';
import { Boleto } from './js/model/boleto.js';

// Verificar disponibilidad de asientos
let obj = new Proyeccion();
const disponibilidad = await obj.verificarDisponibilidadAsientos("66a00c936a82374ecd0c82e5");
console.log(disponibilidad);
obj.destructor();

// Comprar un boleto
obj = new Boleto();
const result = await obj.comprarBoleto(
  "66a00c936a82374ecd0c82e5",
  "66a12a131c85a1dbadd68b3f",
  "66a00d936a82374ecd0c8304",
  15,
  0,
  "tarjeta"
);
console.log(result);
obj.destructor();
```

**Notas importantes:**

- Asegúrese de que los IDs utilizados (proyeccionId, asientoId, usuarioId) existan en la base de datos.
- El método de pago debe ser uno de los siguientes: "tarjeta", "efectivo", o "paypal".
- Es crucial llamar al método `destructor()` después de usar la instancia para cerrar la conexión a la base de datos.
- Maneje posibles errores utilizando try-catch al llamar a estos métodos asíncronos.



## 3. Asignación de Asientos

La funcionalidad de asignación de asientos se divide en la clase: **Boleto**. Esta clase permite reservar y cancelar la reserva de asientos para una proyección específica.

### Clase **Boleto**

Esta clase maneja la asignación de asientos, tanto para reservar como para cancelar reservas.

#### Métodos

1. **reservarAsiento(proyeccionId, asientoId, usuarioId, precio, descuento, metodoPago)**

   Permite la reserva de un asiento para una proyección específica.

   - **Parámetros:**

     - `proyeccionId` (string): El identificador único de la proyección.
     - `asientoId` (string): El identificador único del asiento a reservar.
     - `usuarioId` (string): El identificador único del usuario que realiza la reserva.
     - `precio` (number): El precio original del asiento.
     - `descuento` (number): El descuento aplicado al asiento (por ejemplo, para asientos VIP).
     - `metodoPago` (string): El método de pago utilizado ("tarjeta", "efectivo", "paypal").

   - **Retorna:** `Promise<Object>` - Una promesa que se resuelve en un objeto con detalles de la reserva.

   - **Formato de respuesta:**

     ```javascript
     {
       message: string,
       reserva: Object,
       asientoActualizado: Object
     }
     ```

   - **Ejemplo de uso:**

     ```javascript
     let obj = new Boleto();
     const reservaResult = await obj.reservarAsiento(
       "66a00c936a82374ecd0c82e6",
       "66a12a131c85a1dbadd68b50",
       "66a00d936a82374ecd0c82fe",
       15,
       1.5,
       "paypal"
     );
     console.log(reservaResult);
     obj.destructor();
     ```

2. **cancelarReserva(reservaId, asientoId)**

   Permite la cancelación de una reserva de asiento ya realizada.

   - **Parámetros:**

     - `reservaId` (string): El identificador único de la reserva que se desea cancelar.
     - `asientoId` (string): El identificador único del asiento cuya reserva se desea cancelar.

   - **Retorna:** `Promise<Object>` - Una promesa que se resuelve en un objeto con detalles de la cancelación.

   - **Formato de respuesta:**

     ```javascript
     {
       message: string,
       cancelacion: Object
     }
     ```

   - **Ejemplo de uso:**

     ```javascript
     let obj = new Boleto();
     const cancelResult = await obj.cancelarReserva(
       "66a532c22d945dcabe528d0e",
       "66a12a131c85a1dbadd68b50"
     );
     console.log(cancelResult);
     obj.destructor();
     ```

### Notas Importantes

- Asegúrate de que los IDs utilizados (`proyeccionId`, `asientoId`, `usuarioId`, `reservaId`) existan en la base de datos.
- El método de pago debe ser uno de los siguientes: "tarjeta", "efectivo", o "paypal".
- Es crucial llamar al método `destructor()` después de usar la instancia para cerrar la conexión a la base de datos.
- Maneja posibles errores utilizando `try-catch` al llamar a estos métodos asíncronos