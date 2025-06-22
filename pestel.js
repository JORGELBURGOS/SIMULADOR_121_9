// Variables para análisis PESTEL
const pestelFactors = [
    {
        id: 'political',
        name: 'Político',
        icon: 'fa-landmark',
        variables: [
            { 
                id: 'government_influence', 
                name: 'Influencia gubernamental', 
                description: 'Gobiernos y bancos centrales convierten los pagos instantáneos en infraestructura pública esencial 24/7',
                impact: 4
            },
            { 
                id: 'political_situation', 
                name: 'Situación política', 
                description: 'Proyectos regionales de interconexión señalan el camino para remesas instantáneas y baratas',
                impact: 3
            }
        ]
    },
    {
        id: 'economic',
        name: 'Económico',
        icon: 'fa-chart-line',
        variables: [
            { 
                id: 'inflation_rates', 
                name: 'Tasas de inflación', 
                description: 'Impacto de la inflación en los costos operativos y poder adquisitivo de los clientes',
                impact: 4
            },
            { 
                id: 'growth_rates', 
                name: 'Tasas de crecimiento', 
                description: 'Formalización de la economía: millones de nuevos usuarios → PIB global +USD 285 mil M estimado para 2028',
                impact: 5
            }
        ]
    },
    {
        id: 'social',
        name: 'Social',
        icon: 'fa-users',
        variables: [
            { 
                id: 'cultural_values', 
                name: 'Valores culturales', 
                description: 'Generación Z & Millennials ya lideran adopción; su peso de consumo acelera lo instantáneo a norma social',
                impact: 5
            },
            { 
                id: 'risk_attitude', 
                name: 'Actitud hacia el riesgo', 
                description: 'Expectativa de "hand-to-hand money": usuarios asumen que el dinero se mueve tan rápido como un chat',
                impact: 4
            }
        ]
    },
    {
        id: 'technological',
        name: 'Tecnológico',
        icon: 'fa-microchip',
        variables: [
            { 
                id: 'ai', 
                name: 'Inteligencia artificial', 
                description: 'IA en tiempo real analiza cada transacción y frena fraude sin friccionar la experiencia',
                impact: 5
            },
            { 
                id: 'blockchain', 
                name: 'Blockchain', 
                description: 'Stablecoins reguladas y depósitos tokenizados se integran en rails bancarios',
                impact: 3
            }
        ]
    },
    {
        id: 'ecological',
        name: 'Ecológico',
        icon: 'fa-leaf',
        variables: [
            { 
                id: 'carbon_footprint', 
                name: 'Huella de carbono', 
                description: '"Green fintech" incorpora cálculo de huella de carbono por compra y opciones de compensación automática',
                impact: 2
            }
        ]
    },
    {
        id: 'legal',
        name: 'Legal',
        icon: 'fa-gavel',
        variables: [
            { 
                id: 'crypto_regulations', 
                name: 'Regulaciones cripto', 
                description: 'Nuevas normativas y regulaciones internacionales sobre criptoactivos',
                impact: 3
            },
            { 
                id: 'consumer_protection', 
                name: 'Protección al consumidor', 
                description: 'Expansión de Open Banking / Open Finance: acceso obligatorio a cuentas vía API para PISP y fintech',
                impact: 4
            }
        ]
    }
];

// Impactos seleccionados por el usuario
let pestelImpacts = {};

// Inicializar módulo PESTEL
function initPestelAnalysis() {
    loadPestelImpacts();
    renderPestelFactors();
    updatePestelRadarChart();
    setupPestelEvents();
    generatePestelStrategies();
}

function loadPestelImpacts() {
    pestelFactors.forEach(factor => {
        factor.variables.forEach(variable => {
            const key = `${factor.id}_${variable.id}`;
            pestelImpacts[key] = variable.impact;
        });
    });
}

// Renderizar factores PESTEL
function renderPestelFactors() {
    const container = document.querySelector('#pestel .factor-container');
    container.innerHTML = '';
    
    pestelFactors.forEach(factor => {
        const factorCard = document.createElement('div');
        factorCard.className = 'factor-card';
        
        factorCard.innerHTML = `
            <h3><i class="fas ${factor.icon}"></i> ${factor.name}</h3>
            <div class="variables-list" id="${factor.id}-variables"></div>
        `;
        
        container.appendChild(factorCard);
        
        const variablesContainer = document.getElementById(`${factor.id}-variables`);
        factor.variables.forEach(variable => {
            const variableItem = document.createElement('div');
            variableItem.className = 'variable-item';
            
            const currentImpact = pestelImpacts[`${factor.id}_${variable.id}`] || variable.impact;
            
            variableItem.innerHTML = `
                <div class="variable-header">
                    <div class="variable-name">${variable.name}</div>
                    <div class="variable-impact">Impacto: ${currentImpact}/5</div>
                </div>
                <div class="variable-description">${variable.description}</div>
                <input type="range" class="impact-slider" min="1" max="5" value="${currentImpact}" 
                       data-factor="${factor.id}" data-variable="${variable.id}">
                <div class="impact-labels">
                    <span>Bajo</span>
                    <span>Medio</span>
                    <span>Alto</span>
                </div>
            `;
            
            variablesContainer.appendChild(variableItem);
        });
    });
}

