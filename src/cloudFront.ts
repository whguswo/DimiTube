import AWS, { AWSError } from "aws-sdk";
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
const random = uuidv4()

dotenv.config();

AWS.config.update({
    accessKeyId: process.env.AK,
    secretAccessKey: process.env.SK,
    region: 'ap-northeast-2'
})

const cloudfront = new AWS.CloudFront();

const updateCloud = () => {
    const params = {
        DistributionId: 'E37HOI5Q4WD1N3',
        InvalidationBatch: {
            CallerReference: random,
            Paths: {
                Quantity: 1,
                Items: [
                    '/profiles/*',
                ]
            }
        }
    };

    cloudfront.createInvalidation(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log(data);
    });
}

export { updateCloud }