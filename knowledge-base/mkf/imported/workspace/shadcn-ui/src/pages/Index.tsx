import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowUp, FileText, Download } from 'lucide-react';
import TableOfContents from '@/components/TableOfContents';
import ArticleSection from '@/components/ArticleSection';
import ReferencesList from '@/components/ReferencesList';
import { articleData } from '@/data/articleContent';

export default function Index() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate TOC items
  const tocItems = [
    ...articleData.sections.map((section) => [
      { id: section.id, title: section.title, level: 1 },
      ...(section.subsections?.map((sub) => ({
        id: sub.id,
        title: sub.title,
        level: 2,
      })) || []),
    ]).flat(),
    { id: 'references', title: 'References', level: 1 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-[#0B3B69] to-[#007ACC] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8" />
            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              Research Report
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {articleData.title}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-6">
            {articleData.subtitle}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              className="bg-white text-[#0B3B69] hover:bg-gray-100"
              onClick={() => window.print()}
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => document.getElementById('introduction')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Read Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - Sticky Sidebar */}
          <aside className="lg:col-span-1">
            <TableOfContents items={tocItems} />
          </aside>

          {/* Article Content */}
          <article className="lg:col-span-3 space-y-8">
            {/* Executive Summary */}
            <div className="bg-white rounded-lg p-6 border-l-4 border-l-[#007ACC] shadow-sm">
              <h2 className="text-xl font-semibold text-[#0B3B69] mb-3">Executive Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                This comprehensive report details the strategic design and implementation of a mobile-first, 
                AI-integrated digital engine for Call Kaids Roofing. The system focuses on three core pillars: 
                internal operations automation, marketing content generation, and Meta Ads orchestration—all 
                while maintaining strict data integrity and backend-first architecture principles.
              </p>
            </div>

            <Separator className="my-8" />

            {/* Main Sections */}
            {articleData.sections.map((section) => (
              <ArticleSection key={section.id} section={section} />
            ))}

            <Separator className="my-8" />

            {/* References */}
            <ReferencesList references={articleData.references} />
          </article>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg bg-[#007ACC] hover:bg-[#0B3B69]"
          size="icon"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* Footer */}
      <footer className="bg-[#111827] text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Call Kaids Roofing Digital Engine Research Report
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by MGX Platform
          </p>
        </div>
      </footer>
    </div>
  );
}