// Actualizar gráfico radar PESTEL
function updatePestelRadarChart() {
    // Calcular promedio de impacto por factor
    const factorAverages = {};
    
    pestelFactors.forEach(factor => {
        let total = 0;
        let count = 0;
        
        factor.variables.forEach(variable => {
            const impact = pestelImpacts[`${factor.id}_${variable.id}`] || variable.impact;
            total += impact;
            count++;
        });
        
        factorAverages[factor.name] = total / count;
    });
    
    const ctx = document.getElementById('pestel-radar-chart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.pestelRadarChart) {
        window.pestelRadarChart.destroy();
    }
    
    window.pestelRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(factorAverages),
            datasets: [{
                label: 'Impacto',
                data: Object.values(factorAverages),
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
            }]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 1,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Generar estrategias sugeridas basadas en PESTEL
function generatePestelStrategies() {
    const strategiesList = document.getElementById('pestel-strategies-list');
    strategiesList.innerHTML = '';
    
    // Identificar factores con mayor impacto (promedio > 3.5)
    const highImpactFactors = [];
    
    pestelFactors.forEach(factor => {
        let total = 0;
        let count = 0;
        
        factor.variables.forEach(variable => {
            const impact = pestelImpacts[`${factor.id}_${variable.id}`] || variable.impact;
            total += impact;
            count++;
        });
        
        const average = total / count;
        if (average > 3.5) {
            highImpactFactors.push({
                factor: factor.name,
                average: average,
                variables: factor.variables
                    .filter(v => (pestelImpacts[`${factor.id}_${v.id}`] || v.impact) > 3)
                    .map(v => ({
                        name: v.name,
                        impact: pestelImpacts[`${factor.id}_${v.id}`] || v.impact
                    }))
            });
        }
    });
    
    // Generar estrategias para cada factor de alto impacto
    highImpactFactors.forEach(factor => {
        factor.variables.forEach(variable => {
            const strategy = getPestelStrategy(factor.factor, variable.name, variable.impact);
            if (strategy) {
                addPestelStrategyToGlobal(strategy, factor.factor);
                
                const strategyCard = document.createElement('div');
                strategyCard.className = 'strategy-card';
                strategyCard.innerHTML = `
                    <h4>${strategy.title}</h4>
                    <p>${strategy.description}</p>
                    <div class="strategy-impact">
                        <span>${factor.factor}</span>
                        <span>Impacto: ${variable.impact}/5</span>
                    </div>
                `;
                strategiesList.appendChild(strategyCard);
            }
        });
    });
    
    if (highImpactFactors.length === 0) {
        strategiesList.innerHTML = '<p>No se han identificado factores de alto impacto.</p>';
    }
}

function addPestelStrategyToGlobal(strategy, factor) {
    if (!window.strategiesData) window.strategiesData = [];
    
    const existing = window.strategiesData.find(s => s.title === strategy.title);
    if (!existing) {
        window.strategiesData.push({
            id: `pestel-${Date.now()}`,
            title: strategy.title,
            description: strategy.description,
            source: 'pestel',
            businessUnit: getBusinessUnitForFactor(factor),
            products: getProductsForFactor(factor),
            impact: {
                revenue: strategy.impact * 3,
                transactions: strategy.impact * 4,
                cost: strategy.impact * -1
            }
        });
    }
}

function getBusinessUnitForFactor(factor) {
    const mapping = {
        'Tecnológico': 'Product Development',
        'Social': 'Customer Experience',
        'Económico': 'Business Development',
        'Político': 'Corporate',
        'Legal': 'Compliance',
        'Ecológico': 'Sustainability'
    };
    return mapping[factor] || 'Corporate';
}

function getProductsForFactor(factor) {
    // Esta función debería mapear factores a productos relevantes
    // Implementación simplificada:
    return ['Todos'];
}

// Configurar eventos PESTEL
function setupPestelEvents() {
    document.querySelectorAll('.impact-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const factor = this.dataset.factor;
            const variable = this.dataset.variable;
            const impact = parseInt(this.value);
            
            pestelImpacts[`${factor}_${variable}`] = impact;
            
            // Actualizar visualización de impacto
            this.closest('.variable-item').querySelector('.variable-impact').textContent = `Impacto: ${impact}/5`;
            
            updatePestelRadarChart();
            generatePestelStrategies();
        });
    });
}

// Inicializar módulo PESTEL cuando se carga la pestaña
document.querySelector('.nav-tabs li[data-tab="pestel"]').addEventListener('click', function() {
    if (!window.pestelInitialized) {
        initPestelAnalysis();
        window.pestelInitialized = true;
    }
});