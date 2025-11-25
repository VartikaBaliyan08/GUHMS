# GUHMS Design Guidelines

## Design Approach: Healthcare System Clarity

**Selected Framework:** Material Design principles adapted for healthcare, emphasizing clinical professionalism, data clarity, and accessibility. Healthcare applications demand trust, efficiency, and information hierarchy - Material's structured approach with cards, elevation, and clear typography serves this perfectly.

**Core Principles:**
- Clinical professionalism with approachable warmth
- Information density balanced with breathing room
- Clear visual hierarchy for critical medical data
- Trust-building through consistency and polish

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - UI, dashboards, data tables
- Accent: Sora (via Google Fonts) - headings, hero sections

**Type Scale:**
- Hero/Display: text-5xl to text-6xl (Sora, font-bold)
- Page Titles: text-3xl to text-4xl (Sora, font-semibold)
- Section Headers: text-xl to text-2xl (Inter, font-semibold)
- Card Titles: text-lg (Inter, font-medium)
- Body/Data: text-base (Inter, font-normal)
- Captions/Meta: text-sm (Inter, font-normal)
- Small Print: text-xs (Inter)

---

## Layout & Spacing System

**Tailwind Spacing Units:** 2, 4, 6, 8, 12, 16, 20, 24

**Application:**
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20, py-24
- Card gaps: gap-4, gap-6, gap-8
- Form field spacing: space-y-4, space-y-6
- Icon-text gaps: gap-2, gap-3

**Container Strategy:**
- Public pages: max-w-7xl mx-auto px-6
- Dashboard content: max-w-[1400px] mx-auto px-8
- Forms/modals: max-w-md to max-w-2xl
- Data tables: w-full with horizontal scroll on mobile

---

## Component Library

### Navigation
**Navbar:**
- Fixed top, backdrop-blur-lg with glassmorphism effect
- Height: h-16
- Logo: h-8 with text-xl brand name
- Navigation links: text-sm font-medium with underline decoration on hover
- Theme toggle: sun/moon icon button (rounded-full p-2)
- User avatar: rounded-full h-9 w-9 with dropdown menu

**Footer:**
- py-8 to py-12, border-t
- Three-column grid (lg:grid-cols-3) for: branding, links, legal
- Copyright text-sm, links text-sm hover:underline

### Dashboard Components

**Stats Cards:**
- Rounded-xl, p-6
- Icon in colored circle (h-12 w-12, rounded-full) top-left
- Large metric: text-3xl font-bold
- Label: text-sm below metric
- Optional trend indicator: text-xs with up/down arrow

**Data Tables:**
- Rounded-lg overflow with border
- Header: bg-accent, font-semibold, text-sm, px-6 py-3
- Rows: px-6 py-4, border-b, hover state with subtle highlight
- Actions column: flex gap-2 with icon buttons
- Search bar above: max-w-sm with magnifying glass icon

**Appointment Cards:**
- Rounded-lg, p-4 to p-6
- Status badge: top-right, rounded-full px-3 py-1 text-xs font-medium
- Time: text-lg font-semibold with clock icon
- Patient/Doctor name: text-base font-medium
- Reason/notes: text-sm
- Actions: flex gap-2 at bottom

**Forms:**
- Labels: text-sm font-medium, mb-1.5
- Inputs: rounded-lg, px-4 py-2.5, border with focus ring
- Button groups: flex gap-3
- Field spacing: space-y-4
- Error messages: text-sm text-red-600 mt-1

### Public Pages

**Landing Hero:**
- Full viewport height (min-h-screen) with medical imagery
- Content overlay with backdrop-blur on image
- Centered content: max-w-4xl mx-auto
- Hero title: text-5xl to text-6xl font-bold
- Subtitle: text-xl to text-2xl, max-w-2xl
- CTA buttons: gap-4, primary + secondary variant
- Large hero image showing hospital/doctor/patient interaction with modern UI

**Feature Sections:**
- py-20 to py-24 spacing between sections
- Alternating layouts: text-left with image-right, then reverse
- Icon boxes: grid-cols-1 md:grid-cols-3 gap-8
- Each feature: icon (h-12 w-12), title (text-xl), description (text-base)

### Modals & Overlays

**Modal Structure:**
- Backdrop: fixed inset-0 with blur and dim
- Content: max-w-2xl, rounded-2xl, p-6 to p-8
- Header: text-2xl font-semibold, close button top-right
- Body: space-y-6
- Footer: flex justify-end gap-3

**Appointment Slot Picker:**
- Calendar grid: grid-cols-7 gap-2
- Time slots: grid-cols-3 to grid-cols-4 gap-3
- Available slots: rounded-lg p-3 text-center, border, hover effect
- Selected: ring-2 treatment

**Doctor Cards:**
- Rounded-xl, p-6
- Doctor image: rounded-full h-20 w-20
- Name: text-lg font-semibold
- Specialization: text-sm with medical bag icon
- Experience: text-sm with star icon
- "View Availability" button at bottom

---

## Theme System Implementation

**Required Dual Theme Support:**
Users explicitly require smooth dark/light theme toggle with persistence. While specific color values aren't dictated here, the structure must support:
- Global theme context with toggle
- Smooth transition animations (transition-colors duration-200)
- All components theme-aware
- localStorage persistence
- Theme toggle in navbar (sun/moon icon switch)

---

## Medical Imagery Strategy

**Images Section:**

**Hero Image (Landing):**
- Large, professional photo of doctor-patient interaction or modern hospital dashboard UI
- Placement: Full-width background for hero section
- Style: Bright, trustworthy, showing diversity and care
- Source: Unsplash/Pexels medical/healthcare category

**Feature Section Images:**
- Admin dashboard mockup screenshot
- Doctor with tablet/medical technology
- Patient using mobile health app
- Modern hospital interior

**Dashboard Illustrations:**
- Empty states: friendly medical illustrations (stethoscope, calendar, prescription pad)
- Success states: checkmark with medical cross

**Icons:** Use Lucide React for medical-specific icons (stethoscope, pill, calendar, user-md, clipboard, etc.)

---

## Animations

**Minimal, Purposeful Motion:**
- Page transitions: fade + slight y-offset (20px)
- Theme toggle: rotate animation on icon
- Modal enter/exit: scale(0.95) to scale(1) + opacity
- Card hover: subtle lift (translateY(-2px))
- Button hover: slight scale(1.02)
- Loading states: pulse on skeletons
- Toast notifications: slide from top-right

**No continuous/distracting animations** - healthcare professionals need focus.

---

## Accessibility Standards

- Focus rings on all interactive elements (ring-2 ring-offset-2)
- ARIA labels on icon-only buttons
- Form validation with error announcements
- Keyboard navigation throughout
- Sufficient contrast ratios for medical data readability
- Table headers properly marked for screen readers