const logoImg = document.querySelector("#logo-img");
const menu_div = document.querySelector("#menu-img_div");
const sidebar = document.querySelector("#side-bar");
const user = document.querySelector("#user");
const logout = document.querySelector("#logout");

let menuShow = false;

logoImg.addEventListener("click", () => {
    location.href = location.origin;
})

user.addEventListener("click", () => {
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
    let deleteCookie = (name) => {
        document.cookie = name + '=;';
    }
    deleteCookie('ownChannelId');
    deleteCookie('id');
    deleteCookie('sessionHash');
    location.href = "/login";
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
        sidebar.style.width = "50px";
        menuShow = false;
    }
})

// window.addEventListener('resize', () => {
//     if(window.outerWidth)
// })