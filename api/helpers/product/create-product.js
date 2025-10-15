module.exports = {
    friendlyName: 'Create product',
    description: 'Create a new product',
    inputs: {
        data: { type: 'ref', required: true },
    },
    fn: async function (inputs) {
        try {
            const { name, code } = inputs.data || {};
            let { status, type, description, note, amount, configuration } = inputs.data || {};

            if (!name || String(name).trim() === '') {
                const error = new Error('Missing required field');
                error.code = 'ERROR40';
                throw error;
            }
            const id = await sails.helpers.utils.generateUuid();
            let finalCode;
            if (code && String(code).trim() !== '') {
              finalCode = String(code).trim().toUpperCase();
              await sails.helpers.utils.checkCodeExists.with({
                model: 'product',
                code: finalCode,
                shouldExist: false,     // không được trùng
                normalize: false        // đã tự chuẩn hóa ở trên
              });
            } else {
              finalCode = await sails.helpers.utils.generateShortHash.with({ id });
              try {
                await sails.helpers.utils.checkCodeExists.with({
                  model: 'product',
                  code: finalCode,
                  shouldExist: false
                });
              } catch (e) {
                if (e.code !== 'ERROR92') throw e;
                // fallback tránh collision
                const fallback = id.replace(/-/g, '').slice(0, 10).toUpperCase();
                await sails.helpers.utils.checkCodeExists.with({
                  model: 'product',
                  code: fallback,
                  shouldExist: false
                });
                finalCode = fallback;
              }
            }
            const validStatus = [0, 1];
            const validType = [0, 1];

            const payload = {
                id,
                name: String(name).trim(),
                code: finalCode,
            };
            if (status !== undefined) {
                const s = Number(status);
                if (!validStatus.includes(s)) {
                  const err = new Error('Invalid input format');
                  err.code = 'ERROR41';
                  throw err;
                }
                payload.status = s;
              }
        
              if (type !== undefined) {
                const t = Number(type);
                if (!validType.includes(t)) {
                  const err = new Error('Invalid input format');
                  err.code = 'ERROR41';
                  throw err;
                }
                payload.type = t;
              }

              if (amount !== undefined) {
                const a = Number(amount);
                if (isNaN(a) || a < 0) {
                  const error = new Error('Invalid amount value');
                  error.code = 'ERROR41';
                  throw error;
                }
                payload.amount = a;
              }

              if (description !== undefined) payload.description = String(description).trim();
              if (note !== undefined) payload.note = String(note).trim();
              
              if (configuration !== undefined) {
                try {
                  if (typeof configuration === 'string') {
                    configuration = JSON.parse(configuration);
                  }
                  payload.configuration = configuration;
                } catch (e) {
                  const error = new Error('Invalid configuration format');
                  error.code = 'ERROR41';
                  throw error;
                }
              }
              const created = await sails.models.product.create(payload).fetch();

              return {
                message: 'Product created successfully',
                data: created
              };
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