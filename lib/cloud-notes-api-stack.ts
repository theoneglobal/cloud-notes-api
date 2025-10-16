import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';

export class CloudNotesApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const notesLambda = new lambda.Function(this, 'NotesHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      handler: 'handler.handler',
      environment: {
        MONGO_URI: process.env.MONGO_URI || '',
        DB_NAME: process.env.DB_NAME || 'cloudnotes',
        COLLECTION_NAME: process.env.COLLECTION_NAME || 'notes',
      },
    });

    new apigateway.LambdaRestApi(this, 'NotesApi', {
      handler: notesLambda,
    });
  }
}
