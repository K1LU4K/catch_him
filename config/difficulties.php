<?php

/**
 * Return an array contain difficulty like "difficulty" => xx ms
 */

return [

    "mobile" => [
        1 => [
            "name" => "Easy",
            "time" => 700,
        ],
        2 => [
            "name" => "Normal",
            "time" => 500,
        ],
        3 => [
            "name" => "Hard",
            "time" => 350,
        ],

        // To set default value, precise index of the value wanted
        "default" => 2,
    ],

    "computer" => [
        1 => [
            "name" => "Easy",
            "time" => 800,
        ],
        2 => [
            "name" => "Normal",
            "time" => 600,
        ],
        3 => [
            "name" => "Hard",
            "time" => 400,
        ],

        // To set default value, precise index of the value wanted
        "default" => 2,
    ],

];