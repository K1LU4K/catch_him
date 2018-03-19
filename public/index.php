<?php
session_start();
define("ROOT", dirname(__DIR__));

require "../vendor/autoload.php";

$oGridGen = \K1LU4K\GridGenerator::getInstance();

$oGridGen->setDifficulty();
$oGridGen->setSize();


$oCellMan = new \K1LU4K\CellManager($oGridGen);

// Get ajax request
if (! empty($_GET['ajax'])) {

    if (! empty($_GET['cell'])) {

        // Declare available methods, then test if method in the request exist
        $methods = ["change", "isWinner"];

        if (in_array($_GET['cell'], $methods)) {

            // If method is "change", change the
            if ($_GET['cell'] == "change") { $oCellMan->returnActiveCell(); }

            if ($_GET["cell"] == "isWinner") { $oCellMan->isActiveCell(); }

        }
        else {
            $oCellMan->wrongMethod();
        }

        exit();

    }

    if (! empty($_GET['grid-size']) || ! empty($_GET['difficulty'])) {
        $oGridGen->generate();
        exit();
    }

}

?>

<?php include "./parts/header.php" ?>

<!-- Generate grid -->
<div class="grid-container">
    <?php $oGridGen->generate(); ?>
</div>

<?php include "./parts/footer.php" ?>
