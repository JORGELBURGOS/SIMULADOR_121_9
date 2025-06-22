// Estrategias disponibles y activas
let activeStrategies = [];

// Inicializar módulo de estrategias
function initStrategiesModule() {
    renderAvailableStrategies();
    renderIntegratedDashboard();
    setupStrategyEvents();
    updateActiveStrategiesList();
}

// Renderizar estrategias disponibles
function renderAvailableStrategies() {
    if (!window.strategiesData) return;
    
    const listContainer = document.getElementById('available-strategies-list');
    listContainer.innerHTML = '';
    
    window.strategiesData.forEach(strategy => {
        const strategyCard = document.createElement('div');
        strategyCard.className = 'strategy-card';
        strategyCard.dataset.id = strategy.id;
        
        strategyCard.innerHTML = `
            <h4>${strategy.title}</h4>
            <p>${strategy.description}</p>
            <div class="strategy-meta">
                <span><i class="fas fa-building"></i> ${strategy.businessUnit}</span>
                <span><i class="fas fa-tag"></i> ${strategy.source}</span>
            </div>
            <div class="strategy-impact">
                <span>Ingresos: +${strategy.impact.revenue}%</span>
                <span>Transacciones: +${strategy.impact.transactions}%</span>
            </div>
            <div class="strategy-actions">
                <button class="btn btn-sm btn-primary" data-id="${strategy.id}">Simular</button>
                <button class="btn btn-sm btn-secondary" data-id="${strategy.id}">Detalles</button>
            </div>
        `;
        
        listContainer.appendChild(strategyCard);
    });
    
    // Configurar eventos de los botones
    document.querySelectorAll('#available-strategies-list .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const strategyId = this.dataset.id;
            const strategy = window.strategiesData.find(s => s.id === strategyId);
            if (strategy) {
                simulateStrategy(strategy);
            }
        });
    });
    
    document.querySelectorAll('#available-strategies-list .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const strategyId = this.dataset.id;
            const strategy = window.strategiesData.find(s => s.id === strategyId);
            if (strategy) {
                showStrategyDetails(strategy);
            }
        });
    });
}

// Simular estrategia
function simulateStrategy(strategy) {
    const modalTitle = document.getElementById('strategyModalTitle');
    const modalBody = document.getElementById('strategyModalBody');
    
    modalTitle.textContent = `Simular: ${strategy.title}`;
    
    modalBody.innerHTML = `
        <div class="strategy-form">
            <div class="form-group">
                <label for="simulation-investment">Inversión ($):</label>
                <input type="number" id="simulation-investment" class="form-control" min="1000" step="1000" value="50000">
            </div>
            <div class="form-group">
                <label for="simulation-duration">Duración (meses):</label>
                <input type="number" id="simulation-duration" class="form-control" min="1" max="24" value="12">
            </div>
            <div class="form-group">
                <label for="simulation-growth">Crecimiento esperado (%):</label>
                <input type="number" id="simulation-growth" class="form-control" min="1" max="100" value="${strategy.impact.revenue}">
            </div>
            <div class="form-actions">
                <button id="confirm-simulation" class="btn btn-primary">Confirmar</button>
            </div>
        </div>
    `;
    
    document.getElementById('confirm-simulation').addEventListener('click', function() {
        const investment = parseFloat(document.getElementById('simulation-investment').value);
        const duration = parseInt(document.getElementById('simulation-duration').value);
        const growth = parseInt(document.getElementById('simulation-growth').value);
        
        if (isNaN(investment) || isNaN(duration) || isNaN(growth)) {
            alert('Por favor completa todos los campos con valores válidos');
            return;
        }
        
        activateStrategy(strategy, investment, duration, growth);
        bootstrap.Modal.getInstance(document.getElementById('strategyModal')).hide();
    });
    
    const modal = new bootstrap.Modal(document.getElementById('strategyModal'));
    modal.show();
}

