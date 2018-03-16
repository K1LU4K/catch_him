(function () {

    let toggleSidebarContainer = document.querySelector(".toggle-sidebar-container"),
        toggleSidebar = document.getElementById("toggle-sidebar"),
        sidebar = document.querySelector("." + toggleSidebar.dataset.toggle),
        gridContainer = document.querySelector(".grid-container");

    let startButton = document.getElementById("start-game");

    addMobileStyle();

    window.addEventListener("resize", addMobileStyle);

    function addMobileStyle() {
        if (mobileAndTabletcheck()) {

            window.addEventListener("deviceorientation", function () {

                if (window.innerHeight > window.innerWidth) {
                    gridContainer.classList.add("portrait");
                    sidebar.classList.remove("landscape");
                }
                else {
                    gridContainer.classList.remove("portrait");
                    sidebar.classList.add("landscape");
                }

            });

            sidebar.classList.add("mobile-browser");
            gridContainer.classList.add("mobile-browser");
            toggleSidebarContainer.classList.remove("computer");

            toggleSidebar.addEventListener("click", function (event) {
                event.preventDefault();
                toggleMenu();
            });

            startButton.addEventListener("click", function (event) {
                event.preventDefault();
                toggleMenu();
            }, { once: true });

        }
        else {
            sidebar.classList.remove("mobile-browser");
            gridContainer.classList.remove("mobile-browser");
            toggleSidebarContainer.classList.add("computer");
        }
    }

    function toggleMenu() {
        toggleSidebar.classList.toggle("open");
        sidebar.classList.toggle("display");
    }

})();