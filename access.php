<?php
    require_once 'config.php';

    function validate_email($email) {
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)) return ["type"=>"email", "error"=>"Your email is in the incorrect format"];
        return NULL;
    }

    function validate_username($username) {
        if(strlen($username) < 4) return ["type"=>"username", "error"=>"Your username must be at least 4 characters."];
        if(strlen($username) > 32) return ["type"=>"username", "error"=>"Your username must not exceed 32 characters."];
        return NULL;
    }

    function validate_password($password) {
        if(preg_match("/\s/i", $password)) return ["type"=>"password", "error"=>"Passwords must not contain any spaces"];
        if(strlen($password) < 8) return ["type"=>"password", "error"=>"Your password must be at least 8 characters."];
        if(strlen($password) > 32) return ["type"=>"password", "error"=>"Your password must not exceed 32 characters."];
        return NULL;
    }

    function validate_access_attempt($pdo) {
        // Get user IP
        $ip = $_SERVER["REMOTE_ADDR"];

        // Get user row data from IPs table
        $query = $pdo->prepare('SELECT * FROM ips WHERE ip=?');
        $query->execute([$ip]);
        $result = $query->fetch(PDO::FETCH_ASSOC);
        
        // If user does not have a row
        if(!$result) {
            // Insert a new row, and set attempts to 1, and last attempt date to current date
            $query = $pdo->prepare('INSERT INTO ips (ip, last_attempt, attempts) VALUES (?, ?, 1)');        
            $query->execute([$ip, time()]);
        } else {
            // If this returns null, this means the row was reset and no action is needed
            $latest = max($result["last_lockout"], $result["last_attempt"]);
            
            // Check if the row has not been reset,
            // And if the latest time exceeds reset period,
            if($latest and time() - $latest >= RESET_PERIOD) {
                // Then reset the row for the user in the IPs table
                $query=$pdo->prepare('UPDATE ips SET last_attempt=NULL, attempts=0, last_lockout=NULL, lockouts=0 WHERE ip=?');
                $query->execute([$ip]);

                // Update $result variable to the new reset values
                $query = $pdo->prepare('SELECT * FROM ips WHERE ip=?');
                $query->execute([$ip]);
                $result = $query->fetch(PDO::FETCH_ASSOC);
            }
            // Otherwise, if latest time does not exceed reset period
            // Check if there have been any lockouts
            if($result["last_lockout"]) {
                // Get difference of time between the lockout date and this current date
                $diff = time() - $result["last_lockout"];
                // Get lockout period by checking if lockouts exceed the maximum
                $period = $result["lockouts"] >= MAX_LOCKOUTS ? MAX_LOCKOUT_PUNISHMENT_PERIOD : LOCKOUT_PERIOD;

                // If in lockout
                if($period - $diff >= 0) {
                    // Display error message and show remaining time, and stop code execution
                    $remaining = toFriendlyTime(max(0, $period - $diff));
                    error(json_encode([["type"=>"email", "error"=>"Max login attempts reached, locked out for $remaining."]]));
                } else {
                    // Otherwise,
                    // Check if the lockouts exceed the maximum, which means they were punished
                    if($result["lockouts"] >= MAX_LOCKOUTS) {
                        // Then, reset the amount of lockouts
                        $query = $pdo->prepare('UPDATE ips SET lockouts=0 WHERE ip=?');
                        $query->execute([$ip]);
                    }
                }
            }

            // Check if the number of login attempts is greater than the maximum
            if($result["attempts"] >= MAX_LOGIN_ATTEMPTS) {
                // Reset number of attempts, and increase the number of lockouts
                $query = $pdo->prepare('UPDATE ips SET attempts=0, last_lockout=?, lockouts=lockouts+1 WHERE ip=?');
                $query->execute([time(), $ip]);
                
                // Get lockout period by checking if lockouts exceed the maximum
                $period = toFriendlyTime($result["lockouts"] + 1 >= MAX_LOCKOUTS ? MAX_LOCKOUT_PUNISHMENT_PERIOD : LOCKOUT_PERIOD);
                // Display error message and show remaining time, and stop code execution
                error(json_encode([["type"=>"email", "error"=>"Max login attempts reached, locked out for $period."]]));
            } else {
                // Otherwise,
                // Increase the number of attempts, and set last attempt date to this date
                $query = $pdo->prepare('UPDATE ips SET attempts=attempts+1, last_attempt=? WHERE ip=?');
                $query->execute([time(), $ip]);
            }
        }
    }
?>