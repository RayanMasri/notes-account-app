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
?>