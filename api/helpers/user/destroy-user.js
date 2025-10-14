
module.exports = {
    friendlyName : 'Destroy user',
    description : 'Destroy a user by email.',
    inputs : {
        email: { type: 'string', required: true }
    },
    
    fn : async function (inputs) {
        try {
            // Validate required field
            if (!inputs.email) {
                const error = new Error('Email is required');
                error.code = 'ERROR40'; // Missing required field
                throw error;
            }

            // Validate email format
            await sails.helpers.user.validateEmail.with({ email: inputs.email });

            // Ensure email exists before deleting
            await sails.helpers.user.checkEmailExits.with({
                email: inputs.email,
                shouldExist: true
            });

            const deletedUser = await sails.models.user.destroyOne({ email: inputs.email });

            if (!deletedUser) {
                const error = new Error('Failed to delete user');
                error.code = 'ERROR99'; // Generic internal error
                throw error;
            }

            return {
                message: 'User deleted successfully',
                data: { email: inputs.email }
            };
        } catch (err) {
            sails.log.error('Error in destroy-user:', err);
            if (err.code) {
                throw err;
            }
            const error = new Error(err.message || 'Failed to delete user');
            error.code = 'ERROR99';
            throw error;
        }
    }
}