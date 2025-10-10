
module.exports = {
    friendlyName : 'Destroy user',
    description : 'Destroy a user by email.',
    inputs : {
        email: { type: 'string', required: true }
    },
    exits : {
        success: { description: 'User destroyed successfully.' },
        notFound: { description: 'User not found.' },
        serverError: { description: 'An error occurred while trying to destroy the user.' }
    },
    fn : async function (inputs, exits) {
        try {
             try {
                await sails.helpers.user.validateUserExists.with({ email: inputs.email, shouldExist: false });
            } catch (err) {
                if( err.exit === 'userNotFound') {
                    return exits.notFound({ message: 'User not found' });
                }
                throw err;
            }
                const deletedUser = await User.destroyOne({ email: inputs.email });
                // Phòng khi không xóa được vì lý do khác
                if (!deletedUser) {
                    return exits.notFound({ message: 'User not found or already deleted' });
                }
                return exits.success({ message: 'User destroyed successfully', user: deletedUser });
        } catch (error) {
            sails.log.error(error);
            return exits.serverError({ error: error.message });
        }
    }
}