// Variables para análisis PESTEL
const pestelFactors = [
    {
        id: 'political',
        name: 'Político',
        icon: 'fa-landmark',
        variables: [
            { id: 'government_influence', name: 'Influencia gubernamental', description: 'Gobiernos y bancos centrales convierten los pagos instantáneos en infraestructura pública esencial 24/7' },
            { id: 'political_situation', name: 'Situación política', description: 'Proyectos regionales de interconexión señalan el camino para remesas instantáneas y baratas' },
            { id: 'government_subsidies', name: 'Subsidios gubernamentales', description: 'Inclusión financiera y reducción del uso de efectivo/transferencias P2P gratis o con fee simbólico' },
            { id: 'bilateral_relations', name: 'Relaciones bilaterales', description: 'Mandatos "instant-by-default": regulación europea obliga a bancos a ofrecer transferencias inmediatas' },
            { id: 'regulation', name: 'Regulación & Desregulación', description: 'Impulso a CBDC y stablecoins reguladas como complemento soberano a la red bancaria rápida' }
        ]
    },
    {
        id: 'economic',
        name: 'Económico',
        icon: 'fa-chart-line',
        variables: [
            { id: 'inflation_rates', name: 'Tasas de inflación', description: 'Impacto de la inflación en los costos operativos y poder adquisitivo de los clientes' },
            { id: 'mergers', name: 'Fusiones y transformación', description: 'Crece la consolidación fintech-banca: compras, joint-ventures y "bank-as-a-service" para escalar rápido' },
            { id: 'growth_rates', name: 'Tasas de crecimiento', description: 'Formalización de la economía: millones de nuevos usuarios → PIB global +USD 285 mil M estimado para 2028' },
            { id: 'revenue_growth', name: 'Crecimiento de ingresos', description: 'Ingresos mundiales por pagos en tiempo real escalarán de USD 14 mil M (2021) a ~USD 120 mil M (2031)' },
            { id: 'access_financing', name: 'Acceso a financiación', description: 'Liquidación al instante mejora liquidez y reduce necesidad de crédito puente para pymes' }
        ]
    },
    {
        id: 'social',
        name: 'Social',
        icon: 'fa-users',
        variables: [
            { id: 'cultural_values', name: 'Valores culturales', description: 'Generación Z & Millennials ya lideran adopción; su peso de consumo acelera lo instantáneo a norma social' },
            { id: 'risk_attitude', name: 'Actitud hacia el riesgo', description: 'Expectativa de "hand-to-hand money": usuarios asumen que el dinero se mueve tan rápido como un chat' },
            { id: 'ethical_values', name: 'Valores éticos', description: 'Auge de fraude APP → inversión en educación financiera + biometría + IA antifraude para sostener confianza' },
            { id: 'population', name: 'Población (tamaño)', description: 'Pagos rápidos = puerta de entrada a historial financiero → mayor acceso a microcrédito, seguros y ahorro digital' },
            { id: 'embedded_payments', name: 'Cultura "pago embebido"', description: 'Redes sociales, super-apps e IoT convierten cualquier interfaz en punto de cobro' }
        ]
    },
    {
        id: 'technological',
        name: 'Tecnológico',
        icon: 'fa-microchip',
        variables: [
            { id: 'iot', name: 'IoT', description: 'Pagos M2M (vehículos, electrodomésticos) y micro-transacciones IoT despegan con 5G/6G' },
            { id: 'qr_ar', name: 'AV & VR y Comunicaciones', description: 'Cobros QR interoperables y request-to-pay se vuelven funciones básicas sobre la capa rápida' },
            { id: 'ai', name: 'Inteligencia artificial', description: 'IA en tiempo real analiza cada transacción y frena fraude sin friccionar la experiencia' },
            { id: 'automation', name: 'Automatización', description: 'Estándar ISO 20022 + APIs abiertas = interoperabilidad global y llegada de actores "plug-and-play"' },
            { id: 'blockchain', name: 'Impacto del Blockchain', description: 'Blockchain evoluciona: stablecoins reguladas y depósitos tokenizados se integran en rails bancarios' }
        ]
    },
    {
        id: 'ecological',
        name: 'Ecológico',
        icon: 'fa-leaf',
        variables: [
            { id: 'carbon_footprint', name: 'Huella de carbono', description: '"Green fintech" incorpora cálculo de huella de carbono por compra y opciones de compensación automática' },
            { id: 'climate_change', name: 'Cambio climático', description: 'Data centers crecen; la industria se compromete a energía 100 % renovable y offset de huella' },
            { id: 'disaster_resilience', name: 'Resiliencia post-desastre', description: 'Pagos instantáneos fortalecen resiliencia post-desastre' },
            { id: 'pollution_levels', name: 'Niveles de polución', description: 'Sustitución de efectivo, cheques y PVC -80 % de CO₂ por transacción frente a pagos físicos tradicionales' }
        ]
    },
    {
        id: 'legal',
        name: 'Legal',
        icon: 'fa-gavel',
        variables: [
            { id: 'safeguard_laws', name: 'Leyes de salvaguardia', description: 'Monitoreo con IA de Pla y FT' },
            { id: 'hybrid_licenses', name: 'Licencias híbridas', description: 'Nuevas normativas de licencias hibridas para bancos - fintech globales (dinero electrónico)' },
            { id: 'crypto_regulations', name: 'Regulaciones cripto', description: 'Nuevas normativas y regulaciones internacionales sobre criptoactivos' },
            { id: 'consumer_protection', name: 'Protección al consumidor', description: 'Expansión de Open Banking / Open Finance: acceso obligatorio a cuentas vía API para PISP y fintech' },
            { id: 'fraud_reimbursement', name: 'Reembolso por fraude', description: 'Nuevas normas de verificación de beneficiario + reembolso APP fraude protegen al consumidor' }
        ]
    }
];

