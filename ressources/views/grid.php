<div class="grid" data-difficulty="<?= $gridInfos['difficulty'] ?>" data-grid-size="<?= $gridInfos['size'] ?>" data-time-active="<?= $gridInfos['ms'] ?>" data-grid-size-available="<?= $gridInfos['gridSizeAvailable'] ?>">

    <?php for ($x = 0 ; $x < $this->size ; $x++) : ?>

        <div class="line" id="<?= "row" . $x ?>">

        <?php for ($y = 0 ; $y < $this->size ; $y++) : ?>

            <?php $iCellId = ($this->size * $x) + $y; ?>

            <div class="cell" id="<?= "cell" . $iCellId ?>"></div>

        <?php endfor; ?>

        </div>

    <?php endfor; ?>

</div>
