import AWS from 'aws-sdk';

export const bucketName = '00bucket';

export const lambdaFiller = new AWS.Lambda({
    apiVersion: '2015-03-31',
    endpoint: 'http://172.17.0.1:3001',
    sslEnabled: false,
});

export const lambdaPdfMerger = new AWS.Lambda({
    apiVersion: '2015-03-31',
    endpoint: 'http://172.17.0.1:3002',
    sslEnabled: false,
});

export const lambdaDocxMerger = new AWS.Lambda({
    apiVersion: '2015-03-31',
    endpoint: 'http://172.17.0.1:3002',
    sslEnabled: false,
});
