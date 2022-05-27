const video = document.getElementById("video")
const videoTitle = document.getElementById("videoTitle")
const description = document.getElementById("description")
const userIcon = document.getElementById("user-icon")
const channelName = document.getElementById("channelName")
const watch_innerHeader = document.getElementById("watch-inner-header")
const player = videojs(video);
const videoId = location.search.replace('?v=', '')


window.addEventListener('load', async () => {
    resizing()
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
    userIcon.style.backgroundImage = `url('https://d18yz4nkgugxke.cloudfront.net/profiles/${json.channelId}.png?${new Date().getTime()}')`
    userIcon.addEventListener("click", () => {
        location.href = `/channel/${json.channelId}`
    })
    channelName.innerHTML = json.channelName
    description.innerHTML = json.description
})

window.addEventListener('resize', () => {
    resizing()
})

const resizing = () => {
    if (window.innerWidth < 1820) {
        watch_innerHeader.style.marginLeft = "20px";
        watch_innerHeader.style.marginRight = "20px";
    } else {
        watch_innerHeader.style.marginLeft = "calc((100% - 1725px)/2)";
        watch_innerHeader.style.marginRight = "calc((100% - 1725px)/2)";
    }
}