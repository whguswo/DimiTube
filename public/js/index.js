const logoImg = document.querySelector("#logo-img");
const menu_div = document.querySelector("#menu-img_div");
const sidebar = document.querySelector("#side-bar");

let menuShow = false;

logoImg.addEventListener("click", () => {
    location.href = location.origin;
})

menu_div.addEventListener('click', () => {
    menu_div.className = 'clickEffect';
    menu_div.addEventListener('animationend', () => {
        menu_div.classList.remove('clickEffect');
    })
    if (!menuShow) {
        sidebar.style.width = "220px";
        menuShow = true;
    } else {
        sidebar.style.width = "80px";
        menuShow = false;
    }
})
