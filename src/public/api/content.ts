import { supabase } from '@/integrations/supabase/client';

/**
 * Public Content API
 * Centralized data fetching layer for public-facing content.
 * All functions handle errors gracefully and return null on failure.
 */

// Blog Posts
export async function getBlogPosts() {
  try {
    const { data, error } = await supabase
      .from('content_blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('content_blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
}

// Services
export async function getServices() {
  try {
    const { data, error } = await supabase
      .from('content_services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('content_services')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching service ${slug}:`, error);
    return null;
  }
}

// Suburbs
export async function getSuburbs() {
  try {
    const { data, error } = await supabase
      .from('content_suburbs')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching suburbs:', error);
    return [];
  }
}

export async function getSuburbBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('content_suburbs')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching suburb ${slug}:`, error);
    return null;
  }
}

// Case Studies / Portfolio
export async function getCaseStudies(limit?: number) {
  try {
    let query = supabase
      .from('content_case_studies')
      .select('*')
      .eq('is_published', true)
      .order('completed_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

export async function getCaseStudiesByService(serviceName: string, limit?: number) {
  try {
    let query = supabase
      .from('content_case_studies')
      .select('*')
      .eq('is_published', true)
      .eq('service_type', serviceName)
      .order('completed_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching case studies for service ${serviceName}:`, error);
    return [];
  }
}

export async function getCaseStudiesBySuburb(suburbName: string, limit?: number) {
  try {
    let query = supabase
      .from('content_case_studies')
      .select('*')
      .eq('is_published', true)
      .eq('suburb', suburbName)
      .order('completed_date', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching case studies for suburb ${suburbName}:`, error);
    return [];
  }
}

// Media
export async function getMediaByIds(ids: string[]) {
  try {
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .in('id', ids);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching media:', error);
    return [];
  }
}

// Business Profile
export async function getBusinessProfile() {
  try {
    const { data, error } = await supabase
      .from('business_profile_data')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return null;
  }
}
