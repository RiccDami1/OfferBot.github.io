document.addEventListener('DOMContentLoaded', function() {
    // Elementi DOM
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const adminPanel = document.getElementById('admin-panel');
    const updateStatusBtn = document.getElementById('update-status');
    const statusSelect = document.getElementById('status-select');
    const statusMessage = document.getElementById('status-message');
    const adminPassword = document.getElementById('admin-password');
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const statusDescription = document.getElementById('status-description');
    const lastUpdate = document.getElementById('last-update');
    const historyList = document.getElementById('history-list');
    const statusLogin = document.querySelector('.status-login');
    
    // Nascondi il pulsante di accesso amministratore all'inizio
    statusLogin.style.display = 'none';
    
    // Password amministratore (in un'applicazione reale, questo dovrebbe essere gestito lato server)
    const ADMIN_PASSWORD = 'admin123';
    
    // Dati di stato iniziali
    let currentStatus = {
        status: 'online',
        message: 'Il bot è completamente operativo e sta cercando nuove offerte.',
        timestamp: new Date().toISOString()
    };
    
    // Sequenza segreta per mostrare il pulsante admin
    let secretSequence = [];
    const correctSequence = ['a', 'd', 'm', 'i', 'n'];
    
    // Aggiungi event listener per la sequenza segreta
    document.addEventListener('keydown', function(e) {
        // Aggiungi il tasto premuto alla sequenza
        secretSequence.push(e.key.toLowerCase());
        
        // Mantieni solo gli ultimi 5 tasti premuti
        if (secretSequence.length > 5) {
            secretSequence.shift();
        }
        
        // Controlla se la sequenza corrisponde
        if (arraysEqual(secretSequence, correctSequence)) {
            statusLogin.style.display = 'flex';
        }
    });
    
    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }
    
    // Carica lo stato dal localStorage se disponibile
    loadStatus();
    
    // Carica la cronologia dal localStorage se disponibile
    loadHistory();
    
    // Event Listeners
    adminLoginBtn.addEventListener('click', toggleAdminPanel);
    updateStatusBtn.addEventListener('click', updateStatus);
    
    // Funzioni
    function toggleAdminPanel() {
        if (adminPanel.style.display === 'block') {
            adminPanel.style.display = 'none';
            adminLoginBtn.textContent = 'Accesso Amministratore';
        } else {
            adminPanel.style.display = 'block';
            adminLoginBtn.textContent = 'Nascondi Pannello';
        }
    }
    
    function updateStatus() {
        // Verifica la password
        if (adminPassword.value !== ADMIN_PASSWORD) {
            alert('Password non valida!');
            return;
        }
        
        // Ottieni i valori dal form
        const status = statusSelect.value;
        const message = statusMessage.value.trim() || getDefaultMessage(status);
        
        // Aggiorna lo stato corrente
        currentStatus = {
            status: status,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        // Salva lo stato nel localStorage
        saveStatus();
        
        // Aggiungi alla cronologia
        addToHistory(currentStatus);
        
        // Aggiorna l'interfaccia
        updateStatusUI();
        
        // Resetta il form
        statusMessage.value = '';
        adminPassword.value = '';
        
        alert('Stato aggiornato con successo!');
    }
    
    function getDefaultMessage(status) {
        switch(status) {
            case 'online':
                return 'Il bot è completamente operativo e sta cercando nuove offerte.';
            case 'maintenance':
                return 'Il bot è in manutenzione programmata. Torneremo presto online!';
            case 'partial':
                return 'Alcune funzionalità del bot potrebbero non essere disponibili al momento.';
            case 'offline':
                return 'Il bot è attualmente offline. Stiamo lavorando per ripristinare il servizio.';
            default:
                return 'Stato del bot sconosciuto.';
        }
    }
    
    function updateStatusUI() {
        // Aggiorna l'indicatore di stato
        statusIndicator.className = 'status-indicator ' + currentStatus.status;
        
        // Aggiorna il testo dello stato
        switch(currentStatus.status) {
            case 'online':
                statusText.textContent = 'Online';
                break;
            case 'maintenance':
                statusText.textContent = 'In Manutenzione';
                break;
            case 'partial':
                statusText.textContent = 'Parzialmente Operativo';
                break;
            case 'offline':
                statusText.textContent = 'Offline';
                break;
        }
        
        // Aggiorna il messaggio di stato
        statusDescription.textContent = currentStatus.message;
        
        // Aggiorna l'ultimo aggiornamento
        const date = new Date(currentStatus.timestamp);
        lastUpdate.textContent = formatDate(date);
    }
    
    function formatDate(date) {
        const options = { 
            day: 'numeric', 
            month: 'long', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        return date.toLocaleDateString('it-IT', options);
    }
    
    function saveStatus() {
        localStorage.setItem('offerbot_status', JSON.stringify(currentStatus));
    }
    
    function loadStatus() {
        const savedStatus = localStorage.getItem('offerbot_status');
        if (savedStatus) {
            currentStatus = JSON.parse(savedStatus);
            updateStatusUI();
        }
    }
    
    function addToHistory(status) {
        // Carica la cronologia esistente
        let history = JSON.parse(localStorage.getItem('offerbot_history') || '[]');
        
        // Aggiungi il nuovo stato all'inizio dell'array
        history.unshift(status);
        
        // Limita la cronologia a 10 elementi
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // Salva la cronologia aggiornata
        localStorage.setItem('offerbot_history', JSON.stringify(history));
        
        // Aggiorna l'interfaccia della cronologia
        renderHistory(history);
    }
    
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('offerbot_history') || '[]');
        renderHistory(history);
    }
    
    function renderHistory(history) {
        // Svuota la lista della cronologia
        historyList.innerHTML = '';
        
        // Se non ci sono elementi nella cronologia
        if (history.length === 0) {
            historyList.innerHTML = '<div class="history-empty">Nessuna cronologia disponibile</div>';
            return;
        }
        
        // Aggiungi ogni elemento della cronologia alla lista
        history.forEach(item => {
            const date = new Date(item.timestamp);
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="history-status ${item.status}"></div>
                <div class="history-content">
                    <div class="history-header">
                        <div class="history-title">${getStatusTitle(item.status)}</div>
                        <div class="history-date">${formatDate(date)}</div>
                    </div>
                    <div class="history-message">${item.message}</div>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
    }
    
    function getStatusTitle(status) {
        switch(status) {
            case 'online':
                return 'Online';
            case 'maintenance':
                return 'In Manutenzione';
            case 'partial':
                return 'Parzialmente Operativo';
            case 'offline':
                return 'Offline';
            default:
                return 'Stato Sconosciuto';
        }
    }
    
    // Aggiorna i dati casuali ogni 30 secondi per simulare l'attività del bot
    function updateRandomData() {
        const uptime = document.getElementById('uptime');
        
        // Solo se il bot è online o parzialmente operativo
        if (currentStatus.status === 'online' || currentStatus.status === 'partial') {
            // Aggiorna l'uptime
            const currentUptime = parseFloat(uptime.textContent);
            let newUptime;
            
            if (currentStatus.status === 'online') {
                newUptime = Math.min(99.9, currentUptime + (Math.random() * 0.1)).toFixed(1);
            } else {
                newUptime = Math.max(90.0, currentUptime - (Math.random() * 0.2)).toFixed(1);
            }
            
            uptime.textContent = newUptime + '%';
            
            // Salva l'uptime nel localStorage per la home page
            localStorage.setItem('offerbot_uptime', newUptime + '%');
        }
    }
    
    // Funzione per aggiornare le offerte trovate oggi
    function updateOffersCount() {
        const offersToday = document.getElementById('offers-today');
        
        // Controlla se è un nuovo giorno
        const now = new Date();
        const lastUpdateDate = localStorage.getItem('offerbot_last_update_date');
        const today = now.toDateString();
        
        // Se è un nuovo giorno o non c'è un valore salvato, resetta il contatore
        if (!lastUpdateDate || lastUpdateDate !== today) {
            offersToday.textContent = '0';
            localStorage.setItem('offerbot_offers_count', '0');
            localStorage.setItem('offerbot_last_update_date', today);
        } else {
            // Altrimenti carica il valore salvato
            const savedCount = localStorage.getItem('offerbot_offers_count') || '0';
            offersToday.textContent = savedCount;
        }
    }
    
    // Funzione per incrementare le offerte trovate oggi
    function incrementOffersCount() {
        // Solo se il bot è online o parzialmente operativo
        if (currentStatus.status === 'online' || currentStatus.status === 'partial') {
            const offersToday = document.getElementById('offers-today');
            const currentOffers = parseInt(offersToday.textContent);
            const newOffers = currentOffers + 1;
            
            offersToday.textContent = newOffers;
            localStorage.setItem('offerbot_offers_count', newOffers.toString());
        }
    }
    
    // Carica il conteggio delle offerte all'avvio
    updateOffersCount();
    
    // Aggiorna i dati casuali ogni 30 secondi
    setInterval(updateRandomData, 30000);
    
    // Incrementa le offerte ogni 12 minuti (720000 ms)
    setInterval(incrementOffersCount, 720000);
    
    // Controlla ogni minuto se è mezzanotte per resettare il contatore
    setInterval(function() {
        const now = new Date();
        if (now.getHours() === 0 && now.getMinutes() === 0) {
            updateOffersCount(); // Questo resetterà il contatore a mezzanotte
        }
    }, 60000);
});