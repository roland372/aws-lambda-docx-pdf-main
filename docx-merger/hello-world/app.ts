import { APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';
// import DocxMerger from './docx-merger';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const DocxMerger = require('./docx-merger');

const S3Client = new S3({
    accessKeyId: 'Q3AM3UQ867SPQQA43P2F',
    secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
    endpoint: 'play.min.io',
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
    correctClockSkew: true,
});

type TDataFromRequest = {
    bucketName: string;
    filesToMerge: string[];
};

export const lambdaHandler = async (event: TDataFromRequest): Promise<APIGatewayProxyResult> => {
    const { bucketName, filesToMerge } = event;
    try {
        // const filesToMerge = ['file1', 'file2'];
        // const filesToMerge = event.filesToMerge;
        const downloadedFiles: Buffer[] = [];

        filesToMerge.map(async (el) => {
            const file = await S3Client.getObject({
                Key: el,
                Bucket: bucketName,
            }).promise();

            console.log('---file ' + el + ' downloaded');
            downloadedFiles.push(file.Body as Buffer);
        });

        const mergedDocx = new DocxMerger({}, [...downloadedFiles]);
        console.log('Files merged');

        mergedDocx.save('nodebuffer', async function (data: Buffer) {
            await S3Client.putObject({
                Key: 'merged.docx',
                Bucket: bucketName,
                Body: data,
            })
                .promise()
                .then(() => {
                    console.log('Merged DOCX file uploaded successfully.');
                })
                .catch((err) => {
                    console.log('putObject err: ' + JSON.stringify(err));
                    throw err;
                });
        });

        // const file1 = await S3Client.getObject({
        //     Key: 'input.docx',
        //     Bucket: bucketName,
        // }).promise();

        // const file2 = await S3Client.getObject({
        //     Key: 'input1.docx',
        //     Bucket: bucketName,
        // }).promise();

        // console.log(`<----- File downloaded ----->`);

        // const mergedDocx = new DocxMerger({}, [file1.Body, file2.Body]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Files merged and saved successfully',
            }),
        };
    } catch (err) {
        console.log('response err' + JSON.stringify(err));
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
