import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Reference {
  id: number;
  title: string;
  url: string;
}

interface ReferencesListProps {
  references: Reference[];
}

export default function ReferencesList({ references }: ReferencesListProps) {
  return (
    <Card id="references" className="scroll-mt-20 border-t-4 border-t-[#007ACC]">
      <CardHeader>
        <CardTitle className="text-2xl text-[#0B3B69]">References</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {references.map((ref) => (
            <a
              key={ref.id}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#007ACC] text-white flex items-center justify-center text-sm font-semibold">
                {ref.id}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 group-hover:text-[#007ACC] transition-colors">
                  {ref.title}
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">{ref.url}</p>
              </div>
              <ExternalLink className="flex-shrink-0 w-4 h-4 text-gray-400 group-hover:text-[#007ACC] transition-colors" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}