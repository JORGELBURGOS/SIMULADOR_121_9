// Datos iniciales para la matriz BCG
let bcgData = [
    {
        id: 'transferencias_salientes',
        name: 'Transferencias Salientes',
        businessUnit: 'Digital Payments',
        marketGrowth: 15,
        marketShare: 25,
        revenue: 0,
        transactions: 0,
        category: 'cash-cow'
    },
    {
        id: 'debines',
        name: 'Debines',
        businessUnit: 'Digital Payments',
        marketGrowth: 8,
        marketShare: 18,
        revenue: 0,
        transactions: 0,
        category: 'cash-cow'
    },
    {
        id: 'pct',
        name: 'Pagos con Transferencias',
        businessUnit: 'Instant Payments',
        marketGrowth: 45,
        marketShare: 12,
        revenue: 0,
        transactions: 0,
        category: 'question-mark'
    },
    {
        id: 'transferencias_entrantes',
        name: 'Transferencias Entrantes',
        businessUnit: 'Instant Payments',
        marketGrowth: 30,
        marketShare: 20,
        revenue: 0,
        transactions: 0,
        category: 'star'
    },
    {
        id: 'transferencias_salientes_psp',
        name: 'Transferencias Salientes PSP',
        businessUnit: 'Instant Payments',
        marketGrowth: 35,
        marketShare: 15,
        revenue: 0,
        transactions: 0,
        category: 'star'
    },
    {
        id: 'qr_credito',
        name: 'QR Crédito',
        businessUnit: 'Digital Payments',
        marketGrowth: 35,
        marketShare: 18,
        revenue: 0,
        transactions: 0,
        category: 'star'
    },
    {
        id: 'prevencion_fraude',
        name: 'Prevención del Fraude',
        businessUnit: 'Risk Management',
        marketGrowth: 25,
        marketShare: 30,
        revenue: 0,
        transactions: 0,
        category: 'cash-cow'
    }
];

// Estrategias aplicadas
let bcgStrategies = [];

// Inicializar módulo BCG
function initBcgMatrix() {
    calculateBcgFinancials();
    renderBcgMatrix();
    renderInteractiveBCG();
    setupBcgEvents();
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
            
            // Actualizar categoría basada en datos reales
            if (item.marketGrowth > 20 && item.marketShare > 15) {
                item.category = 'star';
            } else if (item.marketGrowth > 20 && item.marketShare <= 15) {
                item.category = 'question-mark';
            } else if (item.marketGrowth <= 20 && item.marketShare > 15) {
                item.category = 'cash-cow';
            } else {
                item.category = 'dog';
            }
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
    
    // Clasificar cada unidad de negocio
    bcgData.forEach(item => {
        const quadrant = item.category;
        
        // Crear elemento para el cuadrante
        const element = document.createElement('div');
        element.className = 'bcg-item tooltip';
        element.textContent = item.name;
        element.dataset.tooltip = `
            ${item.businessUnit}
            Crecimiento: ${item.marketGrowth}%
            Participación: ${item.marketShare}%
            Ingresos: $${item.revenue.toLocaleString()}
            Transacciones: ${item.transactions.toLocaleString()}
        `;
        
        // Añadir al cuadrante correspondiente
        document.getElementById(`${quadrant}-items`).appendChild(element);
    });
}

// Renderizar matriz BCG interactiva
function renderInteractiveBCG() {
    const ctx = document.getElementById('interactive-bcg-chart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.interactiveBCGChart) {
        window.interactiveBCGChart.destroy();
    }
    
    window.interactiveBCGChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: bcgData.map(item => ({
                label: item.name,
                data: [{
                    x: item.marketShare,
                    y: item.marketGrowth,
                    r: Math.sqrt(item.revenue) / 1000 || 5
                }],
                backgroundColor: getBcgColor(item.category),
                borderColor: '#fff',
                borderWidth: 1
            }))
        },
        options: {
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Tasa de Crecimiento (%)'
                    },
                    min: 0,
                    max: 50
                },
                x: {
                    title: {
                        display: true,
                        text: 'Participación de Mercado (%)'
                    },
                    min: 0,
                    max: 35
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = bcgData.find(i => i.name === context.dataset.label);
                            return [
                                `Producto: ${item.name}`,
                                `Unidad: ${item.businessUnit}`,
                                `Crecimiento: ${item.marketGrowth}%`,
                                `Participación: ${item.marketShare}%`,
                                `Ingresos: $${item.revenue.toLocaleString()}`,
                                `Transacciones: ${item.transactions.toLocaleString()}`
                            ];
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function getBcgColor(category) {
    const colors = {
        'star': 'rgba(255, 206, 86, 0.7)',
        'cash-cow': 'rgba(75, 192, 192, 0.7)',
        'question-mark': 'rgba(54, 162, 235, 0.7)',
        'dog': 'rgba(255, 99, 132, 0.7)'
    };
    return colors[category] || 'rgba(153, 102, 255, 0.7)';
}

// Configurar eventos BCG
function setupBcgEvents() {
    document.getElementById('growth-metric').addEventListener('change', renderBcgMatrix);
    document.getElementById('share-metric').addEventListener('change', renderBcgMatrix);
    document.getElementById('apply-bcg-strategy').addEventListener('click', applyBcgStrategy);
    
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

// Generar estrategias sugeridas BCG
function generateBcgStrategies() {
    const listContainer = document.getElementById('bcg-strategies-list');
    listContainer.innerHTML = '';
    
    const suggestedStrategies = [
        {
            title: "Invertir en Estrellas",
            description: "Las unidades en este cuadrante requieren inversión para mantener su crecimiento y liderazgo.",
            quadrant: "stars",
            type: "investment"
        },
        {
            title: "Evaluar Incógnitas",
            description: "Determine si vale la pena invertir para convertir estas unidades en estrellas o eliminarlas.",
            quadrant: "question-marks",
            type: "analysis"
        },
        {
            title: "Cosechar Vacas",
            description: "Estas unidades generan efectivo que puede usarse para invertir en estrellas e incógnitas prometedoras.",
            quadrant: "cash-cows",
            type: "harvest"
        },
        {
            title: "Minimizar Perros",
            description: "Considere eliminar o reducir inversión en estas unidades a menos que tengan valor estratégico.",
            quadrant: "dogs",
            type: "divest"
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
                <span>Tipo: ${strategy.type}</span>
            </div>
        `;
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