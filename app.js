// EuroDreams Lottery Predictor PWA

// The CSV link is embedded in the LotoIdeas website page
// Source page: https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/
// Look for link text: "Valores separados por comas (.csv)"
const LOTOIDEAS_URL = 'https://www.lotoideas.com/eurodreams-resultados-historicos-de-todos-los-sorteos/';

// Fallback CSV URL (in case dynamic discovery fails)
// This URL is extracted from the LotoIdeas website
const FALLBACK_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTZzm-CTUj3li4EdfW1ImthPdc0AGIymq8tbuwPiqjW0OL4F1MWO5G6PfPEtNvLJcY8MpJo4apayTip/pub?output=csv';

let CSV_URL = FALLBACK_CSV_URL; // Will be updated if dynamic discovery succeeds

// Fallback data when external fetch fails (e.g., CORS issues with file:// protocol)
const FALLBACK_CSV = `FECHA,COMB. GANADORA,,,,,,SUEÑO
17/11/2025,04,08,13,18,28,38,4
13/11/2025,07,15,18,19,24,32,2
10/11/2025,01,08,10,19,21,37,2
6/11/2025,11,13,15,31,33,34,3
3/11/2025,02,10,12,20,21,26,2
30/10/2025,09,14,18,22,33,39,2
27/10/2025,18,19,21,23,30,35,1
23/10/2025,08,17,20,21,24,31,5
20/10/2025,08,18,21,25,32,33,1
16/10/2025,01,04,06,10,34,38,5
13/10/2025,01,05,12,20,22,25,1
9/10/2025,01,03,04,08,20,30,3
6/10/2025,18,26,30,31,36,40,4
2/10/2025,04,07,18,19,22,29,1
29/09/2025,09,10,25,33,35,40,2
25/09/2025,05,09,11,14,28,30,2
22/09/2025,02,05,09,22,26,38,5
18/09/2025,11,17,26,32,36,37,1
15/09/2025,04,07,15,21,33,35,1
11/09/2025,01,09,15,17,19,37,2
8/09/2025,01,03,05,11,20,31,5
4/09/2025,10,14,21,22,37,40,4
1/09/2025,06,22,30,31,32,33,4
28/08/2025,06,07,11,15,16,35,5
25/08/2025,05,06,19,32,35,37,1
21/08/2025,04,16,17,25,29,39,3
18/08/2025,01,31,33,35,36,40,4
14/08/2025,14,15,21,22,32,38,1
11/08/2025,10,11,15,20,27,38,3
7/08/2025,03,14,23,28,33,34,1
4/08/2025,02,08,13,14,15,17,5
31/07/2025,04,15,19,23,34,37,5
28/07/2025,04,19,25,26,38,40,3
24/07/2025,01,02,05,06,15,38,1
21/07/2025,03,04,08,11,26,31,1
17/07/2025,04,10,12,26,28,29,4
14/07/2025,06,12,20,21,33,37,4
10/07/2025,02,03,04,08,11,29,2
7/07/2025,08,14,17,24,26,29,3
3/07/2025,03,04,16,30,35,40,4
30/06/2025,01,07,22,31,37,39,5
26/06/2025,04,07,19,22,24,35,5
23/06/2025,08,19,22,28,32,37,2
19/06/2025,02,08,09,24,25,28,1
16/06/2025,06,17,23,29,30,35,3
12/06/2025,06,12,25,27,29,35,2
9/06/2025,02,03,06,08,23,28,2
5/06/2025,10,17,19,28,31,32,3
2/06/2025,08,11,15,18,29,32,5
29/05/2025,16,18,19,21,22,32,5
26/05/2025,02,17,18,21,25,35,2
22/05/2025,01,05,15,26,31,36,4
19/05/2025,08,15,26,32,35,38,2
15/05/2025,11,15,24,26,32,37,2
12/05/2025,04,15,19,21,25,37,2
8/05/2025,01,08,17,35,38,39,2
5/05/2025,10,19,23,25,32,39,1
1/05/2025,05,12,19,23,33,38,3
28/04/2025,12,20,25,28,30,38,1
24/04/2025,03,04,19,23,33,36,1
21/04/2025,04,27,33,34,38,39,2
17/04/2025,02,10,14,23,30,32,2
14/04/2025,04,11,15,21,30,36,3
10/04/2025,07,14,22,33,34,39,5
7/04/2025,04,09,21,23,24,34,4
3/04/2025,07,13,16,22,32,33,5
31/03/2025,02,21,27,35,38,40,4
27/03/2025,09,11,23,29,37,39,1
24/03/2025,03,11,26,27,28,37,1
20/03/2025,16,23,25,37,38,40,5
17/03/2025,17,19,20,23,35,37,3
13/03/2025,13,16,18,24,29,30,5
10/03/2025,01,15,21,24,26,28,3
6/03/2025,01,02,08,16,18,25,2
3/03/2025,03,10,12,29,30,36,1
27/02/2025,16,27,30,32,34,35,1
24/02/2025,15,16,19,28,32,37,1
20/02/2025,04,08,09,18,24,36,3
17/02/2025,10,11,22,33,36,37,5
13/02/2025,05,07,16,35,37,39,5
10/02/2025,09,11,26,29,36,38,5
6/02/2025,02,05,20,23,27,34,4
3/02/2025,09,11,17,21,38,40,2
30/01/2025,09,20,28,35,38,40,1
27/01/2025,01,05,18,23,26,30,4
23/01/2025,07,12,20,24,25,37,2
20/01/2025,02,04,07,16,18,36,3
16/01/2025,02,05,11,14,22,38,4
13/01/2025,10,12,18,19,34,40,2
9/01/2025,05,19,22,28,38,40,3
6/01/2025,04,17,18,23,34,37,5
2/01/2025,04,10,16,18,33,39,2
30/12/2024,08,15,21,24,31,40,3
26/12/2024,02,07,11,21,34,38,4
23/12/2024,02,09,13,16,30,37,5
19/12/2024,03,06,07,10,16,32,3
16/12/2024,07,15,23,24,30,34,2
12/12/2024,03,05,21,24,27,30,1
9/12/2024,10,16,17,23,26,35,3
5/12/2024,03,04,07,21,30,34,2
2/12/2024,01,07,14,19,25,36,2
28/11/2024,04,05,12,28,32,37,1
25/11/2024,01,07,10,11,23,26,1
21/11/2024,12,14,15,21,36,39,5
18/11/2024,08,13,21,22,28,33,4
14/11/2024,18,19,20,22,34,37,2
11/11/2024,05,07,24,26,29,35,1
7/11/2024,04,15,17,21,25,34,1
4/11/2024,16,18,30,33,34,37,1
31/10/2024,01,06,08,09,29,30,4
28/10/2024,07,08,13,15,27,33,5
24/10/2024,03,06,07,20,26,34,5
21/10/2024,07,09,14,31,36,38,4
17/10/2024,06,15,22,26,33,37,1
14/10/2024,03,10,12,17,31,37,3
10/10/2024,08,09,15,27,30,34,3
7/10/2024,04,14,24,28,34,40,4
3/10/2024,03,06,14,24,38,40,5
30/09/2024,05,14,15,21,24,28,3
26/09/2024,09,19,21,31,32,39,2
23/09/2024,09,11,13,31,32,34,5
19/09/2024,01,03,25,27,30,35,3
16/09/2024,12,18,21,28,31,32,1
12/09/2024,16,27,31,34,38,39,1
9/09/2024,03,06,09,18,22,27,3
5/09/2024,08,19,24,31,32,40,2
2/09/2024,03,20,24,27,33,36,3
29/08/2024,03,04,14,22,24,36,4
26/08/2024,05,06,08,12,30,32,5
22/08/2024,01,11,16,26,28,40,5
19/08/2024,06,11,14,17,28,33,5
15/08/2024,06,14,20,34,38,40,3
12/08/2024,10,13,19,22,25,28,2
8/08/2024,02,08,09,17,21,22,2
5/08/2024,03,10,13,16,31,38,5
1/08/2024,01,06,23,27,33,34,5
29/07/2024,01,05,09,19,22,25,3
25/07/2024,03,16,18,27,30,37,4
22/07/2024,03,12,18,19,21,24,4
18/07/2024,08,22,28,31,38,40,1
15/07/2024,15,19,21,23,28,40,3
11/07/2024,05,19,20,24,28,30,4
8/07/2024,03,13,21,26,36,40,3
4/07/2024,04,08,22,23,27,33,3
1/07/2024,04,08,11,12,20,38,2
27/06/2024,09,13,15,18,27,37,2
24/06/2024,05,13,16,20,23,30,5
20/06/2024,01,02,07,13,19,21,5
17/06/2024,14,16,19,22,23,32,4
13/06/2024,17,19,21,22,23,27,1
10/06/2024,04,07,27,31,33,40,3
6/06/2024,12,15,24,28,29,31,1
3/06/2024,01,03,11,22,34,38,4
30/05/2024,04,10,11,17,24,39,5
27/05/2024,02,07,14,15,23,24,3
23/05/2024,07,08,13,14,23,31,1
20/05/2024,03,14,15,21,23,29,4
16/05/2024,08,09,14,18,23,24,3
13/05/2024,09,20,23,24,37,39,1
9/05/2024,06,07,13,14,24,33,1
6/05/2024,07,17,26,27,32,39,3
2/05/2024,04,10,16,17,26,30,1
29/04/2024,01,17,23,29,36,40,3
25/04/2024,02,16,19,23,24,25,1
22/04/2024,06,23,24,31,32,39,1
18/04/2024,04,13,16,18,28,30,2
15/04/2024,02,13,17,26,33,37,5
11/04/2024,17,19,22,30,35,37,1
8/04/2024,03,13,24,28,36,39,4
4/04/2024,09,10,12,14,20,31,5
1/04/2024,03,10,15,18,26,38,4
28/03/2024,01,07,09,13,18,37,3
25/03/2024,03,12,15,20,25,27,3
21/03/2024,03,08,27,30,33,37,2
18/03/2024,06,08,18,19,24,39,3
14/03/2024,03,12,13,20,27,35,2
11/03/2024,02,07,14,22,37,39,1
7/03/2024,13,15,23,31,35,39,1
4/03/2024,01,10,23,25,29,35,1
29/02/2024,10,11,21,31,38,40,1
26/02/2024,02,15,19,23,37,40,2
22/02/2024,02,08,10,20,24,39,4
19/02/2024,07,20,25,37,38,40,4
15/02/2024,03,05,08,14,16,21,1
12/02/2024,03,04,06,09,10,16,1
8/02/2024,02,19,22,26,36,40,4
5/02/2024,05,09,20,21,25,40,4
1/02/2024,06,12,15,28,33,35,3
29/01/2024,02,08,25,27,29,38,3
25/01/2024,01,02,03,22,26,27,1
22/01/2024,08,16,25,29,31,34,2
18/01/2024,08,16,19,23,30,40,5
15/01/2024,02,06,19,23,33,35,5
11/01/2024,05,07,24,29,31,38,2
8/01/2024,13,19,25,26,33,40,1
4/01/2024,15,21,22,29,30,39,1
1/01/2024,02,05,18,24,28,39,4
28/12/2023,05,11,15,21,24,39,5
25/12/2023,03,12,13,17,21,22,1
21/12/2023,03,15,17,23,26,29,4
18/12/2023,02,16,21,33,35,40,5
14/12/2023,03,08,09,22,27,33,1
11/12/2023,11,18,21,28,30,32,1
7/12/2023,01,03,05,10,32,38,5
4/12/2023,08,12,24,29,30,32,5
30/11/2023,02,14,15,27,36,37,5
27/11/2023,02,18,23,29,33,35,4
23/11/2023,04,15,22,23,28,35,4
20/11/2023,06,13,18,25,26,32,3
16/11/2023,05,11,13,18,25,27,5
13/11/2023,01,06,25,26,33,39,2
9/11/2023,14,16,19,31,32,37,2
6/11/2023,10,13,14,25,30,35,5`;

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

