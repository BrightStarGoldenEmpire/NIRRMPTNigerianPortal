import React from 'react';
import { newsData } from '@/lib/data/newsData';

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = newsData.find((item) => item.slug === slug);

  if (!article) {
    return <div className="max-w-7xl mx-auto py-12 px-4">Article not found.</div>;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <span className="text-xs font-bold text-emerald-700 uppercase">{article.category}</span>
      <h1 className="text-3xl font-extrabold text-slate-900 mt-2 mb-4">{article.title}</h1>
      <p className="text-slate-400 text-xs mb-8">{article.date}</p>
      <div className="prose text-slate-700 leading-relaxed">
        {article.content}
      </div>
    </article>
  );
}