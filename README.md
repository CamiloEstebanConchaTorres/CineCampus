# CineCampus

## **Developer**

- Camilo Esteban Concha Torres

## Configuracion del archivo `.env`

Crea un archivo llamado `.env` en la raíz de tu proyecto y agrega las siguientes variables de entorno:

```bash

// credenciales del administrador

MONGODB_HOST=mongodb://
MONGODB_USER=camilo
MONGODB_PASS=1111
MONGODB_PORT=33654
MONGODB_CLUSTER=viaduct.proxy.rlwy.net
MONGODB_DBNAME=CineCampus

// credenciales de un usuario vip:

MONGODB_HOST=mongodb://
MONGODB_USER=ana
MONGODB_PASS=2222
MONGODB_PORT=33654
MONGODB_CLUSTER=viaduct.proxy.rlwy.net
MONGODB_DBNAME=CineCampus


// credenciales de un usuario estandar:

MONGODB_HOST=mongodb://
MONGODB_USER=juan
MONGODB_PASS=7777
MONGODB_PORT=33654
MONGODB_CLUSTER=viaduct.proxy.rlwy.net
MONGODB_DBNAME=CineCampus

```

## Instalacion de las dependencias necesarias

 Nos aseguramos de instalar el paquete `mongodb` ejecutando:

