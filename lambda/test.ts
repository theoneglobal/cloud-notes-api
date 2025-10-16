import { handler } from './handler';
import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

const mockEvent: APIGatewayProxyEvent = {
  httpMethod: 'POST',
  body: JSON.stringify({ title: 'Test Note', content: 'Hello from local simulation' }),
  headers: {},
  multiValueHeaders: {},
  isBase64Encoded: false,
  path: '/',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: '',
    apiId: '',
    httpMethod: 'POST',
    identity: {
      accessKey: '',
      accountId: '',
      apiKey: '',
      apiKeyId: '',
      caller: '',
      clientCert: null,
      cognitoAuthenticationProvider: '',
      cognitoAuthenticationType: '',
      cognitoIdentityId: '',
      cognitoIdentityPoolId: '',
      principalOrgId: '',
      sourceIp: '',
      user: '',
      userAgent: '',
      userArn: '',
    },
    path: '/',
    requestId: '',
    stage: '',
    requestTimeEpoch: 0,
    resourceId: '',
    resourcePath: '/',
    protocol: 'HTTP/1.1',
    authorizer: {},
  },
  resource: '/',
};

const context: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'testFunction',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:test',
  memoryLimitInMB: '128',
  awsRequestId: 'test-request-id',
  logGroupName: '/aws/lambda/testFunction',
  logStreamName: 'test-log-stream',
  getRemainingTimeInMillis: () => 3000,
  done: () => {},
  fail: () => {},
  succeed: () => {},
};

const run = async (): Promise<void> => {
  try {
    const response: APIGatewayProxyResult = await handler(mockEvent, context);
    process.stdout.write(`Lambda response:\n${JSON.stringify(response, null, 2)}\n`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    process.stderr.write(`Error invoking Lambda handler:\n${errorMessage}\n`);
  }
};

void run();
