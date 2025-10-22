# FAQ Management System

## Overview
The FAQ management system allows administrators to create, read, update, and delete frequently asked questions through the admin portal. The FAQs are stored in the database and displayed dynamically on the public FAQ page.

## Features

### Admin Portal Features
- **View FAQs**: See all FAQs with their order, status, and creation date
- **Create FAQ**: Add new FAQs with question, answer, order, and active status
- **Edit FAQ**: Update existing FAQ content, order, and status
- **Delete FAQ**: Remove FAQs from the system
- **Order Management**: Set custom order for FAQ display
- **Active/Inactive Status**: Toggle FAQ visibility

### Public FAQ Page Features
- **Dynamic Loading**: FAQs are loaded from the database
- **Collapsible Interface**: Click to expand/collapse FAQ answers
- **Link Support**: Automatic detection and linking of internal links (e.g., `/waiver`)
- **Error Handling**: Graceful error handling with retry functionality
- **Loading States**: User-friendly loading indicators

## Database Schema

```sql
model FAQ {
  id        String   @id @default(uuid())
  question  String
  answer    String
  order     Int      @default(0) // For custom ordering
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  @@index([isActive])
  @@index([order])
  @@map("faqs")
}
```

## API Endpoints

### Public API
- `GET /api/faqs` - Get all active FAQs for public display

### Admin API (Requires Authentication)
- `GET /api/admin/faqs` - Get all FAQs (admin only)
- `POST /api/admin/faqs` - Create new FAQ (admin only)
- `PATCH /api/admin/faqs` - Update existing FAQ (admin only)
- `DELETE /api/admin/faqs` - Delete FAQ (admin only)

## Setup Instructions

### 1. Database Migration
```bash
# Push the new schema to your database
npm run db:push

# Migrate existing hardcoded FAQs to database
npm run db:migrate-faqs
```

### 2. Admin Access
1. Log in to the admin portal at `/admin`
2. Navigate to the "FAQs" tab
3. Use the "Create FAQ" button to add new FAQs

### 3. Public Display
- FAQs are automatically displayed on `/faq` page
- Only active FAQs are shown to the public
- FAQs are ordered by the `order` field, then by creation date

## Migration from Hardcoded FAQs

The system includes a migration script that will:
1. Check if FAQs already exist in the database
2. If no FAQs exist, migrate all 21 hardcoded FAQs
3. Preserve the original order and content
4. Set all migrated FAQs as active

## Usage Examples

### Creating a New FAQ
1. Go to Admin Portal → FAQs tab
2. Click "Create FAQ"
3. Fill in:
   - **Question**: "What should I wear?"
   - **Answer**: "Costumes are required. See the dress code section for details."
   - **Order**: 5 (for positioning)
   - **Active**: ✓ (checked)
4. Click "Create FAQ"

### Editing an FAQ
1. Find the FAQ in the admin list
2. Click "Edit FAQ"
3. Modify the content as needed
4. Click "Update FAQ"

### Reordering FAQs
1. Edit each FAQ and adjust the "Order" field
2. Lower numbers appear first
3. FAQs with the same order are sorted by creation date

## Technical Details

### Frontend Components
- **FAQ Page**: `/src/app/faq/page.tsx` - Public FAQ display
- **Admin FAQ Tab**: `/src/app/admin/page.tsx` - Admin management interface
- **API Routes**: `/src/app/api/faqs/` and `/src/app/api/admin/faqs/`

### State Management
- Uses React hooks for local state management
- Real-time updates after CRUD operations
- Error handling with user feedback

### Security
- Admin API routes require authentication
- Public API only returns active FAQs
- Input validation on all forms

## Troubleshooting

### FAQs Not Loading
1. Check database connection
2. Verify FAQ table exists: `npm run db:push`
3. Check if FAQs exist: `npm run db:migrate-faqs`

### Admin Access Issues
1. Ensure you're logged in as admin
2. Check authentication status
3. Verify admin role in session

### Order Not Working
1. Ensure order field is a number
2. Check database for duplicate order values
3. Refresh the page after updating order

## Future Enhancements
- Bulk import/export functionality
- FAQ categories/tags
- Search functionality
- FAQ analytics (most viewed, etc.)
- Rich text editor for answers
- FAQ templates
