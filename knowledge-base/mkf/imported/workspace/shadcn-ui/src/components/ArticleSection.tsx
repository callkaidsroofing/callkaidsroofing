import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DataTable from './DataTable';
import type { Section } from '@/data/articleContent';

interface ArticleSectionProps {
  section: Section;
  level?: number;
}

export default function ArticleSection({ section, level = 1 }: ArticleSectionProps) {
  const HeadingTag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
  
  return (
    <section id={section.id} className="scroll-mt-20">
      <Card className={`mb-8 ${level === 1 ? 'border-2 border-[#007ACC]' : ''}`}>
        <CardHeader>
          <div className="flex items-center gap-3">
            {level === 1 && (
              <Badge className="bg-[#007ACC] hover:bg-[#0B3B69]">
                Module {section.id.split('-')[0]}
              </Badge>
            )}
            <CardTitle className={level === 1 ? 'text-2xl' : 'text-xl'}>
              <HeadingTag className="text-[#0B3B69]">{section.title}</HeadingTag>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {section.content.map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}

          {section.tables?.map((table, index) => (
            <DataTable
              key={index}
              title={table.title}
              headers={table.headers}
              rows={table.rows}
            />
          ))}

          {section.subsections?.map((subsection) => (
            <div key={subsection.id} className="mt-6 pl-4 border-l-2 border-gray-200">
              <ArticleSection section={subsection} level={level + 1} />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}