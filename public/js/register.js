const id = document.querySelector("#id")
const password = document.querySelector("#password")
const email = document.querySelector("#email")
const submit = document.querySelector("#submit")

const validateGmail = (email) => {
    let result = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return result.test(String(email).toLowerCase());
}

submit.addEventListener("click", async () => {
    signUp();
})

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        signUp();
    }
})

async function signUp() {
    console.log(JSON.stringify({
        id: id.value,
        pass: password.value,
        email: email.value
    }))
    // if (validateGmail(email.value)) {
    //     alert("Gmail 주소가 아닙니다. 이메일에 Gmail 주소를 입력했는지 확인해 주세요.\n(이메일 인증은 Gmail로만 가능합니다.)")
    //     return false;
    // }
    if (id.value == "" || password.value == "" || email.value == "") {
        alert("ID, PASSWORD, EMAIL를 올바르게 입력했는지 확인해 주세요.\n(이메일 인증은 Gmail로만 가능합니다.)")
        return false;
    }
    const result = await fetch('/register', {
        method: "POST",
        body: JSON.stringify({
            id: id.value,
            password: password.value,
            email: email.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await result.text();
}