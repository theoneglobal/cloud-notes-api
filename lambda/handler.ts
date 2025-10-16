import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, DB_NAME = 'cloudnotes', COLLECTION_NAME = 'notes' } = process.env;

if (!MONGO_URI) {
  throw new Error('Missing MONGO_URI in environment variables');
}

const client = new MongoClient(MONGO_URI);

type Note = {
  title: string;
  content: string;
};

export const handler = async (
  event: APIGatewayProxyEvent,
  _context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const notes = db.collection<Note>(COLLECTION_NAME);

    switch (event.httpMethod) {
      case 'POST': {
        let note: Note;
        try {
          note = JSON.parse(event.body || '{}') as Note;
        } catch {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON in request body' }),
          };
        }

        await notes.insertOne(note);
        return {
          statusCode: 201,
          body: JSON.stringify({ message: 'Note created' }),
        };
      }

      case 'GET': {
        const allNotes = await notes.find().toArray();
        return {
          statusCode: 200,
          body: JSON.stringify(allNotes),
        };
      }

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: message }),
    };
  } finally {
    await client.close();
  }
};
