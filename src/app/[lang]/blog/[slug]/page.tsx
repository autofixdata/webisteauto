import { getPost, getAllPostsMeta, getResolvableBlogParams } from '@/lib/blog';
import { getDictionary } from '@/dictionaries/getDictionary';
import { notFound } from 'next/navigation';
import { Calendar, User, Clock, ChevronRight, Home, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MDXRemote } from 'next-mdx-remote/rsc';
import type { Metadata } from 'next';
import { buildBlogAlternates, metadataTitle, openGraphForPath } from '@/lib/metadata';
import { pageUrl, SITE_URL } from '@/lib/siteConfig';

export const dynamicParams = true;
export const revalidate = 86400; // Cache blog pages for 24h

export async function generateStaticParams() {
  return getResolvableBlogParams();
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPost(lang, slug);
  if (!post) return { title: 'Not Found' };

  const canonical = pageUrl(lang, `/blog/${slug}`);
  const ogImage = post.image?.startsWith('http') ? post.image : `${SITE_URL}${post.image}`;

  const blogPath = `/blog/${slug}`;

  return {
    title: metadataTitle(`${post.title} | AutoFixData Blog`),
    description: post.excerpt,
    authors: [{ name: post.author }],
    keywords: post.tags?.join(', '),
    alternates: buildBlogAlternates(lang, slug),
    openGraph: openGraphForPath(lang, blogPath, {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      siteName: 'AutoFixData',
    }),
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
      site: '@autofixdata',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' }
    }
  };
}

// Custom MDX components
const mdxComponents = {
  h2: (props: any) => <h2 className="text-2xl md:text-3xl font-extrabold text-afd-navy mt-12 mb-5 pb-3 border-b border-gray-100" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold text-afd-navy mt-8 mb-4" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-bold text-afd-navy mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="text-afd-text leading-[1.9] mb-5 text-[17px]" {...props} />,
  ul: (props: any) => <ul className="list-none mb-6 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-afd-text" {...props} />,
  li: (props: any) => (
    <li className="flex items-start gap-2.5 text-afd-text text-[17px] leading-relaxed">
      <span className="mt-1.5 w-2 h-2 rounded-full bg-afd-yellow flex-shrink-0" />
      <div className="flex-1">{props.children}</div>
    </li>
  ),
  a: ({ href, children, ...props }: any) => {
    const isInternal = href && (href.startsWith('/') || href.startsWith('#'));
    const className = "text-afd-blue font-semibold underline underline-offset-2 hover:text-afd-navy transition-colors";
    if (isInternal) {
      return <Link href={href} className={className} {...props}>{children}</Link>;
    }
    return <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  },
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-afd-yellow bg-afd-yellow/5 px-6 py-4 my-8 rounded-r-xl [&>p]:italic [&>p]:text-afd-navy [&>p]:font-medium [&>p]:mb-0" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props: any) => <thead className="bg-afd-navy text-white" {...props} />,
  th: (props: any) => <th className="px-4 py-3 text-left font-bold text-sm tracking-wide" {...props} />,
  td: (props: any) => <td className="px-4 py-3 border-t border-gray-100" {...props} />,
  tr: (props: any) => <tr className="even:bg-gray-50 hover:bg-afd-yellow/5 transition-colors" {...props} />,
  strong: (props: any) => <strong className="font-bold text-afd-navy" {...props} />,
  em: (props: any) => <em className="italic text-afd-slate" {...props} />,
};

