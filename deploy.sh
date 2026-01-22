#!/bin/bash

# BDN App Deployment Script
# This script helps deploy the app to both App Store and Google Play

set -e  # Exit on error

echo "🚀 BDN App Deployment Script"
echo "============================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo -e "${RED}❌ EAS CLI not found. Installing...${NC}"
    npm install -g eas-cli
fi

# Check if logged in
echo -e "${YELLOW}Checking EAS login status...${NC}"
if ! eas whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in. Please login:${NC}"
    eas login
fi

echo -e "${GREEN}✅ Logged in as: $(eas whoami)${NC}"
echo ""

# Menu
echo "What would you like to do?"
echo "1) Set up credentials (Android & iOS)"
echo "2) Build for production (both platforms)"
echo "3) Submit to stores (both platforms)"
echo "4) Build and submit (all-in-one)"
echo "5) Push OTA update (after database connection)"
echo "6) Check build status"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        echo -e "${YELLOW}Setting up Android credentials...${NC}"
        eas credentials
        echo -e "${YELLOW}Setting up iOS credentials...${NC}"
        eas credentials
        echo -e "${GREEN}✅ Credentials configured!${NC}"
        ;;
    2)
        echo -e "${YELLOW}Building for production (this may take 15-30 minutes per platform)...${NC}"
        eas build --platform all --profile production
        echo -e "${GREEN}✅ Builds complete! Check status with: eas build:list${NC}"
        ;;
    3)
        echo -e "${YELLOW}Submitting to stores...${NC}"
        eas submit --platform all --profile production
        echo -e "${GREEN}✅ Submission complete!${NC}"
        ;;
    4)
        echo -e "${YELLOW}Building for production...${NC}"
        eas build --platform all --profile production
        echo -e "${YELLOW}Builds complete. Submitting to stores...${NC}"
        eas submit --platform all --profile production
        echo -e "${GREEN}✅ Build and submission complete!${NC}"
        ;;
    5)
        read -p "Enter update message: " message
        echo -e "${YELLOW}Pushing OTA update...${NC}"
        eas update --branch production --message "$message"
        echo -e "${GREEN}✅ OTA update pushed!${NC}"
        ;;
    6)
        echo -e "${YELLOW}Recent builds:${NC}"
        eas build:list --limit 5
        echo ""
        echo -e "${YELLOW}Recent submissions:${NC}"
        eas submit:list --limit 5
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
