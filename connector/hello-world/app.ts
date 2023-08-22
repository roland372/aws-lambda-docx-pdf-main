import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TGeneratedObject } from './types';
import { bucketName } from './config';
import { invokeFiller, invokePdfMerger, invokeDocxMerger } from './utils';

//? connector -->  sam local start-api
//? filler -->  sam local start-lambda --host 0.0.0.0 --warm-containers LAZY
//? pdfMerger --> sam local start-lambda --host 0.0.0.0 --port 3002
//? docxMerger --> sam local start-lambda --host 0.0.0.0 --port 3003

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const { template }: TGeneratedObject = JSON.parse(event.body || '{}');
        const { templateBody, documents } = template;
        const fileExtension = documents[0].extension;
        const transactionsLength = documents[0].transactionIds.length;
        let mergeResult = '';

        const filledFiles: string[] = await Promise.all(
            documents.map(async (document) => await invokeFiller(templateBody, document)),
        );

        if (transactionsLength > 1) {
            mergeResult = await (fileExtension === '.pdf' ? invokePdfMerger : invokeDocxMerger)(
                filledFiles,
                bucketName,
            );
        } else {
            mergeResult = filledFiles.toString();
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                function: 'LambdaConnectorFunction',
                message: 'Files filed and merged successfully',
                fileName: mergeResult,
            }),
            headers: { 'content-type': 'application/json' },
        };
    } catch (err) {
        console.log('--- Lambda Connector Error: ' + err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: '--- Lambda Connector Error: <----- error' + err,
            }),
        };
    }
};
