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





// Caso de uso 2.Compra de Boletos: ///////////////////////////////////////////////////////////////////////////////////////////////
  obj = new Proyeccion();
  const disponibilidad = await obj.verificarDisponibilidadAsientos("66a00c936a82374ecd0c82e5"); // id de la proyeccion existente y correcto
  console.log(`
    Disponibilidad de asientos:
    Total: ${disponibilidad.total}
    Disponibles: ${disponibilidad.disponibles}
    Ocupados: ${disponibilidad.ocupados}
    Reservados: ${disponibilidad.reservados}
    Detalles de asientos disponibles: ${JSON.stringify(disponibilidad.detalles.disponibles, null, 2)}
  `); // descomentar el console log para mostrarar los asientos disponibles de el id de la proyeccion que se esta cargando
  obj.destructor();

  obj = new Boleto();
  const result = await obj.comprarBoleto(
    "66a00c936a82374ecd0c82e5", // insertar proyeccionId de la pelicula
    "66a12a131c85a1dbadd68b3f", // insertar asientoId deseado, tener encuenta los vip, regular y discapacitados
    "66a00d936a82374ecd0c8304", // insertar usuarioId quien compra el boleto
    15, // insertar precio de la pelicula
    0,  // insertar descuento solo si es un usuario vip
    "tarjeta" // insertar el metodo de pago del boleto, posibles: (tarjeta, efectivo, paypal)
  );
  //console.log(result); // descomentar este console.log y ejecutar en la consola solo si esos son los datos correctos de una compra de un boleto
  obj.destructor();
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
