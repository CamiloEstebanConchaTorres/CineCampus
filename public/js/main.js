document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  setupSearch();
});

async function fetchMovies() {
  try {
      const response = await fetch('/pelicula');
      const result = await response.json();
      displayMovies(result.data);
  } catch (error) {
      console.error('Error fetching movies:', error);
  }
}

function displayMovies(movies) {
  const nowPlayingList = document.querySelector('#now-playing .movie-list');
  const comingSoonList = document.querySelector('#coming-soon .movie-list');

  movies.forEach(movie => {
      const movieElement = createMovieElement(movie);
      // Aquí puedes decidir en qué lista colocar la película basándote en la fecha de estreno
      // Por ahora, las colocaremos todas en "Now playing"
      nowPlayingList.appendChild(movieElement);
  });
}

function createMovieElement(movie) {
  const movieCard = document.createElement('div');
  movieCard.classList.add('movie-card');
  movieCard.innerHTML = `
      <img src="${movie.imagen}" alt="${movie.titulo}">
      <div class="movie-info">
          <h3>${movie.titulo}</h3>
          <p>${movie.genero.join(', ')}</p>
      </div>
  `;
  return movieCard;
}

function setupSearch() {
  const searchInput = document.querySelector('.search-bar input');
  searchInput.addEventListener('input', debounce(performSearch, 300));
}

function performSearch() {
  const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
  const movieCards = document.querySelectorAll('.movie-card');

  movieCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const genres = card.querySelector('p').textContent.toLowerCase();
      if (title.includes(searchTerm) || genres.includes(searchTerm)) {
          card.style.display = '';
      } else {
          card.style.display = 'none';
      }
  });
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}












// import { Pelicula } from './js/model/pelicula.js';
// import { Asiento } from './js/model/asiento.js';
// import { Boleto } from './js/model/boleto.js';
// import { Compra } from './js/model/compra.js';
// import { Proyeccion } from './js/model/proyeccion.js';
// import { Sala } from './js/model/sala.js';
// import { Vip } from './js/model/tarjeta_vip.js';
// import { Usuario } from './js/model/usuario.js';


// let obj;

// // Caso de uso 1. Selección de Películas: /////////////////////////////////////////////////////////////////////////////
//   obj = new Pelicula();
//   const peliculas = await obj.getAllPeliculas();
//   //console.log(peliculas); // descomentamos para listar todas las peliculas de un catalogo
//   obj.destructor();

//   const pelicula = await obj.getPeliculaById("66a00a936a82374ecd0c82c8");
//   //console.log(pelicula); // descomentamos para listar los detalles especificos mas las proyecciones de una pelicula
//   obj.destructor();
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





// // Caso de uso 2.Compra de Boletos: ///////////////////////////////////////////////////////////////////////////////////////////////
//   // obj = new Proyeccion();
//   // const disponibilidad = await obj.verificarDisponibilidadAsientos("66a00c936a82374ecd0c82e5"); // id de la proyeccion existente y correcto
//   // console.log(`
//   //   Disponibilidad de asientos:
//   //   Total: ${disponibilidad.total}
//   //   Disponibles: ${disponibilidad.disponibles}
//   //   Ocupados: ${disponibilidad.ocupados}
//   //   Reservados: ${disponibilidad.reservados}
//   //   Detalles de asientos disponibles: ${JSON.stringify(disponibilidad.detalles.disponibles, null, 2)}
//   // `); // descomentar el console log para mostrarar los asientos disponibles de el id de la proyeccion que se esta cargando
//   // obj.destructor();

//   // obj = new Boleto();
//   // const result = await obj.comprarBoleto(
//   //   "66a00c936a82374ecd0c82e5", // insertar proyeccionId de la pelicula
//   //   "66a12a131c85a1dbadd68b3f", // insertar asientoId deseado, tener encuenta los vip, regular y discapacitados
//   //   "66a00d936a82374ecd0c8304", // insertar usuarioId quien compra el boleto
//   //   15, // insertar precio de la pelicula
//   //   0,  // insertar descuento solo si es un usuario vip
//   //   "tarjeta" // insertar el metodo de pago del boleto, posibles: (tarjeta, efectivo, paypal)
//   // );
//   // console.log(result);
//   // obj.destructor();
//   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




