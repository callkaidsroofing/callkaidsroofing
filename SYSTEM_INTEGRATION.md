# Call Kaids Roofing - Internal System Integration Guide

## System Architecture Overview

The internal system is a comprehensive business management platform with the following components:

### 1. **Authentication & Authorization**
- **Role-based access control** using `user_roles` table
- Two roles: `admin` and `inspector`
- Secure session management with Supabase Auth
- Auto-redirect for authenticated users
- Protected routes with `AuthGuard` component

### 2. **Core Modules**

#### **Dashboard (Inspection Reports)**
- View, filter, and manage inspection reports
- Grid and table view modes
- Advanced filtering (status, priority, date range)
- Direct link to quote generation
- Report viewer with detailed inspection data

#### **Quotes Management**
- Create, edit, send, and delete quotes
- Professional PDF export
- Email delivery with Resend integration
- Quote history and version tracking
- Email tracking (sent, viewed, reminder)
- Three-tier pricing system (Essential, Premium, Complete)

#### **Leads Management**
- Track and convert website leads
- Task and follow-up management
- Activity timeline with notes
- Lead status workflow (new → contacted → scheduled → converted/lost)
- Export functionality

#### **AI Chat Dashboard**
- **Public-facing chatbot**: Lead capture, image analysis (Gemini Vision), competitor quote extraction
- **Internal assistant**: Voice-to-text, inspection reporting, quote generation, SOP lookup
- Analytics tracking

### 3. **Data Flow**

```
Lead Capture (Website) 
  → Leads Dashboard 
    → Create Inspection 
      → Generate Quote 
        → Send Quote (Email) 
          → Track Follow-ups 
            → Job Activation
```

### 4. **Database Schema**

**Core Tables:**
- `inspection_reports` - Field inspection data
- `quotes` + `quote_line_items` - Quote generation
- `leads` - Website lead capture
- `lead_tasks` + `lead_notes` - Lead management
- `user_roles` - Permission management
- `chat_conversations` + `chat_messages` - AI chat history
- `image_analyses` + `voice_transcriptions` - AI processing

**RLS Security:**
- All tables protected with Row-Level Security
- Inspector role required for most operations
- Admin role for sensitive operations (delete quotes, manage users)

### 5. **Edge Functions (Supabase)**

| Function | Purpose | AI Model |
|----------|---------|----------|
| `analyze-image` | Roof condition analysis, competitor quote OCR, damage assessment | Gemini 2.5 Flash |
| `transcribe-voice` | Voice-to-text for field reporting | OpenAI Whisper |
| `internal-assistant` | Command-driven employee support | Gemini 2.5 Flash |
| `chat-customer-support` | Public chatbot for website visitors | Gemini 2.5 Flash |
| `send-quote-email` | Email delivery with Resend | N/A |
| `send-lead-notification` | Lead alerts | N/A |

### 6. **Error Handling**

**Centralized Error Management:**
- `lib/errorHandling.ts` - Error classification and user-friendly messages
- `hooks/useErrorHandler.ts` - Consistent error display
- `GlobalErrorBoundary` - React error boundary for catastrophic failures
- Proper validation on all inputs

### 7. **State Management**

**Authentication:**
- `useAuth` hook - Session state, user info, role checking
- Automatic role verification on auth change
- Secure sign-out with state cleanup

**Loading States:**
- `useLoadingState` hook - Multiple concurrent operations
- Skeleton loaders for better UX
- Proper loading indicators

**Form State:**
- React Hook Form with Zod validation
- Autosave functionality for inspection forms
- Draft restoration from localStorage

### 8. **UI/UX Enhancements**

- **Animations**: Fade-in, slide, scale animations for smooth transitions
- **Responsive Design**: Mobile-first approach with Tailwind
- **Design System**: Semantic color tokens, consistent spacing
- **Accessibility**: Proper ARIA labels, keyboard navigation
- **Visual Feedback**: Toast notifications, autosave indicators, loading states

### 9. **Security Measures**

- ✅ Row-Level Security on all tables
- ✅ Secure definer functions for role checking
- ✅ Input validation and sanitization
- ✅ No hardcoded credentials
- ✅ Cascade deletes to prevent orphaned data
- ✅ CORS headers properly configured
- ✅ Rate limiting on API endpoints

### 10. **Integration Points**

**Email System (Resend):**
- Quote delivery
- Lead notifications
- Follow-up reminders
- ABN and company details in all emails

**AI Services (Lovable AI Gateway):**
- Gemini Vision for image analysis
- Whisper for voice transcription
- Gemini Flash for conversational AI

**Storage (Supabase Storage):**
- `media` bucket (public) - General assets
- `inspection-photos` bucket (private) - Inspection images

### 11. **Workflow Automation**

**Inspection → Quote Pipeline:**
1. Inspector creates inspection report
2. Report saved with measurements and photos
3. Quote builder auto-populates from report
4. Line items calculated from KF_02 pricing model
5. Quote PDF generated with company branding
6. Email sent via Resend with tracking

**Lead Management Pipeline:**
1. Lead captured from website (public chatbot)
2. Appears in Leads Dashboard
3. Follow-up task auto-created
4. Activity timeline tracks interactions
5. Lead converts to inspection booking
6. Status updated throughout lifecycle

### 12. **Performance Optimizations**

- Lazy loading for route components
- Optimized images with variants
- Database query optimization with indexes
- Debounced search inputs
- Pagination for large datasets
- Memoized calculations

### 13. **Testing & Debugging**

**Available Tools:**
- Console logs (non-sensitive data only)
- Network request monitoring
- Supabase analytics query
- Edge function logs
- Real-time error tracking

### 14. **Deployment Checklist**

- [ ] All RLS policies enabled and tested
- [ ] Resend API key configured
- [ ] Lovable API key configured
- [ ] Email confirmation disabled (for testing)
- [ ] Admin user created via `create_admin_for_authenticated_user()`
- [ ] Inspector roles assigned
- [ ] Storage buckets properly configured
- [ ] Edge functions deployed
- [ ] Custom domain configured
- [ ] SSL certificate active

### 15. **Known Limitations**

- Quote deletion requires admin role
- Image uploads limited to 10MB
- Voice transcription max 10 minutes
- Email rate limits apply (Resend tier)
- AI API usage tracked (Lovable AI limits)

### 16. **Future Enhancements**

- Bulk quote operations
- Advanced reporting/analytics
- Mobile app integration
- Automated job scheduling
- Customer portal
- Payment processing integration

## Quick Reference Commands

**Create Admin User (Run once):**
```sql
SELECT create_admin_for_authenticated_user();
```

**Assign Inspector Role:**
```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'inspector');
```

**View System Analytics:**
- Navigate to `/internal/chat` → Analytics tab

## Support Contacts

- Technical: Built on Lovable.dev
- Email: callkaidsroofing@outlook.com
- Phone: 0435 900 709
- ABN: 39475055075

---

**System Status: ✅ Fully Operational**
Last Updated: 2025-01-19