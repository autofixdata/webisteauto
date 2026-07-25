import Link from 'next/link';
import { getAllPostsMeta } from '@/lib/blog';
import { getDictionary } from '@/dictionaries/getDictionary';
import { Clock, Calendar, ArrowRight, Tag } from 'lucide-react';
import type { Metadata } from 'next';
import { buildAlternates, openGraphForPath } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  const b = dict.blog || {};
  const title = b.indexTitle || 'Auto Fix Data Technical Blog — Mechanic Guides & Repair Tips';
  const description = b.indexDesc || 'In-depth automotive repair guides, OEM wiring diagram tutorials, diagnostic deep-dives and software comparisons for professional mechanics.';

  return {
    title,
    description,
    alternates: buildAlternates(lang, '/blog'),
    openGraph: openGraphForPath(lang, '/blog', {
      type: 'website',
      title,
      description,
      images: [{ url: `${SITE_URL}/images/diagnostics-abstract.png`, width: 1200, height: 630, alt: title }],
      siteName: 'AutoFixData',
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/diagnostics-abstract.png`],
      site: '@autofixdata',
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any) as any;
  const b = dict.blog || {};
  const posts = getAllPostsMeta(lang);

  const title = b.indexTitle || 'Auto Fix Data Technical Blog — Mechanic Guides & Repair Tips';
  const description = b.indexDesc || 'In-depth automotive repair guides, OEM wiring diagram tutorials, diagnostic deep-dives and software comparisons for professional mechanics.';

  // JSON-LD Collection schema
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: title,
    description: description,
    url: pageUrl(lang, '/blog'),
    publisher: {
      "@type": "Organization",
      name: "AutoFixData",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.png` }
    },
    blogPost: posts.map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image: post.image.startsWith('http') ? post.image : `${SITE_URL}${post.image}`,
      datePublished: post.date,
      url: pageUrl(lang, `/blog/${post.slug}`),
      author: { "@type": "Organization", name: "AutoFixData" }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* Hero */}
      <section className="bg-afd-navy pt-36 pb-20 px-6 text-center dark-section border-b border-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-afd-yellow/10 border border-afd-yellow/20 rounded-full text-afd-yellow text-xs font-bold tracking-wider mb-6">
          {b.badge || 'Expert Automotive Guides'}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 max-w-3xl mx-auto leading-tight">
          {b.indexTitle || 'The Auto Fix Data Technical Blog'}
        </h1>
        <p className="text-xl text-afd-slate max-w-2xl mx-auto">
          {b.indexDesc || 'In-depth guides, OEM data tutorials, and repair software comparisons for professional mechanics.'}
        </p>
      </section>

      {/* Grid */}
      <section className="py-16 px-6 bg-[#f8fafc] min-h-[50vh]">
        <div className="max-w-[1100px] mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-afd-slate py-20">Articles coming soon…</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  key={post.slug}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col"
                >
                  <div className="h-48 bg-afd-navy relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-afd-navy shadow-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] bg-afd-yellow/10 text-afd-navy font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" /> {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-afd-navy mb-3 group-hover:text-afd-blue transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-afd-text text-sm mb-6 line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-afd-slate mt-auto pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {post.readTime}
                      </div>
                      <span className="text-afd-yellow font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                        {b.readMore || 'Read Article'} <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
