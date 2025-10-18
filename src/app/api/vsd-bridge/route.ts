
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const internalApiKey = process.env.INTERNAL_API_KEY;

  if (!internalApiKey) {
    console.error('INTERNAL_API_KEY is not set in environment variables.');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // The target endpoint for the VSD Network API
  const vsdApiUrl = 'http://localhost:9002/api/transactions';

  try {
    // Get the JSON body from the incoming frontend request
    const requestBody = await request.json();

    // Forward the request to the VSD Network API using axios
    const response = await axios.post(vsdApiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        // Securely add the internal API key as a Bearer token
        'Authorization': `Bearer ${internalApiKey}`,
      },
    });

    // Return the response from the VSD Network API back to the frontend
    return NextResponse.json(response.data, { status: response.status });

  } catch (error) {
    // Handle errors from the axios request
    if (axios.isAxiosError(error)) {
      console.error('Error forwarding request to VSD Network:', error.response?.data);
      return NextResponse.json(
        { error: error.response?.data?.error || 'Failed to connect to VSD Network' },
        { status: error.response?.status || 500 }
      );
    }

    // Handle other unexpected errors
    console.error('Unexpected error in API bridge:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
