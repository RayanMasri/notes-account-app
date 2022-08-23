<?php    
    require_once 'cors.php';
    require_once 'db.php';
    require_once 'session.php';
    require_once 'utility.php';

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

    // Get user id
    $query = $pdo->prepare('SELECT * FROM accounts WHERE username=?');
    $query->execute([$_SESSION["username"]]);
    $result = $query->fetch(PDO::FETCH_ASSOC);
    $user_id = $result["id"];

    // Get existing notes for user
    $query = $pdo->prepare('SELECT id, title, content FROM notes WHERE user_id=?');
    $query->execute([$user_id]);
    $result = $query->fetchAll(PDO::FETCH_ASSOC);
    
    die(json_encode(["result"=>$result]));

?>