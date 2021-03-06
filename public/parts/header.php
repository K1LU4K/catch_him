<!DOCTYPE html>
<html lang="fr">
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <meta name="application-name" content="Catch Him!">
    <meta name="description" content="Catch Him! is a little game where you try to catch a light. You can set grid-size and difficulty.">
    <meta name="keywords" content="catchhim,catch,him,catch-him,light,grid-size,difficulty,grid,gautier,dujarrier,gautierdujarrier">

    <meta name="author" content="Gautier Dujarrier">
    <meta name="creator" content="Gautier Dujarrier">

    <title>Catch Him</title>

    <link rel="icon" href="./favicon.ico">

    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link rel="stylesheet" href="./css/dist/main.min.css">

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

                <?php foreach ($oGridGen->getAllDifficulties() as $number => $infos) : ?>
                    <a class="difficulty-button <?php echo ($oGridGen->getDifficulty() == $number) ? "active" : "" ?>" href="<?= $oGridGen->generateDifficultyUrl($number) ?>"><?= ucfirst($infos["name"]) ?></a>
                <?php endforeach; ?>

            </div>

            <!-- Menu for choose the grid size -->
            <div class="menu grid-size">
                <p>Grid size :</p>

                <?php foreach ($oGridGen->getAllSizes() as $size) : ?>
                    <a class="grid-size-button <?php echo ($oGridGen->getSize() == $size) ? "active" : "" ?>" href="<?= $oGridGen->generateSizeUrl($size) ?>"><?= $size . " x " . $size ?></a>
                <?php endforeach; ?>

            </div>

            <div class="mentions">
                <p>
                    <small>
                        Copyright © Gautier Dujarrier</br>
                        <a id="mentions-button" href="mentions.php">Mentions Légal</a>
                    </small>
                </p>
            </div>

        </div>

    </div>
