const channelDiv = document.getElementById("channel-div")
const videoDiv = document.getElementById("video-div")

window.addEventListener('load', async () => {

    let query = location.search.replace('?query=', '')
    const search = await fetch('/search', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            query: query,
        })
    })
    let data = await search.text()
    let json = JSON.parse(data)
    let result = true;
    if (json.channels.length != 0) {
        for (let i = 0; i < json.channels.length; i++) {
            const div = document.createElement("div")
            div.innerHTML = json.channels[i].channelName
            div.className = 'hoverCursorPointer'
            div.addEventListener("click", () => {
                location.href = `/channel/${json.channels[i].channelId}`
            })
            channelDiv.append(div)
        }
        result = true
    } else {
        result = false
    }
    if (json.videos.length != 0) {
        for (let j = 0; j < json.videos.length; j++) {
            const div = document.createElement("div")
            div.innerHTML = json.videos[j].videoTitle
            div.className = 'hoverCursorPointer'
            div.addEventListener("click", () => {
                location.href = `/watch?v=${json.videos[j].videoId}`
            })
            videoDiv.append(div)
        }
        result = true
    } else if (result === false) {
        const div = document.createElement("div")
        div.innerHTML = "검색결과가 없습니다."
        videoDiv.append(div)
    }
})