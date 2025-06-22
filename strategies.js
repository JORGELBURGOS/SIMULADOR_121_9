// Estrategias disponibles y activas
let availableStrategies = [];
let activeStrategies = [];

// Inicializar módulo de estrategias
function initStrategiesModule() {
    loadAvailableStrategies();
    renderAvailableStrategies();
    setupStrategyEvents();
}

// Cargar estrategias disponibles
function loadAvailableStrategies() {
    // En una implementación real, esto vendría de una API o archivo JSON
    availableStrategies = [
        {
            id: 'strategy-1',
            title: 'Expansión a QR Crédito',
            description: 'Implementar capacidad para procesar pagos QR con tarjetas de crédito, aprovechando la creciente adopción.',
            source: 'bcg',
            businessUnit: 'Digital Payments',
            products: ['Transferencias Salientes', 'Debines'],
            impact: {
                revenue: 15,
                transactions: 25,
                cost: 10
            }
        },
        {
            id: 'strategy-2',
            title: 'Prevención de Fraude con IA',
            description: 'Implementar sistema de inteligencia artificial para detección de transacciones fraudulentas en tiempo real.',
            source: 'pestel',
            businessUnit: 'Instant Payments',
            products: ['Pagos con Transferencias', 'Transferencias Entrantes'],
            impact: {
                revenue: 5,
                transactions: 8,
                cost: -5
            }
        },
        // ... más estrategias
    ];
}

