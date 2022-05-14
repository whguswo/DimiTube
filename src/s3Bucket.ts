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

// const remove = async (dir: string) => {
//     const listParams = {
//         Bucket: bucket,
//         Prefix: dir
//     };

//     const listedObjects = await s3.listObjectsV2(listParams).promise();

//     const deleteParams = {
//         Bucket: bucket,
//         Delete: { Objects },
//     };

//     listedObjects.Contents.forEach(({ Key }) => {
//         deleteParams.Delete.Objects.push({ Key });
//     });

//     await s3.deleteObjects(deleteParams).promise();

//     if (listedObjects.IsTruncated) await remove(dir);
// }

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
    // let params = {
    //     Bucket: bucket,
    //     Key: `${dir}/thumbnail.png`,
    // };
    // s3.listObjectsV2
    // s3.deleteObject(params, (err, data) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log(`File removed successfully`);
    //     }
    // });
}

export { upload, remove }