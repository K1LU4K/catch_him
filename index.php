<?php
session_start();

require "vendor/autoload.php";

$oGridGen = \K1LU4K\GridGenerator::getInstance();

$sDifficultyUrl = (! empty($_GET["grid-size"])) ? "?grid-size=" . $_GET['grid-size'] . "&difficulty=" : "?difficulty=";
$sSizeUrl = (! empty($_GET["difficulty"])) ? "?difficulty=" . $_GET['difficulty'] . "&grid-size=" : "?grid-size=";

if (! empty($_GET["difficulty"])) {
    $iDifficulty = trim(strip_tags($_GET["difficulty"]));
    $oGridGen->setDifficulty($iDifficulty);
}

if (! empty($_GET["grid-size"])) {
    $iGridSize = trim(strip_tags($_GET["grid-size"]));
    $oGridGen->setSize($iGridSize);
}

$oCellMan = new \K1LU4K\CellManager($oGridGen);

// Get ajax request
if (! empty($_GET['cell']) && ! empty($_GET['ajax'])) {

    // Declare available methods, then test if method in the request exist
    $methods = ["change", "isWinner"];

    if (in_array($_GET['cell'], $methods)) {

        // If method is "change", change the
        if ($_GET['cell'] == "change") {
            $oCellMan->activeRandomCell();
        }

        if ($_GET["cell"] == "isWinner") {
            $oCellMan->isActiveCell();
        }

    }
    else {
        header("HTTP/1.0 404 Page Not Found");
        echo "L'URL demander n'existe pas";
    }

    exit();

}

?>
<!DOCTYPE html>
<html lang="fr">
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Catch Him</title>

    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/normalize.css">
    <link rel="stylesheet" href="./assets/css/style.css">

</head>
<body>

<div class="wrapper">

    <div class="sidebar">

        <div class="sidebar-content">

            <!-- Start button -->
            <div class="menu start">
                <h1>Catch the light !</h1>
                <a id="start-game" class="start-button" href="">Play ?</a>
            </div>

            <!-- Menu for choose difficulty -->
            <div class="menu difficulty">
                <p>Difficulty :</p>
                <a class="difficulty-button <?php echo ($oGridGen->getDifficulty() == 1) ? "active" : "" ?>" href="<?= $sDifficultyUrl . "1" ?>">Easy</a>
                <a class="difficulty-button <?php echo ($oGridGen->getDifficulty() == 2) ? "active" : "" ?>" href="<?= $sDifficultyUrl . "2" ?>">Normal</a>
                <a class="difficulty-button <?php echo ($oGridGen->getDifficulty() == 3) ? "active" : "" ?>" href="<?= $sDifficultyUrl . "3" ?>">Difficult</a>
            </div>

            <!-- Menu for choose the grid size -->
            <div class="menu grid-size">
                <p>Grid size :</p>
                <a class="grid-size-button <?php echo ($oGridGen->getSize() == 8) ? "active" : "" ?>" href="<?= $sSizeUrl . "8" ?>">8 x 8</a>
                <a class="grid-size-button <?php echo ($oGridGen->getSize() == 16) ? "active" : "" ?>" href="<?= $sSizeUrl . "16" ?>">16 x 16</a>
                <a class="grid-size-button <?php echo ($oGridGen->getSize() == 32) ? "active" : "" ?>" href="<?= $sSizeUrl . "32" ?>">32 x 32</a>
            </div>

        </div>

    </div>

    <!-- Generate grid -->
    <div class="grid-container">
        <?php $oGridGen->generate(); ?>
    </div>

</div>

<script type="text/javascript" src="./assets/js/app.js"></script>

</body>
</html>