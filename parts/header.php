<!DOCTYPE html>
<html lang="fr">
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Catch Him</title>

    <link rel="icon" href="./favicon.ico">

    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link rel="stylesheet" href="./assets/css/normalize.css">
    <link rel="stylesheet" href="./assets/css/style.css">

</head>
<body>

<div class="wrapper">

    <div class="toggle-sidebar-container computer">
        <div id="toggle-sidebar" data-toggle="sidebar">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>

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
                <a class="difficulty-button <?php echo ($oGridGen->getDifficulty() == 1) ? "active" : "" ?>" href="<?= $oGridGen->generateDifficultyUrl() . "1" ?>">Easy</a>
                <a class="difficulty-button <?php echo ($oGridGen->getDifficulty() == 2) ? "active" : "" ?>" href="<?= $oGridGen->generateDifficultyUrl() . "2" ?>">Normal</a>
                <a class="difficulty-button <?php echo ($oGridGen->getDifficulty() == 3) ? "active" : "" ?>" href="<?= $oGridGen->generateDifficultyUrl() . "3" ?>">Difficult</a>
            </div>

            <!-- Menu for choose the grid size -->
            <div class="menu grid-size">
                <p>Grid size :</p>
                <a class="grid-size-button <?php echo ($oGridGen->getSize() == 8) ? "active" : "" ?>" href="<?= $oGridGen->generateSizeUrl() . "8" ?>">8 x 8</a>
                <a class="grid-size-button <?php echo ($oGridGen->getSize() == 16) ? "active" : "" ?>" href="<?= $oGridGen->generateSizeUrl() . "16" ?>">16 x 16</a>
                <a class="grid-size-button <?php echo ($oGridGen->getSize() == 32) ? "active" : "" ?>" href="<?= $oGridGen->generateSizeUrl() . "32" ?>">32 x 32</a>
            </div>

        </div>

    </div>
