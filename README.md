# CineCampus

**CineCampus** es una aplicación web diseñada para la gestión de reservas de boletos para cines. Permite a los usuarios ver películas, seleccionar asientos, y completar la compra. La aplicación utiliza Node.js con Express para el backend y HTML/CSS/JavaScript para el frontend, con MongoDB para la base de datos.

## Funcionalidades

- **Ver películas**: Muestra una lista de películas en cartelera y próximamente.
- **Detalles de película**: Proporciona información detallada de cada película, incluyendo la sinopsis, elenco, y la opción de ver el tráiler.
- **Seleccionar asientos**: Permite a los usuarios seleccionar asientos en la proyección de su elección.
- **Reservar boletos**: Los usuarios pueden seleccionar la fecha, hora, y tipo de asiento, y luego completar la compra.
- **Resumen de compra**: Muestra un resumen detallado de la compra antes de confirmar.
- **Confirmación de compra**: Muestra un código de confirmación y detalles de la reserva.

## Tecnologías Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Base de Datos**: MongoDB
- **API**: Endpoints para la gestión de películas, usuarios, y reservas

## Instalación

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/CamiloEstebanConchaTorres/CineCampus
   cd CineCampus
   ```

2. **Instala las dependencias del proyecto:**

   Asegúrate de tener Node.js instalado. Luego, ejecuta:

   ```bash
   npm i
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   **Importante:** Reemplazar variables de entorno por el usuario deseado.

   ```bash
   MONGO_URI=mongodb://camilo:cami123@junction.proxy.rlwy.net:28510/CineCampus
   MONGO_USER=camilo

   EXPRESS_HOST=0.0.0.0
   EXPRESS_PORT=5001
   EXPRESS_STATIC=public


   ```

4. **Inicia el servidor:**

   ```bash
   npm run dev
   ```

   El servidor estará disponible en `http://localhost:5001`

## Uso

1. **Accede a la aplicación**: Abre tu navegador y navega a `http://localhost:5001`
2. **Explora las películas**: En la página principal, podrás ver las películas en cartelera y próximamente.
3. **Selecciona una película**: Haz clic en una película para ver sus detalles.
4. **Reserva asientos**: En la página de detalles de la película, selecciona la fecha, hora, y asientos.
5. **Completa la compra**: Revisa el resumen de tu compra y confirma el pedido.
6. **Confirmación**: Recibirás un código de confirmación tras completar la compra.



## Autor

- **Camilo Esteban Concha Torres**
