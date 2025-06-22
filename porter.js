// Variables para análisis de Porter
const porterForces = [
    {
        id: 'current_competition',
        name: 'Competencia Actual',
        icon: 'fa-users',
        variables: [
            { id: 'link_competition', name: 'Link', description: 'Principal competidor en pagos digitales con fuerte presencia en comercios' },
            { id: 'coelsa_competition', name: 'COELSA', description: 'Proveedor de infraestructura de pagos con ventaja en conexión bancaria' },
            { id: 'prisma_competition', name: 'Prisma', description: 'Competidor en procesamiento de tarjetas expandiéndose a pagos instantáneos' },
            { id: 'crypto_competition', name: 'Cripto', description: 'Plataformas cripto ofreciendo alternativas de pago descentralizadas' }
        ]
    },
    {
        id: 'new_entrants',
        name: 'Amenaza Nuevos Entrantes',
        icon: 'fa-door-open',
        variables: [
            { id: 'regulation_barrier', name: 'Barrera regulatoria', description: 'La regulación en el sector financiero puede ser un obstáculo para nuevos competidores' },
            { id: 'digital_facilitation', name: 'Facilitación digital', description: 'La digitalización está reduciendo barreras de entrada para nuevos competidores' }
        ]
    },
    {
        id: 'substitutes',
        name: 'Productos Sustitutos',
        icon: 'fa-exchange-alt',
        variables: [
            { id: 'crypto_substitutes', name: 'Criptoactivos', description: 'Las criptomonedas y stablecoins como alternativa a los pagos tradicionales' },
            { id: 'brand_rails', name: 'Rieles de marcas', description: 'Grandes marcas desarrollando sus propias soluciones de pago' }
        ]
    },
    {
        id: 'supplier_power',
        name: 'Poder de Proveedores',
        icon: 'fa-truck',
        variables: [
            { id: 'aci_power', name: 'ACI Worldwide', description: 'Proveedor clave de tecnología para procesamiento de pagos' }
        ]
    },
    {
        id: 'buyer_power',
        name: 'Poder de Clientes',
        icon: 'fa-hand-holding-usd',
        variables: [
            { id: 'bank_power', name: 'Bancos socios', description: 'Bancos dueños de Coelsa con poder de negociación' },
            { id: 'coelsa_negotiation', name: 'Negociación Coelsa', description: 'Poder de negociación en tarifas con la cámara compensadora' },
            { id: 'mercadolibre_volume', name: 'Volumen MercadoLibre', description: 'Grandes volúmenes de Mercado Pago dando poder de negociación' }
        ]
    }
];

// Impactos seleccionados por el usuario
let porterImpacts = {};

// Inicializar módulo Porter
function initPorterAnalysis() {
    renderPorterForces();
    setupPorterEvents();
}

