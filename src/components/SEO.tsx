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
    type = 'website'
}: SEOProps) => {
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
        </Helmet>
    );
};

export default SEO;
