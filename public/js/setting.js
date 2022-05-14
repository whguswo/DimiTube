const channelName = document.querySelector("#channelName");
const message = document.querySelector("#message");
const videoDiv = document.querySelector("#video-div");
const videoBtn = document.querySelector("#video-btn");
const btn = document.querySelector("#apply");
let checkArr = [];

(async () => {
    let req_url = location.pathname.replace('/setting', '')
    const result = await fetch(req_url, {
        method: "POST",
    })
    let data = await result.text()
    let json = JSON.parse(data)
    console.log(json)
    if (!json.isOwner) {
        alert("채널의 주인이 아닙니다.")
        window.history.back();
    }
    channelName.value = json.channelName
    message.value = json.message
    for (let i = 0; i < json.videoList.length; i++) {
        const div = document.createElement("div")
        const checkbox = document.createElement("input")
        checkbox.setAttribute("type", "checkbox")
        checkbox.setAttribute("value", json.videoList[i].videoId)
        checkbox.addEventListener("change", (e) => {
            if (e.target.checked) {
                checkArr.push(e.target.value)
            } else {
                for (let i = 0; i < checkArr.length; i++) {
                    if (checkArr[i] === e.target.value) {
                        checkArr.splice(i, 1);
                        break
                    }
                }
            }
        })
        div.append(checkbox)
        div.append(json.videoList[i].videoTitle)
        videoDiv.append(div)
    }
})();

const updateSetting = async (channelName, message) => {
    const result = await fetch(location.pathname, {
        method: "POST",
        body: JSON.stringify({
            channelName: channelName,
            message: message,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await result.text();
    let json = JSON.parse(data)
    if (json.state) {
        alert(json.message)
    }
}

const removeVideo = async (videoArr) => {
    let req_url = location.pathname.replace('/setting', '')
    const result = await fetch(`${req_url}/removeVideo`, {
        method: "POST",
        body: JSON.stringify({
            videoList: videoArr
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await result.text();
    let json = JSON.parse(data)
    if (json.state) {
        alert(json.message)
        location.reload()
    }
}

channelName.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && channelName.value != "") {
        updateSetting(channelName.value, message.value)
    }
})

btn.addEventListener("click", () => {
    if (channelName.value != "") {
        updateSetting(channelName.value, message.value)
    }
})

videoBtn.addEventListener("click", () => {
    removeVideo(checkArr)
})