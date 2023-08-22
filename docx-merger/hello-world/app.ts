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
    outputFile: string;
};

export const lambdaHandler = async (event: TDataFromRequest): Promise<APIGatewayProxyResult> => {
    const { bucketName, filesToMerge, outputFile } = event;
    try {
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
                Key: outputFile,
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

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Files merged and saved successfully, output fileName: ${outputFile}`,
                fileName: outputFile,
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
