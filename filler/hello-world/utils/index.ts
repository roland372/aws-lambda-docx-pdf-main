import { TDataToFill, TDocumentData, TOutputConfig } from '../types';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { canBeConvertedToPDF, convertTo } from '@shelf/aws-lambda-libreoffice';
import * as fs from 'fs/promises';
import { S3Client } from '../config';

export const validateInput = (
	document: TDocumentData,
	templateBody: string,
	outputFile: string,
	bucketName: string
) => {
	if (!document || !templateBody || !outputFile || !bucketName) {
		return {
			statusCode: 400,
			body: JSON.stringify({
				message:
					"Can't convert file to PDF. Missing input or output file names.",
			}),
		};
	}
};

export const fillDocxFile = (templateBody: string, dataToFill: TDataToFill) => {
	const zip = new PizZip(Buffer.from(templateBody, 'base64'));
	const doc = new Docxtemplater(zip, {
		delimiters: {
			start: '{{',
			end: '}}',
		},
		paragraphLoop: true,
		linebreaks: true,
		nullGetter() {
			return '';
		},
	});

	doc.render({ ...dataToFill });

	const buf = doc.getZip().generate({
		type: 'nodebuffer',
		compression: 'DEFLATE',
	});

	return buf;
};

export const convertDocxToPdf = async (
	outputFile: string,
	outputFileWithExtension: string
) => {
	if (!canBeConvertedToPDF(`${outputFile}`)) {
		console.log("<----- Can't convert file to PDF ----->");
		return {
			statusCode: 400,
			body: JSON.stringify({
				message: "Can't convert file to PDF",
			}),
		};
	}

	await convertTo(`${outputFile}`, 'pdf');
	console.log('<----- File converted to PDF ----->');

	const outputPDF = await fs.readFile(`../../tmp/${outputFileWithExtension}`);

	return outputPDF;
};

export const putObjectInBucket = async (outputConfig: TOutputConfig) => {
	await S3Client.putObject(outputConfig)
		.promise()
		.then(() => {
			console.log('PDF file uploaded successfully.');
		})
		.catch(err => {
			console.log('err: ', err);
			throw err;
		});
};
