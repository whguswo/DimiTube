const fileName = document.getElementById("fileName")
const fileInput = document.getElementById("fileInput")
const description = document.getElementById("description")
const uploadButton = document.getElementById("uploadButton")

uploadButton.addEventListener('click', async () => {
    if (fileName.value !== '' && fileInput.files[0]) {
        const result = await fetch(`${location.href}/upload?filename=${fileName.value}&description=${description.value.replaceAll("\n", "<br>")}`, {
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
            alert("영상변환이 완료되었습니다. 업로드까지 약 1분 소요됩니다.")
        }
    } else {
        alert("선택된 영상이 없습니다.")
    }
})