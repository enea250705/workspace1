# Workforce Manager Deployment Guide

This guide provides instructions for deploying the Workforce Manager application on Render.

## Prerequisites

- A Render account (https://render.com)
- Git repository with your code
- Email account credentials for sending notifications

## Deployment Steps

### Option 1: Deploy using render.yaml (Recommended)

1. Fork or clone this repository to your GitHub account
2. Connect your GitHub account to Render
3. Click "New" > "Blueprint" in the Render dashboard
4. Select your repository
5. Render will automatically detect the `render.yaml` file and configure the services
6. Set the required environment variables:
   - `EMAIL_USER`: Your email address for sending notifications
   - `EMAIL_PASS`: Your email password or app password

### Option 2: Manual Deployment

#### Backend Service

1. In the Render dashboard, click "New" > "Web Service"
2. Connect your repository
3. Configure the service:
   - **Name**: workforce-manager-backend
   - **Environment**: Node
   - **Region**: Frankfurt (or your preferred region)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free

4. Add environment variables:
   - `NODE_ENV`: production
   - `SESSION_SECRET`: (generate a random string)
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_PORT`: 587
   - `EMAIL_USER`: Your email address
   - `EMAIL_PASS`: Your email password or app password

#### Database

1. In the Render dashboard, click "New" > "PostgreSQL"
2. Configure the database:
   - **Name**: workforce-db
   - **Region**: Frankfurt (or your preferred region)
   - **Plan**: Free

3. After creation, copy the "Internal Database URL" from the database dashboard

4. Go back to your backend service and add the environment variable:
   - `DATABASE_URL`: (paste the Internal Database URL)

#### Frontend Service

1. In the Render dashboard, click "New" > "Static Site"
2. Connect your repository
3. Configure the service:
   - **Name**: workforce-manager-frontend
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: dist
   - **Region**: Frankfurt (or your preferred region)

4. Add environment variables:
   - `VITE_API_URL`: (URL of your backend service, e.g., https://workforce-manager-backend.onrender.com)

5. Add a redirect rule:
   - **Source**: /*
   - **Destination**: /index.html
   - **Status**: 200

## Troubleshooting

- **Database Connection Issues**: Ensure the DATABASE_URL is correctly set and the database is accessible from the backend service
- **Email Sending Issues**: Verify your email credentials and ensure less secure apps are allowed or you're using an app password
- **Build Failures**: Check the build logs for errors and ensure all dependencies are correctly installed

## Maintenance

- Monitor your services in the Render dashboard
- Check logs for errors
- Set up alerts for service downtime 