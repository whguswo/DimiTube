// const ffmpeg = require('fluent-ffmpeg')
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg')
const fs = require('fs')

ffmpeg.setFfmpegPath(ffmpegInstaller.path)


// ffmpeg(`videos/${fileName}`, { timeout: 432000 }).addOptions([
//     '-profile:v baseline',
//     '-level 3.0',
//     '-start_number 0',
//     '-hls_time 10',
//     '-hls_list_size 0',
//     '-f hls'
// ]).output(`videos/${fileDir}/output.m3u8`).on('end', () => {
//     console.log('end');
// }).run()
const convert = (stream: Readable) => {
    ffmpeg().input(stream).addOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls'
    ]).output(`../test/output.m3u8`).on('end', (err) => {
        console.log('end');
    }).run()
}

export { convert }