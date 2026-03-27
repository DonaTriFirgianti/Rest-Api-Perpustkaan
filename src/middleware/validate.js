import { z } from 'zod';

const bookSchema = z.object({
    isbn: z
        .string({ required_error: 'ISBN wajib diisi' })
        .min(1, 'ISBN tidak boleh kosong'),

    title: z
        .string({ required_error: 'Judul buku wajib diisi' })
        .min(1, 'Judul tidak boleh kosong'),

    author: z
        .string({ required_error: 'Nama pengarang wajib diisi' })
        .min(1, 'Nama pengarang tidak boleh kosong'),

    publisher: z
        .string()
        .optional()
        .nullable(),

    year: z
        .number()
        .int()
        .min(1000, 'Tahun terbit tidak valid')
        .max(new Date().getFullYear(), `Tahun tidak boleh melebihi ${new Date().getFullYear()}`)
        .optional()
        .nullable(),

    stock: z
        .number({ invalid_type_error: 'Stok harus berupa angka' })
        .int()
        .min(0, 'Stok tidak boleh negatif')
        .optional()
        .default(1),
});

export const validateBook = (req, res, next) => {
    const result = bookSchema.safeParse(req.body);

        if (!result.success) {
            const errors = result.error?.errors?.map((e) => e.message) ?? ['Validasi gagal'];
            return res.status(400).json({
                success: false,
                message: 'Validasi gagal',
                errors,
            });
        }

    req.body = result.data;
    next();
};

export const validateId = (req, res, next) => {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'ID tidak valid, harus berupa angka positif',
        });
    }

    next();
};