/**
 * Attempts to discover the CSV URL dynamically from the LotoIdeas website.
 * This function tries to scrape the page to find the link with text 
 * "Valores separados por comas (.csv)" which contains the Google Sheets URL.
 * 
 * @returns {Promise<string|null>} The discovered CSV URL or null if not found
 */
async function discoverCSVUrl() {
    try {
        // Try multiple CORS proxy services as fallbacks
        const corsProxies = [
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            '' // Direct access (will fail due to CORS but worth trying)
        ];
        
        for (const proxy of corsProxies) {
            try {
                const url = proxy + encodeURIComponent(LOTOIDEAS_URL);
                const response = await fetch(proxy ? url : LOTOIDEAS_URL, { 
                    timeout: 5000,
                    signal: AbortSignal.timeout(5000)
                });
                
                if (!response.ok) continue;
                
                const html = await response.text();
                
                // Parse HTML to find CSV link
                // Look for link containing "Valores separados por comas" or ".csv"
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const links = doc.querySelectorAll('a');
                
                for (const link of links) {
                    const text = link.textContent.toLowerCase();
                    const href = link.href;
                    
                    // Look for CSV link indicators
                    if ((text.includes('valores separados por comas') || 
                         text.includes('.csv') ||
                         text.includes('csv')) && 
                        href && 
                        href.includes('docs.google.com') && 
                        href.includes('output=csv')) {
                        
                        console.log('✅ Discovered CSV URL from LotoIdeas:', href);
                        return href;
                    }
                }
            } catch (proxyError) {
                // Try next proxy
                continue;
            }
        }
        
        return null;
    } catch (error) {
        console.warn('Failed to discover CSV URL dynamically:', error.message);
        return null;
    }
}

