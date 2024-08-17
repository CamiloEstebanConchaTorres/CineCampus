document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('pelicula_id');

    try {
        const response = await fetch(`/pelicula/${peliculaId}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        displayAsientos(data.data.asientos);
        displayFechas(data.data.fechas);
        displayHorarios(data.data.horarios);
    } catch (error) {
        console.error("Error fetching proyecciones:", error);
    }
});

function displayProyecciones(proyecciones) {
    const proyeccionesContainer = document.getElementById('proyecciones-container');
    if (!proyecciones || !Array.isArray(proyecciones)) {
        console.error("No se encontraron proyecciones");
        return;
    }
    
    proyeccionesContainer.innerHTML = '';
    proyecciones.forEach(proyeccion => {
        const proyeccionElement = document.createElement('div');
        proyeccionElement.classList.add('proyeccion');
        proyeccionElement.innerHTML = `
            <p>Fecha y Hora: ${new Date(proyeccion.fechaHora).toLocaleString()}</p>
            <p>Precio: ${proyeccion.precio} USD</p>
            <button class="book-now" data-id="${proyeccion._id}">Reservar ahora</button>
        `;
        proyeccionesContainer.appendChild(proyeccionElement);
    });
}

function displayAsientos(asientos) {
    const seatMap = document.getElementById('seat-map');
    seatMap.innerHTML = '';

    asientos.forEach((fila, filaIndex) => {
        fila.forEach((asiento, asientoIndex) => {
            const seatElement = document.createElement('div');
            seatElement.classList.add('seat');

            if (asiento.disponible) {
                seatElement.classList.add('available');
                seatElement.addEventListener('click', () => selectSeat(seatElement));
            } else {
                seatElement.classList.add('reserved');
            }

            seatElement.textContent = asientoIndex + 1;
            seatMap.appendChild(seatElement);
        });
    });
}

function selectSeat(seatElement) {
    const previouslySelected = document.querySelector('.seat.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
        previouslySelected.classList.add('available');
    }
    seatElement.classList.remove('available');
    seatElement.classList.add('selected');
}

function displayFechas(fechas) {
    const dateSelection = document.getElementById('date-selection');
    dateSelection.innerHTML = '';

    fechas.forEach(fecha => {
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = fecha;
        dateElement.addEventListener('click', () => selectDate(dateElement));
        dateSelection.appendChild(dateElement);
    });
}

function selectDate(dateElement) {
    const previouslySelected = document.querySelector('.date.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }
    dateElement.classList.add('selected');
}

function displayHorarios(horarios) {
    const timeSelection = document.getElementById('time-selection');
    timeSelection.innerHTML = '';

    horarios.forEach(horario => {
        const timeElement = document.createElement('div');
        timeElement.classList.add('time');
        timeElement.textContent = horario;
        timeElement.addEventListener('click', () => selectTime(timeElement));
        timeSelection.appendChild(timeElement);
    });
}

function selectTime(timeElement) {
    const previouslySelected = document.querySelector('.time.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }
    timeElement.classList.add('selected');
}
