import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KnowledgeFile {
  id: string;
  file_key: string;
  title: string;
  content: string;
  category: string;
  metadata: Record<string, any>;
  version: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileVersion {
  id: string;
  file_id: string;
  version_number: number;
  content: string;
  change_summary: string | null;
  changed_by: string | null;
  created_at: string;
}

export function useFileManager() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [currentFile, setCurrentFile] = useState<KnowledgeFile | null>(null);
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [chunkCount, setChunkCount] = useState(0);
  const { toast } = useToast();

  const listFiles = async (category?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('file-manager', {
        body: { action: 'list', category }
      });

      if (error) throw error;
      setFiles(data.files || []);
      return data.files;
    } catch (error: any) {
      toast({
        title: 'Error loading files',
        description: error.message,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getFile = async (fileId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('file-manager', {
        body: { action: 'get', fileId }
      });

      if (error) throw error;
      setCurrentFile(data.file);
      setVersions(data.versions || []);
      setChunkCount(data.chunkCount || 0);
      return data;
    } catch (error: any) {
      toast({
        title: 'Error loading file',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createFile = async (
    title: string,
    content: string,
    category: string,
    fileKey?: string,
    metadata?: Record<string, any>
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('file-manager', {
        body: { action: 'create', title, content, category, fileKey, metadata }
      });

      if (error) throw error;
      
      toast({
        title: 'File created',
        description: 'File has been created and will be embedded shortly'
      });

      await listFiles();
      return data.file;
    } catch (error: any) {
      toast({
        title: 'Error creating file',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateFile = async (
    fileId: string,
    content: string,
    title?: string,
    category?: string,
    metadata?: Record<string, any>
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('file-manager', {
        body: { action: 'update', fileId, content, title, category, metadata }
      });

      if (error) throw error;
      
      toast({
        title: 'File updated',
        description: 'File has been updated successfully'
      });

      return data.file;
    } catch (error: any) {
      toast({
        title: 'Error updating file',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reEmbedFile = async (fileId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('file-manager', {
        body: { action: 're-embed', fileId }
      });

      if (error) throw error;
      
      toast({
        title: 'Re-embedding started',
        description: 'File will be re-embedded in the background'
      });

      return data.embedResult;
    } catch (error: any) {
      toast({
        title: 'Error re-embedding file',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('file-manager', {
        body: { action: 'delete', fileId }
      });

      if (error) throw error;
      
      toast({
        title: 'File deleted',
        description: 'File has been deactivated successfully'
      });

      await listFiles();
      return true;
    } catch (error: any) {
      toast({
        title: 'Error deleting file',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    files,
    currentFile,
    versions,
    chunkCount,
    listFiles,
    getFile,
    createFile,
    updateFile,
    reEmbedFile,
    deleteFile
  };
}
