import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    items.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card className="sticky top-20 p-4 hidden lg:block">
      <h3 className="font-semibold text-sm mb-3 text-[#0B3B69]">Table of Contents</h3>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <nav className="space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                'block w-full text-left text-sm py-1.5 px-2 rounded transition-colors',
                item.level === 2 && 'pl-4',
                item.level === 3 && 'pl-6',
                activeId === item.id
                  ? 'bg-[#007ACC] text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#007ACC]'
              )}
            >
              {item.title}
            </button>
          ))}
        </nav>
      </ScrollArea>
    </Card>
  );
}