export type TInput = {
    name: string;
    token: string;
    inputDocxName: string;
    outputFile: string;
};

export type TInputObj = {
    args: TInput[];
    bucketName: string;
    outputPdfName: string;
};

export type TDataToSend = {
    templateBody: string;
    documents: TDocumentData[];
};

export type TGeneratedObject = {
    template: TTemplate;
    organizationId: string;
    namespace: string;
    callbackEndpoint: string;
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
    outputFile: string;
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
