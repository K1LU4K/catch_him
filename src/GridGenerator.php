<?php

namespace K1LU4K;


class GridGenerator
{

    protected $size;
    protected $cells;
    protected $difficulty;
    protected $time;

    public static $_instance;

    /**
     * GridGenerator constructor.
     */
    public function __construct() {
        $this->size = 16;
        $this->difficulty = 2;
        $this->time = 500;
        $this->cells = $this->size * $this->size;
    }

    /**
     * @return GridGenerator
     */
    public static function getInstance() {
        if (! isset(self::$_instance)) {
            self::$_instance = new GridGenerator();
        }
        return self::$_instance;
    }

    /**
     * Generate the html grid
     */
    public function generate() {

        switch ($this->difficulty) {

            case 1:
                $this->time = 0.7;
                $ms = $this->time * 1000;
                break;

            case 2:
                $this->time = 0.5;
                $ms = $this->time * 1000;
                break;

            case 3:
                $this->time = 0.2;
                $ms = $this->time * 1000;
                break;

            default:
                $this->time = 500;
                $ms = $this->time * 1000;
                break;

        }

        echo "<div class=\"grid\" data-difficulty=\"{$this->difficulty}\" data-grid-size=\"{$this->size}\" data-time-active=\"{$ms}\">";

        for ($x = 0 ; $x < $this->size ; $x++) {

            echo "<div class=\"line\" id=\"row{$x}\">";

            for ($y = 0 ; $y < $this->size ; $y++) {

                $iCellId = ($this->size * $x) + $y;

                echo "<div class=\"cell\" id=\"cell{$iCellId}\">";
                echo "</div>";

            }

            echo "</div>";

        }

        echo "</div>";

    }

    /**
     * @return float|int
     */
    public function getCells() {
        return $this->cells;
    }

    /**
     * @param int $difficulty
     */
    public function setDifficulty($difficulty) {
        $this->difficulty = $difficulty;
    }

    /**
     * @param int $size
     */
    public function setSize($size) {
        $this->size = $size;
        $this->cells = $this->size * $this->size;
    }

    /**
     * @return int
     */
    public function getSize() {
        return $this->size;
    }

    /**
     * @return int
     */
    public function getDifficulty() {
        return $this->difficulty;
    }

    /**
     * @return int
     */
    public function getTime()
    {
        return $this->time;
    }

}