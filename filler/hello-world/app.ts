import * as fs from 'fs/promises';
import { APIGatewayProxyResult } from 'aws-lambda';
import { TDataFromRequest } from './types';
import {
	validateInput,
	fillDocxFile,
	convertDocxToPdf,
	putObjectInBucket,
} from './utils';

export const lambdaHandler = async (
	event: TDataFromRequest
): Promise<APIGatewayProxyResult> => {
	try {
		const { document, templateBody, outputFile, bucketName }: TDataFromRequest =
			event;
		const outputFileNameWithExtension = outputFile + document.extension;

		validateInput(document, templateBody, outputFile, bucketName);

		const buf = fillDocxFile(templateBody, document.dataToFill);
		await fs.writeFile(`../../tmp/${outputFile}`, buf);
		console.log(`<----- File filled and saved as ${outputFile} ----->`);

		//! PDF
		if (document.extension === '.pdf') {
			const outputPDF = await convertDocxToPdf(
				outputFile,
				outputFileNameWithExtension
			);
			const outputConfig = {
				Key: `${outputFileNameWithExtension}`,
				Bucket: bucketName,
				Body: outputPDF,
			};

			await putObjectInBucket(outputConfig);
		} else if (document.extension === '.docx') {
			//! DOCX
			const filledFile = await fs.readFile(
				`../../tmp/${outputFileNameWithExtension}`
			);

			const outputConfig = {
				Key: `${outputFileNameWithExtension}`,
				Bucket: bucketName,
				Body: filledFile,
			};

			await putObjectInBucket(outputConfig);
		}

		await fs.unlink(`../../tmp/${outputFileNameWithExtension}`);
		console.log('<----- file deleted from container. ----->');

		return {
			statusCode: 200,
			body: JSON.stringify({
				function: 'LambdaFillerFunction',
				message: `File converted and saved successfully, converted file: ${outputFileNameWithExtension}`,
				fileName: outputFileNameWithExtension,
			}),
			headers: { 'content-type': 'application/json' },
		};
	} catch (err) {
		console.log('<----- JAKI ERROR? ----->' + JSON.stringify(err));
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Internal Server Error',
			}),
		};
	}
};
