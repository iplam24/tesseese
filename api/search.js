export default async function handler(req, res) {
  // Add CORS headers so frontend can call it if needed, though on Vercel it's same-origin
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://tracuudiemnb.ninhbinh.edu.vn/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://tracuudiemnb.ninhbinh.edu.vn/',
        'Origin': 'https://tracuudiemnb.ninhbinh.edu.vn',
        'Accept': 'application/json, text/plain, */*'
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      console.error('Target API returned status:', response.status);
      return res.status(response.status).json({ error: 'Lỗi từ máy chủ đích.' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(502).json({ error: 'Không thể kết nối đến máy chủ tra cứu điểm.' });
  }
}
