const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe is not configured yet.' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin = `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: 2700,
            product_data: {
              name: 'Missing Money Method Claim Packet',
              description: 'Personalized claim checklist, letter templates, document organizer, and California digital-asset notes.'
            }
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/claim-packet.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/claim-packet.html?canceled=1`,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      metadata: {
        product: 'claim-packet',
        sponsor: 'Creignificent LLC'
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({ error: 'Unable to start checkout.' });
  }
};
