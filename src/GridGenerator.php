<?php

namespace K1LU4K;


class GridGenerator
{

    protected $size;
    protected $cells;
    protected $difficulty;
    protected $time;
    protected $availableGridSize = [8, 16, 32];

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
    public function generate($size = null) {

        $grid = "";

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

        $grid .= "<div class=\"grid\" data-difficulty=\"{$this->difficulty}\" data-grid-size=\"{$this->size}\" data-time-active=\"{$ms}\" data-available-grid-size=\"" . json_encode($this->availableGridSize) . "\">";

        for ($x = 0 ; $x < $this->size ; $x++) {

            $grid .= "<div class=\"line\" id=\"row{$x}\">";

            for ($y = 0 ; $y < $this->size ; $y++) {

                $iCellId = ($this->size * $x) + $y;

                $grid .= "<div class=\"cell\" id=\"cell{$iCellId}\">";
                $grid .= "</div>";

            }

            $grid .= "</div>";

        }

        $grid .= "</div>";

        if (! empty($_GET["ajax"])) {

            $json = [
                "sizeUrl" => $this->generateSizeUrl(),
                "difficultyUrl" => $this->generateDifficultyUrl(),
                "grid" => $grid,
            ];

            $json = json_encode($json);

            echo $json;
            return;

        }

        echo $grid;

    }

    /**
     * Generate url for size button
     * @return string
     */
    public function generateSizeUrl() {
        return (! empty($_GET["difficulty"])) ? "?difficulty=" . $_GET['difficulty'] . "&grid-size=" : "?grid-size=";
    }

    /**
     * Generate url for difficulty button
     * @return string
     */
    public function generateDifficultyUrl() {
        return (! empty($_GET["grid-size"])) ? "?grid-size=" . $_GET['grid-size'] . "&difficulty=" : "?difficulty=";
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
        $difficulty = ($difficulty <= 0 || $difficulty > 3) ? 2 : $difficulty ;
        $this->difficulty = $difficulty;
    }

    /**
     * @param int $size
     */
    public function setSize($size) {
        $size = (! in_array($size, $this->availableGridSize)) ? 16 : $size ;
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