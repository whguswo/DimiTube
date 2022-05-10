const player = videojs('video');
const videoSource = document.querySelector('#videoSource')

videoSource.src = `https://d18yz4nkgugxke.cloudfront.net/${location.search.replace('?v=', '')}/output.m3u8`