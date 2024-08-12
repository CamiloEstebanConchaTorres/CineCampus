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
    movieDetailsContainer.innerHTML = `
      <div class="movie-header">
        <img src="${movie.imagen}" alt="${movie.titulo}" class="movie-poster">
        <h2>${movie.titulo}</h2>
        <p>${movie.genero.join(', ')}</p>
        <button class="watch-trailer">Watch Trailer</button>
      </div>
      <div class="movie-description">
        <p>${movie.sinopsis}</p>
      </div>
      <div class="movie-cast">
        <h3>Cast</h3>
        <div class="cast-list">
          ${movie.actores.map(actor => `
            <div class="cast-member">
              <img src="${actor.imagen}" alt="${actor.nombre}">
              <p>${actor.nombre}</p>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="cinema-selection">
        <h3>Cinema</h3>
        <div class="cinema-option">
          <img src="path_to_cinema_logo.jpg" alt="Cinema Logo">
          <div>
            <h4>Atrium Cinemas</h4>
            <p>Staff Lines, Soddor, Karachi</p>
          </div>
        </div>
        <!-- Agregar más opciones de cine si es necesario -->
      </div>
      <button class="book-now">Book Now</button>
    `;
  
    // Añadir evento al botón "Watch Trailer"
    const trailerButton = movieDetailsContainer.querySelector('.watch-trailer');
    trailerButton.addEventListener('click', () => {
      // Aquí puedes agregar la lógica para mostrar el trailer
      alert('Trailer functionality not implemented yet');
    });
  
    // Añadir evento al botón "Book Now"
    const bookButton = movieDetailsContainer.querySelector('.book-now');
    bookButton.addEventListener('click', () => {
      // Aquí puedes agregar la lógica para la reserva
      alert('Booking functionality not implemented yet');
    });
  }