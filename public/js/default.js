import menuShow_fun from "./FORMENUBAR.js"

const logoImg = document.querySelector("#logo-img");
const menu_div = document.querySelector("#menu-img_div");
const sidebar = document.querySelector("#side-bar");
const user = document.querySelector("#user");
const user_inner = document.querySelector("#user-inner");
const logout = document.querySelector("#logout");
const setting = document.querySelector("#setting");
const searchbox = document.querySelector("#search");
const search_button = document.querySelector("#search-button");
const top_center = document.querySelector("#top-center_");
const backBtn = document.querySelector("#smallScreenVer_out");
const main = document.querySelector("#main");
const alert1 = document.querySelector("#alert1");

let menuShow = true;
if (!menuShow_fun()) menuShow = false;
let search_toggle = false;
let sidebarWidth = 220;

const search = (query) => {
    location.href = `/search?query=${query}`
}

const getCookieValue = (key) => {
    let cookieKey = key + "=";
    let result = "";
    const cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        if (cookieArr[i][0] === " ") {
            cookieArr[i] = cookieArr[i].substring(1);
        }

        if (cookieArr[i].indexOf(cookieKey) === 0) {
            result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
            return result;
        }
    }
    return result;
}

const deleteCookie = (name) => {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const menuShowTrue = (name) => {
    sidebarWidth = 220;
    sidebar.style.width = `${sidebarWidth}px`;
    main.style.marginLeft = `${sidebarWidth}px`;
    main.style.width = `calc(100% - ${sidebarWidth}px)`;
    alert1.style.display = "block";
    menuShow = true;
    menuShow_fun("true")
}

const menuShowFalse = (name) => {
    sidebarWidth = 50;
    sidebar.style.width = `${sidebarWidth}px`;
    main.style.marginLeft = `${sidebarWidth}px`;
    main.style.width = `calc(100% - ${sidebarWidth}px)`;
    alert1.style.display = "none";
    menuShow = false;
    menuShow_fun("false")
}

window.addEventListener('load', async () => {
    if (getCookieValue("openCloseBar") === true) {
        menuShowTrue("openCloseBar")
    } else if (getCookieValue("openCloseBar") === false) {
        menuShowFalse("openCloseBar")
    }
    let channelId = getCookieValue("ownChannelId");
    if (channelId) {
        user_inner.style.backgroundImage = `url('https://d18yz4nkgugxke.cloudfront.net/profiles/${channelId}.png')`
    }
})

logoImg.addEventListener("click", () => {
    location.href = location.origin;
})

window.addEventListener('resize', () => {
    if (window.innerWidth > 950) {
        search_toggle = false;
        searchbox.style.display = "block";
        searchbox.style.width = "530px";

        top_center.style.position = "relative";
        top_center.style.width = "100%";
        top_center.classList.remove("mobile_search");
        top_center.style.zIndex = "0";
        top_center.style.justifyContent = "center";

        backBtn.style.display = "none";
    } else {
        if (!search_toggle) {
            searchbox.style.display = "";
            top_center.style.justifyContent = "flex-end";
        }
    }
})

searchbox.addEventListener("focus", () => {
    searchbox.select();
})
searchbox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        search(searchbox.value)
    }
})

search_button.addEventListener("click", () => {
    if (searchbox.style.display === "" && window.innerWidth <= 950 && search_toggle === false) {
        search_toggle = true;
        searchbox.style.display = "block";
        searchbox.style.width = "calc(95% - 90px)";

        top_center.style.position = "absolute";
        top_center.style.width = "100vw";
        top_center.className = "mobile_search";
        top_center.style.zIndex = "10";
        top_center.style.justifyContent = "center";

        backBtn.style.display = "block";

        searchbox.focus()
    } else {
        search(searchbox.value)
    }
})

backBtn.addEventListener("click", () => {
    backBtn.style.display = "none";
    top_center.style.position = "relative";
    searchbox.style.display = "";
    top_center.classList.remove("mobile_search");
    top_center.style.width = "100%";
    top_center.style.zIndex = "0";
    top_center.style.justifyContent = "flex-end";
    search_toggle = false;
})

setting.addEventListener("click", () => {
    let finalValue = getCookieValue("ownChannelId");
    if (finalValue) {
        location.href = `/channel/${finalValue}/setting`;
    } else {
        alert("WARNING!!\n잘못된 접근입니다.");
    }
})

user.addEventListener("click", () => {
    let finalValue = getCookieValue("ownChannelId");
    // console.log(finalValue);
    if (finalValue) {
        location.href = `/channel/${finalValue}`;
    } else {
        alert("WARNING!!\n잘못된 접근입니다.");
    }
})

logout.addEventListener("click", () => {
    let logout_check = confirm("로그아웃 하시겠습니까?");
    if (!logout_check) {
        return false;
    }

    location.href = "/login";
})

menu_div.addEventListener('click', () => {
    menu_div.className = 'clickEffect';
    menu_div.addEventListener('animationend', () => {
        menu_div.classList.remove('clickEffect');
    })
    if (!menuShow) {
        menuShowTrue("openCloseBar")
    } else {
        menuShowFalse("openCloseBar")
    }
})