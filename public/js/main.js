document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    setupSearch();
    setupNavSearch();
});

async function fetchUserInfo() {
    try {
        const response = await fetch('/usuario');
        const result = await response.json();
        if (result.data) {
            displayUserInfo(result.data);
        }
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
}

function displayUserInfo(userInfo) {
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');

    if (userInfo.imagen) {
        userAvatar.src = userInfo.imagen;
    }
    userName.textContent = `Hi, ${userInfo.nombre}`;
}

async function fetchMovies() {
  try {
      const response = await fetch('/pelicula');
      const result = await response.json();
      const movies = result.data;

      movies.sort((a, b) => new Date(a.fechaEstreno) - new Date(b.fechaEstreno));
      const halfway = Math.ceil(movies.length / 2);
      const nowPlayingMovies = movies.slice(0, halfway);
      const comingSoonMovies = movies.slice(halfway);

      displayMovies(nowPlayingMovies, '#now-playing .movie-carousel');
      displayMovies(comingSoonMovies, '#coming-soon .movie-carousel');

      setupCarousel('#now-playing');
      setupCarousel('#coming-soon'); 
  } catch (error) {
      console.error('Error fetching movies:', error);
  }
}


function displayMovies(movies, listSelector) {
    const movieList = document.querySelector(listSelector);
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = createMovieElement(movie);
        movieList.appendChild(movieElement);
    });
}

function createMovieElement(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
        <img src="${movie.imagen}" alt="${movie.titulo}" onerror="this.src='https://via.placeholder.com/150';">
        <div class="movie-info">
            <h3>${movie.titulo}</h3>
            <p>${movie.genero.join(', ')}</p>
        </div>
    `;
    movieCard.addEventListener('click', () => showMovieDetails(movie));
    return movieCard;
}

function showMovieDetails(movie) {
    // Guardar los datos de la película en localStorage para usarlos en la página de detalles
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    // Redirigir a la página de detalles
    window.location.href = 'views/movie-details.html';
}

function setupSearch() {
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', debounce(performSearch, 300));
}

function setupNavSearch() {
    const searchNavLink = document.querySelector('.bottom-nav .nav-item:nth-child(2)');
    searchNavLink.addEventListener('click', () => {
        const searchBar = document.querySelector('#search-bar input');
        searchBar.focus();
    });
}

function performSearch() {
    const searchTerm = document.querySelector('.search-bar input').value.toLowerCase();
    const movieCards = document.querySelectorAll('.movie-card');
    const nowPlayingContainer = document.querySelector('#now-playing .movie-carousel');
    const comingSoonContainer = document.querySelector('#coming-soon .movie-carousel');
    const noResultsNowPlaying = document.querySelector('#now-playing .no-results');
    const noResultsComingSoon = document.querySelector('#coming-soon .no-results');
    
    let hasResultsNowPlaying = false;
    let hasResultsComingSoon = false;

    // Mostrar u ocultar tarjetas y mensajes en la sección de "Now Playing"
    movieCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const genres = card.querySelector('p').textContent.toLowerCase();
        if (title.includes(searchTerm) || genres.includes(searchTerm)) {
            card.style.display = '';
            if (nowPlayingContainer.contains(card)) {
                hasResultsNowPlaying = true;
            } else if (comingSoonContainer.contains(card)) {
                hasResultsComingSoon = true;
            }
        } else {
            card.style.display = 'none';
        }
    });

    // Mostrar o esconder el mensaje de resultados no encontrados en "Now Playing"
    noResultsNowPlaying.style.display = hasResultsNowPlaying ? 'none' : 'block';

    // Mostrar o esconder el mensaje de resultados no encontrados en "Coming Soon"
    noResultsComingSoon.style.display = hasResultsComingSoon ? 'none' : 'block';
}


function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function setupCarousel(sectionId) {
  const section = document.querySelector(sectionId);
  const indicators = section.querySelectorAll('.indicator');
  const carousel = section.querySelector('.movie-carousel');

  carousel.addEventListener('scroll', () => {
      let scrollPosition = carousel.scrollLeft;
      let width = carousel.offsetWidth;
      let index = Math.round(scrollPosition / width);

      indicators.forEach((indicator, i) => {
          if (i === index) {
              indicator.classList.add('active');
          } else {
              indicator.classList.remove('active');
          }
      });
  });
  if (sectionId === '#coming-soon') {
      carousel.style.scrollSnapType = 'x mandatory';
      carousel.style.scrollSnapPointsX = 'repeat(100%)';
      carousel.style.scrollPadding = '0 50%'; // Para centrar la tarjeta
  }
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