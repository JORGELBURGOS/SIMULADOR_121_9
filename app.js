// Configuración inicial de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar pestañas
    initTabs();
    
    // Cargar datos iniciales
    loadInitialData();
    
    // Configurar eventos globales
    setupGlobalEvents();
    
    // Inicializar tooltips
    initTooltips();
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
        })
        .catch(error => console.error('Error cargando clientes:', error));
    
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            window.productsData = data;
            console.log('Productos cargados:', data);
            initializeFinancials();
        })
        .catch(error => console.error('Error cargando productos:', error));
    
    fetch('strategies.json')
        .then(response => response.json())
        .then(data => {
            window.strategiesData = data;
            console.log('Estrategias cargadas:', data);
            initializeStrategies();
        })
        .catch(error => console.error('Error cargando estrategias:', error));
}

function initializeStrategies() {
    if (window.strategiesModuleInitialized) return;
    
    // Inicializar módulos que dependen de estrategias
    if (typeof initStrategiesModule === 'function') {
        initStrategiesModule();
    }
    
    window.strategiesModuleInitialized = true;
}

function setupGlobalEvents() {
    // Evento para el botón de reset financiero
    document.getElementById('reset-financials').addEventListener('click', resetFinancials);
    
    // Evento para el botón de cálculo automático
    document.getElementById('auto-calculate').addEventListener('click', autoCalculateFinancials);
    
    // Evento para actualizar dashboard
    document.getElementById('refresh-dashboard').addEventListener('click', refreshDashboard);
}

function resetFinancials() {
    if (confirm('¿Estás seguro de que deseas reiniciar todos los valores financieros?')) {
        initializeFinancials();
    }
}

function autoCalculateFinancials() {
    if (window.productsData && window.clientsData) {
        calculateAutomaticFinancials();
    } else {
        alert('Por favor espera a que se carguen todos los datos.');
    }
}

function refreshDashboard() {
    if (window.strategiesData) {
        renderIntegratedDashboard();
    }
}

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

// Nueva función para renderizar dashboard integrado
function renderIntegratedDashboard() {
    if (!window.strategiesData) return;
    
    const dashboard = document.getElementById('strategy-dashboard');
    
    // Agrupar estrategias por fuente y unidad de negocio
    const strategiesBySource = window.strategiesData.reduce((acc, strategy) => {
        if (!acc[strategy.source]) acc[strategy.source] = {};
        if (!acc[strategy.source][strategy.businessUnit]) {
            acc[strategy.source][strategy.businessUnit] = [];
        }
        acc[strategy.source][strategy.businessUnit].push(strategy);
        return acc;
    }, {});
    
    // Renderizar secciones
    dashboard.innerHTML = '';
    
    for (const [source, units] of Object.entries(strategiesBySource)) {
        const sourceSection = document.createElement('div');
        sourceSection.className = 'dashboard-section';
        sourceSection.innerHTML = `<h3><i class="fas ${getSourceIcon(source)}"></i> ${source.toUpperCase()} Strategies</h3>`;
        
        for (const [unit, strategies] of Object.entries(units)) {
            const unitCard = document.createElement('div');
            unitCard.className = 'unit-card';
            unitCard.innerHTML = `
                <h4>${unit}</h4>
                <div class="strategies-container">
                    ${strategies.map(strategy => renderStrategyCard(strategy)).join('')}
                </div>
            `;
            sourceSection.appendChild(unitCard);
        }
        
        dashboard.appendChild(sourceSection);
    }
}

function getSourceIcon(source) {
    const icons = {
        bcg: 'fa-chart-pie',
        pestel: 'fa-globe-americas',
        porter: 'fa-chess-board'
    };
    return icons[source.toLowerCase()] || 'fa-lightbulb';
}

function renderStrategyCard(strategy) {
    return `
        <div class="strategy-card" data-id="${strategy.id}">
            <h5>${strategy.title}</h5>
            <p>${strategy.description}</p>
            <div class="strategy-meta">
                <span><i class="fas fa-money-bill-wave"></i> +${strategy.impact.revenue}% ingresos</span>
                <span><i class="fas fa-exchange-alt"></i> +${strategy.impact.transactions}% transacciones</span>
            </div>
            <div class="strategy-actions">
                <button class="btn btn-sm btn-primary" onclick="simulateStrategy('${strategy.id}')">Simular</button>
            </div>
        </div>
    `;
}

// Exponer funciones globalmente para uso en HTML
window.simulateStrategy = function(strategyId) {
    const strategy = window.strategiesData.find(s => s.id === strategyId);
    if (strategy) {
        showStrategyDetails(strategy);
    }
};