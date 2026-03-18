const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/omnibiz');

const User = require('../models/user');

async function fixAdmin() {
  try {
    console.log('🔧 Fixing Super Admin Account...\n');

    // Find existing admin
    const existingAdmin = await User.findOne({ email: 'devtechs842@gmail.com' });

    if (!existingAdmin) {
      console.log('❌ No admin found. Creating new super admin...\n');
      
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('Name: ', async (name) => {
        readline.question('Email: ', async (email) => {
          readline.question('Password: ', async (password) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const superAdmin = new User({
              name,
              email,
              password: hashedPassword,
              role: 'super_admin',
              permissions: {
                canCreateOrders: true,
                canViewAllOrders: true,
                canApproveOrders: true,
                canManageInventory: true,
                canManageUsers: true,
                canViewReports: true,
                canManageSettings: true,
                canManageServices: true,
                canVerifyOrders: true,
                canDeleteOrders: true,
                canManageRoles: true,
                canViewAllClients: true,
                canAssignAdmins: true
              },
              accountStatus: 'active',
              isActive: true,
              verificationStatus: {
                email: true,
                phone: true,
                business: true
              }
            });

            await superAdmin.save();

            console.log('\n✅ Super Admin Created Successfully!\n');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('   Name:', name);
            console.log('   Email:', email);
            console.log('   Password:', password);
            console.log('   Role: super_admin (Full Privileges)');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            readline.close();
            mongoose.connection.close();
            process.exit(0);
          });
        });
      });
      return;
    }

    console.log('✅ Found existing admin:');
    console.log(`   Email: ${existingAdmin.email}`);
    console.log(`   Role: ${existingAdmin.role}`);
    console.log(`   Account Status: ${existingAdmin.accountStatus}\n`);

    // Fix the role and permissions
    existingAdmin.role = 'super_admin';
    existingAdmin.permissions = {
      canCreateOrders: true,
      canViewAllOrders: true,
      canApproveOrders: true,
      canManageInventory: true,
      canManageUsers: true,
      canViewReports: true,
      canManageSettings: true,
      canManageServices: true,
      canVerifyOrders: true,
      canDeleteOrders: true,
      canManageRoles: true,
      canViewAllClients: true,
      canAssignAdmins: true
    };
    existingAdmin.accountStatus = 'active';
    existingAdmin.isActive = true;
    existingAdmin.verificationStatus = {
      email: true,
      phone: true,
      business: true
    };

    await existingAdmin.save();

    console.log('✅ Super Admin Updated Successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('   Name:', existingAdmin.name);
    console.log('   Email:', existingAdmin.email);
    console.log('   Role: super_admin');
    console.log('   Account Status: active');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🔐 Login with your existing password');
    console.log('🚀 Navigate to /login and use your credentials\n');

    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}

mongoose.connection.once('open', async () => {
  console.log('✅ Connected to MongoDB\n');
  await fixAdmin();
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
