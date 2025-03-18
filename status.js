document.addEventListener('DOMContentLoaded', function() {
    // Elementi della pagina di stato
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const statusDescription = document.getElementById('status-description');
    const lastUpdate = document.getElementById('last-update');
    const uptime = document.getElementById('uptime');
    const offersToday = document.getElementById('offers-today');
    const historyList = document.getElementById('history-list');
    const adminPanel = document.getElementById('admin-panel');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const updateStatusBtn = document.getElementById('update-status');
    const statusSelect = document.getElementById('status-select');
    const statusMessage = document.getElementById('status-message');
    const adminPassword = document.getElementById('admin-password');
    
    // Carica lo stato corrente dal server
    function loadCurrentStatus() {
        // Usa fetch per ottenere i dati dal server
        fetch('status-data.json?nocache=' + new Date().getTime())
            .then(response => response.json())
            .then(data => {
                // Aggiorna l'indicatore di stato
                if (statusIndicator) {
                    statusIndicator.className = 'status-indicator ' + data.currentStatus.status;
                }
                
                // Aggiorna il testo dello stato
                if (statusText) {
                    switch(data.currentStatus.status) {
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
                }
                
                // Aggiorna il messaggio di stato
                if (statusDescription) {
                    statusDescription.textContent = data.currentStatus.message;
                }
                
                // Aggiorna l'ultimo aggiornamento
                if (lastUpdate) {
                    lastUpdate.textContent = data.currentStatus.lastUpdate || 'Oggi, 15:30';
                }
                
                // Aggiorna il conteggio delle offerte
                if (offersToday) {
                    offersToday.textContent = data.stats.offersToday;
                }
                
                // Aggiorna l'uptime
                if (uptime) {
                    uptime.textContent = data.stats.uptime;
                }
                
                // Carica la cronologia
                if (historyList) {
                    loadStatusHistory(data.history);
                }
            })
            .catch(error => {
                console.error('Errore nel caricamento dei dati:', error);
                // Fallback ai dati locali in caso di errore
                loadFromLocalStorage();
            });
    }
    
    // Fallback ai dati locali
    function loadFromLocalStorage() {
        const savedStatus = localStorage.getItem('offerbot_status');
        if (savedStatus && statusIndicator && statusText && statusDescription) {
            const currentStatus = JSON.parse(savedStatus);
            
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
        }
        
        // Carica la cronologia dal localStorage
        const savedHistory = localStorage.getItem('offerbot_status_history');
        if (savedHistory && historyList) {
            loadStatusHistory(JSON.parse(savedHistory));
        }
    }
    
    // Carica la cronologia degli stati
    function loadStatusHistory(history) {
        if (!historyList) return;
        
        if (history && history.length > 0) {
            // Svuota la lista della cronologia
            historyList.innerHTML = '';
            
            // Aggiungi ogni elemento della cronologia
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                historyItem.innerHTML = `
                    <div class="history-status ${item.status}"></div>
                    <div class="history-content">
                        <div class="history-header">
                            <div class="history-title">${getStatusText(item.status)}</div>
                            <div class="history-date">${item.date}</div>
                        </div>
                        <div class="history-message">${item.message}</div>
                    </div>
                `;
                
                historyList.appendChild(historyItem);
            });
        } else {
            // Cronologia di default se non esiste
            const defaultHistory = [
                {
                    status: 'online',
                    date: 'Oggi, 15:30',
                    message: 'Il bot è completamente operativo e sta cercando nuove offerte.'
                },
                {
                    status: 'maintenance',
                    date: 'Ieri, 22:15',
                    message: 'Manutenzione programmata per aggiornamenti del sistema.'
                },
                {
                    status: 'online',
                    date: 'Ieri, 18:00',
                    message: 'Risolti tutti i problemi, il bot è tornato online.'
                }
            ];
            
            historyList.innerHTML = '';
            defaultHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                historyItem.innerHTML = `
                    <div class="history-status ${item.status}"></div>
                    <div class="history-content">
                        <div class="history-header">
                            <div class="history-title">${getStatusText(item.status)}</div>
                            <div class="history-date">${item.date}</div>
                        </div>
                        <div class="history-message">${item.message}</div>
                    </div>
                `;
                
                historyList.appendChild(historyItem);
            });
        }
    }
    
    // Ottieni il testo dello stato in base al codice
    function getStatusText(status) {
        switch(status) {
            case 'online': return 'Online';
            case 'maintenance': return 'In Manutenzione';
            case 'partial': return 'Parzialmente Operativo';
            case 'offline': return 'Offline';
            default: return 'Sconosciuto';
        }
    }
    
    // Mostra/nascondi il pannello admin
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', function() {
            if (adminPanel.style.display === 'block') {
                adminPanel.style.display = 'none';
                adminLoginBtn.textContent = 'Accesso Amministratore';
            } else {
                adminPanel.style.display = 'block';
                adminLoginBtn.textContent = 'Nascondi Pannello';
            }
        });
    }
    
    // Aggiorna lo stato
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', function() {
            const password = adminPassword.value;
            
            // Password semplice per demo
            if (password === 'admin123') {
                const newStatus = {
                    status: statusSelect.value,
                    message: statusMessage.value,
                    lastUpdate: getCurrentDateTime()
                };
                
                // Salva il nuovo stato localmente
                localStorage.setItem('offerbot_status', JSON.stringify(newStatus));
                
                // Invia i dati al server
                updateServerData(newStatus);
                
                // Resetta il form
                statusMessage.value = '';
                adminPassword.value = '';
                
                alert('Stato aggiornato con successo!');
            } else {
                alert('Password non valida!');
            }
        });
    }
    
    // Aggiorna i dati sul server
    function updateServerData(newStatus) {
        // Prima otteniamo i dati attuali
        fetch('status-data.json')
            .then(response => response.json())
            .then(data => {
                // Aggiorna lo stato corrente
                data.currentStatus = newStatus;
                
                // Aggiorna la cronologia
                data.history.unshift({
                    status: newStatus.status,
                    date: getCurrentDateTime(),
                    message: newStatus.message
                });
                
                // Limita la cronologia a 10 elementi
                if (data.history.length > 10) {
                    data.history = data.history.slice(0, 10);
                }
                
                // Salva i dati aggiornati
                saveDataToServer(data);
            })
            .catch(error => {
                console.error('Errore nel caricamento dei dati:', error);
                // Crea un nuovo oggetto dati se non è possibile caricare quello esistente
                const newData = {
                    currentStatus: newStatus,
                    history: [{
                        status: newStatus.status,
                        date: getCurrentDateTime(),
                        message: newStatus.message
                    }],
                    stats: {
                        offersToday: localStorage.getItem('offerbot_offers_count') || '0',
                        uptime: localStorage.getItem('offerbot_uptime') || '99.8%'
                    }
                };
                saveDataToServer(newData);
            });
    }
    
    // Salva i dati sul server
    function saveDataToServer(data) {
        // In un ambiente reale, qui useresti una chiamata AJAX o fetch per inviare i dati al server
        // Per questa demo, simuliamo il salvataggio mostrando un messaggio
        console.log('Dati da salvare sul server:', data);
        alert('I dati sono stati aggiornati. In un ambiente reale, questi dati sarebbero salvati sul server.');
        
        // Aggiorna la visualizzazione
        loadCurrentStatus();
    }
    
    // Ottieni la data e l'ora corrente formattate
    function getCurrentDateTime() {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
        return now.toLocaleDateString('it-IT', options);
    }
    
    // Carica lo stato all'avvio
    loadCurrentStatus();
    
    // Imposta un intervallo per controllare gli aggiornamenti ogni 30 secondi
    setInterval(loadCurrentStatus, 30000);
});