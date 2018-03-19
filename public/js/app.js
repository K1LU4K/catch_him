window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

(function () {

    // Variable for event
    let isSetOrientationEvent = false,
        isSetSidebarEvent = false,
        isSetStyleEvent = false;

    // Variable for sidebar button
    let start = document.getElementById("start-game"),
        toggleSidebar = document.getElementById("toggle-sidebar"),
        sidebar = document.querySelector("." + toggleSidebar.dataset.toggle),
        toggleSidebarContainer = document.querySelector(".toggle-sidebar-container"),
        gridContainer = document.querySelector(".grid-container");

    // Button for difficulty and grid-size
    let difficultyButtons = document.querySelectorAll(".menu.difficulty a"),
        gridSizeButtons = document.querySelectorAll(".menu.grid-size a"),
        nbrDifficultyButtons = difficultyButtons.length,
        nbrGridSizeButtons = gridSizeButtons.length,
        url;

    // Variables for grid and get time difficulty
    let grid = document.querySelector(".grid"),
        difficulty = grid.dataset.difficulty,
        gridSize = grid.dataset.gridSize,
        timeActive = grid.dataset.timeActive,
        timeBetweenChange = parseInt(timeActive) + 1000,
        availableGridSize = JSON.parse(grid.dataset.gridSizeAvailable);

    // Variables for cell and win cell
    let cell,
        winCell,
        cellId,
        changeCell,
        makeCellDisappear,
        TimeoutCellWinnable;

    let xhr = new XMLHttpRequest();

    start.addEventListener("click", startGameEvent, { once: true });

    // Event for change style in function of screen size
    changeStyleEvent();

    for (let i = 0 ; i < nbrDifficultyButtons ; i++) {
        difficultyButtons[i].addEventListener("click", changeDifficultyEvent);
    }

    for (let i = 0 ; i < nbrGridSizeButtons ; i++) {
        gridSizeButtons[i].addEventListener("click", changeGridSizeEvent);
    }

    /**
     * Function for the click event in play buton, start the game
     * @param event
     */
    function startGameEvent(event) {
        event.preventDefault();

        cleanGrid();

        // If mobile style is active, close sidebar
        if (gridContainer.classList.contains("mobile-browser")) {
            toggleSidebar.classList.toggle("open");
            sidebar.classList.toggle("display");
        }

        start.innerText = "Stop ?";
        start.addEventListener("click", stopGameEvent, { once: true });

        /**
         * Interval for changing winnable cell change
         * @type {number}
         */
        changeCell = setInterval(function () {

            url = "?difficulty=" + encodeURIComponent(difficulty) + "&grid-size=" + encodeURIComponent(gridSize) + "&ajax=true&cell=change";

            xhr.open("GET", url);
            xhr.onload = setRandomCellResponse;
            xhr.send();

            }, timeBetweenChange);

    }

    /**
     * Function for stop the game, use one event for stop click button
     */
    function stopGameEvent(event) {
        event.preventDefault();

        removeActiveCell();

        start.innerText = "Play ?";
        start.addEventListener("click", startGameEvent, { once: true });

        clearInterval(changeCell);
        clearTimeout(makeCellDisappear);
        clearTimeout(TimeoutCellWinnable);

    }

    /**
     * Function for the click event in the cell winnable
     * @param event
     */
    function makeWinnableEvent(event) {
        event.preventDefault();

        var clickedCellId = cell.id;

        xhr.open("GET", "?ajax=true&cell=isWinner&cellId=" + encodeURIComponent(clickedCellId));

        xhr.onload = checkIfWinResponse;

        xhr.send();

    }

    /**
     * Remove all win cells
     */
    function cleanGrid() {
        winCell = document.querySelector(".win");
        if (winCell) {
            winCell.classList.remove("win");
        }
    }

    /**
     * Function for XMLHttpRequest.onload method, get a random cell form the database and active it during x millisecondes
     */
    function setRandomCellResponse() {

        if (xhr.readyState == XMLHttpRequest.DONE) {

            let response = JSON.parse(xhr.responseText);

            if (xhr.status === 200) {

                cellId = "cell" + response.cellId;
                cell = document.getElementById(cellId);

                cell.classList.add("active");

                // Timeout to disable winnable cell
                makeCellDisappear = setTimeout(function () {
                    cell.classList.remove('active');
                    clearTimeout(makeCellDisappear);
                }, timeActive);

                // Add click event to make the cell winnable
                cell.addEventListener("mousedown", makeWinnableEvent);
                TimeoutCellWinnable = setTimeout(function () {
                    cell.removeEventListener("mousedown", makeWinnableEvent);
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
    function checkIfWinResponse() {

        if (xhr.readyState == XMLHttpRequest.DONE) {

            let response = JSON.parse(xhr.responseText);

            if (xhr.status === 200) {

                cell.removeEventListener("mousedown", makeWinnableEvent);

                start.innerText = "Play ?";

                start.removeEventListener("click", stopGameEvent);
                start.addEventListener("click", startGameEvent, { once:true });

                cell.classList.remove("active");
                cell.classList.add("win");

                alert(response.success);

                clearInterval(changeCell);
                clearTimeout(makeCellDisappear);
                clearTimeout(TimeoutCellWinnable);
            }
            else {

                alert(response.error);

                clearInterval(changeCell);
                clearTimeout(makeCellDisappear);
                clearTimeout(TimeoutCellWinnable);
            }

        }

    }

    /**
     * Toggle mobile style and check orientation device for the grid appereance
     */
    function changeStyleEvent() {
        toggleOrientationEvent();
        toggleMobileStyle();

        if (! isSetStyleEvent) {
            window.addEventListener("resize", changeStyleEvent);
            isSetStyleEvent = true;
        }

    }

    /**
     * Toggle mobile style
     */
    function toggleMobileStyle() {

        if (mobileAndTabletcheck() || window.innerWidth < 1000) {

            sidebar.classList.add("mobile-browser");
            gridContainer.classList.add("mobile-browser");
            toggleSidebarContainer.classList.remove("computer");

            if (! isSetSidebarEvent) {
                toggleSidebar.addEventListener("click", toggleSidebarEvent);
                isSetSidebarEvent = true;
            }

        }
        else {

            sidebar.classList.remove("mobile-browser");
            gridContainer.classList.remove("mobile-browser");
            toggleSidebarContainer.classList.add("computer");

            if (isSetSidebarEvent) {
                toggleSidebar.removeEventListener("click", toggleSidebarEvent);
                isSetSidebarEvent = false;
            }

        }

    }

    /**
     * Toggle sidebar and sidebar button
     * @param event
     */
    function toggleSidebarEvent(event) {
        event.preventDefault();
        toggleSidebar.classList.toggle("open");
        sidebar.classList.toggle("display");
    }

    /**
     * Toggle portrait or landscape orientation when user change it
     */
    function toggleOrientationEvent() {

        if (window.innerHeight > window.innerWidth || gridContainer.clientHeight > gridContainer.clientWidth) {
            gridContainer.classList.add("portrait");
            sidebar.classList.remove("landscape");
        }
        else {
            gridContainer.classList.remove("portrait");
            sidebar.classList.add("landscape");
        }

        if (mobileAndTabletcheck() && ! isSetOrientationEvent) {
            window.addEventListener("deviceorientation", toggleOrientationEvent);
            isSetOrientationEvent = true;
        }

    }

    /**
     * Function for change difficulty event
     */
    function changeDifficultyEvent(event) {
        stopGameEvent(event);

        let thisButton = this;

        url = this.getAttribute("href");

        xhr.open("GET", url + "&ajax=true");

        xhr.onload = () => { changeOptionResponse(".difficulty-button.active", thisButton); };

        xhr.send();

    }

    /**
     * Function for change grid-size event
     */
    function changeGridSizeEvent(event) {
        stopGameEvent(event);

        let thisButton = this;

        url = this.getAttribute("href");

        xhr.open("GET", url + "&ajax=true");

        xhr.onload = () => { changeOptionResponse(".grid-size-button.active", thisButton); };

        xhr.send();

    }

    /**
     * Function for change the active menu button and regenerate grid
     * @param activeButtonSelector
     */
    function changeOptionResponse(activeButtonSelector, thisButton) {

        if (xhr.readyState === XMLHttpRequest.DONE) {

            let response = JSON.parse(xhr.responseText);

            if (xhr.status === 200) {
                let activeButton = document.querySelector(activeButtonSelector);

                activeButton.classList.remove("active");
                thisButton.classList.add("active");

                refreshGrid(response.grid);

                if (activeButtonSelector.match("difficulty")) {
                    for (let i = 0 ; i < nbrGridSizeButtons ; i++) {
                        gridSizeButtons[i].setAttribute("href", "?difficulty=" + response.difficulty + "&grid-size=" + availableGridSize[i]);
                    }
                }
                else {
                    for (let i = 0 ; i < nbrDifficultyButtons ; i++) {
                        difficultyButtons[i].setAttribute("href", "?grid-size=" + response.size + "&difficulty=" + (i + 1));
                    }
                }

            }
            else {
                alert("An error is occured. Please try again later.");
            }

        }

    }

    /**
     * Refresh the actual grid with a newgrid
     * @param newGrid
     */
    function refreshGrid(newGrid) {

        gridContainer.innerHTML = newGrid;
        grid = gridContainer.firstChild;

        difficulty = grid.dataset.difficulty;
        timeActive = grid.dataset.timeActive;
        gridSize = grid.dataset.gridSize;
        timeBetweenChange = parseInt(timeActive) + 1000;

    }

    /**
     * Remove all active cell (usefull if a cell is active when the game is stopped)
     */
    function removeActiveCell() {
        let activeCells = document.querySelectorAll(".cell.active");
        for (let i = 0 ; i < activeCells.length ; i++) {
            activeCells[i].classList.remove("active");
        }
    }

})();