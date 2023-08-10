import { bucketName, lambdaFiller, lambdaMerger } from '../config';
import { TDocumentData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const invokeFiller = async (templateBody: string, document: TDocumentData) => {
    const outputFile = uuidv4();

    const params = {
        FunctionName: 'LambdaFillerFunction',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ templateBody, document, outputFile, bucketName }),
    };

    const data = await lambdaFiller.invoke(params).promise();
    const payloadString = data.Payload ? data.Payload.toString() : '';
    const response = JSON.parse(payloadString);
    const convertedFile = JSON.parse(response.body).fileName;

    return convertedFile;
};

export const invokeMerger = async (convertedFiles: string[], bucketName: string) => {
    const outputFile = uuidv4();
    const dataToSendToMerger = {
        args: [`--files=${[...convertedFiles]}`, `--bucket=${bucketName}`, `--filename=${outputFile}.pdf`],
    };

    const params = {
        FunctionName: 'PdfMergerFunction',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(dataToSendToMerger),
    };

    await lambdaMerger
        .invoke(params, function (err, data) {
            if (err) console.log(err);
            else console.log(`<----- Data sent successfully ${data} ----->`);
        })
        .promise();
};
