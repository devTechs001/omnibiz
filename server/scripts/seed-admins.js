/**
 * Auto Seed Admin Accounts Script
 * Creates default admin and super admin accounts on first deploy
 * 
 * Usage: node server/scripts/seed-admins.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Default admin credentials - CHANGE THESE IN PRODUCTION!
const DEFAULT_SUPER_ADMIN = {
  name: 'Super Admin',
  email: process.env.SUPER_ADMIN_EMAIL || 'admin@omnibiz.com',
  password: process.env.SUPER_ADMIN_PASSWORD || 'Admin@12345',
  role: 'owner'
};

const DEFAULT_ADMIN = {
  name: 'Admin User',
  email: process.env.ADMIN_EMAIL || 'manager@omnibiz.com',
  password: process.env.ADMIN_PASSWORD || 'Manager@12345',
  role: 'admin'
};

// Connect to MongoDB
const dbUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/omnibiz';

mongoose.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin', 'owner'],
    default: 'user'
  },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function createOrUpdateUser(userData, permissions) {
  try {
    let user = await User.findOne({ email: userData.email });

    if (user) {
      // Update existing user
      user.role = userData.role;
      user.permissions = permissions;
      user.isActive = true;
      user.isEmailVerified = true;
      await user.save();
      console.log(`✅ Updated ${userData.role}: ${user.email}`);
      return { user, created: false };
    } else {
      // Create new user
      const hashedPassword = await hashPassword(userData.password);
      user = await User.create({
        ...userData,
        password: hashedPassword,
        permissions,
        isActive: true,
        isEmailVerified: true
      });
      console.log(`✅ Created ${userData.role}: ${user.email}`);
      return { user, created: true };
    }
  } catch (error) {
    console.error(`❌ Error with ${userData.email}:`, error.message);
    return { error };
  }
}

async function seedAdmins() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  🔐 OmniBiz Admin Account Seeder');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Super Admin Permissions
  const superAdminPermissions = [
    'all', 'manage_users', 'manage_products', 'manage_orders',
    'manage_services', 'manage_appointments', 'manage_finances',
    'manage_team', 'manage_locations', 'manage_settings',
    'view_analytics', 'manage_discounts', 'manage_feedback',
    'manage_support', 'delete_any', 'edit_any'
  ];

  // Admin Permissions
  const adminPermissions = [
    'manage_products', 'manage_orders', 'manage_services',
    'manage_appointments', 'manage_team', 'view_analytics',
    'manage_discounts', 'manage_feedback'
  ];

  // Create Super Admin
  const superAdminResult = await createOrUpdateUser(DEFAULT_SUPER_ADMIN, superAdminPermissions);

  // Create Admin
  const adminResult = await createOrUpdateUser(DEFAULT_ADMIN, adminPermissions);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  📋 Account Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (superAdminResult.user) {
    console.log(`\n👑 SUPER ADMIN:`);
    console.log(`   Email: ${superAdminResult.user.email}`);
    console.log(`   Password: ${DEFAULT_SUPER_ADMIN.password}`);
    console.log(`   Role: ${superAdminResult.user.role.toUpperCase()}`);
    console.log(`   ${superAdminResult.created ? '✨ Created' : '🔄 Updated'}`);
  }

  if (adminResult.user) {
    console.log(`\n👤 ADMIN:`);
    console.log(`   Email: ${adminResult.user.email}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    console.log(`   Role: ${adminResult.user.role.toUpperCase()}`);
    console.log(`   ${adminResult.created ? '✨ Created' : '🔄 Updated'}`);
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ⚠️  IMPORTANT: Change these passwords!');
  console.log('  Login at: /login');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  mongoose.connection.close();
  process.exit(0);
}

// Run seeder
mongoose.connection.once('open', () => {
  console.log('✅ Connected to MongoDB\n');
  seedAdmins();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
