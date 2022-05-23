const channel_header = document.querySelector('#channel_header')
const tabs_innerContainer = document.querySelector('#tabs_inner-container')
const noVideo = document.querySelector('#noVideo')
const noVideo_container = document.querySelector('#noVideo_container')
const video_container = document.querySelector('#video_container')
const channel_profile = document.querySelector('#channel_profile')
const channelTitle = document.querySelector('#channelTitle')
const user_message = document.querySelector('#user_message')
const videoContents = document.querySelector('#videoContents')
const noVideoText = document.querySelector('#noVideoText')
const videoContents_container = document.querySelector("#videoContents_container")

window.addEventListener('load', async () => {
    let fst_resizingPadding_width = window.innerWidth
    resizingPadding(fst_resizingPadding_width)
    let name = location.pathname
    name = name.replace('/channel/', '')
    const result = await fetch(`/channel/${name}`, {
        method: "POST",
    })
    let data = await result.text()
    data = JSON.parse(data)
    console.log(data)
    let data_channelName = data.channelName
    channelTitle.innerHTML = data_channelName
    user_message.innerHTML = data.message
    // channel_profile.innerHTML = data_channelName.slice(0, 1).toUpperCase()
    channel_profile.style.backgroundImage = `url(https://d18yz4nkgugxke.cloudfront.net/profiles/${name}.png)`;
    document.title = data_channelName

    const ownerCheck = (isThereVideo) => {
        if (data.isOwner) {
            const channel_settingBox = document.querySelector('#channel_settingBox')
            let upload = document.createElement('button')
            let channelSetting = document.createElement('button')
            upload.append("동영상 업로드")
            channelSetting.append("채널 맞춤설정")
            upload.className = 'channel_btnStyle'
            channelSetting.className = 'channel_btnStyle'
            channelSetting.id = 'channel_settingBtn'

            upload.addEventListener("click", () => {
                location.href += '/upload'
            })
            channelSetting.addEventListener("click", () => {
                location.href += '/setting'
            })
            if (isThereVideo === "noVideo") {
                channel_settingBox.appendChild(channelSetting)
                channelSetting.style.marginRight = "0px"
                noVideo_container.style.display = "flex"
                video_container.style.display = "none"
                noVideo.appendChild(upload)
            } else if (isThereVideo === "yesVideo") {
                console.log("yesvideo")
                channel_settingBox.appendChild(channelSetting)
                channel_settingBox.appendChild(upload)
                channelSetting.style.marginRight = "20px"
                noVideo_container.style.display = "none"
                video_container.style.display = "flex"
            } else {
                alert("잘못된 요청입니다. F5")
                location.reload()
            }
        }
    }

    if (data.videoList.length === 0) {
        ownerCheck("noVideo")
    } else {
        for (let i = 0; i < data.videoList.length; i++) {
            let div = document.createElement('div')
            let videoId = data.videoList[i].videoId
            div.innerHTML = `
            <a href="/watch?v=${videoId}">
                <div class="thumbnail" style="background-image: url('https://d18yz4nkgugxke.cloudfront.net/${videoId}/thumbnail.png')"></div>
            </a>
            <div class="video-information">
                <div class="video-texts">
                    <h3 class="video-title">
                        <a href="/watch?v=${videoId}">
                            <div>${data.videoList[i].videoTitle}</div>
                        </a>
                    </h3>
                </div>
            </div>`

            videoContents.append(div)
        }
        ownerCheck("yesVideo")
    }
})

window.addEventListener("resize", () => {
    resizingPadding(window.innerWidth)
    if (window.innerHeight < 500) {
        // noVideo.style.marginTop = "0px"
        noVideoText.style.display = "none"
    } else {
        noVideo.style.marginTop = "10%"
        noVideoText.style.display = "block"
    }
})

const resizingPadding = (now_width) => {
    let resizingPadding_width = null;

    if (now_width > 1385) {
        resizingPadding_width = 1284;
    } else if (now_width > 1170) {
        resizingPadding_width = 1070;
    } else if (now_width > 970) {
        resizingPadding_width = 856;
    } else if (now_width > 685) {
        resizingPadding_width = 642;
    }

    channel_header.style.paddingRight = `calc((100% - ${resizingPadding_width}px)/2)`
    channel_header.style.paddingLeft = `calc((100% - ${resizingPadding_width}px)/2)`
    tabs_innerContainer.style.paddingLeft = `calc((100% - ${resizingPadding_width}px)/2)`
    tabs_innerContainer.style.paddingRight = `calc((100% - ${resizingPadding_width}px)/2)`
    videoContents_container.style.paddingLeft = `calc((100% - ${resizingPadding_width}px)/2)`
    videoContents_container.style.paddingRight = `calc((100% - ${resizingPadding_width}px)/2)`
}

// {/* <img src="https://d18yz4nkgugxke.cloudfront.net/0e124dad-3897-486c-a207-65ca04acc5a9/thumbnail.png" alt=""> */ }
