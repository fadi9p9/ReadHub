import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentController {
  private readonly stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2025-04-30.basil',
    });
  }

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  async createCheckoutSession(@Body() body: { amount: number }) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Product Name',
            },
            unit_amount: Math.round(body.amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return { url: session.url };
  }

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  async createSubscriptionSession(@Body() body: { plan: 'monthly' | 'yearly' }) {
    const priceId =
      body.plan === 'monthly'
        ? 'price_1RTLciPLKq8J9gFTOz4XdHuR'
        : 'price_1RTLjYPLKq8J9gFTMAcrRJal';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return { url: session.url };
  }
}