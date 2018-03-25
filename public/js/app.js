(function () {

    // Variable for event
    let isSetOrientationEvent = false,
        isSetSidebarEvent = false,
        isSetStyleEvent = false;

    /**
     * Variables for timeout and interval
     *
     * timeoutWinContainer = timeout for remove forward class of .win-container
     * timeoutActiveCell = timeout for remove the active cell
     * timeoutCellWinnable =
     */
    let timeoutWinContainer,
        timeoutActiveCell,
        intervalChangeCell;

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
        timeBetweenChange = parseInt(timeActive) + 500,
        availableGridSize = JSON.parse(grid.dataset.gridSizeAvailable);

    /**
     * Variables for cell and win cell
     *
     * cellId = id send from php for the active cell
     * wonCell = cell which clicked in time by user
     * cell = cell active during timActive
     */
    let cellId,
        wonCell,
        cell;

    let winContainer = document.querySelector(".win-container"),
        winScreen = document.querySelector(".win-screen"),
        score,
        replay,
        canReplaying = false,
        hideScoreTime;

    let xhr = new XMLHttpRequest();

    // Event for change style in function of screen size
    changeStyleEvent();

    start.addEventListener("click", startGameEvent, { once: true });

    // Add an event for each difficulty and size button
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

        canReplaying = false;
        cleanGrid();

        // If mobile style is active, close sidebar
        if (gridContainer.classList.contains("mobile-browser") && toggleSidebar.classList.contains("open")) {
            toggleSidebar.classList.toggle("open");
            sidebar.classList.toggle("display");
        }

        if (winContainer && winContainer.classList.contains("display")) {
            winContainer = document.querySelector(".win-container");
            winScreen = document.querySelector(".win-screen");
            hideVictoryScreenEvent();
        }

        start.innerText = "Stop ?";
        start.addEventListener("click", stopGameEvent, { once: true });

        /**
         * Interval for changing winnable cell change
         * @type {number}
         */
        intervalChangeCell = setInterval(function () {

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

        clearInterval(intervalChangeCell);
        clearTimeout(timeoutActiveCell);

    }

    /**
     * Function for the click event in the cell winnable
     * @param event
     */
    function makeWinnableEvent(event) {
        event.preventDefault();

        let clickedCellId = cell.id,
            isWon = false;

        xhr.open("GET", "?ajax=true&cell=isWinner&cellId=" + encodeURIComponent(clickedCellId));

        xhr.onload = checkIfWinResponse;

        xhr.send();

    }

    /**
     * Remove all win cells
     */
    function cleanGrid() {
        wonCell = document.querySelector(".win");
        if (wonCell) {
            wonCell.classList.remove("win");
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

                // Add click event to make the cell winnable
                cell.addEventListener("mousedown", makeWinnableEvent);

                // Timeout to disable winnable cell
                timeoutActiveCell = setTimeout(function () {
                    cell.removeEventListener("mousedown", makeWinnableEvent);
                    cell.classList.remove('active');
                    clearTimeout(timeoutActiveCell);
                }, timeActive);

            }
            else {
                alert('Une erreur est survenu, sorry.');
                clearInterval(intervalChangeCell);
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

                if (response.success) {

                    // Set win screen variables
                    winContainer = document.querySelector(".win-container");
                    winScreen = document.querySelector(".win-screen");
                    score = document.getElementById("light-appeared");
                    replay = document.getElementById("replay");
                    hideScoreTime = winContainer.dataset.animationTime;

                    cell.removeEventListener("mousedown", makeWinnableEvent);

                    // Change the stop button in replay button
                    start.innerText = "Replay ?";
                    start.removeEventListener("click", stopGameEvent);
                    start.addEventListener("click", startGameEvent, { once:true });

                    // Display win screen
                    winContainer.classList.add("forward");
                    winContainer.classList.add("display");
                    winScreen.classList.add("animate");

                    winContainer.addEventListener("click", hideVictoryScreenEvent, { once:true });

                    // Display how many times the light was appeared and make the replay button on win screen
                    canReplaying = true;
                    score.innerText = response.nbrAppeared;
                    replay.addEventListener("click", startGameEvent, { once:true });

                    // Show the winning cell
                    cell.classList.remove("active");
                    cell.classList.add("win");

                    clearInterval(intervalChangeCell);
                    clearTimeout(timeoutActiveCell);

                }

            }
            else {

                alert(response.error);

                clearInterval(intervalChangeCell);
                clearTimeout(timeoutActiveCell);
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

    function hideVictoryScreenEvent(event = null) {
        if (event) {
            event.preventDefault();
        }

        winScreen.classList.remove("animate");
        winContainer.classList.remove("display");

        timeoutWinContainer = setTimeout(function () {
            winContainer.classList.remove("forward");
            clearTimeout(timeoutWinContainer);
        }, hideScoreTime);

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

            grid.style.height = (gridContainer.clientWidth * ( 95 / 100 )) + "px";
            grid.style.width = (gridContainer.clientWidth * ( 95 / 100 )) + "px";

        }
        else {
            gridContainer.classList.remove("portrait");
            sidebar.classList.add("landscape");

            grid.style.width = (gridContainer.clientHeight * ( 95 / 100 )) + "px";
            grid.style.height = (gridContainer.clientHeight * ( 95 / 100 )) + "px";

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
        if (! canReplaying) {
            stopGameEvent(event);
        }
        else {
            event.preventDefault();
        }

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
        if (! canReplaying) {
            stopGameEvent(event);
        }
        else {
            event.preventDefault();
        }

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

        gridContainer.removeChild(grid);
        gridContainer.innerHTML += newGrid;
        grid = gridContainer.querySelector('.grid');

        difficulty = grid.dataset.difficulty;
        timeActive = grid.dataset.timeActive;
        gridSize = grid.dataset.gridSize;
        timeBetweenChange = parseInt(timeActive) + 1000;

        toggleOrientationEvent();

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