import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { upload } from './s3Bucket'
import { Response } from 'express';

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const convert = (videoId: string, res: Response) => {
    ffmpeg(`videos/${videoId}/${videoId}.mp4`)
        .screenshots({
            count: 1,
            filename: 'thumbnail.png',
            folder: `videos/${videoId}`,
            size: '640x360'
        });
    ffmpeg(`videos/${videoId}/${videoId}.mp4`, { timeout: 43200 }).addOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls'
    ]).output(`videos/${videoId}/output.m3u8`).on('end', async () => {
        upload(videoId)
        res.send({ state: "success" })
    }).run()

}

export { convert }