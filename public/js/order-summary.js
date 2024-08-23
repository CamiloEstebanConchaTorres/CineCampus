document.addEventListener('DOMContentLoaded', () => {
    const movieData = JSON.parse(localStorage.getItem('selectedMovie'));
    if (movieData) {
        updateMovieDetails(movieData);
    } else {
        console.error('No movie data found');
    }
});

function updateMovieDetails(movie) {
    const movieDetailsElement = document.querySelector('.movie-details');
    
    // Actualizar la imagen de la película
    const movieImage = movieDetailsElement.querySelector('img');
    movieImage.src = movie.imagen;
    movieImage.alt = movie.titulo;

    // Actualizar el título y género de la película
    const movieInfo = movieDetailsElement.querySelector('.movie-info');
    movieInfo.innerHTML = `
        <h2>${movie.titulo}</h2>
        <p>${movie.genero.join(', ')}</p>
        <h3>Cine Campus</h3>
    `;
}
