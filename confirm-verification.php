<?php    
    require_once 'cors.php';
    require_once 'db.php';
    require_once 'utility.php';
    require_once 'access.php';
    require_once 'config.php';
    require_once 'session.php';

    usleep(SPAM_PREVENTION_DELAY * 1000000);

    // Get database
    $db = get_database();
    if($db["error"]) error(json_encode([["type"=>"email", "error"=>"An error occured in the server"]]));
    $pdo = $db["pdo"];

    // Validate user attempt
    $validation = validate_access_attempt($pdo, "verification_attempts", VERIFICATION_VALIDATION_CONFIG);
    if(!$validation["success"]) {
        $period = $validation["period"];
        error(json_encode(["error"=>"Try again after $period."]));
    }  

    // Check if session was eradicated
    session_start();
    if(!session_check()) {
        error(json_encode(["error"=>"Session eradicated"]));
    }
    
    // Check if user is authenticated
    if(!isset($_SESSION["username"])) {
        error(json_encode(["error"=>"Not authenticated"]));
    }

    // Check if verification code is empty or not sent
    if(!isset($_POST["code"]) or !$_POST["code"]) {
        error(json_encode(["error"=>"Verification code must not be empty."]));
    }

    // Check if verification code contains non-digit characters
    $matches = [];
    preg_match_all("/[^\d]/i", $_POST["code"], $matches);
    if($matches[0]) error(json_encode(["error"=>"Verification code must only contain digits."]));

    // Check if verification code exactly equals 4 digits
    if(strlen($_POST["code"]) != 4) error(json_encode(["error"=>"Verification code must be 4 digits."]));

    // Get verification data about user
    $query = $pdo->prepare('SELECT verified, verify_code, verify_expiry FROM accounts WHERE username=?');
    $query->execute([$_SESSION["username"]]);
    $result = $query->fetch(PDO::FETCH_ASSOC);
    
    // Check if user is already verified
    if($result["verified"]) error(json_encode(["error"=>"Account is already verified."]));

    // Check if verification code in database is expired, or the verification code is incorrect
    if(time() >= $result["verify_expiry"] or $_POST["code"] != $result["verify_code"]) {
        error(json_encode(["error"=>"Verification code is expired/incorrect."]));
    } 

    // Set user verified status
    $query = $pdo->prepare('UPDATE accounts SET verified=1, verify_code=NULL, verify_expiry=NULL WHERE username=?');
    $query->execute([$_SESSION["username"]]);

    $_SESSION["verified"] = True;
    die(json_encode(["success"=>True]));
?>