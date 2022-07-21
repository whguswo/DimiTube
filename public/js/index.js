const video_container = document.getElementById("video_container");
const videoContents = document.getElementById("videoContents");
const videoContents_container = document.getElementById(
	"videoContents_container"
);

window.addEventListener("load", async () => {
	const result = await fetch("/getVideo", {
		method: "GET",
	});
	let data = await result.text();
	let json = JSON.parse(data);
	console.log(json);

	for (let i = 0; i < json.recentVideoList.length; i++) {
		let div = document.createElement("div");
		let videoId = json.recentVideoList[i].videoId;
		let channelId = json.recentVideoList[i].channelId;
		div.innerHTML = `
		<div class="thumbnail_hyperLink">
			<a href="/watch?v=${videoId}">
				<div class="thumbnail" style="background-image: url('https://d18yz4nkgugxke.cloudfront.net/${videoId}/thumbnail.png')"></div>
			</a>
		</div>
    <div class="video-information">
      <div class="video-profile-container">
        <a href="/channel/${channelId}">
          <div class="video-profile" style="background-image: url('https://d18yz4nkgugxke.cloudfront.net/profiles/${channelId}.png')"></div>
        </a>
      </div>
      <div class="video-texts">
        <h3 class="video-title">
            <a href="/watch?v=${videoId}">
                <div>${json.recentVideoList[i].videoTitle}</div>
            </a>
        </h3>
        <a href="/channel/${channelId}" class="video-channel">${json.recentVideoList[i].owner}</a>
        <div class="video-views">조회수 ${json.recentVideoList[i].views}회</div>
      </div>
    </div>`;

		videoContents.append(div);
	}
	// for(let j = 0; j < json.)
});

window.addEventListener("resize", () => {
	if (window.innerWidth < 435) {
		videoContents_container.style.padding = "0 20px";
	} else {
		videoContents_container.style.padding = "20px";
	}
});
