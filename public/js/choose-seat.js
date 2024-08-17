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
            displayProyecciones(proyecciones);
            // Inicializar con la primera proyección
            displayAsientos(proyecciones[0].asientos);
            displayFechas(proyecciones.map(p => p.fechaHora));
            // Puedes ajustar el displayHorarios si tienes horarios específicos
        } else {
            console.error("No se encontraron proyecciones");
        }
    } catch (error) {
        console.error("Error fetching proyecciones:", error);
    }
});

function displayProyecciones(proyecciones) {
    const proyeccionesContainer = document.getElementById('proyecciones-container');
    proyeccionesContainer.innerHTML = '';

    proyecciones.forEach((proyeccion, index) => {
        const proyeccionElement = document.createElement('div');
        proyeccionElement.classList.add('proyeccion');
        
        proyeccionElement.textContent = `Proyección ${index + 1}: ${new Date(proyeccion.fechaHora).toLocaleString()}`;
        
        // Añade un evento de clic para cambiar a esta proyección
        proyeccionElement.addEventListener('click', () => {
            displayAsientos(proyeccion.asientos);
            displayFechas([proyeccion.fechaHora]);
        });

        proyeccionesContainer.appendChild(proyeccionElement);
    });
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

function displayFechas(fechas) {
    const dateSelection = document.getElementById('date-selection');
    dateSelection.innerHTML = '';

    fechas.forEach(fecha => {
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = new Date(fecha).toLocaleDateString();
        dateSelection.appendChild(dateElement);
    });
}

function selectSeat(seatElement) {
    // Lógica para seleccionar un asiento
    const selected = document.querySelector('.seat.selected');
    if (selected) {
        selected.classList.remove('selected');
    }
    seatElement.classList.add('selected');
}
