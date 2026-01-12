// Script to create admin user in Firebase Authentication
// Run with: node scripts/createAdminUser.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';

// Initialize Firebase Admin with service account
// You need to download service account key from Firebase Console:
// Project Settings > Service Accounts > Generate new private key

const serviceAccount = {
  type: "service_account",
  project_id: "blog-s-huy",
  // Add other fields from your service account JSON file
  // You need to add the full service account key here
};

// Alternative: Load from file
// import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

try {
  // Initialize admin app
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'blog-s-huy'
    });
  }

  const auth = getAuth();

  // Create admin user
  const userRecord = await auth.createUser({
    email: 'admin@admin',
    password: 'Ah12345@',
    emailVerified: true,
    disabled: false,
  });

  console.log('✅ Admin user created successfully!');
  console.log('User UID:', userRecord.uid);
  console.log('Email:', userRecord.email);
} catch (error) {
  if (error.code === 'auth/email-already-exists') {
    console.log('⚠️  User already exists. Updating password...');
    try {
      // Get user by email and update password
      const user = await auth.getUserByEmail('admin@admin');
      await auth.updateUser(user.uid, {
        password: 'Ah12345@',
        emailVerified: true,
        disabled: false,
      });
      console.log('✅ Password updated successfully!');
    } catch (updateError) {
      console.error('❌ Error updating user:', updateError);
    }
  } else {
    console.error('❌ Error creating user:', error);
  }
}

