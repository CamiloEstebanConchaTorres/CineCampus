document.addEventListener('DOMContentLoaded', () => {
    const timeRemainingElement = document.getElementById('time-remaining');
    let timeRemaining = 300; // 5 minutos en segundos

    const intervalId = setInterval(() => {
        timeRemaining--;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        timeRemainingElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            alert('Time is up! Your seats have been released.');
            cancelPurchase(); // Llamar a la función para cancelar la reserva
        }
    }, 1000);

    document.getElementById('confirm-purchase').addEventListener('click', confirmPurchase);
    document.getElementById('cancel-purchase').addEventListener('click', cancelPurchase);

    displayOrderSummary();
});

function displayOrderSummary() {
    const ticketDetails = JSON.parse(localStorage.getItem('selectedTickets'));
    const ticketDetailsElement = document.getElementById('ticket-details');
    const totalPriceElement = document.getElementById('total-price');

    let totalPrice = 0;
    ticketDetailsElement.innerHTML = '';

    ticketDetails.forEach(ticket => {
        totalPrice += ticket.precio_final;
        const ticketInfo = document.createElement('div');
        ticketInfo.textContent = `Seat: ${ticket.asiento_id} - Price: $${ticket.precio_final}`;
        ticketDetailsElement.appendChild(ticketInfo);
    });

    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

async function confirmPurchase() {
    const tickets = JSON.parse(localStorage.getItem('selectedTickets'));
    const paymentMethod = document.getElementById('payment-select').value;

    try {
        const response = await fetch('/compra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                boletos: tickets,
                usuarioId: localStorage.getItem('usuarioId'),
                metodoPago: paymentMethod,
                reserva: false,
            }),
        });

        const result = await response.json();
        if (result.mensaje === 'Compra completada con éxito') {
            alert('Purchase completed successfully!');
            window.location.href = '/confirmation.html';
        } else {
            alert('There was an error completing your purchase.');
        }
    } catch (error) {
        console.error('Error confirming purchase:', error);
    }
}

async function cancelPurchase() {
    const compraId = localStorage.getItem('compraId');

    try {
        const response = await fetch(`/compra/${compraId}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        if (result.mensaje === 'Reserva cancelada y asientos liberados') {
            alert('Your reservation has been canceled.');
            window.location.href = '/';
        } else {
            alert('There was an error canceling your reservation.');
        }
    } catch (error) {
        console.error('Error canceling purchase:', error);
    }
}
