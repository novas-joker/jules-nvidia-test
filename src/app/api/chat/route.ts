import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const abortController = new AbortController();

  try {
    // Validate environment variables
    const apiUrl = process.env.NVIDIA_API_URL;
    const apiKey = process.env.NVIDIA_API_KEY;

    if (!apiUrl) {
      console.error('Missing NVIDIA_API_URL environment variable');
      return NextResponse.json(
        { error: 'Server configuration error: missing API URL' },
        { status: 500 }
      );
    }

    if (!apiKey) {
      console.error('Missing NVIDIA_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error: missing API key' },
        { status: 500 }
      );
    }

    // Validate request body
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { messages } = body;

    // Validate messages parameter
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Invalid messages: must be a non-empty array' },
        { status: 400 }
      );
    }

    console.log('Making request to NVIDIA API:', apiUrl);
    console.log('Model: google/gemma-4-31b-it');
    console.log('Messages count:', messages.length);

    const response = await axios.post(
      apiUrl,
      {
        model: 'google/diffusiongemma-26b-a4b-it',
        messages,
        max_tokens: 4096,
        temperature: 1.0,
        top_p: 0.95,
        stream: true,
        chat_template_kwargs: { enable_thinking: false },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: 'text/event-stream',
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
        signal: abortController.signal,
        timeout: 120000, // 120 second timeout
        maxRedirects: 5,
      }
    );

    console.log('Response received, status:', response.status);

    // Check if response has valid status
    if (response.status !== 200) {
      console.error(`NVIDIA API returned status ${response.status}`);
      return NextResponse.json(
        { error: `NVIDIA API error: ${response.status}` },
        { status: 500 }
      );
    }

    let streamStarted = false;
    const stream = new ReadableStream({
      async start(controller) {
        streamStarted = true;
        response.data.on('data', (chunk: Buffer) => {
          try {
            controller.enqueue(chunk);
          } catch (err) {
            console.error('Error enqueueing chunk:', err);
            controller.error(err);
          }
        });

        response.data.on('end', () => {
          controller.close();
        });

        response.data.on('error', (err: Error) => {
          console.error('Stream error:', err);
          try {
            controller.error(err);
          } catch (controllerErr) {
            console.error('Error closing stream:', controllerErr);
          }
        });
      },
      cancel() {
        console.log('Stream cancelled');
        abortController.abort();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Error in chat API:', {
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data,
      code: error.code,
      errno: error.errno,
    });

    // Handle specific error types
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('Timeout error - NVIDIA API took too long to respond');
      return NextResponse.json(
        { error: 'Request timeout: NVIDIA API took too long to respond. Try a simpler prompt.' },
        { status: 504 }
      );
    }

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      console.error('Connection error - cannot reach NVIDIA API');
      return NextResponse.json(
        { error: 'Connection error: Cannot reach NVIDIA API. Check API_URL and network.' },
        { status: 503 }
      );
    }

    if (error.response?.status === 401) {
      console.error('Authentication failed');
      return NextResponse.json(
        { error: 'Authentication failed: Invalid or expired API key' },
        { status: 401 }
      );
    }

    if (error.response?.status === 404) {
      console.error('Model or endpoint not found');
      return NextResponse.json(
        { error: 'Not found: Check if the model exists and API endpoint is correct' },
        { status: 404 }
      );
    }

    if (error.response?.status === 429) {
      console.error('Rate limited');
      return NextResponse.json(
        { error: 'Rate limited: Too many requests. Wait a moment and try again.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Failed to fetch from NVIDIA API: ${error.message}` },
      { status: 500 }
    );
  }
}
