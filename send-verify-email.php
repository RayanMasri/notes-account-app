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
    
    // Check if user is already verified
    if($result["verified"]) error(json_encode(["error"=>"Account is already verified."]));

    // Generate new verification code
    $code = generate_fixed_digit_random_number();
    $query = $pdo->prepare('UPDATE accounts SET verify_code=?, verify_expiry=? WHERE username=?');
    $query->execute([$code, time() + VERIFICATION_CODE_DURATION, $_SESSION["username"]]);

    // Set email headers
    $subject = "Notes Account Verification";
    $headers = "From: Notes <sender@domain.com>\r\n";
    $headers .= "Return-Path: Notes <sender@domain.com>\r\n"; 
    $headers .= "From: Notes <sender@domain.com>\r\n";  
    $headers .= "Organization: Notes Orgnaization\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
    $headers .= "X-Priority: 3\r\n";
    $headers .= "X-Mailer: PHP". phpversion() ."\r\n" ;

    // Load email HTML file and replace variables
    $variables = array(
        "code"=>$code,
        "username"=>$_SESSION["username"]
    );
    $template = file_get_contents("email.html");
    foreach($variables as $key => $value) {
        $template = str_replace('{{ '.$key.' }}', $value, $template);
    }

    // Send success result to client
    $sent = mail($email, $subject, $template, $headers); 

    if($sent) {
        die(json_encode(["success"=>True]));
    } else {
        error(json_encode(["error"=>"Failed to send email."]));
    }
?>