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

            $tries = $_SESSION["nbr_appeared"];

            if (! isset($_GET["cellId"])) {
                header("HTTP/1.1 404 Page Not Found");
                echo "Ne fais pas n'importe quoi voyons.";
                return;
            }

            if ((microtime(true)) <= $_SESSION['timeout'] && $_SESSION["cell"] == $_GET["cellId"]) {
                unset($_SESSION["nbr_appeared"]);
                $win = true;
            }
            else {
                $win = false;
            }

            if (! empty($_GET["ajax"])) {
                $json = [
                    "success" => $win,
                    "nbrAppeared" => $tries,
                ];
                $json = json_encode($json);
                echo $json;
                return;
            }

        }
        else {
            header("HTTP/1.1 404 Page Not Found");
            $json = [
                "error" => "An error is occured.",
            ];
            $json = json_encode($json);
            echo $json;
            return;
        }
    }

    /**
     * Choose a random cell to active
     */
    public function returnActiveCell() {

        $iIdCell = $this->getRandomCell();
        $serverDelay = 1;

        $_SESSION['timeout'] = microtime(true) + ($this->oGrid->getTime() + $serverDelay);
        $_SESSION['cell'] = "cell" . $iIdCell;
        if (! empty($_SESSION["nbr_appeared"])) {
            $_SESSION["nbr_appeared"]++;
        }
        else {
            $_SESSION["nbr_appeared"] = 1;
        }

        if (! empty($_GET["ajax"])) {
            $json = [
                "cellId" => $iIdCell,
            ];
            $json = json_encode($json);
            echo $json;
            return;
        }

        echo $iIdCell;
        return;
    }

    /**
     * Send 404 when method is unknown
     */
    public function wrongMethod() {
        header("HTTP/1.0 404 Page Not Found");
        echo "L'URL demander n'existe pas";
        return;
    }

    /**
     * Return a random cell
     * @return int
     */
    public function getRandomCell() {
        return rand(0, $this->oGrid->getCells() - 1);
    }

}