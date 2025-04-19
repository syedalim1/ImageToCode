import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://imagetocode.codenovatech.in';
  const currentDate = new Date();
  // Set dates for different content to show freshness for SEO
  const yesterday = new Date(currentDate);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const lastWeek = new Date(currentDate);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  // Define all the static routes for your site
  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/designs`,
      lastModified: yesterday,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/generate-code`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/view-code`,
      lastModified: yesterday,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/credits`,
      lastModified: lastWeek,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/image-to-html`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/image-to-react`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/image-to-nextjs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/design-to-code`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: lastWeek,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
