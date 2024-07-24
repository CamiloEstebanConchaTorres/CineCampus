import { Pelicula } from './js/model/pelicula.js';
import { Asiento } from './js/model/asiento.js';
import { Boleto } from './js/model/boleto.js';
import { Compra } from './js/model/compra.js';
import { Proyeccion } from './js/model/proyeccion.js';
import { Sala } from './js/model/sala.js';
import { Vip } from './js/model/tarjeta_vip.js';
import { Usuario } from './js/model/usuario.js';


let obj;

async function listarTodasLasPeliculas() {
  let obj = new Pelicula();
  const peliculas = await obj.getAllPeliculas();
  console.log(peliculas);
  obj.destructor();
}
//await listarTodasLasPeliculas();


async function obtenerDetallesPelicula(id) {
  let obj = new Pelicula();
  const pelicula = await obj.getPeliculaById(id);
  console.log(pelicula);
  obj.destructor();
}
await obtenerDetallesPelicula('66a00a936a82374ecd0c82c8');