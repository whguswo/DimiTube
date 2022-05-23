const video = document.querySelector("#video")
const videoTitle = document.querySelector("#videoTitle")
const description = document.querySelector("#description")
const userIcon = document.querySelector("#user-icon")
const channelName = document.querySelector("#channelName")
// const 
const player = videojs(video);
const videoId = location.search.replace('?v=', '')


window.addEventListener('load', async () => {
    player.src({
        src: `https://d18yz4nkgugxke.cloudfront.net/${videoId}/output.m3u8`,
        type: "application/x-mpegurl"
    })
    const result = await fetch(`/getVideoInfo/${videoId}`, {
        method: "GET",
    })
    let data = await result.text()
    let json = JSON.parse(data)
    console.log(json)
    videoTitle.innerHTML = json.videoTitle
    userIcon.style.backgroundImage = `url('https://d18yz4nkgugxke.cloudfront.net/profiles/${json.channelId}.png')`
    userIcon.addEventListener("click", () => {
        location.href = `/channel/${json.channelId}`
    })
    channelName.innerHTML = json.channelName
    description.innerHTML = json.description
})