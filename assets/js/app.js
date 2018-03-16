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

    // Variables for winnable cell
    let cell,
        cellId,
        changeCell,
        makeCellDisappear,
        TimeoutCellWinnable;

    let xhr = new XMLHttpRequest();

    /**
     * Start the game
     * @param event
     */
    let startGame = function (event) {
        event.preventDefault();

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
            xhr.open("GET", "?difficulty=" + difficulty + "&grid-size=" + gridSize + "&ajax=true&cell=change");

            xhr.onload = function() {

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
                    }, timeActive);

                }
                else {
                    alert('Une erreur est survenu, sorry.');
                    clearInterval(changeCell);
                }

            };

            xhr.send();
        }, timeBetweenChange);

    }

    /**
     * Function for the click event in the cell winnable
     * @param event
     */
    let makeWinnable = function (event) {
        event.preventDefault();

        let thisCell = this,
            clickedCellId = thisCell.id;

        xhr.open("GET", "?ajax=true&cell=isWinner&cellId=" + clickedCellId);

        xhr.onload = function () {

            if (xhr.status === 200) {

                start.innerText = "Play ?";

                start.addEventListener("click", startGame, { once:true });

                alert(xhr.responseText);

                clearInterval(changeCell);

                clearTimeout(makeCellDisappear);
                clearTimeout(TimeoutCellWinnable);

                thisCell.classList.remove("active");
                thisCell.removeEventListener("click", makeWinnable);

            }
            else {
                alert('Une erreur est survenu, sorry.');
                clearInterval(changeCell);
                clearTimeout(makeCellDisappear);
            }

        }

        xhr.send();

    }

    start.addEventListener("click", startGame, { once: true });

})();