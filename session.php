<?php
    function session_check() {
        if(isset($_SESSION["remember"]) and !$_SESSION["remember"]) {
            if(time() - $_SESSION["last_action"] >= NON_REMEMBER_TIMEOUT) {
                if(session_status() != PHP_SESSION_ACTIVE) session_start();
                session_unset();   // Remove the $_SESSION variable information.
                session_destroy(); // Remove the server-side session information.
                setcookie("PHPSESSID", "", 1); // Force the cookie to expire.
                session_start();
                session_regenerate_id(true);
                return false;
            }
        }
        return true;
    }
?>