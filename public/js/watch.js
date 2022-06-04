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
const writeAComment = document.getElementById("writeAComment")
const comments = document.getElementById("comments")
const comments_userProfile = document.getElementById("comments_userProfile")
const commentButton = document.getElementById("comment_button")
const menu_div = document.querySelector("#menu-img_div");
const mask = document.querySelector("#mask")
let menuShow = false

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
    userIcon.style.backgroundImage = `url('https://d18yz4nkgugxke.cloudfront.net/profiles/${json.channelId
        }.png?${new Date().getTime()}')`;
    userIcon.addEventListener("click", () => {
        location.href = `/channel/${json.channelId}`;
    });
    channelName.innerHTML = json.channelName;
    description.innerHTML = json.description;

    const jsonVideoList = json.videoList;
    for (let i = 0; i < jsonVideoList.length; i++) {
        let other_videoId = jsonVideoList[i].videoId;
        if (json.videoTitle === jsonVideoList[i].videoTitle) continue;
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
        div.addEventListener('click', () => {
            location.href = `/watch?v=${other_videoId}`
        })

        otherVideo_container.append(div)
    }
    //comments => 댓글, views => 조회수

    comments_userProfile.style.backgroundImage = `url('https://d18yz4nkgugxke.cloudfront.net/profiles/${json.channelId}.png?${new Date().getTime()}')`

    writeAComment.addEventListener('keydown', () => {
        writeAComment.style.height = '0px'
        writeAComment.style.height = (writeAComment.scrollHeight) + 'px'
    })
    writeAComment.addEventListener('focusout', () => {
        writeAComment.style.height = '0px'
        writeAComment.style.height = (writeAComment.scrollHeight) + 'px'
    })

    let jsonComment = json.comments
    for (let i = 0; i < jsonComment.length; i++) {
        let div = document.createElement('div')
        div.innerHTML = `
        <div>
            <div id="comment_userInf" style="display: flex;">
                <div>
                    <a href="/channel/${jsonComment[i].channelId}">
                        <div class="comment_profile" style="background-image: url('https://d18yz4nkgugxke.cloudfront.net/profiles/${jsonComment[i].channelId}.png?${new Date().getTime()}')"></div>
                    </a>
                </div>
                <div>
                    <div id="comment_channelName">${jsonComment[i].channelName}</div>
                    <div>${jsonComment[i].comment}</div>
                </div>
            </div>
        </div>`

        comments.append(div)
    }
});

window.addEventListener("resize", () => {
    resizing();
});

commentButton.addEventListener("click", async () => {
    const result = await fetch(`/comment`, {
        method: "post",
        body: JSON.stringify({
            "videoId": videoId,
            "comment": writeAComment.value.replaceAll("\n", "<br>")
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    let data = await result.text();
    console.log(data)
})

menu_div.addEventListener('click', () => {
    if (!menuShow) {
        menuShow = true
        mask.style.display = 'block'
    } else {
        menuShow = false
        mask.style.display = 'none'
    }
})

//↓↓ 무조건 모바일 환경 html만들기 ↓↓

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
    if (window.innerWidth < 435) {
        video_innerContainer.style.position = "fixed"
        video_innerContainer.style.top = "50px"
        video_innerContainer.style.left = "0"
        let nowVideoHeight = video_innerContainer.clientWidth / 16 * 9
        watch_innerHeader.style.marginTop = `${nowVideoHeight}px`
    } else {
        video_innerContainer.style.position = "relative"
        video_innerContainer.style.top = "0"
        video_innerContainer.style.left = "0"
        watch_innerHeader.style.marginTop = "0"
    }
    let videoContainerWidth = video_innerContainer.clientWidth;
    if (e === true && window.innerWidth < 1920) video_innerContainer.style.height = `${(videoContainerWidth * 9) / 16 + 20}px`; // 16:9 비율 동적 변경
    else video_innerContainer.style.height = `${(videoContainerWidth * 9) / 16}px`;
};