// Impactos seleccionados por el usuario
let pestelImpacts = {};

// Inicializar módulo PESTEL
function initPestelAnalysis() {
    renderPestelFactors();
    setupPestelEvents();
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
            
            // Verificar si ya hay un impacto guardado para esta variable
            const currentImpact = pestelImpacts[`${factor.id}_${variable.id}`] || 3;
            
            variableItem.innerHTML = `
                <div class="variable-name">${variable.name}</div>
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

// Configurar eventos PESTEL
function setupPestelEvents() {
    // Eventos para los sliders de impacto
    document.querySelectorAll('.impact-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            const factor = this.dataset.factor;
            const variable = this.dataset.variable;
            const impact = parseInt(this.value);
            
            // Guardar impacto
            pestelImpacts[`${factor}_${variable}`] = impact;
            
            // Actualizar gráfico radar
            updatePestelRadarChart();
            
            // Generar estrategias sugeridas
            generatePestelStrategies();
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
            const impact = pestelImpacts[`${factor.id}_${variable.id}`] || 3;
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
            const impact = pestelImpacts[`${factor.id}_${variable.id}`] || 3;
            total += impact;
            count++;
        });
        
        const average = total / count;
        if (average > 3.5) {
            highImpactFactors.push({
                factor: factor.name,
                average: average,
                variables: factor.variables
                    .filter(v => pestelImpacts[`${factor.id}_${v.id}`] > 3)
                    .map(v => ({
                        name: v.name,
                        impact: pestelImpacts[`${factor.id}_${v.id}`]
                    }))
            });
        }
    });
    
    // Generar estrategias para cada factor de alto impacto
    highImpactFactors.forEach(factor => {
        factor.variables.forEach(variable => {
            const strategy = getPestelStrategy(factor.factor, variable.name, variable.impact);
            if (strategy) {
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
                strategyCard.addEventListener('click', function() {
                    showStrategyDetails(strategy);
                });
                strategiesList.appendChild(strategyCard);
            }
        });
    });
    
    // Si no hay factores de alto impacto, mostrar mensaje
    if (highImpactFactors.length === 0) {
        strategiesList.innerHTML = '<p>No se han identificado factores de alto impacto. Ajusta los controles deslizantes para ver estrategias sugeridas.</p>';
    }
}

// Obtener estrategia PESTEL basada en factor, variable e impacto
function getPestelStrategy(factor, variable, impact) {
    const strategies = {
        political: {
            "Influencia gubernamental": [
                {
                    title: "Colaboración con reguladores",
                    description: "Establecer un programa de relaciones con gobiernos y bancos centrales para posicionar NewPay como socio estratégico en infraestructura de pagos."
                },
                {
                    title: "Adaptación regulatoria proactiva",
                    description: "Crear un equipo dedicado a monitorear y anticipar cambios regulatorios para garantizar el cumplimiento y ventaja competitiva."
                }
            ],
            "Situación política": [
                {
                    title: "Expansión regional estratégica",
                    description: "Priorizar mercados con proyectos de interconexión activos, desarrollando capacidades específicas para remesas transfronterizas."
                }
            ]
        },
        economic: {
            "Tasas de inflación": [
                {
                    title: "Ajuste dinámico de precios",
                    description: "Implementar un modelo de precios indexado para mantener márgenes frente a presiones inflacionarias."
                }
            ],
            "Fusiones y transformación": [
                {
                    title: "Alianzas estratégicas",
                    description: "Identificar oportunidades de joint-ventures o alianzas con bancos tradicionales para acelerar el crecimiento."
                }
            ]
        },
        // ... más estrategias para otros factores y variables
    };
    
    // Simplificación: en una implementación real, esto sería más completo
    const factorKey = factor.toLowerCase();
    if (strategies[factorKey] && strategies[factorKey][variable]) {
        return strategies[factorKey][variable][0]; // Devolver la primera estrategia
    }
    
    // Estrategia genérica si no hay una específica
    return {
        title: `Mitigar riesgos ${factor.toLowerCase()}`,
        description: `Desarrollar un plan de acción para abordar los desafíos identificados en ${variable} (${factor}).`,
        impact: impact,
        factor: factor
    };
}

// Mostrar detalles de estrategia en modal
function showStrategyDetails(strategy) {
    const modalTitle = document.getElementById('strategyModalTitle');
    const modalBody = document.getElementById('strategyModalBody');
    
    modalTitle.textContent = strategy.title;
    
    modalBody.innerHTML = `
        <p><strong>Área:</strong> ${strategy.factor || 'General'}</p>
        <p><strong>Impacto estimado:</strong> ${strategy.impact || 'Medio'}</p>
        <p><strong>Descripción:</strong></p>
        <p>${strategy.description}</p>
        <div class="potential-impact">
            <h5>Impacto Potencial:</h5>
            <ul>
                <li>Aumento estimado en ingresos: 5-15%</li>
                <li>Reducción de costos operativos: 3-8%</li>
                <li>Mejora en NPS: 10-20 puntos</li>
            </ul>
        </div>
    `;
    
    // Configurar botón de aplicar
    const applyBtn = document.getElementById('applyStrategyFromModal');
    applyBtn.onclick = function() {
        addStrategyToSimulation(strategy);
        bootstrap.Modal.getInstance(document.getElementById('strategyModal')).hide();
    };
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('strategyModal'));
    modal.show();
}

// Inicializar módulo PESTEL cuando se carga la pestaña
document.querySelector('.nav-tabs li[data-tab="pestel"]').addEventListener('click', function() {
    if (!window.pestelInitialized) {
        initPestelAnalysis();
        window.pestelInitialized = true;
    }
});