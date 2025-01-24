import heroImage from '~/assets/hero.avif?url';
import { Image } from '@shopify/hydrogen-react';

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__image">
          <Image src={heroImage} sizes="100vw" loading="eager" />
        </div>

        <div className="hero__content">
          <h1 className="hero__title">
            Discover the Best Deals Every Day
          </h1>

          <p className="hero__subtitle">
            Shop the latest trends and essentials at unbeatable prices. Your one-stop shop for everything you need.
          </p>

          <div className="hero__actions">
            <a href="/collections/all" className="button">
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
