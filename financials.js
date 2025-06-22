// Variables globales para datos financieros
let financialData = {
    revenue: 0,
    costOfSales: 0,
    grossProfit: 0,
    operatingExpenses: 0,
    ebitda: 0,
    operatingProfit: 0,
    taxes: 0,
    netProfit: 0,
    transactions: 0,
    operatingMargin: 0,
    netMargin: 0
};

// Inicializar datos financieros
function initializeFinancials() {
    // Valores por defecto
    financialData = {
        revenue: 0,
        costOfSales: 0.3, // 30% de los ingresos por defecto
        operatingExpenses: 0.25, // 25% de los ingresos por defecto
        taxes: 0.3, // 30% de las ganancias por defecto
        transactions: 0
    };
    
    calculateAutomaticFinancials();
    updateFinancialTable();
    updateKPIs();
    renderFinancialCharts();
}

// Calcular valores financieros automáticamente basados en productos y clientes
function calculateAutomaticFinancials() {
    if (!window.productsData || !window.clientsData) return;
    
    let totalRevenue = 0;
    let totalTransactions = 0;
    
    // Calcular ingresos y transacciones basados en productos y clientes
    window.productsData.forEach(product => {
        const clientsUsingProduct = window.clientsData.filter(client => 
            client.products.includes(product.id));
        
        const productTransactions = clientsUsingProduct.reduce((sum, client) => {
            const clientProduct = client.productDetails.find(p => p.productId === product.id);
            return sum + (clientProduct ? clientProduct.monthlyTransactions * 12 : 0);
        }, 0);
        
        const productRevenue = clientsUsingProduct.reduce((sum, client) => {
            const clientProduct = client.productDetails.find(p => p.productId === product.id);
            return sum + (clientProduct ? clientProduct.monthlyTransactions * 12 * clientProduct.pricePerTransaction : 0);
        }, 0);
        
        totalTransactions += productTransactions;
        totalRevenue += productRevenue;
        
        // Guardar datos por producto para gráficos
        product.annualTransactions = productTransactions;
        product.annualRevenue = productRevenue;
    });
    
    // Actualizar datos financieros
    financialData.revenue = totalRevenue;
    financialData.transactions = totalTransactions;
    financialData.costOfSales = totalRevenue * financialData.costOfSales;
    financialData.grossProfit = totalRevenue - financialData.costOfSales;
    financialData.operatingExpenses = totalRevenue * financialData.operatingExpenses;
    financialData.ebitda = financialData.grossProfit - financialData.operatingExpenses;
    financialData.operatingProfit = financialData.ebitda; // Simplificación
    financialData.taxes = financialData.operatingProfit * financialData.taxes;
    financialData.netProfit = financialData.operatingProfit - financialData.taxes;
    financialData.operatingMargin = (financialData.operatingProfit / totalRevenue) * 100;
    financialData.netMargin = (financialData.netProfit / totalRevenue) * 100;
    
    updateFinancialTable();
    updateKPIs();
    renderFinancialCharts();
}

// Actualizar tabla financiera
function updateFinancialTable() {
    const tableBody = document.getElementById('financial-table-body');
    tableBody.innerHTML = '';
    
    const financialItems = [
        { name: 'Ingresos', value: financialData.revenue, percentage: 100, editable: false },
        { name: 'Costos Directos', value: financialData.costOfSales, percentage: (financialData.costOfSales / financialData.revenue) * 100, editable: true, key: 'costOfSales' },
        { name: 'Utilidad Bruta', value: financialData.grossProfit, percentage: (financialData.grossProfit / financialData.revenue) * 100, editable: false },
        { name: 'Gastos Operativos', value: financialData.operatingExpenses, percentage: (financialData.operatingExpenses / financialData.revenue) * 100, editable: true, key: 'operatingExpenses' },
        { name: 'EBITDA', value: financialData.ebitda, percentage: (financialData.ebitda / financialData.revenue) * 100, editable: false },
        { name: 'Utilidad Operativa', value: financialData.operatingProfit, percentage: financialData.operatingMargin, editable: false },
        { name: 'Impuestos', value: financialData.taxes, percentage: (financialData.taxes / financialData.operatingProfit) * 100, editable: true, key: 'taxes' },
        { name: 'Utilidad Neta', value: financialData.netProfit, percentage: financialData.netMargin, editable: false }
    ];
    
    financialItems.forEach(item => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        row.appendChild(nameCell);
        
        const valueCell = document.createElement('td');
        valueCell.textContent = formatCurrency(item.value);
        row.appendChild(valueCell);
        
        const percentageCell = document.createElement('td');
        percentageCell.textContent = item.percentage.toFixed(2) + '%';
        row.appendChild(percentageCell);
        
        const actionsCell = document.createElement('td');
        if (item.editable) {
            const input = document.createElement('input');
            input.type = 'number';
            input.value = item.percentage.toFixed(2);
            input.step = '0.1';
            input.className = 'percentage-input';
            input.dataset.key = item.key;
            
            input.addEventListener('change', function() {
                const newPercentage = parseFloat(this.value);
                if (!isNaN(newPercentage)) {
                    updateFinancialItem(this.dataset.key, newPercentage);
                }
            });
            
            actionsCell.appendChild(input);
        } else {
            actionsCell.textContent = '-';
        }
        row.appendChild(actionsCell);
        
        tableBody.appendChild(row);
    });
}

