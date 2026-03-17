const mongoose = require('mongoose');
const Role = require('./schemas/roles');
const User = require('./schemas/users');
const bcrypt = require('bcrypt');

const mongoURI = 'mongodb://localhost:27017/NNPTUD-C3';

async function seed() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB for seeding...');

        // Define expected roles
        const rolesToSeed = [
            {
                _id: '69b6231b3de61addb401ea26',
                name: 'USER',
                description: 'Default user role'
            },
            {
                _id: '69b65aeb11143c664df8ff94', // Existing Admin ID I found
                name: 'ADMIN',
                description: 'Administrator role'
            }
        ];

        for (const roleData of rolesToSeed) {
            const existingRole = await Role.findById(roleData._id);
            if (!existingRole) {
                const newRole = new Role(roleData);
                await newRole.save();
                console.log(`Created role: ${roleData.name}`);
            } else {
                console.log(`Role ${roleData.name} already exists.`);
            }
        }

        // Check if there is an admin user
        let adminRole = await Role.findOne({ name: { $regex: /admin/i } });
        if (!adminRole) {
             adminRole = await Role.findById('69b65aeb11143c664df8ff94');
        }
        
        const existingAdmin = await User.findOne({ username: 'admin' });

        if (!existingAdmin && adminRole) {
            const newAdmin = new User({
                username: 'admin',
                password: 'admin123', // Will be hashed by pre('save') hook
                email: 'admin@example.com',
                fullName: 'System Admin',
                role: adminRole._id,
                status: true
            });
            await newAdmin.save();
            console.log('Created admin user: admin / admin123');
        } else {
            console.log('Admin user already exists.');
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