/** Extract FAQ pairs (h3 + following p text) from raw MDX source for JSON-LD */
function extractFAQs(source: string) {
  const faqs: { question: string; answer: string }[] = [];
  const h3Regex = /<h3>(.*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = h3Regex.exec(source)) !== null) {
    const question = m[1].replace(/<[^>]+>/g, '').trim();
    const answer = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (question && answer && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }
  return faqs.slice(0, 8);
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const post = getPost(lang, slug);
  if (!post) notFound();

  // Pick 3 random related articles for internal linking
  const allPosts = getAllPostsMeta(lang).filter(p => p.slug !== slug).sort(() => Math.random() - 0.5).slice(0, 3);

  const dict = await getDictionary(lang as any) as any;
  const cta = dict.cta || {};
  const isRtl = lang === 'ar' || lang === 'he';

  const canonical = pageUrl(lang, `/blog/${slug}`);
  const ogImage = post.image?.startsWith('http') ? post.image : `${SITE_URL}${post.image}`;
  const wordCount = post.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const heroSrc = post.image!;
  const heroRemoteUnoptimized =
    typeof heroSrc === 'string' && /^https?:\/\//.test(heroSrc) && !heroSrc.includes('assets.cdn.filesafe.space');

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: post.title,
    description: post.excerpt,
    image: [ogImage],
    datePublished: post.date,
    dateModified: post.date,
    wordCount,
    author: [{ '@type': 'Organization', name: 'AutoFixData', url: SITE_URL }],
    publisher: {
      '@type': 'Organization',
      name: 'AutoFixData',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png`, width: 200, height: 60 }
    },
    inLanguage: lang,
    isAccessibleForFree: true,
    keywords: post.tags?.join(', '),
  };

  const faqs = extractFAQs(post.content);
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: pageUrl(lang, '') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: pageUrl(lang, '/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <article className="bg-[#f8fafc] min-h-screen pt-28 pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-afd-slate mb-8 flex-wrap">
              <li>
                <Link href={`/${lang}`} className="hover:text-afd-blue transition-colors flex items-center gap-1">
                  <Home className="w-4 h-4" />
                </Link>
              </li>
              <li><ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /></li>
              <li><Link href={`/${lang}/blog`} className="hover:text-afd-blue transition-colors font-medium">Blog</Link></li>
              <li><ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} /></li>
              <li><span className="text-afd-navy font-medium truncate max-w-[300px]">{post.title}</span></li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ===== Main Article ===== */}
            <div className="w-full lg:w-[68%] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Hero image */}
              <div className="h-[300px] md:h-[420px] relative overflow-hidden">
                <Image
                  src={heroSrc}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 68vw"
                  className="object-cover"
                  unoptimized={heroRemoteUnoptimized}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-afd-navy/80 via-transparent to-transparent" />
                {post.tags?.length > 0 && (
                  <div className="absolute bottom-6 left-6 flex gap-2 flex-wrap" aria-label="Article tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-afd-yellow text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" />{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 md:p-12">
                {/* Meta row */}
                <div className="flex flex-wrap gap-5 text-xs font-bold text-afd-slate uppercase tracking-wider mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-afd-yellow" />{post.date}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-afd-yellow" />{post.readTime}</div>
                  <div className="flex items-center gap-1.5"><User className="w-4 h-4 text-afd-yellow" />{post.author}</div>
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-afd-navy leading-tight mb-8">
                  {post.title}
                </h1>

                {/* Excerpt lead */}
                <p className="text-xl text-afd-slate leading-relaxed mb-8 border-l-4 border-afd-yellow pl-5">
                  {post.excerpt}
                </p>

                {/* YouTube Embed */}
                {post.youtubeId && (
                  <div className="mb-10 rounded-2xl overflow-hidden shadow-xl border border-gray-100 aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${post.youtubeId}?rel=0&modestbranding=1`}
                      title={post.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}

                {/* MDX Prose Body */}
                <div className="prose-container">
                  <MDXRemote source={post.content} components={mdxComponents} />
                </div>

                {/* Bottom CTA */}
                <div className="mt-14 p-8 bg-afd-navy rounded-2xl text-center border border-afd-yellow/20">
                  <h3 className="text-2xl font-extrabold text-white mb-3">
                    {cta.title || 'Access All 5 Repair Databases Now'}
                  </h3>
                  <p className="text-afd-slate mb-6">
                    {cta.desc || 'Get ALLDATA, AutoData, HaynesPro, Mitchell1 & Identifix in one subscription. 7-day free trial.'}
                  </p>
                  <Link href={`/${lang}/free-trial`}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-afd-yellow text-black font-extrabold rounded-xl hover:bg-afd-yellow-hover hover:scale-105 transition-all shadow-xl shadow-afd-yellow/20 text-base">
                    Start Free Trial — No Credit Card
                  </Link>
                </div>

                {/* Tags footer */}
                {post.tags?.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                    <span className="text-xs font-bold text-afd-slate uppercase tracking-wider self-center mr-2">Tags:</span>
                    {post.tags.map(tag => (
                      <span key={tag} className="bg-gray-100 text-afd-navy text-xs font-semibold px-3 py-1.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ===== Sidebar ===== */}
            <aside className="w-full lg:w-[32%] lg:sticky lg:top-28 flex flex-col gap-6">
              <div className="bg-afd-navy rounded-2xl p-6 text-center border border-afd-yellow/20">
                <div className="text-3xl mb-3">🔧</div>
                <h2 className="text-xl font-extrabold text-white mb-2">{cta.title || 'Get Full Access'}</h2>
                <p className="text-afd-slate text-sm mb-5">{cta.desc || 'Unlock 5 OEM databases. £99/mo. 7-day free trial.'}</p>
                <Link href={`/${lang}/free-trial`}
                  className="w-full block py-3 px-4 bg-afd-yellow text-black font-extrabold rounded-xl hover:bg-afd-yellow-hover transition-all text-sm shadow-lg shadow-afd-yellow/20">
                  Start Free Trial
                </Link>
                <Link href={`/${lang}/pricing`} className="block mt-3 text-xs text-afd-slate hover:text-afd-yellow transition-colors">
                  View all plans →
                </Link>
              </div>

              {/* Quick facts card */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-base font-bold text-afd-navy mb-4">Article Info</h2>
                <dl className="space-y-3 text-sm text-afd-slate">
                  <div className="flex justify-between">
                    <dt className="font-semibold">Reading time</dt>
                    <dd>{post.readTime}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold">Word count</dt>
                    <dd>~{wordCount.toLocaleString()} words</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold">Published</dt>
                    <dd>{post.date}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold">Author</dt>
                    <dd>{post.author}</dd>
                  </div>
                </dl>
              </div>
            </aside>

          </div>

          {/* ===== Related Articles (Internal Linking) ===== */}
          {allPosts.length > 0 && (
            <div className="mt-16 border-t border-gray-200 pt-12">
              <h2 className="text-2xl md:text-3xl font-extrabold text-afd-navy mb-8 text-center">{dict.blog?.related || 'Related Articles'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allPosts.map((p: any) => (
                  <Link key={p.slug} href={`/${lang}/blog/${p.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    <div className="aspect-[16/9] overflow-hidden relative bg-gray-100">
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized={/^https?:\/\//.test(p.image) && !p.image.includes('assets.cdn.filesafe.space')}
                        />
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-afd-yellow uppercase tracking-wider mb-3">
                        <span>{p.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{p.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-afd-navy mb-3 line-clamp-2 leading-snug group-hover:text-afd-blue transition-colors">{p.title}</h3>
                      <p className="text-sm text-afd-slate line-clamp-2 leading-relaxed mb-4 flex-1">{p.excerpt}</p>
                      <div className="text-sm font-bold text-afd-blue mt-auto flex items-center gap-1 group-hover:gap-2 transition-all">
                        {dict.blog?.readMore || 'Read More'} <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
