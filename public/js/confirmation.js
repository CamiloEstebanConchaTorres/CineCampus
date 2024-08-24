document.addEventListener('DOMContentLoaded', () => {
    const confirmacion = JSON.parse(localStorage.getItem('confirmacion'));

    if (confirmacion) {
        document.getElementById('order-number').textContent = confirmacion.codigo_confirmacion;
        document.getElementById('seat').textContent = confirmacion.boleto.map(boleto => `${boleto.fila}${boleto.numero_asiento}`).join(', ');
    } else {
        console.error('No se encontraron los detalles de confirmación');
    }
});
