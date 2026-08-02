import type { Metadata } from "next";
import { areas, site } from "./site";
import { faqs, reviews } from "./content";
import { products } from "./products";

/** Absolute URL for a site-relative path. */
export const abs = (path = "/") => new URL(path, site.url).toString();

export function pageMeta({
  title,
  description,
  path = "/",
  keywords,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = abs(path);
  const ogTitle = `${title} | ${site.name}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: abs("/opengraph-image"), width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [abs("/opengraph-image")],
    },
  };
}

/* --------------------------------------------------------------- schema */

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    priceRange: "££",
    foundingDate: site.founded,
    image: abs("/opengraph-image"),
    logo: abs("/icon.svg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postcode,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    areaServed: areas.map((a) => ({
      "@type": "City",
      name: a.name,
      containedInPlace: { "@type": "AdministrativeArea", name: "Essex" },
    })),
    openingHoursSpecification: site.openingHoursSpec.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1,
    },
    sameAs: [site.social.facebook, site.social.instagram],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Made-to-measure shutters and blinds",
      itemListElement: products.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: p.name, description: p.strapline },
      })),
    },
  };
}

export function productSchema(productId: string) {
  const p = products.find((x) => x.id === productId);
  if (!p) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    brand: { "@type": "Brand", name: site.name },
    category: p.family === "shutters" ? "Window Shutters" : "Window Blinds",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      lowPrice: Math.round(p.rate * 1.2),
      highPrice: Math.round(p.rate * 5),
      offerCount: 1,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: site.name },
    },
  };
}

/** Schema for a list of product ids, with unknown ids dropped. */
export function productSchemas(ids: string[]) {
  return ids.map(productSchema).filter((s): s is NonNullable<typeof s> => s !== null);
}

export function reviewSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: reviews.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        datePublished: r.date,
        name: r.headline,
        reviewBody: r.body,
        reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        itemReviewed: { "@type": "LocalBusiness", name: site.name, image: abs("/opengraph-image") },
      },
    })),
  };
}

export function faqSchema(items = faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

/** Renders one or more schema blocks as a single script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // Schema is built from typed literals in this repo, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}
