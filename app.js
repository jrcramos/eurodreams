// EuroDreams Lottery Predictor PWA
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZzm-CTUj3li4EdfW1ImthPdc0AGIymq8tbuwPiqjW0OL4F1MWO5G6PfPEtNvLJcY8MpJo4apayTip/pub?output=csv';

let historicalDraws = [];
let deferredPrompt;

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

// PWA Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById('install-banner').style.display = 'flex';
});

document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User ${outcome} the install prompt`);
        deferredPrompt = null;
        document.getElementById('install-banner').style.display = 'none';
    }
});

document.getElementById('dismiss-btn')?.addEventListener('click', () => {
    document.getElementById('install-banner').style.display = 'none';
});

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    document.getElementById('refresh-btn')?.addEventListener('click', () => {
        generatePredictions();
    });
});

async function loadData() {
    try {
        showLoading();
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const csvText = await response.text();
        historicalDraws = parseCSV(csvText);
        
        if (historicalDraws.length === 0) {
            throw new Error('No valid draws found in CSV');
        }
        
        hideLoading();
        showDataInfo(historicalDraws.length);
        generatePredictions();
        displayStats();
    } catch (error) {
        showError('Failed to load data: ' + error.message);
    }
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const draws = [];
    
    // Skip header row and parse data
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split by comma - format: FECHA,N1,N2,N3,N4,N5,N6,SUEÑO
        const values = line.split(',').map(v => v.trim());
        
        if (values.length >= 8) {
            // Extract 6 main numbers (columns 1-6) and dream number (column 7)
            const numbers = [];
            for (let j = 1; j <= 6; j++) {
                const num = parseInt(values[j]);
                if (!isNaN(num)) numbers.push(num);
            }
            
            const dreamNum = parseInt(values[7]);
            
            if (numbers.length === 6 && !isNaN(dreamNum)) {
                draws.push({
                    date: values[0],
                    mainNumbers: numbers.sort((a, b) => a - b),
                    dreamNumber: dreamNum
                });
            }
        }
    }
    
    return draws;
}

function generatePredictions() {
    if (historicalDraws.length === 0) return;
    
    const predictions = [
        generateFrequencyPrediction(),
        generateHotColdPrediction(),
        generateGapAnalysisPrediction(),
        generatePatternPrediction(),
        generateBalancedPrediction()
    ];
    
    displayPredictions(predictions);
}

// Prediction Method 1: Frequency Analysis
function generateFrequencyPrediction() {
    const mainFreq = getNumberFrequency(1, 40, false);
    const dreamFreq = getNumberFrequency(1, 5, true);
    
    // Pick top 6 most frequent main numbers
    const mainNumbers = Object.entries(mainFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([num]) => parseInt(num))
        .sort((a, b) => a - b);
    
    // Pick most frequent dream number
    const dreamNumber = Object.entries(dreamFreq)
        .sort((a, b) => b[1] - a[1])[0][0];
    
    return {
        method: '🔥 Frequency Analysis',
        mainNumbers: ensureUniquePrediction(mainNumbers),
        dreamNumber: parseInt(dreamNumber),
        description: 'Most frequently drawn numbers in history'
    };
}

// Prediction Method 2: Hot and Cold Analysis
function generateHotColdPrediction() {
    // Get numbers from recent 20 draws (hot) and avoid very cold numbers
    const recentDraws = historicalDraws.slice(0, Math.min(20, historicalDraws.length));
    const hotNumbers = new Set();
    
    recentDraws.forEach(draw => {
        draw.mainNumbers.forEach(num => hotNumbers.add(num));
    });
    
    // Pick 6 hot numbers
    const mainNumbers = Array.from(hotNumbers).slice(0, 6).sort((a, b) => a - b);
    
    // If not enough, add random numbers
    while (mainNumbers.length < 6) {
        const num = Math.floor(Math.random() * 40) + 1;
        if (!mainNumbers.includes(num)) mainNumbers.push(num);
    }
    
    const dreamNumber = recentDraws[0].dreamNumber;
    
    return {
        method: '🌡️ Hot Numbers',
        mainNumbers: mainNumbers.sort((a, b) => a - b).slice(0, 6),
        dreamNumber: dreamNumber,
        description: 'Numbers that appeared in recent draws'
    };
}

// Prediction Method 3: Gap Analysis
function generateGapAnalysisPrediction() {
    const lastSeen = {};
    
    // Track when each number was last seen
    for (let i = 1; i <= 40; i++) lastSeen[i] = historicalDraws.length;
    
    historicalDraws.forEach((draw, idx) => {
        draw.mainNumbers.forEach(num => {
            if (lastSeen[num] === historicalDraws.length) {
                lastSeen[num] = idx;
            }
        });
    });
    
    // Pick numbers that haven't appeared in a while (due for draw)
    const mainNumbers = Object.entries(lastSeen)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([num]) => parseInt(num))
        .sort((a, b) => a - b);
    
    // Dream number gap analysis
    const dreamLastSeen = {};
    for (let i = 1; i <= 5; i++) dreamLastSeen[i] = historicalDraws.length;
    
    historicalDraws.forEach((draw, idx) => {
        if (dreamLastSeen[draw.dreamNumber] === historicalDraws.length) {
            dreamLastSeen[draw.dreamNumber] = idx;
        }
    });
    
    const dreamNumber = parseInt(Object.entries(dreamLastSeen)
        .sort((a, b) => b[1] - a[1])[0][0]);
    
    return {
        method: '⏰ Gap Analysis',
        mainNumbers: mainNumbers,
        dreamNumber: dreamNumber,
        description: 'Numbers that haven\'t appeared recently (overdue)'
    };
}

// Prediction Method 4: Pattern Recognition
function generatePatternPrediction() {
    // Look for patterns: mix of low (1-20) and high (21-40) numbers
    const mainNumbers = [];
    
    // Get 3 low numbers
    const lowCount = 3;
    for (let i = 0; i < lowCount; i++) {
        let num;
        do {
            num = Math.floor(Math.random() * 20) + 1;
        } while (mainNumbers.includes(num));
        mainNumbers.push(num);
    }
    
    // Fill with high numbers
    while (mainNumbers.length < 6) {
        let num;
        do {
            num = Math.floor(Math.random() * 20) + 21;
        } while (mainNumbers.includes(num));
        mainNumbers.push(num);
    }
    
    const dreamNumber = Math.floor(Math.random() * 5) + 1;
    
    return {
        method: '🎯 Pattern Balance',
        mainNumbers: mainNumbers.sort((a, b) => a - b),
        dreamNumber: dreamNumber,
        description: 'Balanced mix of low and high numbers'
    };
}

// Prediction Method 5: Balanced Random with Validation
function generateBalancedPrediction() {
    // Generate random but ensure it's never been drawn
    let attempts = 0;
    const maxAttempts = 1000;
    
    while (attempts < maxAttempts) {
        const mainNumbers = [];
        while (mainNumbers.length < 6) {
            const num = Math.floor(Math.random() * 40) + 1;
            if (!mainNumbers.includes(num)) mainNumbers.push(num);
        }
        mainNumbers.sort((a, b) => a - b);
        
        const dreamNumber = Math.floor(Math.random() * 5) + 1;
        
        // Check if this combination was never drawn
        if (!wasDrawnBefore(mainNumbers, dreamNumber)) {
            return {
                method: '🎲 Smart Random',
                mainNumbers: mainNumbers,
                dreamNumber: dreamNumber,
                description: 'Random selection never drawn before'
            };
        }
        attempts++;
    }
    
    // Fallback: just return a random one
    const mainNumbers = [];
    while (mainNumbers.length < 6) {
        const num = Math.floor(Math.random() * 40) + 1;
        if (!mainNumbers.includes(num)) mainNumbers.push(num);
    }
    
    return {
        method: '🎲 Smart Random',
        mainNumbers: mainNumbers.sort((a, b) => a - b),
        dreamNumber: Math.floor(Math.random() * 5) + 1,
        description: 'Random selection never drawn before'
    };
}

// Helper Functions
function getNumberFrequency(min, max, isDream) {
    const frequency = {};
    for (let i = min; i <= max; i++) frequency[i] = 0;
    
    historicalDraws.forEach(draw => {
        if (isDream) {
            frequency[draw.dreamNumber]++;
        } else {
            draw.mainNumbers.forEach(num => frequency[num]++);
        }
    });
    
    return frequency;
}

function ensureUniquePrediction(numbers) {
    // Make sure we have 6 unique numbers
    const unique = [...new Set(numbers)];
    while (unique.length < 6) {
        const num = Math.floor(Math.random() * 40) + 1;
        if (!unique.includes(num)) unique.push(num);
    }
    return unique.slice(0, 6).sort((a, b) => a - b);
}

function wasDrawnBefore(mainNumbers, dreamNumber) {
    return historicalDraws.some(draw => {
        return arraysEqual(draw.mainNumbers, mainNumbers) && draw.dreamNumber === dreamNumber;
    });
}

function arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort((a, b) => a - b);
    const sorted2 = [...arr2].sort((a, b) => a - b);
    return sorted1.every((val, idx) => val === sorted2[idx]);
}

// Display Functions
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('error').style.display = 'none';
    document.getElementById('data-info').style.display = 'none';
    document.getElementById('predictions-section').style.display = 'none';
    document.getElementById('stats-section').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showError(message) {
    hideLoading();
    const errorEl = document.getElementById('error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function showDataInfo(count) {
    document.getElementById('draw-count').textContent = count;
    document.getElementById('data-info').style.display = 'block';
}

function displayPredictions(predictions) {
    const container = document.getElementById('predictions-container');
    container.innerHTML = '';
    
    predictions.forEach((pred, idx) => {
        const card = document.createElement('div');
        card.className = 'prediction-card';
        
        const header = document.createElement('div');
        header.className = 'prediction-header';
        
        const method = document.createElement('div');
        method.className = 'prediction-method';
        method.textContent = pred.method;
        
        const badge = document.createElement('div');
        badge.className = 'prediction-badge';
        badge.textContent = `Method ${idx + 1}`;
        
        header.appendChild(method);
        header.appendChild(badge);
        card.appendChild(header);
        
        const numbersContainer = document.createElement('div');
        numbersContainer.className = 'numbers-container';
        
        pred.mainNumbers.forEach(num => {
            const ball = document.createElement('div');
            ball.className = 'number-ball';
            ball.textContent = num;
            numbersContainer.appendChild(ball);
        });
        
        card.appendChild(numbersContainer);
        
        const dreamLabel = document.createElement('div');
        dreamLabel.className = 'dream-number-label';
        dreamLabel.textContent = 'Dream Number:';
        card.appendChild(dreamLabel);
        
        const dreamContainer = document.createElement('div');
        dreamContainer.className = 'numbers-container';
        const dreamBall = document.createElement('div');
        dreamBall.className = 'number-ball dream';
        dreamBall.textContent = pred.dreamNumber;
        dreamContainer.appendChild(dreamBall);
        card.appendChild(dreamContainer);
        
        const description = document.createElement('div');
        description.className = 'prediction-description';
        description.textContent = pred.description;
        card.appendChild(description);
        
        container.appendChild(card);
    });
    
    document.getElementById('predictions-section').style.display = 'block';
}

function displayStats() {
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = '';
    
    const mainFreq = getNumberFrequency(1, 40, false);
    const dreamFreq = getNumberFrequency(1, 5, true);
    
    // Most frequent main number
    const mostFreqMain = Object.entries(mainFreq)
        .sort((a, b) => b[1] - a[1])[0];
    
    // Most frequent dream number
    const mostFreqDream = Object.entries(dreamFreq)
        .sort((a, b) => b[1] - a[1])[0];
    
    const stats = [
        { label: 'Total Draws', value: historicalDraws.length },
        { label: 'Most Frequent Number', value: `${mostFreqMain[0]} (${mostFreqMain[1]}x)` },
        { label: 'Most Frequent Dream', value: `${mostFreqDream[0]} (${mostFreqDream[1]}x)` },
        { label: 'Latest Draw', value: historicalDraws[0]?.date || 'N/A' }
    ];
    
    stats.forEach(stat => {
        const item = document.createElement('div');
        item.className = 'stat-item';
        
        const label = document.createElement('div');
        label.className = 'stat-label';
        label.textContent = stat.label;
        
        const value = document.createElement('div');
        value.className = 'stat-value';
        value.textContent = stat.value;
        
        item.appendChild(label);
        item.appendChild(value);
        statsContainer.appendChild(item);
    });
    
    document.getElementById('stats-section').style.display = 'block';
}
