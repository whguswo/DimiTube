const fileName = document.querySelector('#fileName')
const fileInput = document.querySelector('#fileInput')
const uploadButton = document.querySelector("#uploadButton")

uploadButton.addEventListener('click', async () => {
    if (fileName.value !== '' && fileInput.files[0]) {
        const result = await fetch(`${location.href}?filename=${fileName.value.replaceAll('/', '')}`, {
            method: 'POST',
            body: fileInput.files[0],
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        })
        let data = await result.text()
        let json = JSON.parse(data)
        console.log(json)
        if (json.state == "success") {
            //서버에서 영상 변환이후 s3로 업로드 전 respond 함. 
            alert("영상변환이 완료되었습니다. 업로드까지 최대 1분이 소요됩니다.")
        }
    }
})