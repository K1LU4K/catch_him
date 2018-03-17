(function () {

    // Variable for sidebar button
    let start = document.getElementById("start-game"),
        toggleSidebar = document.getElementById("toggle-sidebar"),
        sidebar = document.querySelector("." + toggleSidebar.dataset.toggle);

    // Variables for grid and get time difficulty
    let grid = document.querySelector(".grid"),
        difficulty = grid.dataset.difficulty,
        gridSize = grid.dataset.gridSize,
        timeActive = grid.dataset.timeActive,
        timeBetweenChange = parseInt(timeActive) + 1000;

    // Variables for cell and win cell
    let cell,
        winCell,
        cellId,
        changeCell,
        makeCellDisappear,
        TimeoutCellWinnable;

    let xhr = new XMLHttpRequest();

    start.addEventListener("click", startGame, { once: true });

    /**
     * Function for the click event in play buton, start the game
     * @param event
     */
    function startGame(event) {
        event.preventDefault();

        winCell = document.querySelector(".win");
        if (winCell) {
            winCell.classList.remove("win");
        }

        this.innerText = "Stop ?";

        if (mobileAndTabletcheck()) {
            toggleSidebar.classList.toggle("open");
            sidebar.classList.toggle("display");
        }

        /**
         * Interval for changing winnable cell change
         * @type {number}
         */
        changeCell = setInterval(function () {

            xhr.open("GET", "?difficulty=" + encodeURIComponent(difficulty) + "&grid-size=" + encodeURIComponent(gridSize) + "&ajax=true&cell=change");
            xhr.onload = setRandomCell;
            xhr.send();

            }, timeBetweenChange);

    }

    /**
     * Function for the click event in the cell winnable
     * @param event
     */
    function makeWinnable(event) {
        event.preventDefault();

        var clickedCellId = cell.id;

        xhr.open("GET", "?ajax=true&cell=isWinner&cellId=" + encodeURIComponent(clickedCellId));

        xhr.onload = checkIfWin;

        xhr.send();

    }

    /**
     * Function for XMLHttpRequest.onload method, get a random cell form the database and active it during x millisecondes
     */
    function setRandomCell() {

        if (xhr.readyState == XMLHttpRequest.DONE) {

            if (xhr.status === 200) {

                cellId = "cell" + xhr.responseText;
                cell = document.getElementById(cellId);

                cell.classList.add("active");

                // Timeout to disable winnable cell
                makeCellDisappear = setTimeout(function () {
                    cell.classList.remove('active');
                    clearTimeout(makeCellDisappear);
                }, timeActive);

                // Add click event to make the cell winnable
                cell.addEventListener("mousedown", makeWinnable);
                TimeoutCellWinnable = setTimeout(function () {
                    cell.removeEventListener("mousedown", makeWinnable);
                    clearTimeout(TimeoutCellWinnable);
                }, timeActive);

            }
            else {
                alert('Une erreur est survenu, sorry.');
                clearInterval(changeCell);
            }

        }

    }

    /**
     * Function for XMLHttpRequest.onload method, check if the user win and stop the game
     */
    function checkIfWin() {

        if (xhr.readyState == XMLHttpRequest.DONE) {

            if (xhr.status === 200) {

                cell.removeEventListener("mousedown", makeWinnable);

                start.innerText = "Play ?";

                start.addEventListener("click", startGame, { once:true });

                cell.classList.remove("active");
                cell.classList.add("win");

                alert(xhr.responseText);

                clearInterval(changeCell);
                clearTimeout(makeCellDisappear);
                clearTimeout(TimeoutCellWinnable);
            }
            else {

                alert('Une erreur est survenu, sorry.');

                clearInterval(changeCell);
                clearTimeout(makeCellDisappear);
                clearTimeout(TimeoutCellWinnable);
            }

        }

    }

})();