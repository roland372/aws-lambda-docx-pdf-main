import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TGeneratedObject } from './types';
import { bucketName } from './config';
import { invokeFiller, invokeMerger } from './utils';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { template }: TGeneratedObject = JSON.parse(event.body || '{}');
        const convertedFiles: string[] = [];

        //! sam local start-lambda --host 0.0.0.0
        for (const document of template.documents) {
            await invokeFiller(template.templateBody, document, convertedFiles);
        }

        //! sam local start-lambda --host 0.0.0.0 --port 3002
        await invokeMerger(convertedFiles, bucketName);

        return {
            statusCode: 200,
            body: JSON.stringify({
                function: 'LambdaConnectorFunction',
                message: 'Files converted and merged successfully',
            }),
            headers: { 'content-type': 'application/json' },
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};

// import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
// import AWS, { S3 } from 'aws-sdk';
// import { v4 as uuid } from 'uuid';
// import { TInput, TInputObj } from './types';

// //? Postman
// // {
// //     "args": [
// //         {
// //             "name": "name1",
// //             "token": "token1",
// //             "inputDocxName": "input1.docx"
// //         },
// //         {
// //             "name": "name2",
// //             "token": "token2",
// //             "inputDocxName": "input2.docx"
// //         }
// //     ],
// //     "bucketName": "00bucket",
// //     "outputPdfName": "output1.pdf"
// // }

// const S3Client = new S3({
//     accessKeyId: 'Q3AM3UQ867SPQQA43P2F',
//     secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
//     endpoint: 'play.min.io',
//     s3ForcePathStyle: true,
//     signatureVersion: 'v4',
//     correctClockSkew: true,
// });

// export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     try {
//         const { args, bucketName, outputPdfName }: TInputObj = JSON.parse(event.body || '{}');
//         const convertedFiles: string[] = [];
//         const dataToSendToFiller: TInput[] = args;
//         const dataToValidate: TInput[] = [];
//         const maxRetryAttempts = 3;

//         //! Filler
//         //? sam local start-lambda --host 0.0.0.0
//         //? sam local start-lambda --host 0.0.0.0 --warm-containers LAZY
//         const invokeFiller = async (el: TInput, outputFile: string) => {
//             const lambdaFiller = new AWS.Lambda({
//                 apiVersion: '2015-03-31',
//                 endpoint: 'http://172.17.0.1:3001',
//                 sslEnabled: false,
//             });

//             const params = {
//                 FunctionName: 'LambdaFillerFunction',
//                 InvocationType: 'RequestResponse',
//                 Payload: JSON.stringify({ ...el, bucketName, outputFile }),
//             };

//             lambdaFiller.invoke(params).send();
//         };

//         //! Merger
//         //? sam local start-lambda --host 0.0.0.0 --port 3002
//         const invokeMerger = async () => {
//             const lambdaMerger = new AWS.Lambda({
//                 apiVersion: '2015-03-31',
//                 endpoint: 'http://172.17.0.1:3002',
//                 sslEnabled: false,
//             });

//             const dataToSendToMerger = {
//                 args: [`--files=${[...convertedFiles]}`, `--bucket=${bucketName}`, `--filename=${outputPdfName}`],
//             };

//             const params = {
//                 FunctionName: 'PdfMergerFunction',
//                 InvocationType: 'RequestResponse',
//                 Payload: JSON.stringify(dataToSendToMerger),
//             };

//             await lambdaMerger
//                 .invoke(params, function (err, data) {
//                     if (err) console.log(err);
//                     else console.log(`<----- Data sent successfully ${data} ----->`);
//                 })
//                 .promise();
//         };

//         const getFilesFromBucket = async () => {
//             const listObjects = await S3Client.listObjects({ Bucket: bucketName }).promise();
//             return listObjects.Contents?.map((el) => el.Key) || [];
//         };

//         const validateAndInvoke = async () => {
//             const listObjectKeys = await getFilesFromBucket();
//             const allFilesExist = dataToValidate.every((file1) =>
//                 listObjectKeys.some((file2) => file2?.includes(file1.outputFile)),
//             );

//             if (allFilesExist) {
//                 console.log('--- All files exist');
//                 await invokeMerger();

//                 return true;
//             } else {
//                 console.log('--- Not all files exist');
//                 await getFilesFromBucket();

//                 return false;
//             }
//         };

//         const validateWithTimeout = async (timeout: number) => {
//             return new Promise<void>(async (resolve, reject) => {
//                 let retryAttempts = 0;

//                 const timeOut = setTimeout(() => {
//                     console.log('Max timeout, could not convert all files.');
//                     reject();
//                 }, timeout);

//                 const validationInterval = setInterval(async () => {
//                     retryAttempts++;

//                     if (await validateAndInvoke()) {
//                         clearInterval(validationInterval);
//                         clearTimeout(timeOut);
//                         resolve();
//                     } else if (retryAttempts >= maxRetryAttempts) {
//                         clearInterval(validationInterval);
//                         clearTimeout(timeOut);
//                         console.log('Max retries reached, cannot convert all files :(');
//                         reject();
//                     }
//                 }, 10000);
//             }).catch((err) => {
//                 console.log(err);
//             });
//         };

//         for (const el of dataToSendToFiller) {
//             const outputFile = uuid();
//             await invokeFiller(el, outputFile);

//             convertedFiles.push(outputFile + '.pdf');
//             dataToValidate.push({ ...el, outputFile: outputFile + '.pdf' });
//         }

//         await validateWithTimeout(30000);

//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 function: 'LambdaConnectorFunction',
//                 message: 'Files converted successfully',
//             }),
//             headers: { 'content-type': 'application/json' },
//         };
//     } catch (err) {
//         console.log(err);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({
//                 message: 'some error happened',
//             }),
//         };
//     }
// };
