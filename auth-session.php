<?php
    require_once 'cors.php';
    require_once 'session.php';

    // ini_set("session.cookie_domain", '.localhost');
    // session_set_cookie_params(3600, '/', '.localhost');
    // if(!isset($_SESSION)) {
    //     session_start();
    // }
    
    // session_start();
    // session_unset();   // Remove the $_SESSION variable information.
    // session_destroy(); // Remove the server-side session information.
    // setcookie("PHPSESSID", "", 1); // Force the cookie to expire.

    // session_status() == PHP_SESSION_ACTIVE;
    session_start();
    if(isset($_POST["keep_alive"])) {
        $_SESSION["last_action"] = time();
    }
    
    // Check if session was eradicated
    if(!session_check()) {
        die(json_encode(["success"=>False]));
    }
    
    if(isset($_SESSION["username"])) {
        die(json_encode(["success"=>$_SESSION["username"], "remember"=>$_SESSION["remember"], "verified"=>$_SESSION["verified"]]));
        
    } else {
        die(json_encode(["success"=>False]));
    }


    // $_SESSION["john"] = 1;

    // ini_set('session.cookie_domain','.localhost');

    // echo ini_get('session.cookie_domain');
    // session_set_cookie_params(0, '/', '.localhost');
    // if(!isset($_SESSION)) {
    //     session_start();
    // }
    // // csrf code add here (see below...)
    // $http_origin = $_SERVER['HTTP_ORIGIN'];
    // if ($http_origin == "http://localhost:3000" || $http_origin == "http://localhost:3000"){
    //     header("Access-Control-Allow-Origin: $http_origin");
    // }
    // header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    // header('Access-Control-Allow-Credentials: true');
    // header('Access-Control-Allow-Headers: X-Requested-With, Origin, Content-Type, X-CSRF-Token, Accept');
    // // code starts here
    // $_SESSION['test'] = 'whatever';
?>