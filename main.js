import { Pelicula } from './js/model/pelicula.js';
import { Asiento } from './js/model/asiento.js';
import { Boleto } from './js/model/boleto.js';
import { Compra } from './js/model/compra.js';
import { Proyeccion } from './js/model/proyeccion.js';
import { Sala } from './js/model/sala.js';
import { Vip } from './js/model/tarjeta_vip.js';
import { Usuario } from './js/model/usuario.js';


let obj;

// Caso de uso 1. Selección de Películas: /////////////////////////////////////////////////////////////////////////////

/**
 * This function retrieves all the movies from the catalog.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of movie objects.
 * Each movie object contains properties such as id, title, description, duration, etc.
 *
 * @example
 * // Example usage:
 * async function main() {
 *   try {
 *     const peliculas = await listarTodasLasPeliculas();
 *     console.log(peliculas);
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * }
 * main();
 */
// creamos esta funcion para poder traer datos especificos de cada pelicula en el catalogo
async function listarTodasLasPeliculas() {
  let obj = new Pelicula();
  const peliculas = await obj.getAllPeliculas();
  console.log(peliculas);
  obj.destructor();
}
// podemos descomentar este await para realizar el filtro de las peliculas
//await listarTodasLasPeliculas();

/**
 * Retrieves detailed information about a specific movie, including its proyecciones.
 *
 * @param {string} id - The unique identifier of the movie.
 *
 * @returns {Promise<Object>} A promise that resolves to a movie object.
 * The movie object contains properties such as id, title, description, duration, proyecciones, etc.
 *
 * @example
 * // Example usage:
 * async function main() {
 *   try {
 *     const pelicula = await obtenerDetallesPelicula('66a00a936a82374ecd0c82c8'); // el id debe ser correcto y debe existir
 *     console.log(pelicula);
 *   } catch (error) {
 *     console.error('Error:', error);
 *   }
 * }
 * main();
 */
// luego creamos esta funcion para obtener detalles especificos de peliculas y sus proyecciones
async function obtenerDetallesPelicula(id) {
  let obj = new Pelicula();
  const pelicula = await obj.getPeliculaById(id);
  console.log(pelicula);
  obj.destructor();
}
// descomentamos este await para filtrar cada detalle de cada pelicula con sus proyecciones
//await obtenerDetallesPelicula('66a00a936a82374ecd0c82c8'); // el id debe ser correcto y debe existir
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////