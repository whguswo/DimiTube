import * as fs from "fs";
import AWS, { AWSError } from "aws-sdk";
import * as dotenv from 'dotenv';
dotenv.config();
const bucket = 'dimitube-video';

AWS.config.update({
    accessKeyId: process.env.AK,
    secretAccessKey: process.env.SK,
    region: 'ap-northeast-2'
})

const s3: AWS.S3 = new AWS.S3({
    apiVersion: '2006-03-01'
});

const upload = async (videoId: string) => {
    fs.unlinkSync(`videos/${videoId}/${videoId}.mp4`)
    fs.readdir(`videos/${videoId}`, (error, list) => {
        for (let i = 0; i < list.length; i++) {

            const fileContent = fs.readFileSync(`videos/${videoId}/${list[i]}`);
            fs.unlinkSync(`videos/${videoId}/${list[i]}`)

            const params = {
                Bucket: bucket,
                Key: `${videoId}/${list[i]}`,
                Body: fileContent
            };

            s3.upload(params, (err: AWSError, data: AWS.S3.ManagedUpload.SendData) => {
                if (err) {
                    console.log(err);
                }
            });

        }
    })
}


const remove = (dir: string) => {
    let listParams = {
        Bucket: bucket,
        Prefix: `${dir}/`
    }
    s3.listObjects(listParams, (err, data) => {
        for (let i = 0; i < data.Contents.length; i++) {
            let params = {
                Bucket: bucket,
                Key: data.Contents[i].Key,
            }

            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log(err)
                }
            });
        }
    })

}

export { upload, remove }