const id = document.querySelector("#id")
const password = document.querySelector("#password")
const submit = document.querySelector("#submit")

submit.addEventListener("click", signIn)

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        signIn();
    }
})

async function signIn() {
    const result = await fetch('/login', {
        method: "POST",
        body: JSON.stringify({
            id: id.value,
            password: password.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await result.text();
    if (data == "true") {
        window.location.href = location.origin;
    } else {
        alert("일치하는 유저정보가 없습니다.\n아이디나 비밀번호를 다시 확인해주세요.")
        id.value = ''
        password.value = ''
    }
}

//맞다 event.keyCode쓰지 마셈
//deprecated 됨! 그게먼데