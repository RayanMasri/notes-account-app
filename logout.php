<?php
    require_once 'cors.php';

    session_start();
    session_unset();   // Remove the $_SESSION variable information.
    session_destroy(); // Remove the server-side session information.
    setcookie("PHPSESSID", "", 1); // Force the cookie to expire.
    session_start();
    session_regenerate_id(true);

?>