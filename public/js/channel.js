const channel_header = document.querySelector('#channel_header')
const tabs_innerContainer = document.querySelector('#tabs_inner-container')
const noVideo = document.querySelector('#noVideo')

window.addEventListener('load', async () => {
    const channel_profile = document.querySelector('#channel_profile')
    const channelTitle = document.querySelector('#channelTitle')
    const videoContents = document.querySelector('#videoContents')
    let fst_resizingPaddingMargin_width = window.innerWidth
    let name = location.pathname
    name = name.replace('/channel/', '')
    const result = await fetch(`/channel/${name}`, {
        method: "POST",
    })
    let data = await result.text()
    data = JSON.parse(data)
    let data_channelName = data.channelName
    channelTitle.innerHTML = data_channelName
    channel_profile.innerHTML = data_channelName.slice(0, 1).toUpperCase()
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
                console.log("novideo")
                channel_settingBox.appendChild(channelSetting)
                channelSetting.style.marginRight = "0px"
                noVideo.style.display = "flex"
                noVideo.appendChild(upload)
            } else if (isThereVideo === "yesVideo") {
                channel_settingBox.appendChild(channelSetting)
                channel_settingBox.appendChild(upload)
                channelSetting.style.marginRight = "20px"
                noVideo.style.display = "none"
            } else {
                alert("잘못된 요청입니다. F5")
                location.reload()
            }
        }
    }

    if (data.videoList.length === 0) {
        ownerCheck("noVideo")
    } else {
        for (i = 0; i < data.videoList.length; i++) {
            let div = document.createElement('div')
            let videoId = data.videoList[i].videoId
            div.innerHTML = data.videoList[i].videoTitle
            div.addEventListener("click", () => {
                location.href = `/watch?v=${videoId}`
            })
            videoContents.append(div)
        }
        ownerCheck("yesVideo")
    }


    resizingPadding(fst_resizingPaddingMargin_width)
})

window.addEventListener("resize", () => {
    resizingPadding(window.innerWidth)
})

const resizingPadding = (now_width) => {
    let resizingPaddingMargin_width = null;

    if (now_width > 1385) {
        resizingPaddingMargin_width = 1284;
    } else if (now_width > 1170) {
        resizingPaddingMargin_width = 1070;
    } else if (now_width > 970) {
        resizingPaddingMargin_width = 856;
    } else if (now_width > 685) {
        resizingPaddingMargin_width = 642;
    }

    channel_header.style.paddingRight = `calc((100% - ${resizingPaddingMargin_width}px)/2)`
    channel_header.style.paddingLeft = `calc((100% - ${resizingPaddingMargin_width}px)/2)`
    tabs_innerContainer.style.marginLeft = `calc((100% - ${resizingPaddingMargin_width}px)/2)`
    tabs_innerContainer.style.marginRight = `calc((100% - ${resizingPaddingMargin_width}px)/2)`
}