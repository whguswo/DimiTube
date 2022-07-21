const channel_header = document.getElementById("channel_header");
const tabs_innerContainer = document.getElementById("tabs_inner-container");
const noVideo = document.getElementById("noVideo");
const noVideo_container = document.getElementById("noVideo_container");
const video_container = document.getElementById("video_container");
const channel_profile = document.getElementById("channel_profile");
const channelTitle = document.getElementById("channelTitle");
const user_message = document.getElementById("user_message");
const videoContents = document.getElementById("videoContents");
const noVideoText = document.getElementById("noVideoText");
const upload_popup = document.getElementById("upload_popup");
const channel_settingBox = document.getElementById("channel_settingBox");
const mobile_bottom_menu = document.getElementById("mobile_bottom_menu");
const videoContents_container = document.getElementById(
	"videoContents_container"
);
const upload_popup_container = document.getElementById(
	"upload_popup_container"
);

window.addEventListener("load", async () => {
	let fst_resizingPadding_width = window.innerWidth;
	resizingPadding(fst_resizingPadding_width);
	let name = location.pathname;
	name = name.replace("/channel/", "");
	const result = await fetch(`/channel/${name}`, {
		method: "POST",
	});
	let data = await result.text();
	data = JSON.parse(data);
	console.log(data);
	let data_channelName = data.channelName;
	channelTitle.innerHTML = data_channelName;
	user_message.innerHTML = data.message;
	// channel_profile.innerHTML = data_channelName.slice(0, 1).toUpperCase()
	// channel_profile.style.backgroundImage = `url(https://d18yz4nkgugxke.cloudfront.net/profiles/${name}.png)`;
	channel_profile.style.backgroundImage = `url('https://d18yz4nkgugxke.cloudfront.net/profiles/${name}.png?${new Date().getTime()}')`;
	document.title = data_channelName;

	let channelId_mobile = data.channelId;
	mobile_bottom_menu.addEventListener("click", () => {
		location.href = `/channel/${channelId_mobile}/upload`;
	});

	const ownerCheck = (isThereVideo) => {
		if (data.isOwner) {
			let upload = document.createElement("button");
			let channelSetting = document.createElement("button");
			upload.append("동영상 업로드");
			channelSetting.append("채널 맞춤설정");
			upload.className = "channel_btnStyle";
			channelSetting.className = "channel_btnStyle";
			channelSetting.id = "channel_settingBtn";

			upload.addEventListener("click", () => {
				// location.href += '/upload'
				showPopup(false);
			});
			channelSetting.addEventListener("click", () => {
				location.href += "/setting";
			});
			if (isThereVideo === "noVideo") {
				channel_settingBox.appendChild(channelSetting);
				channelSetting.style.marginRight = "0px";
				noVideo_container.style.display = "flex";
				video_container.style.display = "none";
				noVideo.appendChild(upload);
			} else if (isThereVideo === "yesVideo") {
				channel_settingBox.appendChild(channelSetting);
				channel_settingBox.appendChild(upload);
				channelSetting.style.marginRight = "20px";
				noVideo_container.style.display = "none";
				video_container.style.display = "flex";
			} else {
				alert("잘못된 요청입니다. F5");
				location.reload();
			}
		}
	};

	if (data.videoList.length === 0) {
		ownerCheck("noVideo");
	} else {
		for (let i = 0; i < data.videoList.length; i++) {
			let div = document.createElement("div");
			let videoId = data.videoList[i].videoId;
			div.innerHTML = `
			<div class="thumbnail_hyperLink">
				<a href="/watch?v=${videoId}">
					<div class="thumbnail" style="background-image: url('https://d18yz4nkgugxke.cloudfront.net/${videoId}/thumbnail.png')"></div>
				</a>
			</div>
        <div class="video-information">
          <div class="video-texts">
            <h3 class="video-title">
              <a href="/watch?v=${videoId}">
                <div>${data.videoList[i].videoTitle}</div>
              </a>
            </h3>
          </div>
          <div class="video-views">조회수 ${data.videoList[i].views}회</div>
        </div>`;

			videoContents.append(div);
		}
		ownerCheck("yesVideo");
	}
});

window.addEventListener("resize", () => {
	resizingPadding(window.innerWidth);
	if (window.innerHeight < 500) {
		// noVideo.style.marginTop = "0px"
		noVideoText.style.display = "none";
	} else {
		noVideo.style.marginTop = "10%";
		noVideoText.style.display = "block";
	}
});

const resizingPadding = (now_width) => {
	let resizingPadding_width = null;
	if (now_width < 520) {
		channel_settingBox.style.display = "none";
		mobile_bottom_menu.style.zIndex = "100";
	} else {
		channel_settingBox.style.display = "flex";
		mobile_bottom_menu.style.zIndex = "-100";
	}

	if (now_width > 1385) {
		resizingPadding_width = 1284;
	} else if (now_width > 1170) {
		resizingPadding_width = 1070;
	} else if (now_width > 970) {
		resizingPadding_width = 856;
	} else if (now_width > 685) {
		resizingPadding_width = 642;
	}

	channel_header.style.paddingRight = `calc((100% - ${resizingPadding_width}px)/2)`;
	channel_header.style.paddingLeft = `calc((100% - ${resizingPadding_width}px)/2)`;
	tabs_innerContainer.style.paddingLeft = `calc((100% - ${resizingPadding_width}px)/2)`;
	tabs_innerContainer.style.paddingRight = `calc((100% - ${resizingPadding_width}px)/2)`;
	videoContents_container.style.paddingLeft = `calc((100% - ${resizingPadding_width}px)/2)`;
	videoContents_container.style.paddingRight = `calc((100% - ${resizingPadding_width}px)/2)`;
};

// =================================================== upload modal page =============================================================
let uploadPage_isMouseout = true;

upload_popup.addEventListener("mouseenter", () => {
	uploadPage_isMouseout = false;
});
upload_popup.addEventListener("mouseleave", () => {
	uploadPage_isMouseout = true;
});
upload_popup_container.addEventListener("click", () => {
	if (uploadPage_isMouseout) showPopup(true);
});
const showPopup = (val) => {
	if (val === true) {
		upload_popup_container.className = "popdown";
		upload_popup_container.addEventListener("animationend", () => {
			upload_popup_container.classList.remove("popdown");
			upload_popup_container.style.zIndex = "-100";
		});
	} else {
		upload_popup_container.style.zIndex = "100";
		upload_popup_container.className = "popup";
		upload_popup_container.addEventListener("animationend", () => {
			upload_popup_container.classList.remove("popup");
			upload_popup_container.style.zIndex = "100";
		});
	}
};
