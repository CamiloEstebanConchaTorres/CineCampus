document.addEventListener('DOMContentLoaded', () => {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (orderDetails) {
        updateOrderSummary(orderDetails);
    } else {
        console.error('No order details found');
    }
});

function updateOrderSummary(orderDetails) {
    const movieData = orderDetails.movie;
    const date = orderDetails.date;
    const time = orderDetails.time;
    const seats = orderDetails.seats;

    const movieDetailsElement = document.querySelector('.movie-details');
    
    // Actualizar la imagen de la película
    const movieImage = movieDetailsElement.querySelector('img');
    movieImage.src = movieData.imagen;
    movieImage.alt = movieData.titulo;

    // Actualizar el título y género de la película
    const movieInfo = movieDetailsElement.querySelector('.movie-info');
    movieInfo.innerHTML = `
        <h2>${movieData.titulo}</h2>
        <p>${movieData.genero.join(', ')}</p>
        <p>Cine Campus</p>
        <p>${date}, ${time}</p>
    `;

    // Actualizar detalles del pedido
    const orderDetailsElement = document.querySelector('.order-details');
    const seatDetails = seats.map(seat => 
        `<p><span>REGULAR SEAT</span> <span>${seat.numero_asiento}</span></p>`
    ).join('');
    const totalSeats = seats.length;
    const totalPrice = seats.reduce((total, seat) => total + seat.precio_final, 0).toFixed(2);

    orderDetailsElement.innerHTML = `
        <p><span>ORDER NUMBER :</span> <span>123456786</span></p>
        ${seatDetails}
        <p><span>TOTAL</span> <span>$${totalPrice} x ${totalSeats}</span></p>
        <p><span>SERVICE FEE</span> <span>$1,99 x 1</span></p>
    `;
    
    // Aquí puedes añadir el código para el método de pago y el temporizador si es necesario
    const paymentMethodElement = document.querySelector('.payment-method');
    paymentMethodElement.innerHTML = `
        <h3>Payment method</h3>
        <div class="card-details">
            <img src="mastercard-logo.png" alt="MasterCard">
            <p>MasterCard</p>
            <p>**** **** 0998 7865</p>
        </div>
        <div class="payment-timer">
            <p>Complete your payment in</p>
            <p class="timer" id="timer">04:59</p>
        </div>
    `;

    // Configura el temporizador
    setTimer();
}

function setTimer() {
    const timerElement = document.getElementById('timer');
    let timeLeft = 300; // 5 minutos en segundos

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateTimer, 1000);
        }
    }

    updateTimer();
}
