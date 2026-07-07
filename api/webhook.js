const admin = require('firebase-admin');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      console.warn("FIREBASE_SERVICE_ACCOUNT is not set in Environment Variables.");
      // Fallback init (will fail if Firestore rules are locked, but allows testing)
      admin.initializeApp({
        projectId: "aacom-reclutamiento"
      });
    }
  } catch (error) {
    console.error("Error initializing firebase-admin:", error);
  }
}

const db = admin.firestore();

module.exports = async function handler(req, res) {
  // CORS Headers just in case Zapier preflights
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const authHeader = req.headers.authorization;
  const secret = process.env.BLOG_WEBHOOK_SECRET || 'aacom-secreto-xyz';
  
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized. Invalid or missing Bearer token.' });
  }

  try {
    const { title, content, heroImage, excerpt, slug } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({ error: 'Missing required fields (title, slug, content)' });
    }

    await db.collection('blog_posts').doc(slug).set({
      title,
      content,
      heroImage: heroImage || '',
      excerpt: excerpt || '',
      slug,
      publishedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({ success: true, message: 'Blog post published successfully to Firestore' });
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
