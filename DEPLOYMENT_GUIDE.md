# Deployment Guide

This guide will help you deploy the Restaurant Dashboard application to GitHub and Vercel.

## GitHub Setup

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name your repository (e.g., "restaurant-dashboard")
   - Set visibility to Public or Private as desired
   - Do NOT initialize with a README, .gitignore, or license
   - Click "Create repository"

2. Push the code to GitHub:
   ```bash
   git remote add origin https://github.com/your-username/restaurant-dashboard.git
   git branch -M main
   git push -u origin main
   ```

## Vercel Deployment

1. Sign up or log in to Vercel:
   - Go to https://vercel.com
   - Sign up with GitHub, GitLab, or email

2. Import your project:
   - Click "New Project"
   - Connect your Git provider (GitHub)
   - Select your repository
   - Click "Import"

3. Configure project settings:
   - Framework Preset: Next.js
   - Root Directory: Leave as is (should auto-detect)
   - Build and Output Settings: Leave as default

4. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL: `your_supabase_url`
   - NEXT_PUBLIC_SUPABASE_ANON_KEY: `your_supabase_anon_key`
   - BREVO_SMTP_HOST: `smtp-relay.brevo.com`
   - BREVO_SMTP_PORT: `587`
   - BREVO_SMTP_USER: `your_brevo_login`
   - BREVO_SMTP_PASS: `your_brevo_password`
   - BREVO_SENDER_EMAIL: `sender@yourdomain.com`
   - BREVO_SENDER_NAME: `"Restaurant Dashboard"`

5. Click "Deploy"

## Post-Deployment Steps

1. After deployment is complete, visit your deployed URL
2. Test the authentication flow (sign up, sign in, sign out)
3. Test the database seeding by visiting `/seed-database`
4. Test email functionality by visiting `/test-email`
5. Test Supabase connection by visiting `/test-supabase`

## Custom Domain (Optional)

1. In your Vercel dashboard, go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (may take a few minutes to hours)

## Environment Variables Security

Important notes about environment variables:
- Public variables (NEXT_PUBLIC_*) are visible in client-side code
- Private variables (without NEXT_PUBLIC_ prefix) are only available server-side
- Never commit sensitive environment variables to version control
- Vercel provides secure environment variable management

## Troubleshooting

Common issues and solutions:

1. **Build failures**: Check the build logs in Vercel dashboard
2. **Authentication issues**: Verify Supabase environment variables
3. **Email not sending**: Check Brevo SMTP credentials
4. **Database connection errors**: Verify Supabase URL and key
5. **404 errors**: Check routing configuration in Next.js app directory

## Updating Your Deployment

To update your deployed application:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. Vercel will automatically detect the changes and redeploy

## Monitoring and Analytics

Vercel provides built-in monitoring:
- Performance analytics
- Error tracking
- Real-time logs
- Custom domains with SSL

For more detailed analytics, consider integrating:
- Google Analytics
- Sentry for error tracking
- LogRocket for session replay