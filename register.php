<?php    
    require_once 'cors.php';
    require_once 'config.php';
    require_once 'db.php';
    require_once 'utility.php';
    require_once 'access.php';
    require_once 'utility.php';

    usleep(ACCESS_DELAY * 1000000);

    $fields = ["username", "email", "password"];
    $errors = [];

    // Check if fields are set in form data and are not empty
    foreach($fields as $field) {
        if(!isset($_POST[$field]) or !trim($_POST[$field])) {
            array_push($errors, ["type"=>$field, "error"=>"Field is required"]);
        }
    }
    if(count($errors) > 0) error(json_encode($errors));

    // Validate username
    $username = validate_username($_POST["username"]);
    if($username) array_push($errors, $username);

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
        error(json_encode([["type"=>"username", "error"=>"Max attempts reached, locked out for $period."]]));
    }

    // Check if username exists
    $query = $pdo->prepare('SELECT * FROM accounts WHERE username=?');
    $query->execute([$_POST["username"]]);
    $result = $query->fetch(PDO::FETCH_ASSOC);
    // If does, throw error
    if($result) error(json_encode([["type"=>"username", "error"=>"Username already exists."]]));
    
    // Check if email exists
    $query = $pdo->prepare('SELECT * FROM accounts WHERE email=?');
    $query->execute([$_POST["email"]]);
    $result = $query->fetch(PDO::FETCH_ASSOC);
    // If does, throw error
    if($result) error(json_encode([["type"=>"email", "error"=>"Email already exists."]]));

    // Add new account data into databse
    $query = $pdo->prepare('INSERT INTO accounts (username, email, password) VALUES (?, ?, ?)');
    $query->execute([$_POST["username"], $_POST["email"], md5($_POST["password"])]);

    session_start();
    $_SESSION["username"] = $_POST["username"];
    $_SESSION["verified"] = False;
    $_SESSION["remember"] = True;

    die(json_encode(["success"=>True]));
?>