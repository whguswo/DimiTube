window.addEventListener('load', async () => {
    const channelTitle = document.querySelector('#channelTitle')
    let name = location.pathname
    name = name.replace('/channel/', '')
    const result = await fetch(`/channel/${name}`, {
        method: "POST",
    })
    let data = await result.text()
    data = JSON.parse(data)
    console.log(data)
    channelTitle.innerHTML = data.channelName
    document.title = data.channelName
    if (data.isOwner) {
        let upload = document.createElement('button')
        upload.innerHTML = '업로드'
        upload.addEventListener("click", () => {
            location.href += '/upload'
        })
        document.body.append(upload)
    }
})

