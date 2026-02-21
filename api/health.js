export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    success: true,
    message: 'CarbonChain Pro Server is Running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
