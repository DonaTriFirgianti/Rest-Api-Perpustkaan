import pool from '../config/db.js';

export const getAllBooks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM buku ORDER BY id ASC');
        return res.status(200).json({
        success: true,
        message: 'Berhasil mengambil semua data buku',
        total: result.rowCount,
        data: result.rows,
        });
    } catch (error) {
        console.error('getAllBooks error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
        });
    }
};

export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM buku WHERE id = $1', [id]);

        if (result.rowCount === 0) {
        return res.status(404).json({
            success: false,
            message: `Buku dengan ID ${id} tidak ditemukan`,
        });
        }

        return res.status(200).json({
        success: true,
        message: 'Berhasil mengambil data buku',
        data: result.rows[0],
        });
    } catch (error) {
        console.error('getBookById error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
        });
    }
    };

export const createBook = async (req, res) => {
    try {
        const { isbn, judul, pengarang, penerbit, tahun, stok } = req.body;

        const checkIsbn = await pool.query(
        'SELECT id FROM buku WHERE isbn = $1', [isbn]
        );

        if (checkIsbn.rowCount > 0) {
        return res.status(409).json({
            success: false,
            message: `ISBN ${isbn} sudah terdaftar`,
        });
        }

        const result = await pool.query(
        `INSERT INTO buku (isbn, judul, pengarang, penerbit, tahun, stok)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [isbn, judul, pengarang, penerbit || null, tahun || null, stok ?? 1]
        );

        return res.status(201).json({
        success: true,
        message: 'Buku berhasil ditambahkan',
        data: result.rows[0],
        });
    } catch (error) {
        console.error('createBook error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
        });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const { isbn, judul, pengarang, penerbit, tahun, stok } = req.body;

        const checkBook = await pool.query(
        'SELECT id FROM buku WHERE id = $1', [id]
        );

        if (checkBook.rowCount === 0) {
        return res.status(404).json({
            success: false,
            message: `Buku dengan ID ${id} tidak ditemukan`,
        });
        }

        const checkIsbn = await pool.query(
        'SELECT id FROM buku WHERE isbn = $1 AND id != $2', [isbn, id]
        );

        if (checkIsbn.rowCount > 0) {
        return res.status(409).json({
            success: false,
            message: `ISBN ${isbn} sudah digunakan oleh buku lain`,
        });
        }

        const result = await pool.query(
        `UPDATE buku
        SET isbn = $1, judul = $2, pengarang = $3, penerbit = $4,
            tahun = $5, stok = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7 RETURNING *`,
        [isbn, judul, pengarang, penerbit || null, tahun || null, stok ?? 1, id]
        );

        return res.status(200).json({
        success: true,
        message: 'Data buku berhasil diperbarui',
        data: result.rows[0],
        });
    } catch (error) {
        console.error('updateBook error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const checkBook = await pool.query(
        'SELECT id, judul FROM buku WHERE id = $1', [id]
        );

        if (checkBook.rowCount === 0) {
        return res.status(404).json({
            success: false,
            message: `Buku dengan ID ${id} tidak ditemukan`,
        });
        }

        const deletedBook = checkBook.rows[0];
        await pool.query('DELETE FROM buku WHERE id = $1', [id]);

        return res.status(200).json({
        success: true,
        message: `Buku "${deletedBook.judul}" berhasil dihapus`,
        });
    } catch (error) {
        console.error('deleteBook error:', error.message);
        return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
        });
    }
};