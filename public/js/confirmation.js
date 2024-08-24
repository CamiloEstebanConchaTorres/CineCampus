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
        const totalPrice = orderDetails.seats.reduce((total, seat) => total + seat.precio_final, 0).toFixed(2);

        // Actualizar el título de la película y la imagen
        document.getElementById('movie-title').textContent = movieTitle;
        document.getElementById('movie-image').src = movieImage;

        // Actualizar la fecha, hora y costo en el HTML
        document.getElementById('date').textContent = movieDate;
        document.getElementById('time').textContent = movieTime;
        document.getElementById('cost').textContent = `$${totalPrice}`;

    } else {
        console.error('No se encontraron los detalles de confirmación o pedido');
    }
});
