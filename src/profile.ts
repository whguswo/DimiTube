import sharp from 'sharp';

const resizeImage = (channelId: string, fileBuffer: Buffer) => {
    sharp(fileBuffer)
        .resize({ width: 80, height: 80 })
        .toFile(`profile/${channelId}.png`, (err, info) => {
            console.log("success!")
        });
}

export { resizeImage }