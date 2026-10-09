import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string | null | undefined;
    description: string | null | undefined;
    keywords?: string;
    image?: string | null;
    /** Canonical path or absolute URL. Defaults to the current route path (no query string). */
    url?: string | null;
    type?: string;
    /** Extra JSON-LD blocks (FAQPage, BreadcrumbList, Service...) for this page, in addition to the Organization schema below. */
    jsonLd?: Record<string, any>[];
    noindex?: boolean;
}

const SITE_URL = 'https://tilmide.ma';
const SITE_TITLE = 'تلميذ - Tilmid';
// Strips a brand suffix a page may already include ("Contact - Tilmid", "... | تلميذ - Tilmid")
// so the brand is appended exactly once.
const BRAND_SUFFIX = /\s*[|–—-]\s*(تلميذ(\s*-\s*Tilmid)?|Tilmid)\s*$/i;

const SEO = ({
    title,
    description,
    keywords,
    image = '/og-image.jpg',
    url,
    type = 'website',
    noindex = false,
    jsonLd = []
}: SEOProps) => {
    const { pathname } = useLocation();
    const siteTitle = SITE_TITLE;
    const safeTitle = typeof title === 'string' && title.trim() ? title : SITE_TITLE;
    const safeDescription = typeof description === 'string' ? description : '';
    const safeImage = typeof image === 'string' && image ? image : '/og-image.jpg';
    const cleanTitle = safeTitle.replace(BRAND_SUFFIX, '').trim();
    const fullTitle = cleanTitle === siteTitle ? siteTitle : `${cleanTitle} | ${siteTitle}`;

    // Ensure absolute URL for image
    const fullImage = safeImage.startsWith('http') ? safeImage : `${SITE_URL}${safeImage}`;
    // Canonical: explicit url, otherwise the current route path. Query strings
    // (filters, tracking params) are never part of the canonical URL.
    const canonicalPath = typeof url === 'string' && url ? url : (pathname || '/').replace(/\/+$/, '') || '/';
    const fullUrl = canonicalPath.startsWith('http') ? canonicalPath : `${SITE_URL}${canonicalPath}`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={safeDescription} />
            {keywords && <meta name='keywords' content={keywords} />}
            <link rel="canonical" href={fullUrl} />

            {/* Robots Tag for Indexing Control */}
            <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />


            {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={safeDescription} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={safeDescription} />
            <meta name="twitter:image" content={fullImage} />

            {/* GEO Tags (Local SEO for Morocco) */}
            <meta name="geo.region" content="MA" />
            <meta name="geo.placename" content="Morocco" />
            <meta name="geo.position" content="31.7917;-7.0926" />
            <meta name="ICBM" content="31.7917, -7.0926" />

            {/* JSON-LD Structured Data (Organization & Website) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Organization",
                    "name": "Tilmid",
                    "url": "https://tilmide.ma",
                    "logo": "https://res.cloudinary.com/do4mapb11/image/upload/v1766146135/Logo-Tilmid_wyhz1m.png",
                    "sameAs": [
                        "https://www.instagram.com/tilmid.official/",
                        "https://www.tiktok.com/@tilmid.official?is_from_webapp=1&sender_device=pc",
                        "https://web.facebook.com/profile.php?id=61568646044886",
                        "https://www.youtube.com/@tilmid.official"
                    ],
                    "contactPoint": {
                        "@type": "ContactPoint",
                        "telephone": "+212-778-104-220",
                        "contactType": "customer service",
                        "areaServed": "MA",
                        "availableLanguage": ["Arabic", "French"]
                    }
                })}
            </script>

            {jsonLd.map((schema, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify({ '@context': 'https://schema.org', ...schema })}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
