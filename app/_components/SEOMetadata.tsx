import React from 'react';
import Head from 'next/head';

interface SEOMetadataProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: string;
  ogImage?: string;
  additionalKeywords?: string[];
  createdBy?: string;
  pageType?: string;
  modifiedDate?: string;
  publishedDate?: string;
}

const SEOMetadata: React.FC<SEOMetadataProps> = ({
  title = 'ImageToCode | #1 AI Design to Code Generator Tool | CodeNovaTech',
  description = 'Transform designs into code with ImageToCodeGenerator AI. Convert images to HTML, CSS, React & Next.js code instantly. Best AI prompt to code service by CodeNovaTech.',
  canonicalUrl = 'https://imagetocode.codenovatech.in',
  ogType = 'website',
  ogImage = '/logo.png',
  additionalKeywords = [],
  createdBy = 'CodeNovaTech',
  pageType = 'WebPage',
  modifiedDate = new Date().toISOString(),
  publishedDate = new Date().toISOString(),
}) => {
  const defaultKeywords = [
    'ImageToCodeGenerator', 
    'AI design to code', 
    'image to code converter', 
    'AI prompt to code',
    'design to HTML', 
    'UI design converter',
    'HTML generator', 
    'CSS generator', 
    'React code generator', 
    'Next.js generator',
    'CodeNovaTech', 
    'AI development tools',
    'mockup to html',
    'screenshot to code',
    'image to react',
    'UI automation',
    'free design to code',
    'design to frontend'
  ];

  const allKeywords = [...defaultKeywords, ...additionalKeywords].join(', ');

  // Calculate absolute image URL
  const absoluteImageUrl = ogImage.startsWith('http') 
    ? ogImage 
    : `https://imagetocode.codenovatech.in${ogImage}`;

  // Create JSON-LD structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': pageType,
    name: title,
    description: description,
    dateModified: modifiedDate,
    datePublished: publishedDate,
    image: absoluteImageUrl,
    publisher: {
      '@type': 'Organization',
      name: createdBy,
      logo: {
        '@type': 'ImageObject',
        url: 'https://imagetocode.codenovatech.in/logo.png'
      }
    }
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={createdBy} />
      <meta name="creator" content={createdBy} />
      <meta name="publisher" content={createdBy} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:site_name" content="ImageToCode by CodeNovaTech" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@CodeNovaTech" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      
      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="application-name" content="ImageToCode" />
      <meta name="msapplication-TileImage" content="/logo.png" />
      <meta name="theme-color" content="#9333ea" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
};

export default SEOMetadata;
