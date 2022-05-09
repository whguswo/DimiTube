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
    }
})