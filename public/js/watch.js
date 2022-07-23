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
const writeAComment = document.getElementById("writeAComment");
const comments = document.getElementById("comments");
const tmp_comments = document.getElementById("tmp-comments");
const comments_userProfile = document.getElementById("comments_userProfile");
const comment_button_write = document.getElementById("comment_button_write");
const comment_button_cancel = document.getElementById("comment_button_cancel");
const comment_button_container = document.getElementById(
	"comment_button-container"
);
const menu_div = document.getElementById("menu-img_div");
const mask = document.getElementById("mask");
const number_of_comments = document.getElementById("number_of_comments");
const videoViews = document.getElementById("videoViews");
const sidebar = document.getElementById("side-bar");
let menuShow = false;
const main = document.getElementById("main");

const getCookieValue = (key) => {
	let cookieKey = key + "=";
	let result = "";
	const cookieArr = document.cookie.split(";");

	for (let i = 0; i < cookieArr.length; i++) {
		if (cookieArr[i][0] === " ") {
			cookieArr[i] = cookieArr[i].substring(1);
		}

		if (cookieArr[i].indexOf(cookieKey) === 0) {
			result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
			return result;
		}
	}
	return result;
};

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
	number_of_comments.innerHTML = `댓글 ${json.comments.length}개`;
	videoViews.innerHTML = `조회수 ${json.views}회`;
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
        <div class="other_views">조회수 ${jsonVideoList[i].views}회</div>
    </div>`;
		div.addEventListener("click", () => {
			location.href = `/watch?v=${other_videoId}`;
		});

		otherVideo_container.append(div);
	}

	//comments => 댓글, views => 조회수
	const nowChannelId = getCookieValue("ownChannelId");
	comments_userProfile.style.backgroundImage = `url('https://d18yz4nkgugxke.cloudfront.net/profiles/${nowChannelId}.png?${new Date().getTime()}')`;

	const writeACommentAddEventListener = () => {
		writeAComment.style.height = "0px";
		writeAComment.style.height = writeAComment.scrollHeight + "px";
		if (writeAComment.value.replaceAll(" ", "").replaceAll("\n", "") === "")
			comment_button_write.disabled = true;
		else comment_button_write.disabled = false;
	};
	writeAComment.addEventListener("keydown", writeACommentAddEventListener);
	writeAComment.addEventListener("keyup", writeACommentAddEventListener);
	writeAComment.addEventListener("focusout", writeACommentAddEventListener);
	writeAComment.addEventListener("focus", () => {
		comment_button_container.style.display = "flex";
	});

	let jsonComment = json.comments;
	for (let i = 0; i < jsonComment.length; i++) {
		let div = document.createElement("div");
		let isCommentOwner = "";
		if (jsonComment[i].channelName === json.channelName)
			isCommentOwner = "comment_channelName_owner";
		div.innerHTML = `
    <div>
      <div class="comment_userInf">
        <div>
          <a href="/channel/${jsonComment[i].channelId}">
            <div class="comment_profile" style="background-image: url('https://d18yz4nkgugxke.cloudfront.net/profiles/${
							jsonComment[i].channelId
						}.png?${new Date().getTime()}')"></div>
          </a>
        </div>
        <div>
          <span class="comment_channelName ${isCommentOwner}">${
			jsonComment[i].channelName
		}</span>
          <div class="comment" style="-webkit-line-clamp: 4;">${
						jsonComment[i].comment
					}</div>
					<span class="moreComment_btn" onclick="moreBtn_isClicked(this, this.previousSibling)">자세히 보기</span>
        </div>
      </div>
    </div>`;

		console.log();

		comments.append(div);
	}
	// const comment = document.getElementsByClassName("comment");
	// const moreComment_btn = document.getElementsByClassName("moreComment_btn");
	// console.log(comment.length);
	// for (let i = 0; i < comment.length; i++) {
	// 	console.log(comment[i].innerHTML);
	// }
	// 자세히 보기 btn 생성 유무 검사
	// 일단은 댓글 취약점 문제 해결 후 만들예정
	const description_countEnter = description.innerHTML
		.match(/<br>/g)
		.filter((item) => item !== "").length;
	if (description_countEnter > 3) {
		console.log("over");
	}
});

const moreBtn_isClicked = (val, comment) => {
	val.innerHTML === "자세히 보기"
		? ((val.innerHTML = "간략히"),
		  (comment.previousSibling.style.webkitLineClamp = ""))
		: ((val.innerHTML = "자세히 보기"),
		  (comment.previousSibling.style.webkitLineClamp = "4"));
};

const moreDescription_btn = document.getElementById("moreDescription_btn");
moreDescription_btn.addEventListener("click", () => {
	moreDescription_btn.innerHTML === "더보기"
		? ((moreDescription_btn.innerHTML = "간략히"),
		  (description.style.webkitLineClamp = ""))
		: ((moreDescription_btn.innerHTML = "더보기"),
		  (description.style.webkitLineClamp = "3"));
});

window.addEventListener("resize", () => {
	resizing();
});

comment_button_write.addEventListener("click", async () => {
	let ownChannelName = getCookieValue("ownChannelId");
	let id = getCookieValue("id");

	if (ownChannelName) {
		let tmpDiv = document.createElement("div");
		tmpDiv.innerHTML = `
    <div>
      <div class="comment_userInf" style="display: flex;">
        <div>
          <a href="/channel/${ownChannelName}">
            <div class="comment_profile" style="background-image: url('https://d18yz4nkgugxke.cloudfront.net/profiles/${ownChannelName}.png?${new Date().getTime()}')"></div>
          </a>
        </div>
        <div>
          <div class="comment_channelName">${id}</div>
            <div class="comment">${writeAComment.value
							.replaceAll("\n", "<br>")
							.replaceAll(" ", "&nbsp;")}
					</div>
        </div>
      </div>
    </div>`;

		tmp_comments.prepend(tmpDiv);
		comment_button_container.style.display = "none";
		comment_button_write.disabled = true;

		const writeACommentValueTrim = writeAComment.value.trim();
		writeAComment.value = "";
		writeAComment.style.height = "0px";
		writeAComment.style.height = writeAComment.scrollHeight + "px";

		const result = await fetch(`/comment`, {
			method: "post",
			body: JSON.stringify({
				videoId: videoId,
				comment: writeACommentValueTrim
					.replaceAll("\n", "<br>")
					.replaceAll(" ", "&nbsp;"),
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		let data = await result.text();
		console.log(data);
	} else {
		alert("WARNING!!\n잘못된 접근입니다.\n로그인이 되어있는지 확인해주십시오.");
	}
});

comment_button_cancel.addEventListener("click", () => {
	writeAComment.value = "";
	writeAComment.style.height = "0px";
	writeAComment.style.height = writeAComment.scrollHeight + "px";
	comment_button_write.disabled = true;
	comment_button_container.style.display = "none";
});

menu_div.addEventListener("click", () => {
	if (!menuShow) {
		menuShow = true;
		mask.style.display = "block";
	} else {
		menuShow = false;
		mask.style.display = "none";
	}
});

//↓↓ 무조건 모바일 환경 html만들기 (reactjs 사용예정) ↓↓

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
		main.style.margin = "auto";
		video_container.style.width = "100%";
		otherVideo_container.style.width = "100%";
	} else {
		watch_innerHeader.style.flexDirection = "row";
		main.style.marginLeft = "50px";
		video_container.style.width = "72%";
		otherVideo_container.style.width = "28%";
	}
	if (window.innerWidth < 435) {
		main.style.marginLeft = "0px";
		main.style.width = "100%";
		video_innerContainer.style.position = "fixed";
		video_innerContainer.style.top = "50px";
		watch_innerHeader.style.marginTop = `${
			(video_innerContainer.clientWidth * 50) / 100
		}px`;
		video_innerContainer.style.width = "100%";
	} else {
		main.style.width = "calc(100% - 25px)";
		video_innerContainer.style.position = "relative";
		video_innerContainer.style.top = "0";
		watch_innerHeader.style.marginTop = "0";
		video_innerContainer.style.width = "none";
	}
};

menu_div.addEventListener("click", () => {
	if (!sidebar.classList.contains("active")) {
		sidebar.style.width = "220px";
	} else {
		sidebar.style.width = "0px";
	}
});
