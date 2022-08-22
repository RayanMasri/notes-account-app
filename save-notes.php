<?php    
    require_once 'cors.php';
    require_once 'session.php';
    require_once 'db.php';

    function error($msg) {
        header('HTTP/1.1 400 Bad Request');
        die($msg);
    }
    

    // Get database
    $db = get_database();
    if($db["error"]) {
        error(json_encode(["error"=>"An error occured in the server"]));
    } 
    $pdo = $db["pdo"];
    

    // validate session
    session_start();

    // check if session was eradicated
    if(!session_check()) {
        error(json_encode(["error"=>"Session eradicated"]));
    }
    
    if(!isset($_SESSION["username"])) {
        error(json_encode(["error"=>"Not authenticated"]));
    }

    if(!isset($_POST["notes"])) {
        error(json_encode(["error"=>"Malformed request"]));
    }

    $notes = json_decode($_POST["notes"], true);

    // Get user id
    $query = $pdo->prepare('SELECT * FROM accounts WHERE username=?');
    $query->execute([$_SESSION["username"]]);
    $result = $query->fetch(PDO::FETCH_ASSOC);
    $user_id = $result["id"];

    // Get existing notes for user
    $query = $pdo->prepare('SELECT * FROM notes WHERE user_id=?');
    $query->execute([$user_id]);
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    
    // Iterate through requested notes
    foreach($notes as $note) {
        $title = $note["title"];
        $content = $note["content"];
        $note_id = intval($note["id"]);

        // Check if note exists
        // Turn query array into another array of id's, search for note id and check if result is an integer,
        // since if the item is found, it returns the key which is the index in this case
        if(is_int(array_search($note_id, array_column($result, 'id')))) {
            // Then, update row in notes table
            $query = $pdo->prepare('UPDATE notes SET title=?, content=? WHERE id=?');
            $query->execute([$title, $content, $note_id]);
            continue;
        }

        // Otherwise, if note does not exist, insert into table
        $query = $pdo->prepare('INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)');
        $query->execute([$user_id, $title, $content]);
    }   

    // Iterate through previous query of notes, and see which ones aren't included in the requested notes
    foreach($result as $note) {
        $note_id = $note["id"];
        if(!in_array($note_id, array_column($notes, 'id'))) {
            // If not included, delete row
            $query = $pdo->prepare('DELETE FROM notes WHERE id=?');
            $query->execute([$note_id]);
        }
    }
?>