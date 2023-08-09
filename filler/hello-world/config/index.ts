import { S3 } from 'aws-sdk';

export const S3Client = new S3({
	accessKeyId: 'Q3AM3UQ867SPQQA43P2F',
	secretAccessKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG',
	endpoint: 'play.min.io',
	s3ForcePathStyle: true,
	signatureVersion: 'v4',
	correctClockSkew: true,
});
