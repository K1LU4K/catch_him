<?php

namespace K1LU4K\Config;

class Config
{

    protected $difficulties;
    protected $grid_sizes;

    protected static $_instance;

    public function __construct() {
        $this->difficulties = require ROOT . "/config/difficulties.php";
        $this->grid_sizes = require ROOT . "/config/grid-sizes.php";
    }

    public static function getInstance(){
        if (empty(self::$_instance)) {
            self::$_instance = new Config();
        }
        return self::$_instance;
    }

    public function getParam($key) {
        $parts = explode(".", $key);

        try {

            if (! empty($parts[0])) {

                if (! empty($parts[1])) {
                    return $this->$parts[0][$parts[1]];
                }
                else {
                    $type = $parts[0];
                    return $this->$type;
                }

            }
            else {
                throw new \Exception("You have to specify a device name.");
            }

        }
        catch (\Exception $e) {
            echo "An error is occured : " . $e->getMessage();
        }

    }

}