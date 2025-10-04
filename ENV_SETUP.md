# Environment Setup Guide

This guide explains how to set up environment variables for the project.

## Important Notes

- **Never commit `.env` files to git** - they contain sensitive information
- The `.env` files are already created with placeholder values
- Replace the placeholder values with your actual credentials

## Backend Setup

1. Navigate to the `backend/` directory
2. Edit the existing `.env` file and replace placeholder values:
   - `MONGO_URI`: Your MongoDB connection string
   - `GOOGLE_CLIENT_ID`: Get from [Google Cloud Console](https://console.cloud.google.com/)
   - `GOOGLE_CLIENT_SECRET`: Get from [Google Cloud Console](https://console.cloud.google.com/)
   - `GEMINI_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/)
   - `GOOGLE_MAPS_API_KEY`: Get from [Google Cloud Console](https://console.cloud.google.com/)
   - `SECRET_KEY`: Generate a secure secret key for Flask

## Frontend Setup

1. Navigate to the `frontend/` directory
2. Edit the existing `.env` file and replace placeholder values:
   - `REACT_APP_API_URL`: Your backend API URL (default: http://localhost:5000)
   - `REACT_APP_API_BASE_URL`: Your backend API base URL (default: http://localhost:5000/api)
   - `REACT_APP_GOOGLE_MAPS_API_KEY`: Google Maps API key if used in frontend

## Security Best Practices

- Use strong, unique secret keys
- Never share your `.env` files
- Use different credentials for development and production
- Regularly rotate your API keys
- Use environment-specific configurations

## Git Configuration

The `.gitignore` files are configured to:
- Ignore all `.env` files (they will never be committed to git)
- Ignore common build artifacts and dependencies
- Protect sensitive environment data

## Troubleshooting

If you're having issues:
1. Make sure your `.env` file is in the correct directory
2. Check that all required variables are set
3. Verify your API keys are valid
4. Restart your development server after changing environment variables
