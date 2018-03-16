(function () {

    // Variable for sidebar button
    let start = document.getElementById("start-game");

    // Variables for grid and get time difficulty
    let grid = document.querySelector(".grid"),
        timeActive = grid.dataset.timeActive,
        timeBetweenChange = parseInt(timeActive) + 1000;

    // Variables for winnable cell
    let cell,
        cellId,
        changeCell,
        makeCellDisapear;

    let xhr = new XMLHttpRequest();

    let startGame = function (event) {
        event.preventDefault();

        this.innerText = "Stop ?";

        /**
         * Interval for changing winnable cell change
         * @type {number}
         */
        changeCell = setInterval(function () {

            xhr.open("GET", "?ajax=true&cell=change");

            xhr.onload = function() {

                if (xhr.status === 200) {

                    cellId = "cell" + xhr.responseText;
                    cell = document.getElementById(cellId);
                    cell.classList.add("active");

                    // Timeout to disable winnable cell
                    makeCellDisapear = setTimeout(function () {
                        cell.classList.remove('active');
                        clearTimeout(makeCellDisapear);
                    }, timeActive);

                    // Add click event to make the cell winnable
                    cell.addEventListener("click", makeWinnable, {
                        once: true
                    });

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

        xhr.open("GET", "?ajax=true&cell=isWinner&cellId=" + cellId);

        xhr.onload = function () {

            if (xhr.status === 200) {
                start.innerText = "Play ?";
                start.addEventListener("click", startGame, { once:true });
                alert(xhr.responseText);
                clearInterval(changeCell);
                clearTimeout(makeCellDisapear);
                this.removeEventListener("click", makeWinnable);
            }
            else {
                alert('Une erreur est survenu, sorry.');
                clearInterval(changeCell);
                clearTimeout(makeCellDisapear);
            }

        }

        xhr.send();

    }

    start.addEventListener("click", startGame, { once: true });

})();