<?php    
    require_once 'cors.php';
    require_once 'db.php';
    require_once 'utility.php';
    require_once 'access.php';
    require_once 'config.php';
    require_once 'session.php';

    // Get database
    $db = get_database();
    if($db["error"]) error(json_encode([["type"=>"email", "error"=>"An error occured in the server"]]));
    $pdo = $db["pdo"];

    // Validate user attempt
    $validation = validate_access_attempt($pdo, "resend_attempts", RESEND_VALIDATION_CONFIG);
    if(!$validation["success"]) {
        $period = $validation["period"];
        error(json_encode(["error"=>"Try again after $period."]));
    }   

    session_start();

    // Check if session was eradicated
    if(!session_check()) {
        error(json_encode(["error"=>"Session eradicated"]));
    }
    
    // Check if user is authenticated
    if(!isset($_SESSION["username"])) {
        error(json_encode(["error"=>"Not authenticated"]));
    }

    // Get user email
    $query = $pdo->prepare('SELECT * FROM accounts WHERE username=?;');
    $query->execute([$_SESSION["username"]]);
    $result = $query->fetch(PDO::FETCH_ASSOC);
    $email = $result["email"];

    $activation_code = 9999;

    $subject = 'Please activate your account';
    $message = <<<MESSAGE
            Hi,
            Please eneter the following code to activate your account:
            $activation_code
            MESSAGE;

    // email header
    $header = "From:" . SENDER_EMAIL_ADDRESS;
    
    // send the email
    $sendmail = mail($email, $subject, nl2br($message), $header);

    if($sendmail) {
        die(json_encode(["success"=>True]));
    } else {
        error(json_encode(["error"=>"Failed to send email."]));
    }
?>