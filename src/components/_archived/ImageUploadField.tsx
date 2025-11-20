import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ImageUploadFieldProps {
  label: string;
  name: string;
  value: string[];
  onChange: (name: string, urls: string[]) => void;
  helpText?: string;
}

export function ImageUploadField({ label, name, value, onChange, helpText }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    onChange(name, [...value, ...urls]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name}>{label}</Label>
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          Upload
        </Button>
      </div>
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-2" aria-label={`${label} previews`}>
          {value.map((url, index) => (
            <img key={url + index} src={url} alt={`${label} ${index + 1}`} className="w-full rounded-lg" />
          ))}
        </div>
      )}
    </div>
  );
}
