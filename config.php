<?php
    define("ALLOWED_ORIGINS", [
        'http://localhost:3000'
    ]);
    define("VERIFICATION_CODE_DURATION", 1800);
    define("SPAM_PREVENTION_DELAY", 0.5); // Delay at the start of every login, register, verification, and email resending call to prevent spamming

    // * All of the below time constants are in seconds

    // Constants for user access
    define("MAX_ACCESS_ATTEMPTS", 10);
    define("MAX_ACCESS_LOCKOUTS", 3);
    define("MAX_ACCESS_LOCKOUTS_PUNISHMENT_PERIOD", 86400); 
    define("ACCESS_LOCKOUT_PERIOD", 300); 
    define("ACCESS_RESET_PERIOD", 86400);
    define("ACCESS_VALIDATION_CONFIG", [
        "MAX_ATTEMPTS"=>MAX_ACCESS_ATTEMPTS,
        "MAX_LOCKOUTS"=>MAX_ACCESS_LOCKOUTS,
        "MAX_LOCKOUTS_PUNISHMENT_PERIOD"=>MAX_ACCESS_LOCKOUTS_PUNISHMENT_PERIOD,
        "LOCKOUT_PERIOD"=>ACCESS_LOCKOUT_PERIOD,
        "RESET_PERIOD"=>ACCESS_RESET_PERIOD,
    ]);

    // Constants for resending verfication emails
    define("MAX_RESEND_ATTEMPTS", 1);
    define("MAX_RESEND_LOCKOUTS", 10);
    define("MAX_RESEND_LOCKOUTS_PUNISHMENT_PERIOD", 86400);
    define("RESEND_LOCKOUT_PERIOD", 60);
    define("RESEND_RESET_PERIOD", 86400);
    define("RESEND_VALIDATION_CONFIG", [
        "MAX_ATTEMPTS"=>MAX_RESEND_ATTEMPTS,
        "MAX_LOCKOUTS"=>MAX_RESEND_LOCKOUTS,
        "MAX_LOCKOUTS_PUNISHMENT_PERIOD"=>MAX_RESEND_LOCKOUTS_PUNISHMENT_PERIOD,
        "LOCKOUT_PERIOD"=>RESEND_LOCKOUT_PERIOD,
        "RESET_PERIOD"=>RESEND_RESET_PERIOD,
    ]);

    // Constants for submitting verification code
    define("MAX_VERIFICATION_ATTEMPTS", 10); // make this 100
    define("MAX_VERIFICATION_LOCKOUTS", 2);
    define("MAX_VERIFICATION_LOCKOUTS_PUNISHMENT_PERIOD", 86400);
    define("VERIFICATION_LOCKOUT_PERIOD", 600);
    define("VERIFICATION_RESET_PERIOD", 86400);
    define("VERIFICATION_VALIDATION_CONFIG", [
        "MAX_ATTEMPTS"=>MAX_VERIFICATION_ATTEMPTS,
        "MAX_LOCKOUTS"=>MAX_VERIFICATION_LOCKOUTS,
        "MAX_LOCKOUTS_PUNISHMENT_PERIOD"=>MAX_VERIFICATION_LOCKOUTS_PUNISHMENT_PERIOD,
        "LOCKOUT_PERIOD"=>VERIFICATION_LOCKOUT_PERIOD,
        "RESET_PERIOD"=>VERIFICATION_RESET_PERIOD,
    ]);

    define("NON_REMEMBER_TIMEOUT", 30); // The time which defines how long after a ping received by the server should the session be deleted if the user opts to not be remembered
?>