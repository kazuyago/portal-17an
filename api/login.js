export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    if (username === 'panitia' && password === 'merdeka81') {
      res.status(200).json({ success: true, message: 'Login berhasil' });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
