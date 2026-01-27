# 🚀 Quick Deployment Reference

## Current Status ✅
- ✅ Logged into EAS as `bdnetwork`
- ✅ EAS CLI installed
- ✅ Keystore file ready (see `DEPLOYMENT_SECRETS.md`)
- ✅ Project configured: `@bdnetwork/bdn`

## Next Steps (Run These Commands)

### 1️⃣ Set Up Android Credentials
```bash
eas credentials
```
**Select:** Android → production → Upload own keystore
**Path:** See `DEPLOYMENT_SECRETS.md` (stored securely)
**Password:** See `DEPLOYMENT_SECRETS.md` (stored securely)
**Alias:** See `DEPLOYMENT_SECRETS.md` (stored securely)

**⚠️ IMPORTANT:** Never commit `DEPLOYMENT_SECRETS.md` to version control.

### 2️⃣ Set Up iOS Credentials
```bash
eas credentials
```
**Select:** iOS → production → Use existing certificates
**Bundle ID:** `com.blackdollarnetwork.mobile` (auto-detected)

### 3️⃣ Build for Production
```bash
eas build --platform all --profile production
```
⏱️ Takes 15-30 minutes per platform

### 4️⃣ Submit to Stores
```bash
eas submit --platform all --profile production
```

---

## Or Use the Deployment Script
```bash
./deploy.sh
```
Then select option 4 for "Build and submit (all-in-one)"

---

## Keystore Info
- **File:** See `DEPLOYMENT_SECRETS.md` (stored securely)
- **Password:** See `DEPLOYMENT_SECRETS.md` (stored securely)
- **Alias:** See `DEPLOYMENT_SECRETS.md` (stored securely)
- **Key Password:** See `DEPLOYMENT_SECRETS.md` (stored securely)

**⚠️ IMPORTANT:** All sensitive credentials are stored in `DEPLOYMENT_SECRETS.md` which is gitignored.

## App Info
- **Bundle ID:** `com.blackdollarnetwork.mobile`
- **Version:** `3.19.0` (Build 223)
- **Project ID:** See `app.json` (public identifier)
