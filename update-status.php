<?php
header('Content-Type: application/json');

// Controlla se è una richiesta POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ottieni i dati JSON inviati
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);
    
    // Verifica la password (in un ambiente reale, usare metodi più sicuri)
    if (isset($data['password']) && $data['password'] === 'admin123') {
        // Rimuovi la password dai dati da salvare
        unset($data['password']);
        
        // Salva i dati nel file JSON
        file_put_contents('status-data.json', json_encode($data, JSON_PRETTY_PRINT));
        
        echo json_encode(['success' => true, 'message' => 'Stato aggiornato con successo']);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Password non valida']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Metodo non consentito']);
}
?>