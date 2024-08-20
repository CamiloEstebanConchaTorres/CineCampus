let precioAsiento = 0;
let precioAsientoVIP = 0;
let asientosSeleccionados = 0;
let precioTotal = 0;

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
            // Muestra horarios y asientos de la primera proyección por defecto
            displayHorarios(proyecciones[0].horarios);
            displayAsientos(proyecciones[0].asientos);
            precioAsiento = proyecciones[0].precio; // Precio base del asiento
            precioAsientoVIP = proyecciones[0].precio_vip || precioAsiento * 1.5;
            updatePrice(precioTotal);
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
        dateElement.textContent = proyeccion.fecha;
        dateElement.addEventListener('click', () => {
            selectDate(dateElement);
            displayHorarios(proyeccion.horarios);
            displayAsientos(proyeccion.asientos);
            precioAsiento = proyeccion.precio; // Actualiza el precio base del asiento
            precioAsientoVIP = proyeccion.precio_vip || precioAsiento * 1.5; // Actualiza el precio VIP
            updatePrice(precioTotal);
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
            timeElement.textContent = horario;
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

    const filas = {};

    asientos.forEach(asiento => {
        if (!filas[asiento.fila]) {
            filas[asiento.fila] = [];
        }
        filas[asiento.fila].push(asiento);
    });

    Object.keys(filas).forEach(fila => {
        const filaElement = document.createElement('div');
        filaElement.classList.add('seat-row');

        // Añadir hueco después de la fila B
        if (fila === 'B') {
            filaElement.classList.add('hueco');
        }

        const rowLabel = document.createElement('label');
        rowLabel.classList.add('row-label');
        rowLabel.textContent = fila;
        filaElement.appendChild(rowLabel);

        filas[fila].forEach(asiento => {
            const seatElement = document.createElement('div');
            seatElement.classList.add('seat');

            if (asiento.estado === 'disponible') {
                if (asiento.tipo === 'vip') {
                    seatElement.classList.add('vip');
                } else {
                    seatElement.classList.add('available');
                }
                seatElement.addEventListener('click', () => selectSeat(seatElement, asiento.tipo));
            } else if (asiento.tipo === 'vip') {
                seatElement.classList.add('vip');
            } else {
                seatElement.classList.add('reserved');
            }

            seatElement.textContent = asiento.numero_asiento;
            filaElement.appendChild(seatElement);
        });

        seatMap.appendChild(filaElement);
    });
}

function updatePrice(total) {
    const priceDisplay = document.getElementById('price');
    if (priceDisplay) {
        priceDisplay.textContent = `$${total.toFixed(2)}`;
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

function selectSeat(seatElement, tipoAsiento) {
    const isSelected = seatElement.classList.contains('selected');

    if (isSelected) {
        seatElement.classList.remove('selected');
        if (tipoAsiento === 'vip') {
            precioTotal -= precioAsientoVIP;
        } else {
            precioTotal -= precioAsiento;
        }
    } else {
        seatElement.classList.add('selected');
        if (tipoAsiento === 'vip') {
            precioTotal += precioAsientoVIP;
        } else {
            precioTotal += precioAsiento;
        }
    }

    updatePrice(precioTotal);
}
