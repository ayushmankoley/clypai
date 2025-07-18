export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { videoId } = req.body;
  console.log('Received request for videoId:', videoId);
  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId' });
  }

  const apiToken = process.env.YT_TRANSCRIPT_API_TOKEN;
  if (!apiToken) {
    console.error('API token not set');
    return res.status(500).json({ error: 'API token not set' });
  }

  try {
    const ytRes = await fetch('https://www.youtube-transcript.io/api/transcripts', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids: [videoId] }),
    });

    const text = await ytRes.text();
    console.log('youtube-transcript.io response:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON from youtube-transcript.io:', text);
      return res.status(500).json({ error: 'Invalid JSON from youtube-transcript.io', raw: text });
    }

    // Transform the array response to the expected object format
    if (Array.isArray(data) && data.length > 0) {
      const item = data[0];
      const track = item.tracks && item.tracks[0];
      const transcriptArr = track && track.transcript;
      const transcriptText = transcriptArr
        ? transcriptArr.map((seg: any) => seg.text).join(' ')
        : '';
      const segments = transcriptArr
        ? transcriptArr.map((seg: any) => ({
            start: parseFloat(seg.start),
            end: parseFloat(seg.start) + parseFloat(seg.dur),
            text: seg.text,
          }))
        : [];

      return res.status(200).json({
        transcripts: {
          [videoId]: {
            transcript: transcriptText,
            segments,
          },
        },
      });
    } else {
      return res.status(404).json({ error: 'Transcript not found in API response', raw: data });
    }
  } catch (err) {
    console.error('Serverless function error:', err);
    return res.status(500).json({ error: 'Failed to fetch transcript', details: err });
  }
} 