#!/usr/bin/env python3
"""
Notion to Supabase Content Sync Script
======================================
Syncs content from Notion databases to Supabase content cache tables.
Runs every 15 minutes via cron job.

Author: Call Kaids Roofing System
Version: 1.0.0
"""

import os
import sys
from datetime import datetime
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
from notion_client import Client as NotionClient
from supabase import create_client, Client as SupabaseClient
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/notion_sync.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Validate environment variables
required_env_vars = [
    'NOTION_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
]

for var in required_env_vars:
    if not os.getenv(var):
        logger.error(f"Missing required environment variable: {var}")
        sys.exit(1)

# Initialize clients
notion = NotionClient(auth=os.getenv('NOTION_API_KEY'))
supabase: SupabaseClient = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_SERVICE_ROLE_KEY')
)


class NotionSupabaseSync:
    """Handles syncing from Notion databases to Supabase tables."""
    
    def __init__(self):
        self.sync_stats = {
            'started_at': datetime.utcnow().isoformat(),
            'tables_synced': 0,
            'records_synced': 0,
            'records_created': 0,
            'records_updated': 0,
            'records_deleted': 0,
            'errors': []
        }
    
    def log_sync_result(self, table_name: str, status: str, stats: Dict):
        """Log sync results to content_sync_log table."""
        try:
            supabase.table('content_sync_log').insert({
                'table_name': table_name,
                'sync_type': 'notion_to_supabase',
                'sync_status': status,
                'started_at': self.sync_stats['started_at'],
                'completed_at': datetime.utcnow().isoformat(),
                'records_synced': stats.get('synced', 0),
                'records_created': stats.get('created', 0),
                'records_updated': stats.get('updated', 0),
                'records_deleted': stats.get('deleted', 0),
                'errors': stats.get('errors', [])
            }).execute()
        except Exception as e:
            logger.error(f"Failed to log sync result for {table_name}: {str(e)}")
    
    def get_notion_property(self, properties: Dict, prop_name: str, prop_type: str) -> Any:
        """Extract property value from Notion page based on type."""
        try:
            prop = properties.get(prop_name, {})
            
            if prop_type == 'title':
                return ''.join([t['plain_text'] for t in prop.get('title', [])])
            elif prop_type == 'rich_text':
                return ''.join([t['plain_text'] for t in prop.get('rich_text', [])])
            elif prop_type == 'select':
                return prop.get('select', {}).get('name')
            elif prop_type == 'multi_select':
                return [s['name'] for s in prop.get('multi_select', [])]
            elif prop_type == 'number':
                return prop.get('number')
            elif prop_type == 'checkbox':
                return prop.get('checkbox', False)
            elif prop_type == 'date':
                date_obj = prop.get('date', {})
                return date_obj.get('start') if date_obj else None
            elif prop_type == 'url':
                return prop.get('url')
            elif prop_type == 'relation':
                return [r['id'] for r in prop.get('relation', [])]
            else:
                return None
        except Exception as e:
            logger.warning(f"Error extracting property {prop_name}: {str(e)}")
            return None
    
    def sync_blog_posts(self) -> Dict:
        """Sync Blog Posts database."""
        table_name = 'content_blog_posts'
        stats = {'synced': 0, 'created': 0, 'updated': 0, 'deleted': 0, 'errors': []}
        
        try:
            db_id = os.getenv('NOTION_BLOG_POSTS_DB_ID')
            if not db_id:
                logger.warning("NOTION_BLOG_POSTS_DB_ID not set, skipping blog posts sync")
                return stats
            
            logger.info(f"Syncing {table_name}...")
            
            # Query Notion database
            results = notion.databases.query(database_id=db_id).get('results', [])
            
            for page in results:
                try:
                    props = page['properties']
                    
                    # Extract data
                    data = {
                        'notion_id': page['id'],
                        'title': self.get_notion_property(props, 'Title', 'title'),
                        'slug': self.get_notion_property(props, 'Slug', 'rich_text'),
                        'excerpt': self.get_notion_property(props, 'Excerpt', 'rich_text'),
                        'content': self.get_notion_property(props, 'Content', 'rich_text'),
                        'category': self.get_notion_property(props, 'Category', 'select'),
                        'tags': self.get_notion_property(props, 'Tags', 'multi_select'),
                        'author': self.get_notion_property(props, 'Author', 'rich_text') or 'Kaidyn Brownlie',
                        'publish_date': self.get_notion_property(props, 'Publish Date', 'date'),
                        'read_time': self.get_notion_property(props, 'Read Time', 'number'),
                        'featured': self.get_notion_property(props, 'Featured', 'checkbox'),
                        'image_url': self.get_notion_property(props, 'Image URL', 'url'),
                        'meta_description': self.get_notion_property(props, 'Meta Description', 'rich_text'),
                        'last_synced_at': datetime.utcnow().isoformat()
                    }
                    
                    # Upsert to Supabase
                    result = supabase.table(table_name).upsert(
                        data,
                        on_conflict='notion_id'
                    ).execute()
                    
                    stats['synced'] += 1
                    if result.data:
                        stats['updated'] += 1
                    
                except Exception as e:
                    error_msg = f"Error syncing blog post {page['id']}: {str(e)}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            logger.info(f"✅ Synced {stats['synced']} blog posts")
            self.log_sync_result(table_name, 'success', stats)
            
        except Exception as e:
            error_msg = f"Fatal error syncing {table_name}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
            self.log_sync_result(table_name, 'failed', stats)
        
        return stats
    
    def sync_services(self) -> Dict:
        """Sync Services database."""
        table_name = 'content_services'
        stats = {'synced': 0, 'created': 0, 'updated': 0, 'deleted': 0, 'errors': []}
        
        try:
            db_id = os.getenv('NOTION_SERVICES_DB_ID')
            if not db_id:
                logger.warning("NOTION_SERVICES_DB_ID not set, skipping services sync")
                return stats
            
            logger.info(f"Syncing {table_name}...")
            
            results = notion.databases.query(database_id=db_id).get('results', [])
            
            for page in results:
                try:
                    props = page['properties']
                    
                    data = {
                        'notion_id': page['id'],
                        'name': self.get_notion_property(props, 'Name', 'title'),
                        'slug': self.get_notion_property(props, 'Slug', 'rich_text'),
                        'short_description': self.get_notion_property(props, 'Short Description', 'rich_text'),
                        'full_description': self.get_notion_property(props, 'Full Description', 'rich_text'),
                        'service_category': self.get_notion_property(props, 'Service Category', 'select'),
                        'features': self.get_notion_property(props, 'Features', 'multi_select'),
                        'process_steps': self.get_notion_property(props, 'Process Steps', 'rich_text'),
                        'pricing_info': self.get_notion_property(props, 'Pricing Info', 'rich_text'),
                        'icon': self.get_notion_property(props, 'Icon', 'rich_text'),
                        'image_url': self.get_notion_property(props, 'Image URL', 'url'),
                        'meta_title': self.get_notion_property(props, 'Meta Title', 'rich_text'),
                        'meta_description': self.get_notion_property(props, 'Meta Description', 'rich_text'),
                        'display_order': self.get_notion_property(props, 'Display Order', 'number') or 0,
                        'featured': self.get_notion_property(props, 'Featured', 'checkbox'),
                        'service_tags': self.get_notion_property(props, 'Service Tags', 'multi_select'),
                        'last_synced_at': datetime.utcnow().isoformat()
                    }
                    
                    supabase.table(table_name).upsert(data, on_conflict='notion_id').execute()
                    stats['synced'] += 1
                    
                except Exception as e:
                    error_msg = f"Error syncing service {page['id']}: {str(e)}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            logger.info(f"✅ Synced {stats['synced']} services")
            self.log_sync_result(table_name, 'success', stats)
            
        except Exception as e:
            error_msg = f"Fatal error syncing {table_name}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
            self.log_sync_result(table_name, 'failed', stats)
        
        return stats
    
    def sync_suburbs(self) -> Dict:
        """Sync Suburbs database."""
        table_name = 'content_suburbs'
        stats = {'synced': 0, 'created': 0, 'updated': 0, 'deleted': 0, 'errors': []}
        
        try:
            db_id = os.getenv('NOTION_SUBURBS_DB_ID')
            if not db_id:
                logger.warning("NOTION_SUBURBS_DB_ID not set, skipping suburbs sync")
                return stats
            
            logger.info(f"Syncing {table_name}...")
            
            results = notion.databases.query(database_id=db_id).get('results', [])
            
            for page in results:
                try:
                    props = page['properties']
                    
                    data = {
                        'notion_id': page['id'],
                        'name': self.get_notion_property(props, 'Name', 'title'),
                        'slug': self.get_notion_property(props, 'Slug', 'rich_text'),
                        'postcode': self.get_notion_property(props, 'Postcode', 'rich_text'),
                        'region': self.get_notion_property(props, 'Region', 'select'),
                        'description': self.get_notion_property(props, 'Description', 'rich_text'),
                        'local_seo_content': self.get_notion_property(props, 'Local SEO Content', 'rich_text'),
                        'services_available': self.get_notion_property(props, 'Services Available', 'multi_select'),
                        'distance_from_base': self.get_notion_property(props, 'Distance from Base', 'number'),
                        'projects_completed': self.get_notion_property(props, 'Projects Completed', 'number') or 0,
                        'meta_title': self.get_notion_property(props, 'Meta Title', 'rich_text'),
                        'meta_description': self.get_notion_property(props, 'Meta Description', 'rich_text'),
                        'last_synced_at': datetime.utcnow().isoformat()
                    }
                    
                    supabase.table(table_name).upsert(data, on_conflict='notion_id').execute()
                    stats['synced'] += 1
                    
                except Exception as e:
                    error_msg = f"Error syncing suburb {page['id']}: {str(e)}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            logger.info(f"✅ Synced {stats['synced']} suburbs")
            self.log_sync_result(table_name, 'success', stats)
            
        except Exception as e:
            error_msg = f"Fatal error syncing {table_name}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
            self.log_sync_result(table_name, 'failed', stats)
        
        return stats
    
    def sync_case_studies(self) -> Dict:
        """Sync Case Studies database."""
        table_name = 'content_case_studies'
        stats = {'synced': 0, 'created': 0, 'updated': 0, 'deleted': 0, 'errors': []}
        
        try:
            db_id = os.getenv('NOTION_CASE_STUDIES_DB_ID')
            if not db_id:
                logger.warning("NOTION_CASE_STUDIES_DB_ID not set, skipping case studies sync")
                return stats
            
            logger.info(f"Syncing {table_name}...")
            
            results = notion.databases.query(database_id=db_id).get('results', [])
            
            for page in results:
                try:
                    props = page['properties']
                    
                    data = {
                        'notion_id': page['id'],
                        'study_id': self.get_notion_property(props, 'Study ID', 'title'),
                        'suburb': self.get_notion_property(props, 'Suburb', 'select'),
                        'job_type': self.get_notion_property(props, 'Job Type', 'select'),
                        'client_problem': self.get_notion_property(props, 'Client Problem', 'rich_text'),
                        'solution_provided': self.get_notion_property(props, 'Solution Provided', 'rich_text'),
                        'key_outcome': self.get_notion_property(props, 'Key Outcome', 'rich_text'),
                        'before_image': self.get_notion_property(props, 'Before Image', 'url'),
                        'after_image': self.get_notion_property(props, 'After Image', 'url'),
                        'testimonial': self.get_notion_property(props, 'Testimonial', 'rich_text'),
                        'project_date': self.get_notion_property(props, 'Project Date', 'date'),
                        'featured': self.get_notion_property(props, 'Featured', 'checkbox'),
                        'slug': self.get_notion_property(props, 'Slug', 'rich_text'),
                        'meta_description': self.get_notion_property(props, 'Meta Description', 'rich_text'),
                        'last_synced_at': datetime.utcnow().isoformat()
                    }
                    
                    supabase.table(table_name).upsert(data, on_conflict='notion_id').execute()
                    stats['synced'] += 1
                    
                except Exception as e:
                    error_msg = f"Error syncing case study {page['id']}: {str(e)}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            logger.info(f"✅ Synced {stats['synced']} case studies")
            self.log_sync_result(table_name, 'success', stats)
            
        except Exception as e:
            error_msg = f"Fatal error syncing {table_name}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
            self.log_sync_result(table_name, 'failed', stats)
        
        return stats
    
    def sync_testimonials(self) -> Dict:
        """Sync Testimonials database."""
        table_name = 'content_testimonials'
        stats = {'synced': 0, 'created': 0, 'updated': 0, 'deleted': 0, 'errors': []}
        
        try:
            db_id = os.getenv('NOTION_TESTIMONIALS_DB_ID')
            if not db_id:
                logger.warning("NOTION_TESTIMONIALS_DB_ID not set, skipping testimonials sync")
                return stats
            
            logger.info(f"Syncing {table_name}...")
            
            results = notion.databases.query(database_id=db_id).get('results', [])
            
            for page in results:
                try:
                    props = page['properties']
                    
                    data = {
                        'notion_id': page['id'],
                        'client_name': self.get_notion_property(props, 'Client Name', 'title'),
                        'testimonial_text': self.get_notion_property(props, 'Testimonial Text', 'rich_text'),
                        'rating': self.get_notion_property(props, 'Rating', 'number'),
                        'service_type': self.get_notion_property(props, 'Service Type', 'select'),
                        'suburb': self.get_notion_property(props, 'Suburb', 'select'),
                        'job_date': self.get_notion_property(props, 'Job Date', 'date'),
                        'verified': self.get_notion_property(props, 'Verified', 'checkbox'),
                        'featured': self.get_notion_property(props, 'Featured', 'checkbox'),
                        'last_synced_at': datetime.utcnow().isoformat()
                    }
                    
                    supabase.table(table_name).upsert(data, on_conflict='notion_id').execute()
                    stats['synced'] += 1
                    
                except Exception as e:
                    error_msg = f"Error syncing testimonial {page['id']}: {str(e)}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            logger.info(f"✅ Synced {stats['synced']} testimonials")
            self.log_sync_result(table_name, 'success', stats)
            
        except Exception as e:
            error_msg = f"Fatal error syncing {table_name}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
            self.log_sync_result(table_name, 'failed', stats)
        
        return stats
    
    def sync_knowledge_base(self) -> Dict:
        """Sync Knowledge Base (FAQs) database."""
        table_name = 'content_knowledge_base'
        stats = {'synced': 0, 'created': 0, 'updated': 0, 'deleted': 0, 'errors': []}
        
        try:
            db_id = os.getenv('NOTION_KNOWLEDGE_BASE_DB_ID')
            if not db_id:
                logger.warning("NOTION_KNOWLEDGE_BASE_DB_ID not set, skipping knowledge base sync")
                return stats
            
            logger.info(f"Syncing {table_name}...")
            
            results = notion.databases.query(database_id=db_id).get('results', [])
            
            for page in results:
                try:
                    props = page['properties']
                    
                    data = {
                        'notion_id': page['id'],
                        'question': self.get_notion_property(props, 'Question', 'title'),
                        'answer': self.get_notion_property(props, 'Answer', 'rich_text'),
                        'category': self.get_notion_property(props, 'Category', 'select'),
                        'related_services': self.get_notion_property(props, 'Related Services', 'multi_select'),
                        'display_order': self.get_notion_property(props, 'Display Order', 'number') or 0,
                        'featured': self.get_notion_property(props, 'Featured', 'checkbox'),
                        'last_synced_at': datetime.utcnow().isoformat()
                    }
                    
                    supabase.table(table_name).upsert(data, on_conflict='notion_id').execute()
                    stats['synced'] += 1
                    
                except Exception as e:
                    error_msg = f"Error syncing FAQ {page['id']}: {str(e)}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            logger.info(f"✅ Synced {stats['synced']} FAQs")
            self.log_sync_result(table_name, 'success', stats)
            
        except Exception as e:
            error_msg = f"Fatal error syncing {table_name}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
            self.log_sync_result(table_name, 'failed', stats)
        
        return stats
    
    def sync_knowledge_files(self) -> Dict:
        """Sync Knowledge Files (RAG) database."""
        table_name = 'knowledge_files'
        stats = {'synced': 0, 'created': 0, 'updated': 0, 'deleted': 0, 'errors': []}
        
        try:
            db_id = os.getenv('NOTION_KNOWLEDGE_FILES_DB_ID')
            if not db_id:
                logger.warning("NOTION_KNOWLEDGE_FILES_DB_ID not set, skipping knowledge files sync")
                return stats
            
            logger.info(f"Syncing {table_name}...")
            
            results = notion.databases.query(database_id=db_id).get('results', [])
            
            for page in results:
                try:
                    props = page['properties']
                    
                    data = {
                        'file_key': self.get_notion_property(props, 'File Key', 'title'),
                        'title': self.get_notion_property(props, 'Title', 'rich_text'),
                        'category': self.get_notion_property(props, 'Category', 'select'),
                        'content': self.get_notion_property(props, 'Content', 'rich_text'),
                        'version': self.get_notion_property(props, 'Version', 'number') or 1,
                        'active': self.get_notion_property(props, 'Active', 'checkbox'),
                        'metadata': self.get_notion_property(props, 'Metadata', 'rich_text'),
                        'last_synced_at': datetime.utcnow().isoformat()
                    }
                    
                    supabase.table(table_name).upsert(data, on_conflict='file_key').execute()
                    stats['synced'] += 1
                    
                except Exception as e:
                    error_msg = f"Error syncing knowledge file {page['id']}: {str(e)}"
                    logger.error(error_msg)
                    stats['errors'].append(error_msg)
            
            logger.info(f"✅ Synced {stats['synced']} knowledge files")
            self.log_sync_result(table_name, 'success', stats)
            
        except Exception as e:
            error_msg = f"Fatal error syncing {table_name}: {str(e)}"
            logger.error(error_msg)
            stats['errors'].append(error_msg)
            self.log_sync_result(table_name, 'failed', stats)
        
        return stats
    
    def run_full_sync(self):
        """Execute full sync of all databases."""
        logger.info("=" * 60)
        logger.info("🚀 Starting Notion → Supabase Sync")
        logger.info("=" * 60)
        
        # Sync all databases
        self.sync_blog_posts()
        self.sync_services()
        self.sync_suburbs()
        self.sync_case_studies()
        self.sync_testimonials()
        self.sync_knowledge_base()
        self.sync_knowledge_files()
        
        # Final summary
        logger.info("=" * 60)
        logger.info("✅ Sync Complete")
        logger.info(f"Total records synced: {self.sync_stats['records_synced']}")
        logger.info(f"Total errors: {len(self.sync_stats['errors'])}")
        logger.info("=" * 60)


def main():
    """Main entry point."""
    try:
        syncer = NotionSupabaseSync()
        syncer.run_full_sync()
        sys.exit(0)
    except Exception as e:
        logger.error(f"Fatal error during sync: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