// Renderizar fuerzas de Porter
function renderPorterForces() {
    const container = document.querySelector('#porter .factor-container');
    container.innerHTML = '';
    
    porterForces.forEach(force => {
        const forceCard = document.createElement('div');
        forceCard.className = 'factor-card';
        
        forceCard.innerHTML = `
            <h3><i class="fas ${force.icon}"></i> ${force.name}</h3>
            <div class="variables-list" id="${force.id}-variables"></div>
        `;
        
        container.appendChild(forceCard);
        
        const variablesContainer = document.getElementById(`${force.id}-variables`);
        force.variables.forEach(variable => {
            const variableItem = document.createElement('div');
            variableItem.className = 'variable-item';
            
            // Verificar si ya hay un impacto guardado para esta variable
            const currentImpact = porterImpacts[`${force.id}_${variable.id}`] || 3;
            
            variableItem.innerHTML = `
                <div class="variable-name">${variable.name}</div>
                <div class="variable-description">${variable.description}</div>
                <input type="range" class="impact-slider" min="1" max="5" value="${currentImpact}" 
                       data-force="${force.id}" data-variable="${variable.id}">
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

// Configurar eventos Porter
function setupPorterEvents() {
    // Eventos para los sliders de impacto
    document.querySelectorAll('#porter .impact-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const force = this.dataset.force;
            const variable = this.dataset.variable;
            const impact = parseInt(this.value);
            
            // Guardar impacto
            porterImpacts[`${force}_${variable}`] = impact;
            
            // Actualizar gráfico radar
            updatePorterRadarChart();
            
            // Generar estrategias sugeridas
            generatePorterStrategies();
        });
    });
}

// Actualizar gráfico radar Porter
function updatePorterRadarChart() {
    // Calcular promedio de impacto por fuerza
    const forceAverages = {};
    
    porterForces.forEach(force => {
        let total = 0;
        let count = 0;
        
        force.variables.forEach(variable => {
            const impact = porterImpacts[`${force.id}_${variable.id}`] || 3;
            total += impact;
            count++;
        });
        
        forceAverages[force.name] = total / count;
    });
    
    const ctx = document.getElementById('porter-radar-chart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (window.porterRadarChart) {
        window.porterRadarChart.destroy();
    }
    
    window.porterRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(forceAverages),
            datasets: [{
                label: 'Intensidad',
                data: Object.values(forceAverages),
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderColor: 'rgba(231, 76, 60, 1)',
                pointBackgroundColor: 'rgba(231, 76, 60, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(231, 76, 60, 1)'
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

// Generar estrategias sugeridas basadas en Porter
function generatePorterStrategies() {
    const strategiesList = document.getElementById('porter-strategies-list');
    strategiesList.innerHTML = '';
    
    // Identificar fuerzas con mayor impacto (promedio > 3.5)
    const highImpactForces = [];
    
    porterForces.forEach(force => {
        let total = 0;
        let count = 0;
        
        force.variables.forEach(variable => {
            const impact = porterImpacts[`${force.id}_${variable.id}`] || 3;
            total += impact;
            count++;
        });
        
        const average = total / count;
        if (average > 3.5) {
            highImpactForces.push({
                force: force.name,
                average: average,
                variables: force.variables
                    .filter(v => porterImpacts[`${force.id}_${v.id}`] > 3)
                    .map(v => ({
                        name: v.name,
                        impact: porterImpacts[`${force.id}_${v.id}`]
                    }))
            });
        }
    });
    
    // Generar estrategias para cada fuerza de alto impacto
    highImpactForces.forEach(force => {
        force.variables.forEach(variable => {
            const strategy = getPorterStrategy(force.force, variable.name, variable.impact);
            if (strategy) {
                const strategyCard = document.createElement('div');
                strategyCard.className = 'strategy-card';
                strategyCard.innerHTML = `
                    <h4>${strategy.title}</h4>
                    <p>${strategy.description}</p>
                    <div class="strategy-impact">
                        <span>${force.force}</span>
                        <span>Impacto: ${variable.impact}/5</span>
                    </div>
                `;
                strategyCard.addEventListener('click', function() {
                    showStrategyDetails(strategy);
                });
                strategiesList.appendChild(strategyCard);
            }
        });
    });
    
    // Si no hay fuerzas de alto impacto, mostrar mensaje
    if (highImpactForces.length === 0) {
        strategiesList.innerHTML = '<p>No se han identificado fuerzas competitivas de alto impacto. Ajusta los controles deslizantes para ver estrategias sugeridas.</p>';
    }
}

// Obtener estrategia Porter basada en fuerza, variable e impacto
function getPorterStrategy(force, variable, impact) {
    const strategies = {
        "Competencia Actual": {
            "Link": [
                {
                    title: "Diferenciación por valor agregado",
                    description: "Desarrollar capacidades únicas de valor agregado (ej. reconciliación automática, APIs avanzadas) para distinguirse de Link."
                }
            ],
            "COELSA": [
                {
                    title: "Alianza estratégica con COELSA",
                    description: "Explorar acuerdos de colaboración con COELSA para aprovechar su infraestructura y reducir competencia directa."
                }
            ]
        },
        "Amenaza Nuevos Entrantes": {
            "Facilitación digital": [
                {
                    title: "Construcción de barreras de salida",
                    description: "Implementar características que aumenten el costo de cambio para clientes (ej. integraciones profundas, historial acumulado)."
                }
            ]
        },
        // ... más estrategias para otras fuerzas y variables
    };
    
    // Simplificación: en una implementación real, esto sería más completo
    if (strategies[force] && strategies[force][variable]) {
        return strategies[force][variable][0]; // Devolver la primera estrategia
    }
    
    // Estrategia genérica si no hay una específica
    return {
        title: `Estrategia para ${force.toLowerCase()}`,
        description: `Desarrollar iniciativas para contrarrestar la amenaza de ${variable} en el área de ${force}.`,
        impact: impact,
        factor: force
    };
}

// Inicializar módulo Porter cuando se carga la pestaña
document.querySelector('.nav-tabs li[data-tab="porter"]').addEventListener('click', function() {
    if (!window.porterInitialized) {
        initPorterAnalysis();
        window.porterInitialized = true;
    }
});