<?php

namespace K1LU4K;

class CellManager
{

    public $oGrid;

    /**
     * CellManager constructor.
     */
    public function __construct(GridGenerator $oGrid) {
        $this->oGrid = $oGrid;
    }

    /**
     * Check if the cell where the user click is the good cell and if hte time is correct
     */
    public function isActiveCell() {
        if (! empty($_SESSION["timeout"]) && ! empty($_SESSION['cell'])) {

            if (! isset($_GET["cellId"])) {
                header("HTTP/1.1 404 Page Not Found");
                echo "Ne fais pas n'importe quoi voyons.";
                return;
            }

            if (time() <= $_SESSION['timeout'] && $_SESSION["cell"] == $_GET["cellId"]) {
                echo "you win !";
                return;
            }

        }
        else {
            header("HTTP/1.1 404 Page Not Found");
            echo "An error is occured";
            return;
        }
    }

    /**
     * Choose a random cell to active
     */
    public function activeRandomCell() {

        $iIdCell = rand(0, $this->oGrid->getCells() - 1);

        $_SESSION['timeout'] = time() + $this->oGrid->getTime();
        $_SESSION['cell'] = "cell" . $iIdCell;

        echo $iIdCell;
        return;
    }

}