# Admin Navigation Guide

## Overview
The admin section has been reorganized for clarity and ease of access. All administrative tools are now clearly grouped under the **Admin** section in the sidebar navigation.

## Access
**Route**: `/internal/v2/admin`
**Permission**: Requires admin role

## Admin Hub Dashboard
Central dashboard showing:
- Quick stats (knowledge base, RAG coverage, system status)
- All admin tools with descriptions
- Quick action buttons for common tasks

## Admin Tools

### 1. Admin Hub (`/internal/v2/admin`)
**Purpose**: Central dashboard for all admin functions
**Features**:
- Overview of system statistics
- Quick access cards to all admin tools
- Common administrative actions

### 2. User Management (`/internal/v2/admin/users`)
**Purpose**: Manage user accounts, roles, and permissions
**Features**:
- View all users
- Assign/revoke admin roles
- Manage user permissions
- User activity monitoring

### 3. Knowledge Files (`/internal/v2/admin/storage`)
**Purpose**: Browse and manage knowledge base files
**Features**:
- File browser with search and filtering
- File editor (view/edit content)
- Version history
- Conflict resolution
- Category-based views
- Statistics and analytics

**Use Cases**:
- Edit existing knowledge documents
- Review file versions
- Resolve conflicts between duplicates
- Browse by category

### 4. Upload Knowledge (`/internal/v2/admin/upload`)
**Purpose**: Upload new knowledge files to the system
**Features**:
- Drag-and-drop file upload
- AI-powered categorization
- Multi-document parsing
- Automatic embedding generation
- Upload history tracking

**Supported Formats**: .md, .txt, .pdf, .docx

**Use Cases**:
- Add new MKF documents
- Import service descriptions
- Upload SOPs and workflows
- Add FAQ content

### 5. Generate Embeddings (`/internal/v2/admin/embeddings`)
**Purpose**: Create vector embeddings for RAG search
**Features**:
- View embedding coverage statistics
- Category-level breakdown
- One-click bulk embedding generation
- Progress tracking
- Error reporting

**Use Cases**:
- Generate embeddings for newly uploaded files
- Re-embed documents after content updates
- Complete RAG coverage for full-text search

### 6. AI Assistant (`/internal/v2/ai-assistant`)
**Purpose**: Internal AI assistant for admin tasks
**Features**:
- Chat interface with AI
- Access to full knowledge base via RAG
- Administrative task automation
- System information queries

## Navigation Structure

```
Admin (Shield Icon)
├── Admin Hub (Dashboard)
├── User Management (Users)
├── Knowledge Files (Storage/Browser)
├── Upload Knowledge (Import)
├── Generate Embeddings (AI/Vector DB)
└── AI Assistant (Chat)
```

## Workflow Examples

### Adding New Knowledge Content
1. **Upload** (`/internal/v2/admin/upload`)
   - Upload .md file with content
   - AI auto-categorizes (or specify manually)
   - System generates embeddings
   
2. **Verify** (`/internal/v2/admin/storage`)
   - Check file appears in browser
   - Review content and metadata
   
3. **Embed** (if auto-embed was disabled)
   - Go to `/internal/v2/admin/embeddings`
   - Generate missing embeddings

### Managing Existing Files
1. **Browse** (`/internal/v2/admin/storage`)
   - Search or filter by category
   - Select file to view/edit
   
2. **Edit** (in file editor)
   - Modify content
   - Save new version
   - Re-embed if needed

3. **Resolve Conflicts** (if any)
   - Use conflict resolver chat
   - AI helps decide which version to keep

### Setting Up New Admin User
1. **User Management** (`/internal/v2/admin/users`)
   - Find user in list
   - Assign 'admin' role
   - User gains access to Admin section

## Key Improvements from Previous Structure

### Before
- Admin tools scattered across different sections
- Confusing redirects (`/admin/knowledge-base` → `/admin/storage`)
- Missing tools in navigation (embeddings, upload)
- No central admin dashboard
- AI Assistant buried in admin section

### After
- ✅ All admin tools in one section
- ✅ Clear, descriptive names
- ✅ Central Admin Hub dashboard
- ✅ Logical grouping (users, files, upload, embeddings)
- ✅ No confusing redirects
- ✅ All tools visible in sidebar
- ✅ Quick access via Admin Hub

## Legacy Redirects

For backward compatibility, old routes redirect to new locations:
- `/admin/knowledge` → `/admin/storage`
- `/admin/knowledge-base` → `/admin/storage`
- `/admin/database` → `/admin/storage`

## Mobile Access

On mobile devices:
1. Tap the menu icon (hamburger) to open sidebar
2. Scroll to "Admin" section
3. Tap to expand admin tools
4. Select desired admin tool

## Permissions

All admin routes require:
- Valid user authentication
- `admin` role in `user_roles` table

Non-admin users will not see the Admin section in the sidebar.

## Quick Reference

| Task | Route | Description |
|------|-------|-------------|
| Overview | `/internal/v2/admin` | Admin dashboard |
| Manage users | `/internal/v2/admin/users` | User roles & permissions |
| Browse files | `/internal/v2/admin/storage` | Knowledge file browser |
| Upload new | `/internal/v2/admin/upload` | Import knowledge files |
| Generate vectors | `/internal/v2/admin/embeddings` | Create RAG embeddings |
| AI help | `/internal/v2/ai-assistant` | Admin AI assistant |

## Support

For issues or questions:
1. Check console logs (browser dev tools)
2. Review edge function logs (Supabase dashboard)
3. Check database tables (`knowledge_uploads`, `master_knowledge`)
4. Verify user has admin role in `user_roles` table
