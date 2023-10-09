const sharp = require('sharp')
const bmp = require("sharp-bmp")
const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");

const region = process.env.REGION;
const bucketName = process.env.BUCKET_NAME;

const client = new S3Client({ region });

const allowedInputMime = ['jpeg', 'jpg']

const handler = async (event) => {
    const key = event.Records[0].s3.object.key;
    const [name, mime] = key.split('.');
    if (!allowedInputMime.includes(mime)) {
        return { statusCode: 400, body: 'Bad request' }
    }

    const response = await client.send(new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    }));
    const object = Buffer.concat(await response.Body.toArray())
    const image = await sharp(object);
    const { data, info } = await image.toBuffer({ resolveWithObject: true })

    const res = await Promise.all([
        client.send(new PutObjectCommand({
            Body: await image.png().toBuffer(),
            ContentType: 'image/png',
            Bucket: bucketName,
            Key: `${name}/${name}.png`,
        })),
        client.send(new PutObjectCommand({
            Body: await image.gif().toBuffer(),
            ContentType: 'image/gif',
            Bucket: bucketName,
            Key: `${name}/${name}.gif`,
        })),
        client.send(new PutObjectCommand({
            Body: bmp.encode({ data: data, width: info.width, height: info.height }).data,
            ContentType: 'image/bmp',
            Bucket: bucketName,
            Key: `${name}/${name}.bmp`,
        })),
    ]);

    console.log(res);

    return { statusCode: 200, body: 'Hello from Lambda' }
}

module.exports = { handler }
