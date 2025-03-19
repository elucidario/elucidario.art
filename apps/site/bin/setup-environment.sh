#!/bin/bash

# Ask user for URLs
read -p "Type dev lead URL: " DEV_URL
read -p "Type prod lead URL: " PROD_URL

# Create files
echo "VITE_LEAD_URL=$DEV_URL" > .env.development
echo "VITE_LEAD_URL=$PROD_URL" > .env.production

# Inform user
echo "Environment setup complete!"
