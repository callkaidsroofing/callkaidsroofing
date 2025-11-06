import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DataTableProps {
  title: string;
  headers: string[];
  rows: string[][];
}

export default function DataTable({ title, headers, rows }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = rows.filter((row) =>
    row.some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="my-6 border-l-4 border-l-[#007ACC]">
      <CardHeader>
        <CardTitle className="text-lg text-[#0B3B69]">{title}</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#007ACC]/10">
                {headers.map((header, index) => (
                  <TableHead key={index} className="font-semibold text-[#0B3B69]">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50">
                    {row.map((cell, cellIndex) => (
                      <TableCell key={cellIndex} className="text-sm">
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={headers.length} className="text-center text-gray-500">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}