// // module.exports = {
// //   friendlyName: 'Create category',
// //   description: 'Create a new category',

// //   inputs: {
// //     data: {
// //       type: 'ref',
// //       required: true,
// //       description: 'Object containing category data (name, code, status, type, description, note)'
// //     }
// //   },

// //   fn: async function (inputs) {
// //     try {
// //       const { name, code } = inputs.data || {};
// //       let { status, type, description, note } = inputs.data || {};

// //       // Basic required validations
// //       if (!name) {
// //         const error = new Error('Missing required field');
// //         error.code = 'ERROR40';
// //         throw error;
// //       }

// //       // Normalize
// //       const trimmedName = String(name).trim();
// //       const trimmedCode = String(code).trim();
// //       description = description !== undefined ? String(description).trim() : undefined;
// //       note = note !== undefined ? String(note).trim() : undefined;

// //       // Coerce numeric fields
// //       const parsedStatus = Number(status);
// //       const parsedType = Number(type);

// //       // Validate formats
// //       const validStatus = [0, 1, 2];
// //       const validType = [0, 1];

// //       if (!validStatus.includes(parsedStatus) || !validType.includes(parsedType)) {
// //         const error = new Error('Invalid input format');
// //         error.code = 'ERROR41';
// //         throw error;
// //       }

// //       // Ensure unique code
// //       const existing = await sails.models.category.findOne({ code: trimmedCode });
// //       if (existing) {
// //         const error = new Error('Category code already exists');
// //         error.code = 'ERROR92'; // Conflict
// //         throw error;
// //       }

// //       const created = await sails.models.category.create({
// //         name: trimmedName,
// //         code: trimmedCode,
// //         status: parsedStatus,
// //         type: parsedType,
// //         description,
// //         note
// //       }).fetch();

// //       return {
// //         message: 'Category created successfully',
// //         data: created
// //       };
// //     } catch (err) {
// //       sails.log.error('Error in create-category helper:', err);
// //       if (err.code) {
// //         throw err;
// //       }
// //       const error = new Error(err.message || 'Failed to create category');
// //       error.code = 'ERROR99';
// //       throw error;
// //     }
// //   }
// // };



// module.exports = {
//     friendlyName: 'Create category',
//     description: 'Create a new category',
  
//     inputs: {
//       data: {
//         type: 'ref',
//         required: true,
//         description: 'Object containing category data (name, code, status, type, description, note)'
//       }
//     },
  
//     fn: async function (inputs) {
//       try {
//         const { name, code } = inputs.data || {};
//         let { status, type, description, note } = inputs.data || {};
  
//         // name bắt buộc
//         if (!name || String(name).trim() === '') {
//           const error = new Error('Missing required field');
//           error.code = 'ERROR40';
//           throw error;
//         }
  
//         const trimmedName = String(name).trim();
  
//         // Chuẩn bị payload, chỉ set các field được truyền hợp lệ
//         const payload = { name: trimmedName };
  
//         // code: chỉ validate & set khi client truyền vào
//         if (code !== undefined && String(code).trim() !== '') {
//           const trimmedCode = String(code).trim().toUpperCase();
  
//           // Unique code
//           const existing = await sails.models.category.findOne({ code: trimmedCode });
//           if (existing) {
//             const error = new Error('Category code already exists');
//             error.code = 'ERROR92'; // Conflict
//             throw error;
//           }
//           payload.code = trimmedCode;
//         }
//         // Nếu không truyền code → model beforeCreate sẽ tự sinh từ id (shorthash)
  
//         // status/type: chỉ validate khi có truyền; nếu không, để model dùng defaults
//         const validStatus = [0, 1, 2];
//         const validType = [0, 1];
  
//         if (status !== undefined) {
//           const parsedStatus = Number(status);
//           if (!validStatus.includes(parsedStatus)) {
//             const error = new Error('Invalid input format');
//             error.code = 'ERROR41';
//             throw error;
//           }
//           payload.status = parsedStatus;
//         }
  
//         if (type !== undefined) {
//           const parsedType = Number(type);
//           if (!validType.includes(parsedType)) {
//             const error = new Error('Invalid input format');
//             error.code = 'ERROR41';
//             throw error;
//           }
//           payload.type = parsedType;
//         }
  
//         if (description !== undefined) payload.description = String(description).trim();
//         if (note !== undefined) payload.note = String(note).trim();
  
//         // Tạo category; model sẽ tự sinh id và code (nếu thiếu)
//         const created = await sails.models.category.create(payload).fetch();
  
//         return {
//           message: 'Category created successfully',
//           data: created
//         };
//       } catch (err) {
//         sails.log.error('Error in create-category helper:', err);
//         if (err.code) {
//           throw err;
//         }
//         const error = new Error(err.message || 'Failed to create category');
//         error.code = 'ERROR99';
//         throw error;
//       }
//     }
//   };



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
        const { name, code } = inputs.data || {};
        let { status, type, description, note } = inputs.data || {};
  
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
  
        // // 3) Đảm bảo code unique
        // let existing = await sails.models.category.findOne({ code: finalCode });
        // if (existing) {
        //   // fallback tránh collision (lấy 10 ký tự đầu của id)
        //   const fallback = id.replace(/-/g, '').slice(0, 10).toUpperCase();
        //   if (fallback !== finalCode) {
        //     finalCode = fallback;
        //     existing = await sails.models.category.findOne({ code: finalCode });
        //   }
        //   if (existing) {
        //     const err = new Error('Category code already exists');
        //     err.code = 'ERROR92';
        //     throw err;
        //   }
        // }
  
        // 4) Validate các trường optional khi có truyền; nếu không, để model dùng defaults
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