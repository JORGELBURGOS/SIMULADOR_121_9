// Configuración inicial de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar pestañas
    initTabs();
    
    // Cargar datos iniciales
    loadInitialData();
    
    // Configurar eventos globales
    setupGlobalEvents();
});

function initTabs() {
    const tabs = document.querySelectorAll('.nav-tabs li');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remover clase active de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            
            // Añadir clase active a la pestaña clickeada
            this.classList.add('active');
            
            // Ocultar todos los contenidos
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function loadInitialData() {
    // Cargar datos de clientes y productos
    fetch('clients.json')
        .then(response => response.json())
        .then(data => {
            window.clientsData = data;
            console.log('Clientes cargados:', data);
        });
    
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            window.productsData = data;
            console.log('Productos cargados:', data);
            initializeFinancials();
        });
    
    fetch('strategies.json')
        .then(response => response.json())
        .then(data => {
            window.strategiesData = data;
            console.log('Estrategias cargadas:', data);
        });
}

function setupGlobalEvents() {
    // Evento para el botón de reset financiero
    document.getElementById('reset-financials').addEventListener('click', resetFinancials);
    
    // Evento para el botón de cálculo automático
    document.getElementById('auto-calculate').addEventListener('click', autoCalculateFinancials);
}

function resetFinancials() {
    if (confirm('¿Estás seguro de que deseas reiniciar todos los valores financieros?')) {
        initializeFinancials();
    }
}

function autoCalculateFinancials() {
    // Lógica para calcular automáticamente los valores financieros basados en los productos
    if (window.productsData && window.clientsData) {
        calculateAutomaticFinancials();
    } else {
        alert('Por favor espera a que se carguen todos los datos.');
    }
}

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Inicializar tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'custom-tooltip';
            tooltipElement.textContent = tooltipText;
            document.body.appendChild(tooltipElement);
            
            const rect = this.getBoundingClientRect();
            tooltipElement.style.left = `${rect.left + rect.width / 2 - tooltipElement.offsetWidth / 2}px`;
            tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 10}px`;
            
            this._tooltipElement = tooltipElement;
        });
        
        tooltip.addEventListener('mouseleave', function() {
            if (this._tooltipElement) {
                this._tooltipElement.remove();
                delete this._tooltipElement;
            }
        });
    });
}