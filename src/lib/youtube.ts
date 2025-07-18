interface VideoMetadata {
  title: string
  thumbnail: string
  videoId: string
}

interface TranscriptResponse {
  transcript: string
  timestamps: Array<{ start: number; end: number; text: string }>
}

export function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

export async function fetchVideoMetadata(videoId: string): Promise<VideoMetadata> {
  // For demo purposes, using oEmbed API (in production, use YouTube Data API)
  const response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch video metadata')
  }
  
  const data = await response.json()
  return {
    title: data.title,
    thumbnail: data.thumbnail_url,
    videoId
  }
}

export async function fetchTranscript(videoId: string): Promise<TranscriptResponse> {
  // Call the Vercel serverless function instead of the external API directly
  const response = await fetch('/api/get-transcript', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ videoId }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch transcript');
  }

  const data = await response.json();
  // The actual response structure is not documented, so we assume:
  // { transcripts: { [videoId]: { transcript: string, segments?: [{start:number,end:number,text:string}] } } }
  const transcriptData = data.transcripts?.[videoId];
  if (!transcriptData) {
    throw new Error('Transcript not found in API response');
  }

  // Fallback if segments are not provided
  const timestamps = transcriptData.segments || [];

  return {
    transcript: transcriptData.transcript,
    timestamps,
  };
}