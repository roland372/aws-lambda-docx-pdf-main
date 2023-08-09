export type TInput = {
	name: string;
	token: string;
	bucketName: string;
	inputDocxName: string;
	outputFile: string;
};

export type TInputObj = {
	args: TInput[];
	bucketName: string;
	outputPdfName: string;
};

export type TOutputConfig = {
	Key: string;
	Bucket: string;
	Body:
		| Buffer
		| {
				statusCode: number;
				body: string;
		  };
};

export type TDataFromRequest = {
	templateBody: string;
	document: TDocumentData;
	outputFile: string;
	bucketName: string;
};

export type TTemplate = {
	templateBody: string;
	externalLogId: string;
	documents: TDocumentData[];
};

export type TDocumentData = {
	userId: string;
	transactionIds: string[];
	transactionId: string;
	parentId: string;
	firstPublishLocationId: string;
	fileName: string;
	extension: string;
	encrypt: null;
	dataToFill: TDataToFill;
	attachAsFile: boolean;
	assemblyFill: boolean;
	uniqueId: string;
};

export type TDataToFill = {
	NAME: string;
	WEBSITE: string;
	PHONE: string;
	TYPE: string;
	INDUSTRY: string;
	NUMBEROFEMPLOYEES: string;
	ANNUALREVENUE: string;
	DateOfCreation: string;
	LatinProVerb: string;
	'c.TODAY': string;
	OWNERID__NAME: string;
	contacts: TContact[];
};

export type TContact = {
	MOBILEPHONE: string;
	LASTNAME: string;
	FIRSTNAME: string;
};
