document.addEventListener('DOMContentLoaded', () => {
    // Obtener los datos de confirmación y detalles del pedido de localStorage
    const confirmacion = JSON.parse(localStorage.getItem('confirmacion'));
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));

    if (confirmacion && orderDetails) {
        // Mostrar el código de confirmación
        document.getElementById('order-number').textContent = confirmacion.codigo_confirmacion;

        // Mostrar los detalles del asiento
        const seatDetails = orderDetails.seats.map(seat => 
            `${seat.fila}${seat.numero_asiento}`
        ).join(', ');
        document.getElementById('seat').textContent = seatDetails;

        // Mostrar la información de la película
        const movieTitle = orderDetails.movie.titulo;
        const movieImage = orderDetails.movie.imagen;
        const movieDate = orderDetails.date;
        const movieTime = orderDetails.time;

        // Actualizar el título de la película y la imagen
        const ticketInfo = document.querySelector('.ticket-info');
        ticketInfo.querySelector('h1').textContent = movieTitle;

        // Actualizar la imagen de la película (si quieres incluirla en la página de confirmación)
        const movieImageElement = document.createElement('img');
        movieImageElement.src = movieImage;
        movieImageElement.alt = movieTitle;
        ticketInfo.insertBefore(movieImageElement, ticketInfo.querySelector('h3'));

        // Actualizar la fecha y la hora en el HTML
        const dateTimeElement = ticketInfo.querySelector('p');
        dateTimeElement.textContent = `Date: ${movieDate}, ${movieTime}`;

    } else {
        console.error('No se encontraron los detalles de confirmación o pedido');
    }
});

