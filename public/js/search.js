window.addEventListener('load', async () => {
    const channelUl = document.querySelector("#channel-ul")
    const videoUl = document.querySelector("#video-ul")

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
    if (json.channels.length != 0) {
        for (let i = 0; i < json.channels.length; i++) {
            const li = document.createElement("li")
            li.innerHTML = json.channels[i].channelName
            li.addEventListener("click", () => {
                location.href = `/channel/${json.channels[i].channelId}`
            })
            channelUl.append(li)
        }
    } else {
        const li = document.createElement("li")
        li.innerHTML = "검색결과가 없습니다."
        channelUl.append(li)
    }
    if (json.videos.length != 0) {
        for (let j = 0; j < json.videos.length; j++) {
            const li = document.createElement("li")
            li.innerHTML = json.videos[j].videoTitle
            li.addEventListener("click", () => {
                location.href = `/watch?v=${json.videos[j].videoId}`
            })
            videoUl.append(li)
        }
    } else {
        const li = document.createElement("li")
        li.innerHTML = "검색결과가 없습니다."
        videoUl.append(li)
    }

    // else {
    //     console.log('Fail')
    //     const channelLi = document.createElement("li")
    //     channelLi.innerHTML = "검색결과가 없습니다."
    //     const videoLi = document.createElement("li")
    //     videoLi.innerHTML = "검색결과가 없습니다."
    //     channelUl.append(channelLi)
    //     videoUl.append(videoLi)
    // }
})