```bash
npm install mongodb
```

 Para el caso de uso 5 es necesaria la instalacion de 2 paquetes: (bcrypt) (uuid)

 ```bash
npm install bcrypt uuid
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



## 4. Descuentos y Tarjetas VIP

La funcionalidad de **Descuentos y Tarjetas VIP** se maneja en la clase: **Boleto**. Esta clase permite la aplicación de descuentos en la compra de boletos para usuarios con tarjeta VIP, así como la verificación de la validez de una tarjeta VIP.

### Clase **Boleto**

Esta clase incluye métodos para manejar la compra de boletos con descuento para usuarios con tarjetas VIP.

#### Métodos

1. **comprarBoletoConDescuento(proyeccionId, asientoId, usuarioId, precio, metodoPago)**

   Permite la compra de un boleto con un descuento aplicado si el usuario tiene una tarjeta VIP válida.

   - **Parámetros:**

     - `proyeccionId` (string): El identificador único de la proyección.
     - `asientoId` (string): El identificador único del asiento a comprar.
     - `usuarioId` (string): El identificador único del usuario que realiza la compra.
     - `precio` (number): El precio original del boleto.
     - `metodoPago` (string): El método de pago utilizado ("tarjeta", "efectivo", "paypal").

   - **Retorna:** `Promise<Object>` - Una promesa que se resuelve en un objeto con detalles de la compra.

   - **Formato de respuesta:**

     ```javascript
     código{
       message: string,
       boleto: Object,
       asientoActualizado: Object,
       compra: Object
     }
     ```

   - **Ejemplo de uso:**

     ```javascript
     let obj = new Boleto();
     const compraVIPResult = await obj.comprarBoletoConDescuento(
       "66a00c936a82374ecd0c82f5",
       "66a12a131c85a1dbadd68b41",
       "66a00d936a82374ecd0c82ff",
       12,
       "paypal"
     );
     console.log(compraVIPResult);
     ```

### Notas Importantes

- Asegúrate de que los IDs utilizados (`proyeccionId`, `asientoId`, `usuarioId`) existan en la base de datos.
- El asiento debe ser de tipo VIP para aplicar el descuento.
- El usuario debe tener una tarjeta VIP válida y activa para que se aplique el descuento.
- Los niveles de tarjeta VIP y sus descuentos son los siguientes:
  - **Oro:** 20% de descuento.
  - **Plata:** 15% de descuento.
  - **Bronce:** 10% de descuento.
- Es crucial llamar al método `destructor()` después de usar la instancia para cerrar la conexión a la base de datos.
- Maneja posibles errores utilizando `try-catch` al llamar a este método asíncrono.



## Caso de Uso 5: Roles Definidos

La funcionalidad de **Roles Definidos** se maneja en la clase: **Usuario**. Esta clase permite la gestión de usuarios, incluyendo la creación de nuevos usuarios, la actualización de roles, la obtención de detalles y la lista de usuarios filtrada por rol.

### Clase **Usuario**

La clase `Usuario` maneja las operaciones relacionadas con los usuarios del sistema, tales como la creación, actualización, consulta y listado.

#### Dependencias

Asegúrate de tener instaladas las siguientes dependencias en tu proyecto:

- **bcrypt**: Para el hash seguro de contraseñas.
- **uuid**: Para la generación de UUIDs únicos.
- **mongodb**: Cliente de MongoDB para interactuar con la base de datos.

Puedes instalar estas dependencias usando npm:

```bash
npm install bcrypt uuid mongodb
```

#### Métodos

1. **crearUsuario(nombre, apellido, email, password, rol)**

   Permite la creación de un nuevo usuario en el sistema y en la base de datos de autenticación de MongoDB.

   - **Parámetros:**

     - `nombre` (string): Nombre del usuario.
     - `apellido` (string): Apellido del usuario.
     - `email` (string): Correo electrónico del usuario.
     - `password` (string): Contraseña del usuario (se almacenará hasheada).
     - `rol` (string): Rol del usuario (puede ser "Administrador", "Usuario Estándar", o "Usuario VIP").

   - **Retorna:** `Promise<Object>` - Una promesa que se resuelve en un objeto con detalles del usuario creado.

   - **Formato de respuesta:**

     ```javascript
     {
       message: string,
       userDetails: {
         nombre: string,
         apellido: string,
         email: string,
         rol: string,
         fechaRegistro: Date,
         ultimoAcceso: Date
       },
       dbUserDetails: {
         _id: string,
         userId: string,
         user: string,
         roles: Array<Object>,
         mechanisms: Array<string>
       }
     }
     ```

   - **Ejemplo de uso:**

     ```javascript
     const usuario = new Usuario();
     const nuevoUsuario = await usuario.crearUsuario(
       "John", 
       "Doe", 
       "john.doe@example.com", 
       "password123", 
       "vip"
     );
     console.log(nuevoUsuario);
     ```

2. **obtenerDetallesUsuario(id)**

   Permite obtener información detallada sobre un usuario a partir de su identificador único.

   - **Parámetros:**

     - `id` (string): Identificador único del usuario.

   - **Retorna:** `Promise<Object>` - Una promesa que se resuelve en el objeto del usuario encontrado, o `null` si no se encuentra.

   - **Formato de respuesta:**

     ```javascript
     {
       _id: ObjectId,
       nombre: string,
       apellido: string,
       email: string,
       password: string,
       rol: string,
       fechaRegistro: Date,
       ultimoAcceso: Date
     }
     ```

   - **Ejemplo de uso:**

     ```javascript
     const usuario = new Usuario();
     const detallesUsuario = await usuario.obtenerDetallesUsuario("5f89277a1234567890abcdef");
     console.log(detallesUsuario);
     ```

3. **actualizarRolUsuario(id, nuevoRol)**

   Permite actualizar el rol de un usuario tanto en la colección de usuarios como en la base de datos de autenticación de MongoDB.

   - **Parámetros:**

     - `id` (string): Identificador único del usuario.
     - `nuevoRol` (string): Nuevo rol para el usuario (puede ser "Administrador", "Usuario Estándar", o "Usuario VIP").

   - **Retorna:** `Promise<Object>` - Una promesa que se resuelve en un objeto con el mensaje de éxito y detalles del usuario actualizado.

   - **Formato de respuesta:**

     ```javascript
     {
       message: string,
       userDetails: {
         id: string,
         nombre: string,
         apellido: string,
         email: string,
         rol: string,
         fechaRegistro: Date,
         ultimoAcceso: Date
       },
       dbUserDetails: {
         user: string,
         roles: Array<Object>
       }
     }
     ```

   - **Ejemplo de uso:**

     ```javascript
     const usuario = new Usuario();
     const actualizarRol = await usuario.actualizarRolUsuario("5f89277a1234567890abcdef", "vip");
     console.log(actualizarRol);
     ```

4. **listarUsuarios(filtroRol = null)**

   Permite obtener una lista de usuarios filtrados por rol. Si no se proporciona un filtro, se devolverán todos los usuarios.

   - **Parámetros:**

     - `filtroRol` (string|null): Rol por el cual filtrar usuarios. Si se omite o se pasa como `null`, se devolverán todos los usuarios.

   - **Retorna:** `Promise<Array>` - Una promesa que se resuelve en una lista de objetos de usuario.

   - **Formato de respuesta:**

     ```javascript
     [
       {
         _id: ObjectId,
         nombre: string,
         apellido: string,
         email: string,
         password: string,
         rol: string,
         fechaRegistro: Date,
         ultimoAcceso: Date
       }
     ]
     ```

   - **Ejemplo de uso:**

     ```javascript
     const usuario = new Usuario();
     const usuariosVIP = await usuario.listarUsuarios("vip");
     console.log(usuariosVIP);
     ```

### Ejemplo Completo

```javascript
import { Usuario } from './js/model/usuario.js';

  // Crear un nuevo usuario
  const usuario = new Usuario();
  const nuevoUsuario = await usuario.crearUsuario(
    "Jane", 
    "Smith", 
    "jane.smith@example.com", 
    "securepassword", 
    "estandar"
  );
  console.log(nuevoUsuario);
  obj.destructor();

  // Obtener detalles de un usuario específico
  const detallesUsuario = await usuario.obtenerDetallesUsuario("5f89277a1234567890abcdef");
  console.log(detallesUsuario);
  obj.destructor();

  // Actualizar el rol de un usuario
  const actualizarRol = await usuario.actualizarRolUsuario("5f89277a1234567890abcdef", "vip");
  console.log(actualizarRol);
  obj.destructor();

  // Listar usuarios por rol
  const usuariosVIP = await usuario.listarUsuarios("vip");
  console.log(usuariosVIP);
  obj.destructor();

  // Listar todos los usuarios
  const todosUsuarios = await usuario.listarUsuarios();
  console.log(todosUsuarios);
  obj.destructor();
```

### Notas Importantes

- Asegúrate de que los IDs utilizados (`id`) existan en la base de datos.
- Los roles deben ser exactamente "admin", "estandar", o "vip" como se especifica en el sistema.
- Maneja posibles errores utilizando `try-catch` al llamar a los métodos asíncronos.
- las credenciales en el archivo .env deben ser las del único admin, solo él puede editar, actualizar tanto usuarios como roles :

```bash
MONGODB_HOST=mongodb://
MONGODB_USER=camilo
MONGODB_PASS=1111
MONGODB_PORT=33654
MONGODB_CLUSTER=viaduct.proxy.rlwy.net
MONGODB_DBNAME=CineCampus
```