// Renderizar estrategias disponibles
function renderAvailableStrategies() {
    const listContainer = document.getElementById('available-strategies-list');
    listContainer.innerHTML = '';
    
    if (availableStrategies.length === 0) {
        listContainer.innerHTML = '<p>No hay estrategias disponibles. Completa los análisis para generar sugerencias.</p>';
        return;
    }
    
    availableStrategies.forEach(strategy => {
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
        `;
        
        strategyCard.addEventListener('click', function() {
            showStrategyDetails(strategy);
        });
        
        listContainer.appendChild(strategyCard);
    });
}

// Mostrar detalles de estrategia
function showStrategyDetails(strategy) {
    const formTitle = document.getElementById('strategy-form-title');
    const formContainer = document.querySelector('.strategy-form');
    const noStrategySelected = document.querySelector('.no-strategy-selected');
    
    formTitle.textContent = strategy.title;
    document.getElementById('strategy-name').value = strategy.title;
    document.getElementById('strategy-description').value = strategy.description;
    
    // Actualizar selector de unidad de negocio
    const businessUnitSelect = document.getElementById('strategy-business-unit');
    businessUnitSelect.innerHTML = `
        <option value="${strategy.businessUnit}">${strategy.businessUnit}</option>
        <option value="Digital Payments">Digital Payments</option>
        <option value="Instant Payments">Instant Payments</option>
    `;
    
    // Actualizar selector de producto
    const productSelect = document.getElementById('strategy-product');
    productSelect.innerHTML = strategy.products.map(product => 
        `<option value="${product}">${product}</option>`
    ).join('');
    
    // Mostrar formulario y ocultar mensaje
    noStrategySelected.style.display = 'none';
    formContainer.style.display = 'block';
    
    // Configurar eventos para los botones
    document.getElementById('simulate-strategy').onclick = function() {
        simulateStrategy(strategy);
    };
    
    document.getElementById('save-strategy').onclick = function() {
        saveStrategyForLater(strategy);
    };
}

// Simular estrategia
function simulateStrategy(strategy) {
    const investment = parseFloat(document.getElementById('strategy-investment').value);
    const duration = parseInt(document.getElementById('strategy-duration').value);
    const growth = parseInt(document.getElementById('strategy-growth').value);
    const businessUnit = document.getElementById('strategy-business-unit').value;
    const product = document.getElementById('strategy-product').value;
    
    if (isNaN(investment) || isNaN(duration) || isNaN(growth)) {
        alert('Por favor completa todos los campos con valores válidos');
        return;
    }
    
    // Crear estrategia activa
    const activeStrategy = {
        ...strategy,
        simulationId: Date.now().toString(),
        investment: investment,
        duration: duration,
        growth: growth,
        businessUnit: businessUnit,
        product: product,
        startDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    
    // Añadir a estrategias activas
    activeStrategies.push(activeStrategy);
    
    // Actualizar lista de estrategias activas
    updateActiveStrategiesList();
    
    // Actualizar impacto de estrategias
    updateStrategyImpact();
    
    // Mostrar notificación
    showNotification(`Estrategia "${strategy.title}" simulada con éxito`, 'success');
}

// Guardar estrategia para más tarde
function saveStrategyForLater(strategy) {
    // En una implementación real, esto guardaría en una lista de favoritos
    showNotification(`Estrategia "${strategy.title}" guardada para más tarde`, 'info');
}

// Actualizar lista de estrategias activas
function updateActiveStrategiesList() {
    const listContainer = document.getElementById('active-strategies-list');
    listContainer.innerHTML = '';
    
    if (activeStrategies.length === 0) {
        listContainer.innerHTML = '<p>No hay estrategias activas. Simula una estrategia para ver su impacto.</p>';
        return;
    }
    
    activeStrategies.forEach(strategy => {
        const strategyItem = document.createElement('div');
        strategyItem.className = 'active-strategy-item';
        strategyItem.dataset.id = strategy.simulationId;
        
        const endDate = new Date(strategy.startDate);
        endDate.setMonth(endDate.getMonth() + strategy.duration);
        
        strategyItem.innerHTML = `
            <h4>${strategy.title} <span class="badge bg-success">Activa</span></h4>
            <div class="strategy-meta">
                <span><i class="fas fa-building"></i> ${strategy.businessUnit}</span>
                <span><i class="fas fa-box"></i> ${strategy.product}</span>
                <span><i class="fas fa-calendar"></i> ${strategy.startDate} a ${endDate.toISOString().split('T')[0]}</span>
            </div>
            <div class="strategy-impact">
                <div class="strategy-impact-item">
                    <span>Inversión:</span>
                    <span>$${strategy.investment.toLocaleString()}</span>
                </div>
                <div class="strategy-impact-item">
                    <span>Crecimiento esperado:</span>
                    <span>${strategy.growth}%</span>
                </div>
                <div class="strategy-impact-item">
                    <span>Impacto en ingresos:</span>
                    <span>+${strategy.impact.revenue}%</span>
                </div>
            </div>
            <div class="strategy-actions">
                <button class="btn btn-sm btn-primary">Ver Detalles</button>
                <button class="btn btn-sm btn-danger">Cancelar</button>
            </div>
        `;
        
        listContainer.appendChild(strategyItem);
    });
    
    // Configurar eventos para los botones
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

// Ver detalles de estrategia activa
function viewStrategyDetails(strategyId) {
    const strategy = activeStrategies.find(s => s.simulationId === strategyId);
    if (!strategy) return;
    
    const endDate = new Date(strategy.startDate);
    endDate.setMonth(endDate.getMonth() + strategy.duration);
    
    const modalTitle = document.getElementById('strategyModalTitle');
    const modalBody = document.getElementById('strategyModalBody');
    
    modalTitle.textContent = strategy.title;
    
    modalBody.innerHTML = `
        <div class="strategy-detail">
            <p><strong>Descripción:</strong> ${strategy.description}</p>
            <div class="detail-row">
                <div class="detail-item">
                    <strong>Unidad de Negocio:</strong>
                    <span>${strategy.businessUnit}</span>
                </div>
                <div class="detail-item">
                    <strong>Producto:</strong>
                    <span>${strategy.product}</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item">
                    <strong>Inversión:</strong>
                    <span>$${strategy.investment.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <strong>Duración:</strong>
                    <span>${strategy.duration} meses</span>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-item">
                    <strong>Fecha de inicio:</strong>
                    <span>${strategy.startDate}</span>
                </div>
                <div class="detail-item">
                    <strong>Fecha de fin:</strong>
                    <span>${endDate.toISOString().split('T')[0]}</span>
                </div>
            </div>
            <div class="progress-container">
                <h5>Progreso:</h5>
                <div class="progress">
                    <div class="progress-bar" style="width: 25%">25%</div>
                </div>
            </div>
            <div class="impact-results">
                <h5>Resultados hasta ahora:</h5>
                <div class="impact-metrics">
                    <div class="metric-card">
                        <div class="metric-value">+8%</div>
                        <div class="metric-label">Ingresos</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">+12%</div>
                        <div class="metric-label">Transacciones</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">-3%</div>
                        <div class="metric-label">Costos</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Configurar botón de aplicar
    const applyBtn = document.getElementById('applyStrategyFromModal');
    applyBtn.textContent = 'Cerrar';
    applyBtn.onclick = function() {
        bootstrap.Modal.getInstance(document.getElementById('strategyModal')).hide();
    };
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('strategyModal'));
    modal.show();
}

// Cancelar estrategia
function cancelStrategy(strategyId) {
    if (confirm('¿Estás seguro de que deseas cancelar esta estrategia?')) {
        activeStrategies = activeStrategies.filter(s => s.simulationId !== strategyId);
        updateActiveStrategiesList();
        updateStrategyImpact();
        showNotification('Estrategia cancelada', 'info');
    }
}

// Actualizar impacto de estrategias
function updateStrategyImpact() {
    // En una implementación real, esto calcularía el impacto real en los datos financieros
    // Aquí solo actualizamos los gráficos de impacto
    
    renderStrategyImpactCharts();
}

// Renderizar gráficos de impacto de estrategias
function renderStrategyImpactCharts() {
    // Gráfico de impacto en ingresos
    const revenueImpactChart = new ApexCharts(document.getElementById('strategy-revenue-impact-chart'), {
        series: [{
            name: 'Ingresos',
            data: [12000000, 13500000, 14500000, 15500000, 16500000, 18000000]
        }],
        chart: {
            type: 'area',
            height: 350,
            toolbar: {
                show: false
            }
        },
        colors: ['#2ecc71'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.3,
            }
        },
        xaxis: {
            categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
        },
        tooltip: {
            y: {
                formatter: function(val) {
                    return '$' + val.toLocaleString()
                }
            }
        }
    });
    revenueImpactChart.render();
    
    // Gráfico de impacto en transacciones
    const transactionsImpactChart = new ApexCharts(document.getElementById('strategy-transactions-impact-chart'), {
        series: [{
            name: 'Transacciones',
            data: [450000, 480000, 510000, 550000, 590000, 630000]
        }],
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            }
        },
        colors: ['#3498db'],
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
        }
    });
    transactionsImpactChart.render();
    
    // Gráfico de impacto financiero acumulado
    const financialImpactCtx = document.getElementById('strategy-financial-impact-chart').getContext('2d');
    
    new Chart(financialImpactCtx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Ingresos',
                    data: [12000000, 13500000, 14500000, 15500000, 16500000, 18000000],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Costos',
                    data: [8500000, 8800000, 8700000, 8900000, 9100000, 9300000],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'EBITDA',
                    data: [3500000, 4700000, 5800000, 6600000, 7400000, 8700000],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += '$' + context.raw.toLocaleString();
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Configurar eventos del módulo de estrategias
function setupStrategyEvents() {
    // Filtros de estrategias
    document.getElementById('strategy-source').addEventListener('change', function() {
        renderAvailableStrategies();
    });
    
    document.getElementById('strategy-filter').addEventListener('change', function() {
        renderAvailableStrategies();
    });
}

// Inicializar módulo de estrategias cuando se carga la pestaña
document.querySelector('.nav-tabs li[data-tab="strategies"]').addEventListener('click', function() {
    if (!window.strategiesInitialized) {
        initStrategiesModule();
        window.strategiesInitialized = true;
    }
});