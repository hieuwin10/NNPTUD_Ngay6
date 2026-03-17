const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/NNPTUD-C3';

async function test() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected');
        const roleSchema = new mongoose.Schema({ name: String, description: String }, { timestamps: true });
        const Role = mongoose.models.role || mongoose.model('role', roleSchema);
        
        const roles = await Role.find({});
        console.log('Roles found:', JSON.stringify(roles, null, 2));
        
        const targetId = '69b6231b3de61addb401ea26';
        const existing = await Role.findById(targetId);
        if (!existing) {
            console.log('Creating role...');
            await Role.create({
                _id: targetId,
                name: 'USER',
                description: 'Default user role'
            });
            console.log('Created USER role');
        } else {
            console.log('USER role exists');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

test();
