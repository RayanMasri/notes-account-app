<?php
    function toFriendlyTime($seconds) {
        $measures = array(
        'day'=>24*60*60,
        'hour'=>60*60,
        'minute'=>60,
        'second'=>1,
        );
        foreach ($measures as $label=>$amount) {
        if ($seconds >= $amount) {  
            $howMany = floor($seconds / $amount);
            return $howMany." ".$label.($howMany > 1 ? "s" : "");
        }
        } 
        return "0 seconds";
    }   

    function error($msg) {
        header('HTTP/1.1 400 Bad Request');
        die($msg);
    }

    function generate_fixed_digit_random_number($digits=4) {        
        return rand(pow(10, $digits-1), pow(10, $digits)-1);
    }
?>