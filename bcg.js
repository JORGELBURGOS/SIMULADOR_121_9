// Datos iniciales para la matriz BCG
let bcgData = [
    {
        id: 'transferencias_salientes',
        name: 'Transferencias Salientes',
        businessUnit: 'Digital Payments',
        marketGrowth: 15,
        marketShare: 25,
        revenue: 0,
        transactions: 0
    },
    {
        id: 'debines',
        name: 'Debines',
        businessUnit: 'Digital Payments',
        marketGrowth: 8,
        marketShare: 18,
        revenue: 0,
        transactions: 0
    },
    {
        id: 'pct',
        name: 'Pagos con Transferencias',
        businessUnit: 'Instant Payments',
        marketGrowth: 45,
        marketShare: 12,
        revenue: 0,
        transactions: 0
    },
    {
        id: 'transferencias_entrantes',
        name: 'Transferencias Entrantes',
        businessUnit: 'Instant Payments',
        marketGrowth: 30,
        marketShare: 20,
        revenue: 0,
        transactions: 0
    },
    {
        id: 'transferencias_salientes_psp',
        name: 'Transferencias Salientes PSP',
        businessUnit: 'Instant Payments',
        marketGrowth: 35,
        marketShare: 15,
        revenue: 0,
        transactions: 0
    }
];

// Estrategias aplicadas
let bcgStrategies = [];

// Inicializar módulo BCG
function initBcgMatrix() {
    // Calcular ingresos y transacciones basados en datos financieros
    calculateBcgFinancials();
    
    // Renderizar matriz BCG
    renderBcgMatrix();
    
    // Configurar eventos
    setupBcgEvents();
    
    // Generar estrategias sugeridas iniciales
    generateBcgStrategies();
}

// Calcular datos financieros para BCG
function calculateBcgFinancials() {
    if (!window.productsData) return;
    
    bcgData.forEach(item => {
        const product = window.productsData.find(p => p.id === item.id);
        if (product) {
            item.revenue = product.annualRevenue || 0;
            item.transactions = product.annualTransactions || 0;
        }
    });
}

// Renderizar matriz BCG
function renderBcgMatrix() {
    // Limpiar cuadrantes
    document.getElementById('stars-items').innerHTML = '';
    document.getElementById('question-marks-items').innerHTML = '';
    document.getElementById('cash-cows-items').innerHTML = '';
    document.getElementById('dogs-items').innerHTML = '';
    
    // Determinar métricas actuales
    const growthMetric = document.getElementById('growth-metric').value;
    const shareMetric = document.getElementById('share-metric').value;
    
    // Clasificar cada unidad de negocio
    bcgData.forEach(item => {
        const growthValue = item[growthMetric === 'market_growth' ? 'marketGrowth' : 
                              (growthMetric === 'revenue_growth' ? 'revenue' : 'transactions')];
        const shareValue = item[shareMetric === 'market_share' ? 'marketShare' : 'revenue'];
        
        // Determinar cuadrante (umbrales arbitrarios)
        let quadrant;
        if (growthValue > 20 && shareValue > 15) {
            quadrant = 'stars';
        } else if (growthValue > 20 && shareValue <= 15) {
            quadrant = 'question-marks';
        } else if (growthValue <= 20 && shareValue > 15) {
            quadrant = 'cash-cows';
        } else {
            quadrant = 'dogs';
        }
        
        // Crear elemento para el cuadrante
        const element = document.createElement('div');
        element.className = 'bcg-item tooltip';
        element.textContent = item.name;
        element.dataset.tooltip = `${item.businessUnit}\nCrecimiento: ${growthValue}%\nParticipación: ${shareValue}%`;
        
        // Añadir al cuadrante correspondiente
        document.getElementById(`${quadrant}-items`).appendChild(element);
    });
}

// Configurar eventos BCG
function setupBcgEvents() {
    // Eventos para los selectores de métricas
    document.getElementById('growth-metric').addEventListener('change', renderBcgMatrix);
    document.getElementById('share-metric').addEventListener('change', renderBcgMatrix);
    
    // Evento para aplicar estrategia
    document.getElementById('apply-bcg-strategy').addEventListener('click', applyBcgStrategy);
    
    // Eventos para los ítems de la matriz
    document.querySelectorAll('.bcg-item').forEach(item => {
        item.addEventListener('click', function() {
            const productName = this.textContent;
            const product = bcgData.find(p => p.name === productName);
            if (product) {
                document.getElementById('business-unit-select').value = product.businessUnit;
            }
        });
    });
}