function activateStrategy(strategy, investment, duration, growth) {
    const activeStrategy = {
        ...strategy,
        simulationId: `sim-${Date.now()}`,
        investment: investment,
        duration: duration,
        growth: growth,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    
    activeStrategies.push(activeStrategy);
    updateActiveStrategiesList();
    updateStrategyImpact();
    showNotification(`Estrategia "${strategy.title}" activada`, 'success');
}

// Actualizar lista de estrategias activas
function updateActiveStrategiesList() {
    const listContainer = document.getElementById('active-strategies-list');
    listContainer.innerHTML = '';
    
    if (activeStrategies.length === 0) {
        listContainer.innerHTML = '<p>No hay estrategias activas</p>';
        return;
    }
    
    activeStrategies.forEach(strategy => {
        const endDate = new Date(strategy.startDate);
        endDate.setMonth(endDate.getMonth() + strategy.duration);
        
        const strategyItem = document.createElement('div');
        strategyItem.className = 'active-strategy-item';
        strategyItem.dataset.id = strategy.simulationId;
        
        strategyItem.innerHTML = `
            <h4>${strategy.title}</h4>
            <div class="strategy-meta">
                <span><i class="fas fa-calendar"></i> ${strategy.startDate} - ${endDate.toISOString().split('T')[0]}</span>
                <span><i class="fas fa-dollar-sign"></i> ${strategy.investment.toLocaleString()}</span>
            </div>
            <div class="progress">
                <div class="progress-bar" style="width: ${calculateProgress(strategy)}%"></div>
            </div>
            <div class="strategy-actions">
                <button class="btn btn-sm btn-primary">Detalles</button>
                <button class="btn btn-sm btn-danger">Cancelar</button>
            </div>
        `;
        
        listContainer.appendChild(strategyItem);
    });
    
    // Configurar eventos de los botones
    document.querySelectorAll('.active-strategy-item .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const strategyId = this.closest('.active-strategy-item').dataset.id;
            viewStrategyDetails(strategyId);
        });
    });
    
    document.querySelectorAll('.active-strategy-item .btn-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const strategyId = this.closest('.active-strategy-item').dataset.id;
            cancelStrategy(strategyId);
        });
    });
}

function calculateProgress(strategy) {
    const start = new Date(strategy.startDate);
    const now = new Date();
    const end = new Date(start);
    end.setMonth(end.getMonth() + strategy.duration);
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.round((elapsed / total) * 100));
}

// Actualizar impacto de estrategias
function updateStrategyImpact() {
    if (!window.financialData) return;
    
    // Calcular impacto acumulado
    const impact = activeStrategies.reduce((acc, strategy) => {
        const monthsRemaining = Math.max(0, strategy.duration - monthsSince(strategy.startDate));
        const monthlyImpact = strategy.growth / strategy.duration;
        
        acc.revenue += (strategy.impact.revenue * monthlyImpact * monthsRemaining) / 100;
        acc.transactions += (strategy.impact.transactions * monthlyImpact * monthsRemaining) / 100;
        acc.cost += (strategy.impact.cost * monthlyImpact * monthsRemaining) / 100;
        return acc;
    }, { revenue: 0, transactions: 0, cost: 0 });
    
    // Aplicar a datos financieros
    window.financialData.revenue *= (1 + impact.revenue);
    window.financialData.transactions = Math.round(window.financialData.transactions * (1 + impact.transactions));
    window.financialData.operatingExpenses *= (1 + impact.cost);
    
    // Actualizar visualizaciones
    if (typeof updateFinancialTable === 'function') {
        updateFinancialTable();
    }
    if (typeof updateKPIs === 'function') {
        updateKPIs();
    }
    
    renderStrategyImpactCharts();
}

function monthsSince(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}

// Configurar eventos del módulo de estrategias
function setupStrategyEvents() {
    // Filtros
    document.getElementById('strategy-filter').addEventListener('change', function() {
        renderAvailableStrategies();
    });
    
    // Botón de actualización
    document.getElementById('refresh-strategies').addEventListener('click', function() {
        renderAvailableStrategies();
        updateActiveStrategiesList();
    });
}

// Inicializar módulo de estrategias cuando se carga la pestaña
document.querySelector('.nav-tabs li[data-tab="strategies"]').addEventListener('click', function() {
    if (!window.strategiesInitialized) {
        initStrategiesModule();
        window.strategiesInitialized = true;
    }
});