async function loadData() {
    try {
        showLoading();
        let csvText;
        let usedFallback = false;
        
        // Try to discover the CSV URL dynamically
        const discoveredUrl = await discoverCSVUrl();
        if (discoveredUrl) {
            CSV_URL = discoveredUrl;
            console.log('Using dynamically discovered CSV URL');
        } else {
            console.log('Using fallback CSV URL');
        }
        
        try {
            const response = await fetch(CSV_URL);
            if (!response.ok) throw new Error('Failed to fetch data');
            csvText = await response.text();
        } catch (fetchError) {
            // Fetch failed (CORS, network issue, etc.) - use fallback data
            console.warn('Failed to fetch from external source, using fallback data:', fetchError.message);
            csvText = FALLBACK_CSV;
            usedFallback = true;
        }
        
        historicalDraws = parseCSV(csvText);
        
        if (historicalDraws.length === 0) {
            throw new Error('No valid draws found in CSV');
        }
        
        hideLoading();
        showDataInfo(historicalDraws.length, usedFallback);
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

function showDataInfo(count, usedFallback = false) {
    document.getElementById('draw-count').textContent = count;
    const dataInfoEl = document.getElementById('data-info');
    const infoText = dataInfoEl.querySelector('p');
    
    if (usedFallback) {
        infoText.innerHTML = `📊 Analyzed <span id="draw-count">${count}</span> historical draws <span style="color: #ff9800;">(Using cached data)</span>`;
    } else {
        infoText.innerHTML = `📊 Analyzed <span id="draw-count">${count}</span> historical draws`;
    }
    
    dataInfoEl.style.display = 'block';
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
