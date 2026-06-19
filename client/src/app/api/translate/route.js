import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, source = 'en', target = 'es' } = await request.json();

    if (!text) {
      return NextResponse.json(
        {
          error: 'Text is required',
        },
        {
          status: 400,
        },
      );
    }

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text,
      )}&langpair=${source}|${target}`,
    );

    const data = await response.json();

    return NextResponse.json({
      translation: data.responseData?.translatedText || text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: 'Translation failed',
      },
      {
        status: 500,
      },
    );
  }
}
