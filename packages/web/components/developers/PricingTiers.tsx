"use client";

const PRICING_TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for testing and small projects',
    features: [
      '100 API calls per day',
      'Basic verification endpoints',
      'Public badge embedding',
      'Community support',
      'No credit card required'
    ],
    limitations: [
      'IP-based rate limiting',
      'No webhooks',
      'Best-effort uptime'
    ],
    cta: 'Get Started',
    ctaVariant: 'secondary' as const,
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'month',
    description: 'For production applications and growing projects',
    features: [
      '10,000 API calls per day',
      'All verification endpoints',
      'Premium badge styles',
      'Webhook notifications',
      'Priority support',
      'Custom domains',
      'Analytics dashboard'
    ],
    limitations: [
      'Fair usage policy applies'
    ],
    cta: 'Start Pro Trial',
    ctaVariant: 'primary' as const,
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large-scale applications with custom needs',
    features: [
      'Unlimited API calls',
      'Custom endpoints',
      'On-premise deployment',
      'White-label solutions',
      'Dedicated support',
      'Custom SLA',
      'Advanced analytics',
      'Multi-region availability'
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    popular: false
  }
] as const;

export default function PricingTiers() {
  return (
    <section id="pricing" className="scroll-mt-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Start free, scale as you grow. No hidden fees, no surprise charges.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {PRICING_TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl border p-8 ${
              tier.popular
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/10 shadow-lg shadow-brand-500/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className="text-gray-600 dark:text-gray-400">/{tier.period}</span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {tier.description}
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-green-500 mt-1">✓</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {tier.limitations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-gray-600 dark:text-gray-400">
                    Limitations
                  </h4>
                  <ul className="space-y-2">
                    {tier.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {limitation}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                tier.ctaVariant === 'primary'
                  ? 'bg-brand-500 hover:bg-brand-600 text-white'
                  : tier.ctaVariant === 'secondary'
                  ? 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  : 'border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Need something different?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We offer custom solutions for unique requirements including on-premise deployments,
            custom rate limits, and specialized support.
          </p>
          <a
            href="mailto:support@sss.community"
            className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
          >
            Contact our team
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}