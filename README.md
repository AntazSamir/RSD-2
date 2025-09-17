# Restaurant Dashboard

A comprehensive restaurant management dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Order management system with real-time updates
- Table management and reservations
- Menu management with inventory tracking
- Staff management and scheduling
- Customer relationship management
- Analytics and reporting
- Responsive design for all device sizes
- Supabase authentication (sign in, sign up, logout)
- Email notifications via Brevo SMTP

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Components
- **State Management**: React Hooks
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Email**: Nodemailer with Brevo SMTP
- **Testing**: Jest, React Testing Library

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd restaurant-dashboard
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Supabase Setup

The project is already configured with Supabase credentials. The environment variables are set in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://gnyalsebkwmbsqxhtpzw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueWFsc2Via3dtYnNxeGh0cHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMTg1NDUsImV4cCI6MjA3MzY5NDU0NX0.WIFI6rnMn0jJHhOLSErV13MPNACvjbjijRcRDWaxPAI
```

If you want to use your own Supabase project:
1. Create a Supabase project at [supabase.com](https://supabase.com/)
2. Get your project URL and anon key from the Supabase dashboard
3. Update the values in `.env.local`

Enable email authentication in your Supabase project settings.

### Brevo SMTP Setup

To enable email notifications, you need to configure Brevo (formerly Sendinblue) SMTP:

1. Create a [Brevo account](https://www.brevo.com/)
2. Get your SMTP credentials from the Brevo dashboard
3. Add the following to your `.env.local` file:
   ```
   BREVO_SMTP_HOST=smtp-relay.sendinblue.com
   BREVO_SMTP_PORT=587
   BREVO_SMTP_USER=your_brevo_login
   BREVO_SMTP_PASS=your_brevo_password
   BREVO_SENDER_EMAIL=sender@yourdomain.com
   BREVO_SENDER_NAME="Restaurant Dashboard"
   ```

### Database Seeding

To populate your Supabase database with sample data, you have two options:

#### Option 1: Using the Web Interface
1. Start the development server: `npm run dev`
2. Visit [http://localhost:3000/seed-database](http://localhost:3000/seed-database)
3. Click the "Seed Database" button

#### Option 2: Using the Command Line
```bash
npm run seed
```

This will create tables and insert sample records for:
- Users (manager, chef, waiter)
- Menu items (pizza, salad, salmon, cake)
- Tables (with different capacities and statuses)
- Orders (sample orders with different statuses)

### Development

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Running Tests

To run the test suite:

```bash
npm run test
# or
yarn test
# or
pnpm test
```

## Project Structure

```
restaurant-dashboard/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── lib/                 # Business logic and data utilities
│   ├── supabase/        # Supabase authentication files
│   └── brevo/           # Brevo email service files
├── public/              # Static assets
├── styles/              # Global styles
├── types/               # TypeScript type definitions
├── __tests__/           # Test files
└── ...
```

## Authentication Flow

The application uses Supabase Auth for authentication:
- Users can sign up with email and password
- Users can sign in with email and password
- Google OAuth is also supported
- Protected routes require authentication
- Session is persisted across page reloads

## Email Notifications

The application uses Brevo SMTP for sending emails:
- Reservation confirmations
- Order confirmations
- Password reset emails
- Test email functionality at `/test-email`

## Testing Supabase Connection

You can test the Supabase connection by visiting `/test-supabase` in your browser.

## Testing Email Functionality

You can test the email functionality by visiting `/test-email` in your browser.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide](https://lucide.dev/)
- Charts from [Recharts](https://recharts.org/)
- Authentication with [Supabase](https://supabase.com/)
- Email service with [Brevo](https://www.brevo.com/)