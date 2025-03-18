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
    
    // Carica lo stato corrente
    function loadCurrentStatus() {
        const savedStatus = localStorage.getItem('offerbot_status');
        if (savedStatus) {
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
            
            // Aggiorna l'ultimo aggiornamento
            lastUpdate.textContent = currentStatus.lastUpdate || 'Oggi, 15:30';
        }
        
        // Carica il conteggio delle offerte
        const savedCount = localStorage.getItem('offerbot_offers_count') || '0';
        if (offersToday) {
            offersToday.textContent = savedCount;
        }
        
        // Carica l'uptime
        const savedUptime = localStorage.getItem('offerbot_uptime') || '99.8%';
        if (uptime) {
            uptime.textContent = savedUptime;
        }
        
        // Carica la cronologia
        loadStatusHistory();
    }
    
    // Carica la cronologia degli stati
    function loadStatusHistory() {
        if (!historyList) return;
        
        const savedHistory = localStorage.getItem('offerbot_status_history');
        if (savedHistory) {
            const history = JSON.parse(savedHistory);
            
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
            
            localStorage.setItem('offerbot_status_history', JSON.stringify(defaultHistory));
            loadStatusHistory();
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
                
                // Salva il nuovo stato
                localStorage.setItem('offerbot_status', JSON.stringify(newStatus));
                
                // Aggiorna la cronologia
                updateStatusHistory(newStatus);
                
                // Aggiorna la visualizzazione
                loadCurrentStatus();
                
                // Resetta il form
                statusMessage.value = '';
                adminPassword.value = '';
                
                alert('Stato aggiornato con successo!');
            } else {
                alert('Password non valida!');
            }
        });
    }
    
    // Aggiorna la cronologia degli stati
    function updateStatusHistory(newStatus) {
        const savedHistory = localStorage.getItem('offerbot_status_history');
        let history = [];
        
        if (savedHistory) {
            history = JSON.parse(savedHistory);
        }
        
        // Aggiungi il nuovo stato all'inizio della cronologia
        history.unshift({
            status: newStatus.status,
            date: getCurrentDateTime(),
            message: newStatus.message
        });
        
        // Limita la cronologia a 10 elementi
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // Salva la cronologia aggiornata
        localStorage.setItem('offerbot_status_history', JSON.stringify(history));
    }
    
    // Ottieni la data e l'ora corrente formattate
    function getCurrentDateTime() {
        const now = new Date();
        const options = { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
        return now.toLocaleDateString('it-IT', options);
    }
    
    // Carica lo stato all'avvio
    loadCurrentStatus();
    
    // Imposta un intervallo per controllare gli aggiornamenti ogni 5 secondi
    setInterval(loadCurrentStatus, 5000);
});