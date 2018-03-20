<?php

namespace K1LU4K;


use Detection\MobileDetect;
use K1LU4K\Config\Config;

class GridGenerator
{

    protected $config;
    protected $detector;

    protected $size;
    protected $cells;
    protected $difficulty;
    protected $time;
    protected $gridSizeAvailable;
    protected $difficultiesAvailable;

    public static $_instance;

    /**
     * GridGenerator constructor.
     */
    public function __construct() {
        $this->config = Config::getInstance();

        $this->detector = new \Mobile_Detect();

        $this->difficultiesAvailable = $this->config->getParam("difficulties");
        $this->gridSizeAvailable= $this->config->getParam("grid_sizes");
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

        if ($this->detector->isMobile() || $this->detector->isTablet()) {
            $gridSizeAvailable = $this->gridSizeAvailable["mobile"];
            unset($gridSizeAvailable["default"]);
        }
        else {
            $gridSizeAvailable = $this->gridSizeAvailable["computer"];
            unset($gridSizeAvailable["default"]);
        }

        $gridInfos = [
            "gridSizeAvailable" => json_encode($gridSizeAvailable),
            "ms" => $this->time * 1000,
            "size" => $this->size,
            "difficulty" => $this->difficulty,
        ];

        unset($_SESSION["nbr_appeared"]);

        ob_start();
        require "../ressources/views/grid.php";
        $grid = ob_get_clean();

        if (! empty($_GET["ajax"])) {

            $json = [
                "size" => $this->size,
                "difficulty" => $this->difficulty,
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
    public function generateSizeUrl($size) {
        $url = (! empty($_GET["difficulty"])) ? "?difficulty=" . $_GET['difficulty'] . "&grid-size=" : "?grid-size=";
        $url .= $size;
        return $url;
    }

    /**
     * Generate url for difficulty button
     * @return string
     */
    public function generateDifficultyUrl($difficulty) {
        $url = (! empty($_GET["grid-size"])) ? "?grid-size=" . $_GET['grid-size'] . "&difficulty=" : "?difficulty=";
        $url .= $difficulty;
        return $url;
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
    public function setDifficulty() {

        if (! empty($_GET["difficulty"])) {

            if ($this->detector->isMobile() || $this->detector->isTablet()) {
                $difficulty = (array_key_exists(intval($_GET["difficulty"]), $this->difficultiesAvailable["mobile"])) ? $_GET["difficulty"] : $this->difficultiesAvailable["mobile"]["default"] ;
            }
            else {
                $difficulty = (array_key_exists(intval($_GET["difficulty"]), $this->difficultiesAvailable["computer"])) ? $_GET["difficulty"] : $this->difficultiesAvailable["computer"]["default"] ;
            }

        }
        else {
            $difficulty = $this->difficultiesAvailable["computer"]["default"];
        }

        $this->difficulty = $difficulty;
        $this->setTime();

    }

    /**
     * @param int $size
     */
    public function setSize() {

        if (! empty($_GET["grid-size"])) {

            if ($this->detector->isMobile() || $this->detector->isTablet()) {
                $size = (in_array($_GET["grid-size"], $this->gridSizeAvailable["mobile"])) ? $_GET["grid-size"] : $this->gridSizeAvailable["mobile"]["default"] ;
            }
            else {
                $size = (in_array($_GET["grid-size"], $this->gridSizeAvailable["computer"])) ? $_GET["grid-size"] : $this->gridSizeAvailable["computer"]["default"] ;
            }

        }
        else {
            if ($this->detector->isMobile() || $this->detector->isTablet()) {
                $size = $this->gridSizeAvailable["mobile"]["default"];
            }
            else {
                $size = $this->gridSizeAvailable["computer"]["default"];
            }
        }

        $this->size = intval($size);
        $this->cells = $this->size * $this->size;
    }

    public function setTime() {

        if ($this->detector->isMobile() || $this->detector->isTablet()) {
            $time = $this->difficultiesAvailable["mobile"][$this->difficulty]["time"];
            for ($i = 1 ; $i < count($this->difficultiesAvailable["mobile"]) ; $i++) {
                if ($this->difficultiesAvailable["mobile"][$i]["time"] == $time) {
                    $this->time = $time / 1000;
                }
            }
        }
        else {
            $time = $this->difficultiesAvailable["computer"][$this->difficulty]["time"];
            for ($i = 1 ; $i < count($this->difficultiesAvailable["computer"]) ; $i++) {
                if ($this->difficultiesAvailable["computer"][$i]["time"] == $time) {
                    $this->time = $time / 1000;
                }
            }
        }
    }

    /**
     * @return int
     */
    public function getSize() {
        return $this->size;
    }

    public function getAllSizes() {
        if ($this->detector->isMobile() || $this->detector->isTablet()) {
            $sizes = $this->gridSizeAvailable["mobile"];
            unset($sizes["default"]);
            return $sizes;
        }
        else {
            $sizes = $this->gridSizeAvailable["computer"];
            unset($sizes["default"]);
            return $sizes;
        }
    }

    /**
     * @return int
     */
    public function getDifficulty() {
        return $this->difficulty;
    }

    public function getAllDifficulties() {
        if ($this->detector->isMobile() || $this->detector->isTablet()) {
            $difficulties = $this->difficultiesAvailable["mobile"];
            unset($difficulties["default"]);
            return $difficulties;
        }
        else {
            $difficulties = $this->difficultiesAvailable["computer"];
            unset($difficulties["default"]);
            return $difficulties;
        }
    }

    /**
     * @return int
     */
    public function getTime()
    {
        return $this->time;
    }

}