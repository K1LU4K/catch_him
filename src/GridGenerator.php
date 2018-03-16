<?php

namespace K1LU4K\Generator;


class GridGenerator
{

    protected $size;

    public function __construct($size = 16) {
        $this->size = $size;
        $this->cells = $size * $size;
    }

    /**
     * Generate the html grid
     */
    public function generate() {

        echo "<div class=\"grid\" data-number-cell=\"{$this->cells}\">";

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

    public function getActive() {
        echo rand(0, $this->cells - 1);
    }

}