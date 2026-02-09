import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SEO = ({
    title,
    description,
    keywords,
    image = '/og-image.jpg',
    url = 'https://tilmide.ma',
    type = 'website',
    noindex = false
}: SEOProps & { noindex?: boolean }) => {
    const siteTitle = 'تلميذ - Tilmid';
    const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

    // Ensure absolute URL for image
    const fullImage = image.startsWith('http') ? image : `https://tilmide.ma${image}`;
    const fullUrl = url.startsWith('http') ? url : `https://tilmide.ma${url}`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{fullTitle}</title>
            <meta name='description' content={description} />
            {keywords && <meta name='keywords' content={keywords} />}
            <link rel="canonical" href={fullUrl} />

            {/* Robots Tag for Indexing Control */}
            <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />


            {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content={siteTitle} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
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
                    "logo": "https://tilmide.ma/logo.png",
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
        </Helmet>
    );
};

export default SEO;
