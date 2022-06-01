const video = document.getElementById("video");
const video_innerContainer = document.getElementById("video-inner-container");
const videoTitle = document.getElementById("videoTitle");
const video_container = document.getElementById("video-container");
const otherVideo_container = document.getElementById("otherVideo-container");
const description = document.getElementById("description");
const userIcon = document.getElementById("user-icon");
const channelName = document.getElementById("channelName");
const watch_innerHeader = document.getElementById("watch-inner-header");
const player = videojs(video);
const videoId = location.search.replace("?v=", "");

window.addEventListener("load", async () => {
    resizing(true);
    player.src({
        src: `https://d18yz4nkgugxke.cloudfront.net/${videoId}/output.m3u8`,
        type: "application/x-mpegurl",
    });
    const result = await fetch(`/getVideoInfo/${videoId}`, {
        method: "GET",
    });
    let data = await result.text();
    let json = JSON.parse(data);
    console.log(json);
    videoTitle.innerHTML = json.videoTitle;
    userIcon.style.backgroundImage = `url('https://d18yz4nkgugxke.cloudfront.net/profiles/${
        json.channelId
    }.png?${new Date().getTime()}')`;
    userIcon.addEventListener("click", () => {
        location.href = `/channel/${json.channelId}`;
    });
    channelName.innerHTML = json.channelName;
    description.innerHTML = json.description;

    const jsonVideoList = json.videoList;
    for (let i = 0; i < jsonVideoList.length; i++) {
        let other_videoId = jsonVideoList[i].videoId;
        if(json.videoTitle === jsonVideoList[i].videoTitle) continue;
        let other_channelId = jsonVideoList[i].channelId;
        let div = document.createElement("div");
        div.innerHTML = `
        <div class="other_thumbnail" style="background-image: url('https://d18yz4nkgugxke.cloudfront.net/${other_videoId}/thumbnail.png')"></div>
        <div class="other_video-information">
            <div class="other_videoTitle">${jsonVideoList[i].videoTitle}</div>
            <a href="/channel/${other_channelId}">
                <div class="other_channel">${jsonVideoList[i].owner}</div>
            </a>
        </div>`
        div.addEventListener('click', ()=>{
            location.href = `/watch?v=${other_videoId}`
        })

        otherVideo_container.append(div)
    }
});

window.addEventListener("resize", () => {
    resizing();
});

const resizing = (e) => {
    if (window.innerWidth < 1820) {
        watch_innerHeader.style.marginLeft = "20px";
        watch_innerHeader.style.marginRight = "20px";
    } else {
        watch_innerHeader.style.marginLeft = "calc((100% - 1725px)/2)";
        watch_innerHeader.style.marginRight = "calc((100% - 1725px)/2)";
    }
    if (window.innerWidth < 1017) {
        watch_innerHeader.style.flexDirection = "column";
        video_container.style.width = "100%";
        otherVideo_container.style.width = "100%";
    } else {
        watch_innerHeader.style.flexDirection = "row";
        video_container.style.width = "72%";
        otherVideo_container.style.width = "28%";
    }
    let videoContainerWidth = video_innerContainer.clientWidth;
    if(e === true)
        video_innerContainer.style.height = `${(videoContainerWidth * 9) / 16 + 23}px`; // 16:9 비율 동적 변경
    else 
        video_innerContainer.style.height = `${(videoContainerWidth * 9) / 16}px`; // 16:9 비율 동적 변경
};
