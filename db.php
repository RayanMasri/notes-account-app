<?php
    function get_database() {
        $dns = 'mysql:host=localhost;dbname=accounts-test';
        $username = 'root';
        $password = '';

        try {
            $pdo = new PDO($dns, $username, $password);  
            return ["error"=>False, "pdo"=>$pdo];      
        } catch(PDOException $e) {
            $msg = $e->getMessage();
            error_log($msg);
            return ["error"=>$msg];
        }
    }
?>