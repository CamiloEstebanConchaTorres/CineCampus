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
        `<p><span>${seat.tipo_asiento.toUpperCase()} SEAT</span> <span>${seat.fila}${seat.numero_asiento}</span></p>`
    ).join('');
    const totalSeats = seats.length;
    const totalPrice = seats.reduce((total, seat) => total + seat.precio_final, 0).toFixed(2);

    orderDetailsElement.innerHTML = `
        <p><span>ORDER NUMBER :</span> <span>123456786</span></p>
        ${seatDetails}
        <p><span>TOTAL</span> <span>$${totalPrice} x ${totalSeats}</span></p>
        <p><span>SERVICE FEE</span> <span>$1.99 x 1</span></p>
    `;
    
    // Aquí puedes añadir el código para el método de pago y el temporizador si es necesario
    const paymentMethodElement = document.querySelector('.payment-method');
    paymentMethodElement.innerHTML = `
        <h3>Payment method</h3>
        <div class="card-details">
            <img src="../storage/img/paypal.png" alt="PayPal">
            <div class="method_pay">
                <p>PayPal</p>
                <p>**** **** 0998 7865</p>
            </div>
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
    let timeLeft = 1000; // 5 minutos en segundos

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateTimer, 1000);
        } else {
            handleTimeout(); // Llamar a la función de manejo de tiempo de espera
        }
    }

    updateTimer();
}

async function handleTimeout() {
    // Obtener los detalles del pedido desde localStorage
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    const selectedSeats = orderDetails ? orderDetails.seats : [];

    // Si hay asientos seleccionados, liberar su estado
    if (selectedSeats.length > 0) {
        try {
            await fetch('/liberar-asientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    asientos: selectedSeats,
                }),
            });
        } catch (error) {
            console.error('Error liberando asientos:', error);
        }
    }

    // Redirigir al usuario a la vista principal
    window.location.href = '../index.html';
}

document.querySelector('.buy-ticket-button').addEventListener('click', async () => {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails'));

    // Crear el objeto de la compra
    const compraData = {
        usuario_id: orderDetails.usuario_id, // Asegúrate de que el usuario_id esté almacenado en orderDetails
        boleto: orderDetails.seats.map(seat => ({
            proyeccion_id: orderDetails.movie.proyeccion_id,
            asiento_id: seat.asiento_id,
            usuario_id: orderDetails.usuario_id, // Asegúrate de que el usuario_id esté disponible
            precio: seat.precio,
            descuento: seat.descuento || 0,  // Si hay un descuento
            precio_final: seat.precio_final || seat.precio,
            estado: 'pagado',
            fecha_compra: new Date().toISOString()
        })),
        precio_total: orderDetails.totalPrice,
        metodo_pago: "paypal", // Puedes cambiarlo según lo que el usuario haya seleccionado
        estado: "completada",
        fecha_compra: new Date().toISOString(),
        codigo_confirmacion: "CONF" + Math.floor(Math.random() * 1000000000) // Genera un código de confirmación
    };

    try {
        const response = await fetch('/compra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(compraData),
        });

        if (!response.ok) {
            throw new Error('Error al realizar la compra');
        }

        const data = await response.json();

        // Redirigir a la página de confirmación
        localStorage.setItem('confirmacion', JSON.stringify(data));
        window.location.href = 'confirmation.html';
    } catch (error) {
        console.error('Error al guardar la compra:', error);
        alert('Hubo un problema al procesar tu compra. Por favor, intenta de nuevo.');
    }
});

