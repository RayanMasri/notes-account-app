<?php    
    require_once 'cors.php';
    require_once 'config.php';
    require_once 'db.php';
    require_once 'utility.php';
    require_once 'access.php';
    require_once 'utility.php';

    usleep(ACCESS_DELAY * 1000000);

    $fields = ["email", "password"];
    $errors = [];

    // Check if fields are set in form data and are not empty
    foreach($fields as $field) {
        if(!isset($_POST[$field]) or !trim($_POST[$field])) {
            array_push($errors, ["type"=>$field, "error"=>"Field is required"]);
        }
    }
    if(count($errors) > 0) error(json_encode($errors));

    // Validate email
    $email = validate_email($_POST["email"]);
    if($email) array_push($errors, $email);

    // Validate password
    $password = validate_password($_POST["password"]);
    if($password) array_push($errors, $password);

    if(count($errors) > 0) error(json_encode($errors));

    // Get database
    $db = get_database();
    if($db["error"]) error(json_encode([["type"=>"email", "error"=>"An error occured in the server"]]));
    $pdo = $db["pdo"];

    // Prevents user to a few attempts of login/register
    $validation = validate_access_attempt($pdo, "access_attempts", ACCESS_VALIDATION_CONFIG);
    if(!$validation["success"]) {
        $period = $validation["period"];
        error(json_encode([["type"=>"email", "error"=>"Max attempts reached, locked out for $period."]]));
    }

    // Check if email & password exist in database
    $query = $pdo->prepare('SELECT * FROM accounts WHERE email=? AND password=?');
    $query->execute([$_POST["email"], md5($_POST["password"])]);
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if($result) {
        // If so, set session data to account data
        session_start();
        $_SESSION["username"] = $result["username"];
        $_SESSION["verified"] = $result["verified"] == 1;
        $_SESSION["remember"] = $_POST["remember"] == "false" ? False : True;
        if(!$_SESSION["remember"]) {
            $_SESSION["last_action"] = time();
        }
        
        die(json_encode(["success"=>True]));
    } else {
        // If not, throw error
        error(json_encode([["type"=>"email", "error"=>"Account does not exist"]]));
    }
?>