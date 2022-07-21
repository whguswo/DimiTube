const videoTitle = document.querySelector("#video-title")
const videoDesc = document.querySelector("#video-description")
const submit = document.querySelector("#submit")
let videoId

window.addEventListener("load", async () => {
    videoId = location.pathname.replace("/video/", "")
    const result = await fetch(`/getVideoInfo/${videoId}`)
    let data = await result.text();
    let json = JSON.parse(data);
    console.log(json)

    // 영상 정보 넣어주기(처음만)
    videoTitle.value = json.videoTitle
    videoDesc.value = json.description.replaceAll("<br>", '\n').replaceAll("&nbsp;", " ")
})

submit.addEventListener("click", async () => {
    const result = await fetch(`/video/${videoId}`, {
        method: "POST",
        body: JSON.stringify({
            videoTitle: videoTitle.value,
            videoDesc: videoDesc.value,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
})