// Aplicar estrategia BCG
function applyBcgStrategy() {
    const businessUnit = document.getElementById('business-unit-select').value;
    const strategyType = document.getElementById('growth-strategy').value;
    
    // Validar selección
    if (!businessUnit) {
        alert('Por favor selecciona una unidad de negocio');
        return;
    }
    
    // Crear estrategia
    const strategy = {
        id: Date.now().toString(),
        type: strategyType,
        businessUnit: businessUnit,
        date: new Date().toISOString().split('T')[0],
        description: getBcgStrategyDescription(strategyType, businessUnit)
    };
    
    // Añadir a la lista de estrategias
    bcgStrategies.push(strategy);
    
    // Actualizar lista de estrategias
    updateBcgStrategiesList();
    
    // Mostrar notificación
    showNotification(`Estrategia aplicada a ${businessUnit}`, 'success');
}

// Obtener descripción de estrategia BCG
function getBcgStrategyDescription(type, businessUnit) {
    const strategies = {
        penetration: `Incrementar participación de mercado en ${businessUnit} mediante campañas agresivas de marketing y mejora de la retención.`,
        development: `Desarrollar nuevas características y funcionalidades para los productos existentes en ${businessUnit} para atraer más clientes.`,
        expansion: `Expandir ${businessUnit} a nuevos mercados geográficos o segmentos de clientes no atendidos.`,
        diversification: `Diversificar la oferta de ${businessUnit} con productos complementarios o nuevos modelos de negocio.`
    };
    
    return strategies[type] || `Estrategia aplicada a ${businessUnit}`;
}

// Actualizar lista de estrategias BCG
function updateBcgStrategiesList() {
    const listContainer = document.getElementById('bcg-strategies-list');
    listContainer.innerHTML = '';
    
    if (bcgStrategies.length === 0) {
        listContainer.innerHTML = '<p>No se han aplicado estrategias aún. Usa el formulario para crear una.</p>';
        return;
    }
    
    bcgStrategies.forEach(strategy => {
        const strategyCard = document.createElement('div');
        strategyCard.className = 'strategy-card';
        
        const strategyTypeName = {
            penetration: 'Penetración de Mercado',
            development: 'Desarrollo de Producto',
            expansion: 'Expansión de Mercado',
            diversification: 'Diversificación'
        }[strategy.type] || strategy.type;
        
        strategyCard.innerHTML = `
            <h4>${strategyTypeName}</h4>
            <p>${strategy.description}</p>
            <div class="strategy-meta">
                <span><i class="fas fa-building"></i> ${strategy.businessUnit}</span>
                <span><i class="fas fa-calendar"></i> ${strategy.date}</span>
            </div>
            <div class="strategy-actions">
                <button class="btn btn-sm btn-primary" data-id="${strategy.id}">Simular</button>
                <button class="btn btn-sm btn-danger" data-id="${strategy.id}">Eliminar</button>
            </div>
        `;
        
        listContainer.appendChild(strategyCard);
    });
    
    // Configurar eventos para los botones
    document.querySelectorAll('#bcg-strategies-list .btn-primary').forEach(btn => {
        btn.addEventListener('click', function() {
            const strategyId = this.dataset.id;
            simulateBcgStrategy(strategyId);
        });
    });
    
    document.querySelectorAll('#bcg-strategies-list .btn-danger').forEach(btn => {
        btn.addEventListener('click', function() {
            const strategyId = this.dataset.id;
            removeBcgStrategy(strategyId);
        });
    });
}

