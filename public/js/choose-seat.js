document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('pelicula_id');

    try {
        const response = await fetch(`/pelicula/${peliculaId}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const { proyecciones } = data.data;

        if (proyecciones && proyecciones.length > 0) {
            displayFechas(proyecciones);
            displayHorarios(proyecciones[0].horarios);
            displayAsientos(proyecciones[0].asientos);
            updatePrice(proyecciones[0].precio);
        } else {
            console.error("No se encontraron proyecciones");
        }
    } catch (error) {
        console.error("Error fetching proyecciones:", error);
    }
});

function displayFechas(proyecciones) {
    const dateSelection = document.getElementById('date-selection');
    dateSelection.innerHTML = '';

    proyecciones.forEach((proyeccion, index) => {
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = new Date(proyeccion.fechaHora).toLocaleDateString();
        dateElement.addEventListener('click', () => {
            // Cambiar la proyección seleccionada
            selectDate(dateElement);
            displayHorarios(proyeccion.horarios);
            displayAsientos(proyeccion.asientos);
            updatePrice(proyeccion.precio);
        });
        
        if (index === 0) {
            dateElement.classList.add('selected');
        }

        dateSelection.appendChild(dateElement);
    });
}

function displayHorarios(horarios) {
    const timeSelection = document.getElementById('time-selection');
    timeSelection.innerHTML = '';

    if (horarios && horarios.length > 0) {
        horarios.forEach((horario, index) => {
            const timeElement = document.createElement('div');
            timeElement.classList.add('time');
            timeElement.textContent = new Date(horario).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timeElement.addEventListener('click', () => {
                selectTime(timeElement);
            });

            if (index === 0) {
                timeElement.classList.add('selected');
            }

            timeSelection.appendChild(timeElement);
        });
    } else {
        console.error("No se encontraron horarios para la proyección seleccionada");
    }
}

function displayAsientos(asientos) {
    const seatMap = document.getElementById('seat-map');
    seatMap.innerHTML = '';

    asientos.forEach(asiento => {
        const seatElement = document.createElement('div');
        seatElement.classList.add('seat');

        if (asiento.estado === 'disponible') {
            seatElement.classList.add('available');
            seatElement.addEventListener('click', () => selectSeat(seatElement));
        } else {
            seatElement.classList.add('reserved');
        }

        seatElement.textContent = asiento.numero_asiento;
        seatMap.appendChild(seatElement);
    });
}

function updatePrice(precio) {
    const priceDisplay = document.getElementById('price');
    if (priceDisplay) {
        priceDisplay.textContent = `$${precio.toFixed(2)}`;
    } else {
        console.error("No se encontró el elemento con id 'price'");
    }
}

function selectDate(dateElement) {
    const allDates = document.querySelectorAll('.date');
    allDates.forEach(date => date.classList.remove('selected'));
    dateElement.classList.add('selected');
}

function selectTime(timeElement) {
    const allTimes = document.querySelectorAll('.time');
    allTimes.forEach(time => time.classList.remove('selected'));
    timeElement.classList.add('selected');
}

function selectSeat(seatElement) {
    const isSelected = seatElement.classList.contains('selected');
    if (isSelected) {
        seatElement.classList.remove('selected');
    } else {
        seatElement.classList.add('selected');
    }
}
