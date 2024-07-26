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
  obj = new Pelicula();
  const peliculas = await obj.getAllPeliculas();
  //console.log(peliculas); // descomentamos para listar todas las peliculas de un catalogo
  obj.destructor();

  const pelicula = await obj.getPeliculaById("66a00a936a82374ecd0c82c8");
  //console.log(pelicula); // descomentamos para listar los detalles especificos mas las proyecciones de una pelicula
  obj.destructor();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


obj = new Proyeccion();
  const disponibilidad = await obj.verificarDisponibilidadAsientos("66a00c936a82374ecd0c82e5"); // id existente y correcto
  console.log(`
    Disponibilidad de asientos:
    Total: ${disponibilidad.total}
    Disponibles: ${disponibilidad.disponibles}
    Ocupados: ${disponibilidad.ocupados}
    Reservados: ${disponibilidad.reservados}
    Detalles de asientos disponibles: ${JSON.stringify(disponibilidad.detalles.disponibles, null, 2)}
  `);
obj.destructor();



obj = new Boleto();
const result = await obj.comprarBoleto(
  "66a00c936a82374ecd0c82e5", // proyeccionId de la pelicula
  "66a12a131c85a1dbadd68b3f", // asientoId deseado
  "66a00d936a82374ecd0c8304", // usuarioId quien compra el boleto
  15, // precio de la pelicula
  0,  // descuento solo si es un vip
  "tarjetas" //metodo de pago del boleto posibles: (tarjeta, efectivo, paypal)
);
console.log(result);
obj.destructor();