// Actualizar un ítem financiero
function updateFinancialItem(key, percentage) {
    if (key === 'costOfSales') {
        financialData.costOfSales = (percentage / 100) * financialData.revenue;
        financialData.grossProfit = financialData.revenue - financialData.costOfSales;
    } else if (key === 'operatingExpenses') {
        financialData.operatingExpenses = (percentage / 100) * financialData.revenue;
    } else if (key === 'taxes') {
        financialData.taxes = (percentage / 100) * financialData.operatingProfit;
    }
    
    // Recalcular valores dependientes
    financialData.ebitda = financialData.grossProfit - financialData.operatingExpenses;
    financialData.operatingProfit = financialData.ebitda; // Simplificación
    financialData.netProfit = financialData.operatingProfit - financialData.taxes;
    financialData.operatingMargin = (financialData.operatingProfit / financialData.revenue) * 100;
    financialData.netMargin = (financialData.netProfit / financialData.revenue) * 100;
    
    updateFinancialTable();
    updateKPIs();
    renderFinancialCharts();
}

// Actualizar KPIs
function updateKPIs() {
    document.getElementById('kpi-ebitda').textContent = formatCurrency(financialData.ebitda);
    document.getElementById('kpi-roi').textContent = ((financialData.netProfit / (financialData.revenue * 0.5)) * 100).toFixed(1) + '%';
    document.getElementById('kpi-transactions').textContent = financialData.transactions.toLocaleString();
    document.getElementById('kpi-nps').textContent = Math.floor(Math.random() * 30 + 60); // Valor aleatorio entre 60-90
}

// Renderizar gráficos financieros
function renderFinancialCharts() {
    // Gráfico de ingresos por unidad de negocio
    const revenueByUnitData = window.productsData.reduce((acc, product) => {
        const unit = product.businessUnit;
        if (!acc[unit]) acc[unit] = 0;
        acc[unit] += product.annualRevenue || 0;
        return acc;
    }, {});
    
    const revenueByUnitChart = new ApexCharts(document.getElementById('revenue-by-unit-chart'), {
        series: Object.values(revenueByUnitData),
        chart: {
            type: 'donut',
            height: 350
        },
        labels: Object.keys(revenueByUnitData),
        colors: ['#3498db', '#2ecc71', '#e74c3c', '#f39c12'],
        legend: {
            position: 'bottom'
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    });
    revenueByUnitChart.render();
    
    // Gráfico de transacciones por producto
    const transactionsByProductData = window.productsData.map(product => ({
        name: product.name,
        data: product.annualTransactions || 0
    }));
    
    const transactionsByProductChart = new ApexCharts(document.getElementById('transactions-by-product-chart'), {
        series: [{
            name: 'Transacciones',
            data: transactionsByProductData.map(item => item.data)
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: transactionsByProductData.map(item => item.name),
        },
        colors: ['#3498db']
    });
    transactionsByProductChart.render();
    
    // Gráfico de evolución financiera
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const financialEvolutionCtx = document.getElementById('financial-evolution-chart').getContext('2d');
    
    // Generar datos mensuales aleatorios basados en los anuales
    const monthlyRevenue = generateMonthlyData(financialData.revenue);
    const monthlyCosts = generateMonthlyData(financialData.costOfSales);
    const monthlyProfit = generateMonthlyData(financialData.netProfit);
    
    new Chart(financialEvolutionCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'Ingresos',
                    data: monthlyRevenue,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Costos',
                    data: monthlyCosts,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Utilidad Neta',
                    data: monthlyProfit,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
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
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Gráfico de composición del P&L
    const profitCompositionChart = new ApexCharts(document.getElementById('profit-composition-chart'), {
        series: [financialData.revenue, financialData.costOfSales, financialData.operatingExpenses, financialData.taxes, financialData.netProfit],
        chart: {
            type: 'pie',
            height: 350
        },
        labels: ['Ingresos', 'Costos Directos', 'Gastos Operativos', 'Impuestos', 'Utilidad Neta'],
        colors: ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#2ecc71'],
        legend: {
            position: 'bottom'
        }
    });
    profitCompositionChart.render();
    
    // Gráfico de margen EBITDA
    const ebitdaMarginChart = new ApexCharts(document.getElementById('ebitda-margin-chart'), {
        series: [{
            name: 'Margen EBITDA',
            data: [financialData.operatingMargin]
        }],
        chart: {
            type: 'radialBar',
            height: 350
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    margin: 0,
                    size: '70%',
                },
                dataLabels: {
                    name: {
                        offsetY: -10,
                        color: '#333',
                        fontSize: '13px'
                    },
                    value: {
                        color: '#333',
                        fontSize: '30px',
                        show: true
                    }
                },
                track: {
                    background: '#e0e0e0',
                    strokeWidth: '97%',
                    margin: 5,
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91]
            },
        },
        stroke: {
            dashArray: 4
        },
        labels: ['Margen EBITDA'],
    });
    ebitdaMarginChart.render();
}

// Generar datos mensuales basados en un total anual
function generateMonthlyData(annualTotal) {
    const base = annualTotal / 12;
    return Array.from({ length: 12 }, (_, i) => {
        const monthFactor = 0.8 + Math.random() * 0.4; // Variación del 80% al 120%
        const trendFactor = 1 + (i * 0.02); // Pequeña tendencia creciente
        return Math.round(base * monthFactor * trendFactor);
    });
}

// Formatear moneda
function formatCurrency(value) {
    return '$' + Math.round(value).toLocaleString();
}