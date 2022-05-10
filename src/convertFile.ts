import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { upload } from './upload'
import { addVideoList } from './connectDB'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

const convert = (videoId: string) => {
    ffmpeg(`videos/${videoId}/${videoId}.mp4`, { timeout: 43200 }).addOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls'
    ]).output(`videos/${videoId}/output.m3u8`).on('end', async () => {
        upload(videoId)
    }).run()
}

export { convert }