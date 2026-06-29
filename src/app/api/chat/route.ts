import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  const abortController = new AbortController();

  try {
    const { messages } = await req.json();

    const response = await axios.post(
      process.env.NVIDIA_API_URL!,
      {
        model: 'google/gemma-4-31b-it',
        messages,
        max_tokens: 16384,
        temperature: 1.0,
        top_p: 0.95,
        stream: true,
        chat_template_kwargs: { enable_thinking: true },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          Accept: 'text/event-stream',
        },
        responseType: 'stream',
        signal: abortController.signal,
      }
    );

    const stream = new ReadableStream({
      async start(controller) {
        response.data.on('data', (chunk: Buffer) => {
          controller.enqueue(chunk);
        });
        response.data.on('end', () => {
          controller.close();
        });
        response.data.on('error', (err: Error) => {
          controller.error(err);
        });
      },
      cancel() {
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
    console.error('Error in chat API:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Failed to fetch from NVIDIA API' },
      { status: 500 }
    );
  }
}