//   // Caso de uso 3. Asignación de Asientos ////////////////////////////////////////////////////////////////////////////////////////////////
//   // obj = new Boleto();
//   // const reservaResult = await obj.reservarAsiento(
//   //   "66a00c936a82374ecd0c82e6", // proyeccionId de la pelicula
//   //   "66a12a131c85a1dbadd68b50", // asientoId deseado
//   //   "66a00d936a82374ecd0c82fe", // usuarioId quien reserva el asiento
//   //   15, // precio de la pelicula
//   //   1.5,  // descuento solo si es un vip
//   //   "paypal" // método de pago
//   // );
//   // console.log(reservaResult);
//   // obj.destructor();

//   // const cancelResult = await obj.cancelarReserva(
//   //   "66a532c22d945dcabe528d0e", // insertar el id de la reserva de la coleccion: compra
//   //   "66a12a131c85a1dbadd68b50" // insertar dato del id del asiento de la coleccion: asiento
//   // );
//   // console.log(cancelResult);
//   // obj.destructor();
//   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////







//   // Caso de uso 4. Descuentos y Tarjetas VIP: /////////////////////////////////////////////////////////////////////////////////////////////
//   // obj = new Boleto();
//   // const compraVIPResult = await obj.comprarBoletoConDescuento(
//   //   "66a00c936a82374ecd0c82f5", // ingresar el id de la proyeccion a ver
//   //   "66a12a131c85a1dbadd68b41", // ingresar el id del asiento (si no es de tipo vip no dejara)
//   //   "66a00d936a82374ecd0c82ff", // ingresar id del usuario (si no es usuario vip no dejara)
//   //   12, // este precio es el precio de la pelicula pero dependiendo del nivel de un usuario vip si es oro: 20% de descuento, plata: 15% de descuento y bronce: 10 % de descuento
//   //   "paypal" // metodo de pago, posibles: (efectivo, paypal, tarjeta)
//   // );
//   // console.log(compraVIPResult);
//   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////









//   // Caso de uso 5. Roles Definidos ///////////////////////////////////////////////////////////////////////////////////////////////////////
//   // creacion del usuario:
//   // obj = new Usuario();
//   // const nuevoUsuario = await obj.crearUsuario(
//   //   "Usuarionombreprueba3", // creamos el nombre del nuevo usuario
//   //   "apellidoprueba", // apellidos para el nuevo usuario
//   //   "pruebas.sanchez@example.com", // email del nuevo usuario
//   //   "1236", // contraseña del nuevo usuario (esta contraseña sera hasheada, para una mas segura)
//   //   "estandar" // rol para el nuevo usuario posibles: (estandar, vip, admin) asi tal cual sino no sirve
//   // );
//   // console.log(nuevoUsuario);
//   // // obtenemos los detalles de un usuario especifico:
//   // obj = new Usuario();
//   // const detallesUsuario = await obj.obtenerDetallesUsuario("66a00d936a82374ecd0c8304"); // agregamos un id existente sino no sirve
//   // console.log(detallesUsuario);
//   // obj.destructor();
//   // // actualizar el rol de un usuario
//   // obj = new Usuario();                                 // id existente del usuario, // rol nuevo para ese usuario
//   // const actualizarRol = await obj.actualizarRolUsuario("66a68d2fe6eabec625a522d8", "vip"); // posibles roles (estandar, vip, admin) tal cual si no no sirve
//   // console.log(actualizarRol);
//   // obj.destructor();
//   // // Filtrar usuarios por su rol
//   // obj = new Usuario();
//   // const usuariosVIP = await obj.listarUsuarios("estandar"); // colocamos el rol por el cual queremos filtrar a los usuarios, permitidos: (estandar, vip, admin)
//   // console.log(usuariosVIP);
//   // obj.destructor();
//   /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////