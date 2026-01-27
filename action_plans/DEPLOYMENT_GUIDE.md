# Complete Deployment Guide - Flutter to Expo Migration

## 🎯 Current Status

✅ **App Configuration:**
- Bundle ID: `com.blackdollarnetwork.mobile`
- Package: `com.blackdollarnetwork.mobile`
- Version: `3.19.0` (Build 223)
- Expo Updates: Configured for OTA updates

✅ **Keystore:**
- Location: `./key.jks` (or see `DEPLOYMENT_SECRETS.md` for actual path)
- Alias: See `DEPLOYMENT_SECRETS.md`
- Password: **Stored securely** (see `DEPLOYMENT_SECRETS.md`)

## 📋 Pre-Deployment Checklist

Before you start, ensure:

- [x] App has complete mocked user flows (end-to-end)
- [x] No "Coming Soon" or placeholder text visible
- [x] All buttons provide feedback (success messages, navigation, etc.)
- [x] App tested on iOS and Android simulators/devices
- [x] Demo account credentials prepared for store reviewers
- [ ] EAS CLI installed: `npm install -g eas-cli`
- [ ] Logged into EAS: `eas login`
- [ ] Apple Developer account access
- [ ] Google Play Console access

## 🔐 Step 1: Set Up Android Credentials

Run this command and follow the prompts:

```bash
eas credentials
```

**When prompted:**
1. Select **Android**
2. Select **production**
3. Choose **"I want to upload my own keystore"**
4. Provide the path: See `DEPLOYMENT_SECRETS.md` for keystore location
5. Enter keystore password: See `DEPLOYMENT_SECRETS.md` (stored securely)
6. Enter key alias: See `DEPLOYMENT_SECRETS.md`
7. Enter key password: See `DEPLOYMENT_SECRETS.md` (stored securely)

**⚠️ IMPORTANT:** Never commit `DEPLOYMENT_SECRETS.md` to version control. Store credentials in a password manager or secure environment variables.

**Expected output:**
```
✓ Keystore uploaded successfully
```

## 🍎 Step 2: Set Up iOS Credentials

Run the credentials command again:

```bash
eas credentials
```

**When prompted:**
1. Select **iOS**
2. Select **production**
3. EAS will detect that `com.blackdollarnetwork.mobile` already exists
4. Choose **"Use existing Distribution Certificate and Provisioning Profile"**
5. Sign in to your Apple Developer account when prompted

