# Firebase Anonymous Auth Setup - Budget Tracker

## ✅ Code Changes Complete!

The following files have been updated:

### 1. App.vue

- Added Firebase auth imports
- Implemented anonymous sign-in on app load
- Auth state listener ensures user is authenticated before loading data

### 2. firebase/config.js

- Added `getAuth` import
- Exported `auth` instance

### 3. composables/useFirebaseStorage.js

- Updated all operations to use user-specific paths: `users/{userId}/transactions`
- Added `userId` field to all new transactions
- Protected operations with auth checks

---

## 🔐 Firebase Console Setup (Required)

You need to complete these steps in Firebase Console:

### Step 1: Enable Anonymous Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **budget-tracker-20fed**
3. Navigate to **Authentication** → **Sign-in method**
4. Click **Anonymous** provider
5. Toggle **Enable**
6. Click **Save**

### Step 2: Update Security Rules

1. Navigate to **Realtime Database** → **Rules** tab
2. Replace current rules with:

```json
{
  "rules": {
    "users": {
      "$userId": {
        "transactions": {
          "$transactionId": {
            ".read": "$userId === auth.uid",
            ".write": "newData.child('userId').val() === auth.uid",
            ".validate": "newData.hasChildren(['type', 'amount', 'category', 'description', 'date', 'userId'])"
          }
        }
      }
    }
  }
}
```

3. Click **Publish**

---

## 📊 New Database Structure

**Before:**

```
budget-tracker-20fed/
└── transactions/
    ├── -abc123/
    ├── -def456/
    └── -ghi789/
```

**After:**

```
budget-tracker-20fed/
└── users/
    └── {userId}/           ← Anonymous user ID
        └── transactions/
            ├── -abc123/
            ├── -def456/
            └── -ghi789/
```

Each anonymous user gets their own isolated data!

---

## 🧪 Testing

### Manual Test Steps:

1. **Clear browser data** (localStorage + IndexedDB)
2. **Open app** → Check console for "Anonymous sign-in successful"
3. **Create a transaction** → Should save with `userId` field
4. **Check Firebase Console** → Should see `users/{uid}/transactions`
5. **Refresh page** → Should still see your transactions
6. **Clear browser data again** → Should see empty list (new anonymous user)

### Expected Console Logs:

```
No user authenticated, signing in anonymously...
Anonymous sign-in successful
User authenticated: abcd1234xyz...
```

---

## ⚠️ Important Notes

### Data Migration

**Existing transactions will NOT be visible** because they're at the old path (`/transactions`).

**Options:**

1. **Start fresh** - Clear old data (simplest for testing)
2. **Manual migration** - Copy old transactions to user-specific path in Firebase Console
3. **Keep old data** - Just for reference, won't affect new anonymous users

### Anonymous User Behavior

- **New device/browser** = New anonymous user = Empty data
- **Clear browser data** = New anonymous user = Empty data
- **Same device** = Same anonymous user = Persisted data

This is expected! Data is device-specific until you implement email/Google sign-in.

---

## 🎯 Next Steps (Optional)

### Upgrade to Persistent Auth:

Later, you can add email/Google sign-in to allow users to:

- Access data across devices
- Recover data if browser data is cleared
- Link anonymous account to permanent account

---

## ✅ Checklist

- [ ] Enable Anonymous Authentication in Firebase Console
- [ ] Update Security Rules in Firebase Console
- [ ] Test app with anonymous auth
- [ ] Verify transactions are saved with `userId`
- [ ] Confirm data isolation (clear browser, see empty list)

---

**Your database will be secure and won't expire!** 🔐
