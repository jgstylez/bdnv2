# Deployment Checklist - Flutter to Expo Migration

## ✅ Completed
- [x] Updated `app.json` with correct identifiers:
  - Bundle ID: `com.blackdollarnetwork.mobile`
  - Package: `com.blackdollarnetwork.mobile`
  - Version: `3.19.0` (higher than Flutter's `3.18.2`)
  - iOS Build Number: `223` (higher than Flutter's `222`)
  - Android Version Code: `223` (higher than Flutter's `222`)
- [x] Added Expo Updates configuration for OTA updates

## 🔧 Next Steps - Credentials Setup

### 1. Set Up Android Keystore
Run this command:
```bash
eas credentials
```

When prompted:
1. Select **Android**
2. Select **production**
3. Choose **"I want to upload my own keystore"**
4. Provide the path to your keystore: See `DEPLOYMENT_SECRETS.md` (stored securely)
5. Enter the keystore password: See `DEPLOYMENT_SECRETS.md` (stored securely)
6. Enter the key alias: See `DEPLOYMENT_SECRETS.md` (stored securely)
7. Enter the key password: See `DEPLOYMENT_SECRETS.md` (stored securely)

**⚠️ IMPORTANT:** Never commit `DEPLOYMENT_SECRETS.md` to version control. Store credentials securely.

### 2. Set Up iOS Credentials
Run this command again:
```bash
eas credentials
```

When prompted:
1. Select **iOS**
2. Select **production**
3. EAS will detect that `com.blackdollarnetwork.mobile` already exists
4. Choose to **use the existing Distribution Certificate and Provisioning Profile**
5. Sign in to your Apple Developer account when prompted

## 📋 Pre-Build Checklist

Before running `eas build`, ensure:
- [ ] All user flows work end-to-end with mock data
- [ ] No "Coming Soon" or placeholder text visible
- [ ] All buttons provide feedback (success messages, navigation, etc.)
- [ ] App tested on both iOS and Android simulators/devices
- [ ] Demo account credentials prepared for store reviewers

## 🚀 Deployment Commands

### Step 1: Build for Both Platforms
```bash
eas build --platform all --profile production
```

This will:
- Use your uploaded keystore for Android
- Use your existing iOS certificates
- Create production builds ready for submission

**Expected time:** 15-30 minutes per platform

### Step 2: Submit to Stores
```bash
eas submit --platform all
```

This will:
- Upload Android build to Google Play Console
- Upload iOS build to App Store Connect
- Prompt for any missing credentials

## 📝 Store Submission Notes

When submitting, include these notes for reviewers:

**For App Store Connect:**
- "App is currently in offline-capable mode with fully functional mock data"
- "All user flows are complete and tested end-to-end"
- "This is a complete rebuild of the app to improve stability and performance"

**For Google Play Console:**
- Same notes as above
- Ensure you select "Production" track (not Internal Testing)

## 🔄 Post-Launch: Database Connection

Once the app is approved and live, you can:

1. **Connect your database** to the app
2. **Push updates via OTA** without store review:
   ```bash
   eas update --branch production --message "Database integration"
   ```
3. Users will receive the update automatically on next app launch

## ⚠️ Important Notes

1. **Keystore Security**: The keystore passwords are sensitive. Store them securely in `DEPLOYMENT_SECRETS.md` (which is gitignored) or a password manager. Never commit them to git.

2. **Version Numbers**: Current version is `3.19.0` with build `223`. If you prefer a major version bump to `4.0.0`, update `app.json` before building.

3. **Expo Updates**: The app is configured for OTA updates. After connecting your database, you can push updates without going through store review again.

4. **Testing**: Make sure to test the production build before submitting. You can download the build from EAS and install it on your device.

## 🆘 Troubleshooting

### If EAS credentials command fails:
- Make sure you're logged in: `eas login`
- Verify your Expo account has access to the project

### If build fails:
- Check that all dependencies are installed: `npm install`
- Verify `app.json` syntax is correct
- Check EAS build logs for specific errors

### If submission fails:
- Verify store credentials are correct
- Check that version numbers are higher than current published versions
- Ensure bundle ID/package name matches exactly

## 📞 Support Resources

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- EAS Submit Docs: https://docs.expo.dev/submit/introduction/
- Expo Updates Docs: https://docs.expo.dev/versions/latest/sdk/updates/