**Note:** If you don't have access to the original Apple Developer account, you'll need to:
- Contact the original developer, OR
- Create new certificates (which means you'll need to update the Bundle ID in App Store Connect)

## 🏗️ Step 3: Build Production Apps

Build for both platforms:

```bash
eas build --platform all --profile production
```

**What happens:**
- Android: Creates an `.aab` file signed with your keystore
- iOS: Creates an `.ipa` file signed with your certificates
- Builds are uploaded to EAS servers
- You'll get download links when complete

**Expected time:** 15-30 minutes per platform

**Monitor progress:**
```bash
eas build:list
```

## 📤 Step 4: Submit to App Stores

### Option A: Automatic Submission (Recommended)

```bash
eas submit --platform all --profile production
```

This will:
- Upload Android build to Google Play Console (Production track)
- Upload iOS build to App Store Connect
- Prompt for any missing credentials interactively

### Option B: Manual Submission

If automatic submission fails, you can download the builds and submit manually:

1. **Download builds:**
   ```bash
   eas build:list
   # Click the download link for each platform
   ```

2. **Android (Google Play Console):**
   - Go to Google Play Console
   - Select your app
   - Go to Production → Create new release
   - Upload the `.aab` file
   - Add release notes
   - Review and roll out

3. **iOS (App Store Connect):**
   - Go to App Store Connect
   - Select your app
   - Click "+" next to iOS App
   - Select the new build
   - Fill in "What's New" section
   - Submit for review

## 📝 Store Submission Notes

### For App Store Connect Review Notes:

```
This is a complete rebuild of the app using React Native/Expo to improve stability and performance.

The app is currently in an offline-capable mode with fully functional mock data. All user flows are complete and tested end-to-end.

Demo Account (if applicable):
- Username: [your-demo-username]
- Password: [your-demo-password]

This update replaces the previous Flutter version and provides a more stable, performant experience.
```

### For Google Play Console Release Notes:

```
Complete app rebuild for improved stability and performance.

- Fully redesigned user interface
- Improved app stability and performance
- Complete end-to-end user flows
- Better offline support

This update replaces the previous version with a completely rebuilt app.
```

## 🔄 Step 5: Post-Launch Database Connection

Once your app is approved and live, you can connect your database without another store review:

1. **Connect your database** to the app
2. **Push OTA update:**
   ```bash
   eas update --branch production --message "Database integration complete"
   ```
3. Users will receive the update automatically on next app launch

**Benefits:**
- No store review needed for logic changes
- Instant updates to all users
- Can roll back if needed

## ⚠️ Important Warnings

### Version Numbers
- Current version: `3.19.0` (Build 223)
- Must be **higher** than your Flutter app's last version
- If Flutter app was `3.18.2` (Build 222), you're good ✅
- If you need to bump version, edit `app.json` before building

### Keystore Security
- **NEVER** commit `key.jks` to git (already in `.gitignore` ✅)
- Store passwords securely (use a password manager)
- Keep backups of your keystore in a secure location
- If you lose the keystore, you **cannot** update the app on Google Play

### Bundle ID / Package Name
- **MUST** match exactly: `com.blackdollarnetwork.mobile`
- If you change this, stores will treat it as a **new app**
- Users won't get automatic updates

## 🆘 Troubleshooting

### EAS Credentials Command Fails

**Error:** "Not logged in"
```bash
eas login
```

**Error:** "Project not found"
```bash
# Verify project ID in app.json matches EAS project
eas project:info
```

### Build Fails

**Error:** "Keystore not found"
- Verify `key.jks` exists (check `DEPLOYMENT_SECRETS.md` for location)
- Use the correct path from your secure credentials file

**Error:** "Invalid keystore password"
- Verify password from `DEPLOYMENT_SECRETS.md` or your secure credential storage
- Verify alias from `DEPLOYMENT_SECRETS.md`

**Error:** "Dependencies missing"
```bash
npm install
```

### Submission Fails

**Error:** "Version code too low"
- Update `versionCode` in `app.json` to be higher than current Play Store version
- Update `buildNumber` for iOS

**Error:** "Bundle ID mismatch"
- Verify `app.json` has correct bundle ID
- Check App Store Connect / Play Console for exact identifier

**Error:** "Missing service account"
- For Android: Create service account in Google Cloud Console
- Download JSON key file
- Update `eas.json` with path to service account JSON

## 📊 Monitoring Your Submission

### Check Build Status
```bash
eas build:list
```

### Check Submission Status
```bash
eas submit:list
```

### View Build Logs
```bash
eas build:view [BUILD_ID]
```

## 🎉 Success Checklist

After successful deployment:

- [ ] Android build uploaded to Google Play Console
- [ ] iOS build uploaded to App Store Connect
- [ ] Both apps submitted for review
- [ ] Review notes added to both stores
- [ ] Demo account credentials provided (if needed)
- [ ] Monitoring build/submission status
- [ ] Ready to push database connection via OTA update

## 📞 Support Resources

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **EAS Submit Docs:** https://docs.expo.dev/submit/introduction/
- **Expo Updates Docs:** https://docs.expo.dev/versions/latest/sdk/updates/
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Google Play Policies:** https://play.google.com/about/developer-content-policy/

## 🚀 Quick Start Commands

```bash
# 1. Login to EAS
eas login

# 2. Set up credentials
eas credentials  # Run twice (Android, then iOS)

# 3. Build for production
eas build --platform all --profile production

# 4. Submit to stores
eas submit --platform all --profile production

# 5. (After approval) Push database update
eas update --branch production --message "Database integration"
```

---

**Last Updated:** January 2025
**App Version:** 3.19.0 (Build 223)
