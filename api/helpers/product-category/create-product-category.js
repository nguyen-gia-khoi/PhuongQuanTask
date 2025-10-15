const { friendlyName, fn } = require("../category/create-category");

module .exports = {
    friendlyName: 'Create product category',
    description: 'Create a new product category',
    inputs: {
        data:{
            type: 'ref',
            required: true,
            description: 'Data for creating product category',  
        }
    },
    fn: async function (inputs) {
        try {
            
        } catch (err) {
            sails.log.error('Error in create-product:', err);
            if (err.code) {
                throw err;
            }
            const error = new Error(err.message || 'Failed to create category');
            error.code = 'ERROR99';
            throw error;
        }
    }
}