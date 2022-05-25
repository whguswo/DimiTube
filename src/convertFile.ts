import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { upload } from './s3Bucket'
import { Readable, Writable } from 'stream';

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const convert = async (videoId: string, stream: Readable) => {

    ffmpeg(stream, { timeout: 43200 }).addOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls'
    ]).output(`videos/${videoId}/output.m3u8`).on('end', async () => {
        ffmpeg(`videos/${videoId}/output.m3u8`)
            .screenshots({
                // count: 1,
                timestamps: ['01:30'],
                filename: 'thumbnail.png',
                folder: `videos/${videoId}/`,
                size: '640x360'
            }).on('end', () => {
                upload(videoId)
            })

    }).run();

}
export { convert }