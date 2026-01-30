// Script to reset admin password in Firebase Authentication
// Run with: node resetAdminPassword.js

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  try {
    const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
    const serviceAccountData = readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountData);
    console.log('✅ Loaded service account from file');
  } catch (fileError) {
    console.error('❌ Firebase Service Account not found. Please either:');
    console.error('   1. Set FIREBASE_SERVICE_ACCOUNT environment variable, or');
    console.error('   2. Place serviceAccountKey.json in the backend folder');
    process.exit(1);
  }
}

// Initialize Firebase Admin
try {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || 'blog-s-huy'
  });
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  process.exit(1);
}

const auth = getAuth();

async function resetAdminPassword() {
  const email = 'admin@admin';
  const password = 'Ah12345@';

  try {
    // Try to get user by email
    const user = await auth.getUserByEmail(email);
    console.log(`✅ Found user: ${user.email}`);
    
    // Update password
    await auth.updateUser(user.uid, {
      password: password,
      emailVerified: true,
      disabled: false
    });
    
    console.log('✅ Password reset successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      // User doesn't exist, create new one
      console.log('⚠️  User not found. Creating new admin user...');
      try {
        const userRecord = await auth.createUser({
          email: email,
          password: password,
          emailVerified: true,
          disabled: false,
        });
        console.log('✅ Admin user created successfully!');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log(`   UID: ${userRecord.uid}`);
      } catch (createError) {
        console.error('❌ Error creating user:', createError.message);
      }
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

resetAdminPassword();
