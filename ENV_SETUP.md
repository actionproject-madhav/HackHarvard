# Environment Setup Guide

This guide explains how to set up environment variables for the project.

## Important Notes

- **Never commit `.env` files to git** - they contain sensitive information
- Always use `.env.example` files as templates
- Copy `.env.example` to `.env` and fill in your actual values

## Backend Setup

1. Navigate to the `backend/` directory
2. Copy the example file: `cp .env.example .env`
3. Edit `.env` and fill in your actual values:
   - Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Get Gemini API key from [Google AI Studio](https://aistudio.google.com/)
   - Get Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Generate a secure secret key for Flask

## Frontend Setup

1. Navigate to the `frontend/` directory
2. Copy the example file: `cp .env.example .env`
3. Edit `.env` and fill in your actual values:
   - Set the correct API URL for your backend
   - Add any required API keys for frontend functionality

## Security Best Practices

- Use strong, unique secret keys
- Never share your `.env` files
- Use different credentials for development and production
- Regularly rotate your API keys
- Use environment-specific configurations

## Git Configuration

The `.gitignore` files are configured to:
- Ignore all `.env` files
- Allow `.env.example` files to be committed
- Ignore common build artifacts and dependencies

## Troubleshooting

If you're having issues:
1. Make sure your `.env` file is in the correct directory
2. Check that all required variables are set
3. Verify your API keys are valid
4. Restart your development server after changing environment variables
