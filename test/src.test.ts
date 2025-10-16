import { handler } from '../lambda/handler';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    close: jest.fn(),
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        insertOne: jest.fn(),
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([{ title: 'Test', content: 'Note' }]),
        }),
      }),
    }),
  })),
}));

describe('Cloud Notes API Lambda Handler', () => {
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

  const createEvent = (method: string, body?: object): APIGatewayProxyEvent => ({
    httpMethod: method,
    body: body ? JSON.stringify(body) : null,
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
      httpMethod: method,
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
  });

  it('should create a note with POST', async () => {
    const event = createEvent('POST', { title: 'Test', content: 'Note' });
    const result = await handler(event, context);
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({ message: 'Note created' });
  });

  it('should retrieve notes with GET', async () => {
    const event = createEvent('GET');
    const result = await handler(event, context);
    expect(result.statusCode).toBe(200);
    const notes = JSON.parse(result.body) as { title: string; content: string }[];
    expect(Array.isArray(notes)).toBe(true);
    expect(notes[0].title).toBe('Test');
    expect(notes[0].content).toBe('Note');
  });

  it('should return 405 for unsupported method', async () => {
    const event = createEvent('PUT');
    const result = await handler(event, context);
    expect(result.statusCode).toBe(405);
    expect(JSON.parse(result.body)).toEqual({ error: 'Method Not Allowed' });
  });

  it('should handle invalid JSON body', async () => {
    const event = createEvent('POST');
    event.body = '{invalid json}';
    const result = await handler(event, context);
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({ error: 'Invalid JSON in request body' });
  });

  it('should handle missing body on POST', async () => {
    const event = createEvent('POST');
    const result = await handler(event, context);
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({ message: 'Note created' });
  });
});
