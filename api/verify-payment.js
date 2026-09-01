const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured yet.' });
  }

  const { session_id } = req.query;
  if (!session_id || typeof session_id !== 'string') {
    return res.status(400).json({ error: 'Missing checkout session.' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session.payment_status === 'paid' && session.metadata?.product === 'claim-packet';

    if (!paid) {
      return res.status(402).json({ paid: false });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      paid: true,
      customerEmail: session.customer_details?.email || '',
      customerName: session.customer_details?.name || ''
    });
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(400).json({ error: 'Unable to verify payment.' });
  }
};
