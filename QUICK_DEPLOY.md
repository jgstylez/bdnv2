# 🚀 Quick Deployment Reference

## Current Status ✅
- ✅ Logged into EAS as `bdnetwork`
- ✅ EAS CLI installed
- ✅ Keystore file ready: `./key.jks`
- ✅ Project configured: `@bdnetwork/bdn`

## Next Steps (Run These Commands)

### 1️⃣ Set Up Android Credentials
```bash
eas credentials
```
**Select:** Android → production → Upload own keystore
**Path:** `/Users/jgstylez/dev/bdnv2/key.jks`
**Password:** `p22VJEEepnDePtDW`
**Alias:** `key`

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
- **File:** `./key.jks`
- **Password:** `p22VJEEepnDePtDW`
- **Alias:** `key`
- **Key Password:** `p22VJEEepnDePtDW`

## App Info
- **Bundle ID:** `com.blackdollarnetwork.mobile`
- **Version:** `3.19.0` (Build 223)
- **Project ID:** `5dec71d3-e780-438e-97a4-b749b0c72c0e`
