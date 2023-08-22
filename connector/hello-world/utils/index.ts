import { bucketName, lambdaFiller, lambdaPdfMerger, lambdaDocxMerger } from '../config';
import { TDocumentData } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const invokeFiller = async (templateBody: string, document: TDocumentData) => {
    console.log('--- Invoking Filler');

    const outputFile = document.transactionId;
    const params = {
        FunctionName: 'LambdaFillerFunction',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ templateBody, document, outputFile, bucketName }),
    };

    const data = await lambdaFiller.invoke(params).promise();
    const responsePayload = data.Payload?.toString() ?? '';
    const parsedResponse = JSON.parse(responsePayload);
    const { fileName } = JSON.parse(parsedResponse.body);
    console.log('---filledFileName ' + fileName);

    return fileName;
};

export const invokePdfMerger = async (filesToMerge: string[], bucketName: string) => {
    console.log('--- Invoking Pdf Merger');

    const outputFile = uuidv4();
    const dataToSendToMerger = {
        args: [`--files=${[...filesToMerge]}`, `--bucket=${bucketName}`, `--filename=${outputFile}.pdf`],
    };

    const params = {
        FunctionName: 'PdfMergerFunction',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(dataToSendToMerger),
    };

    const response = await lambdaPdfMerger.invoke(params).promise();
    const responsePayload = response.Payload?.toString() ?? '{}';
    const parsedResponse = JSON.parse(responsePayload);
    const { fileName } = JSON.parse(parsedResponse.body);

    console.log('---mergedPdfFileName ' + fileName);
    return fileName;
};

export const invokeDocxMerger = async (filesToMerge: string[], bucketName: string) => {
    console.log('---Invoking Docx Merger');

    const outputFile = uuidv4() + '.docx';
    const dataToSendToMerger = {
        bucketName,
        filesToMerge,
        outputFile,
    };

    const params = {
        FunctionName: 'DocxMergerFunction',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(dataToSendToMerger),
    };

    const response = await lambdaDocxMerger.invoke(params).promise();
    const responsePayload = response.Payload?.toString() ?? '';
    const parsedResponse = JSON.parse(responsePayload);
    const { fileName } = JSON.parse(parsedResponse.body);

    console.log('---mergedDocxFileName ' + fileName);
    return fileName;
};
