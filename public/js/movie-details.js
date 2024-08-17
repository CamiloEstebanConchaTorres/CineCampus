document.addEventListener('DOMContentLoaded', () => {
  const movieData = JSON.parse(localStorage.getItem('selectedMovie'));
  if (movieData) {
    displayMovieDetails(movieData);
  } else {
    console.error('No movie data found');
  }
});

function displayMovieDetails(movie) {
  const movieDetailsContainer = document.getElementById('movie-details');

  // Fechas en las que no se debe mostrar el botón "Book Now"
  const excludedDates = [
    '2024-11-01', '2024-11-10', '2024-11-15',
    '2024-12-01', '2024-12-10', '2024-12-15',
    '2024-12-20', '2024-12-25', '2024-12-30', '2024-12-31'
  ];

  // Verificacion si la fecha de estreno está en la lista de fechas excluidas
  const isExcludedDate = excludedDates.includes(movie.fechaEstreno);

  movieDetailsContainer.innerHTML = `
    <div class="movie-header">
      <img src="${movie.imagen}" alt="${movie.titulo}" class="movie-poster">
    </div>
    <div class="div_watch">
      <div class="left_row_watch">
        <h2>${movie.titulo}</h2>
        <p>${movie.genero.join(', ')}</p>
      </div>
      <div class="Rigth_row_watch">
        <button class="watch-trailer">Watch Trailer</button>
      </div>
    </div>
    <div class="movie-description">
      <p>${movie.sinopsis}</p>
    </div>
    <div class="movie-cast">
      <h3>Cast</h3>
      <div class="cast-list">
        ${movie.actores.map(actor => 
          `<div class="cast-member">
            <img src="${actor.imagen}" alt="${actor.nombre}">
            <div class="cast-member-rol">
              <p>${actor.nombre}</p>
              <small>${actor.rol}</small>
            </div>
          </div>`
        ).join('')}
      </div>
    </div>
    <div class="cinema-selection">
      <h3>Cinema</h3>
      <div class="cinema-option">
        <div class="cinema-text">
          <h4>Cine Campus</h4>
          <p>Zona Franca Santander, Zenith, Anillo Vial #piso 6, Bucaramanga, El Caucho, Floridablanca, Santander</p>
        </div>
        <img src="/storage/img/Campus.png" alt="Cinema Logo">
      </div>
      <!-- Agregar más opciones de cine si es necesario -->
    </div>
    ${isExcludedDate ? '' : '<button class="book-now">Book Now</button>'}
  `;

  // Añadir evento al botón "Watch Trailer"
  const trailerButton = movieDetailsContainer.querySelector('.watch-trailer');
  trailerButton.addEventListener('click', () => {
    const userConfirmed = confirm('Serás redirigido a otra página para ver el tráiler. ¿Deseas continuar?');
    if (userConfirmed) {
      window.location.href = movie.trailer;
    } else {
      alert('Redirección cancelada.');
    }
  });

  // Añadir evento al botón "Book Now" si existe
  if (!isExcludedDate) {
    const bookButton = movieDetailsContainer.querySelector('.book-now');
    bookButton.addEventListener('click', () => {
      window.location.href = `choose-seat.html?pelicula_id=${movie._id}`;
    });
  }
}
