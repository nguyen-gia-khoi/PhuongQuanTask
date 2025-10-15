

// api/helpers/category/create-category.js
module.exports = {
    friendlyName: 'Create category',
    description: 'Create a new category using helper-generated id and short code',
  
    inputs: {
      data: {
        type: 'ref',
        required: true,
        description: 'Object containing category data (name, code?, status?, type?, description?, note?)'
      }
    },
  
    fn: async function (inputs) {
      try {
        const { name,code } = inputs.data || {};
        let {  status, type, description, note } = inputs.data || {};
        
        // name bắt buộc
        if (!name || String(name).trim() === '') {
          const error = new Error('Missing required field');
          error.code = 'ERROR40';
          throw error;
        }
  
        // 1) Tạo id bằng helper
        const id = await sails.helpers.utils.generateUuid();
  
        // 2) Xác định code (client truyền thì dùng, ngược lại sinh từ id bằng helper)
        let finalCode;
        if (code && String(code).trim() !== '') {
          finalCode = String(code).trim().toUpperCase();
          await sails.helpers.utils.checkCodeExists.with({
            model: 'category',
            code: finalCode,
            shouldExist: false,     // không được trùng
            normalize: false        // đã tự chuẩn hóa ở trên
          });
        } else {
          finalCode = await sails.helpers.utils.generateShortHash.with({ id });
          try {
            await sails.helpers.utils.checkCodeExists.with({
              model: 'category',
              code: finalCode,
              shouldExist: false
            });
          } catch (e) {
            if (e.code !== 'ERROR92') throw e;
            // fallback tránh collision
            const fallback = id.replace(/-/g, '').slice(0, 10).toUpperCase();
            await sails.helpers.utils.checkCodeExists.with({
              model: 'category',
              code: fallback,
              shouldExist: false
            });
            finalCode = fallback;
          }
        }
  
       
        const validStatus = [0, 1, 2];
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
  
        if (description !== undefined) payload.description = String(description).trim();
        if (note !== undefined) payload.note = String(note).trim();
  
        // 5) Tạo Category
        const created = await sails.models.category.create(payload).fetch();
  
        return {
          message: 'Category created successfully',
          data: created
        };
      } catch (err) {
        sails.log.error('Error in create-category helper:', err);
        if (err.code) throw err;
  
        const error = new Error(err.message || 'Failed to create category');
        error.code = 'ERROR99';
        throw error;
      }
    }
  };