// Simular estrategia BCG
function simulateBcgStrategy(strategyId) {
    const strategy = bcgStrategies.find(s => s.id === strategyId);
    if (!strategy) return;
    
    // Mostrar modal de simulación
    const modalTitle = document.getElementById('strategyModalTitle');
    const modalBody = document.getElementById('strategyModalBody');
    
    modalTitle.textContent = `Simular: ${strategy.businessUnit}`;
    
    modalBody.innerHTML = `
        <h5>${strategy.description}</h5>
        <div class="form-group">
            <label for="simulation-investment">Inversión estimada ($):</label>
            <input type="number" id="simulation-investment" class="form-control" min="0" step="1000" value="50000">
        </div>
        <div class="form-group">
            <label for="simulation-duration">Duración (meses):</label>
            <input type="number" id="simulation-duration" class="form-control" min="1" max="36" value="12">
        </div>
        <div class="form-group">
            <label for="simulation-growth">Crecimiento esperado (%):</label>
            <input type="number" id="simulation-growth" class="form-control" min="0" max="100" step="1" value="15">
        </div>
        <div class="potential-impact">
            <h5>Impacto Estimado:</h5>
            <ul>
                <li>Aumento en participación de mercado: 3-8%</li>
                <li>Incremento en ingresos: 10-25%</li>
                <li>ROI esperado: 12-18 meses</li>
            </ul>
        </div>
    `;
    
    // Configurar botón de aplicar
    const applyBtn = document.getElementById('applyStrategyFromModal');
    applyBtn.textContent = 'Aplicar Simulación';
    applyBtn.onclick = function() {
        const investment = parseFloat(document.getElementById('simulation-investment').value);
        const duration = parseInt(document.getElementById('simulation-duration').value);
        const growth = parseInt(document.getElementById('simulation-growth').value);
        
        if (isNaN(investment) || isNaN(duration) || isNaN(growth)) {
            alert('Por favor ingresa valores válidos');
            return;
        }
        
        applyBcgSimulation(strategy, investment, duration, growth);
        bootstrap.Modal.getInstance(document.getElementById('strategyModal')).hide();
    };
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('strategyModal'));
    modal.show();
}

// Aplicar simulación BCG
function applyBcgSimulation(strategy, investment, duration, growth) {
    // En una implementación real, esto actualizaría los datos financieros
    // Aquí solo mostramos una notificación
    showNotification(`Simulación aplicada a ${strategy.businessUnit} con una inversión de $${investment.toLocaleString()}`, 'success');
    
    // Actualizar KPIs (simulado)
    updateKPIs();
}

// Eliminar estrategia BCG
function removeBcgStrategy(strategyId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta estrategia?')) {
        bcgStrategies = bcgStrategies.filter(s => s.id !== strategyId);
        updateBcgStrategiesList();
        showNotification('Estrategia eliminada', 'info');
    }
}

// Generar estrategias sugeridas BCG
function generateBcgStrategies() {
    const listContainer = document.getElementById('bcg-strategies-list');
    
    // Estrategias basadas en la posición en la matriz BCG
    const suggestedStrategies = [
        {
            title: "Invertir en Estrellas",
            description: "Las unidades en este cuadrante requieren inversión para mantener su crecimiento y liderazgo.",
            quadrant: "stars"
        },
        {
            title: "Evaluar Incógnitas",
            description: "Determine si vale la pena invertir para convertir estas unidades en estrellas o eliminarlas.",
            quadrant: "question-marks"
        },
        {
            title: "Cosechar Vacas",
            description: "Estas unidades generan efectivo que puede usarse para invertir en estrellas e incógnitas prometedoras.",
            quadrant: "cash-cows"
        },
        {
            title: "Minimizar Perros",
            description: "Considere eliminar o reducir inversión en estas unidades a menos que tengan valor estratégico.",
            quadrant: "dogs"
        }
    ];
    
    suggestedStrategies.forEach(strategy => {
        const strategyCard = document.createElement('div');
        strategyCard.className = 'strategy-card';
        strategyCard.innerHTML = `
            <h4>${strategy.title}</h4>
            <p>${strategy.description}</p>
            <div class="strategy-impact">
                <span>Cuadrante: ${strategy.quadrant}</span>
            </div>
        `;
        strategyCard.addEventListener('click', function() {
            showStrategyDetails(strategy);
        });
        listContainer.appendChild(strategyCard);
    });
}

// Inicializar módulo BCG cuando se carga la pestaña
document.querySelector('.nav-tabs li[data-tab="bcg"]').addEventListener('click', function() {
    if (!window.bcgInitialized) {
        initBcgMatrix();
        window.bcgInitialized = true;
    }
});