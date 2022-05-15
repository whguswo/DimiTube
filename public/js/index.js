const video_container = document.querySelector('#video_container')
const videoContents = document.querySelector('#videoContents')

window.addEventListener('load', async () => {
    const result = await fetch('/recent', {
        method: "GET",
    })
    let data = await result.text()
    let json = JSON.parse(data)
    console.log(json)

    for (i = 0; i < json.recentVideoList.length; i++) {
        let div = document.createElement('div')
        let videoId = json.recentVideoList[i].videoId
        div.innerHTML = `<img class="thumbnail" src="https://d18yz4nkgugxke.cloudfront.net/${videoId}/thumbnail.png">${json.recentVideoList[i].videoTitle}`
        div.addEventListener("click", () => {
            location.href = `/watch?v=${videoId}`
        })
        videoContents.append(div)
    }
})
