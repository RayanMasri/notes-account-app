<?php
    define("ALLOWED_ORIGINS", [
        'http://localhost:3000'
    ]);
    define("MAX_LOGIN_ATTEMPTS", 10);
    define("MAX_LOCKOUTS", 3);
    define("LOCKOUT_PERIOD", 300); // in seconds
    define("MAX_LOCKOUT_PUNISHMENT_PERIOD", 86400); // in seconds
    // define("RESET_PERIOD", 86400);
    define("RESET_PERIOD", 1);
    define("NON_REMEMBER_TIMEOUT", 30); // in seconds, the time which defines how long after a ping received by the server should the session be deleted if the user opts to not be remembered
    define("INITIAL_DELAY", 0.5); // in seconds, delay at the start of every login/register call to prevent spamming
    // define("MAX_LOGIN_ATTEMPTS", 3);
    // define("MAX_LOCKOUTS", 3);
    // define("LOCKOUT_PERIOD", 5); // in seconds
    // define("MAX_LOCKOUT_PUNISHMENT_PERIOD", 10); // in seconds
    // define("RESET_PERIOD", 60);
?>