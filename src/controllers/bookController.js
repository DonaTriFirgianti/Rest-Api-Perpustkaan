import pool from '../config/db.js';

export const getAllBooks = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
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
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

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
        const { isbn, title, author, publisher, year, stock } = req.body;

        const checkIsbn = await pool.query(
            'SELECT id FROM books WHERE isbn = $1', [isbn]
        );

        if (checkIsbn.rowCount > 0) {
        return res.status(409).json({
            success: false,
            message: `ISBN ${isbn} sudah terdaftar`,
        });
        }

        const result = await pool.query(
            `INSERT INTO books (isbn, title, author, publisher, year, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [isbn, title, author, publisher || null, year || null, stock ?? 1]
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
        const { isbn, title, author, publisher, year, stock } = req.body;

        const checkBook = await pool.query(
            'SELECT id FROM books WHERE id = $1', [id]
        );

        if (checkBook.rowCount === 0) {
        return res.status(404).json({
            success: false,
            message: `Buku dengan ID ${id} tidak ditemukan`,
        });
    }

    const checkIsbn = await pool.query(
        'SELECT id FROM books WHERE isbn = $1 AND id != $2', [isbn, id]
    );

    if (checkIsbn.rowCount > 0) {
        return res.status(409).json({
            success: false,
            message: `ISBN ${isbn} sudah digunakan oleh buku lain`,
        });
    }

    const result = await pool.query(
        `UPDATE books
        SET isbn = $1, title = $2, author = $3, publisher = $4,
            year = $5, stock = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7 RETURNING *`,
        [isbn, title, author, publisher || null, year || null, stock ?? 1, id]
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
            'SELECT id, title FROM books WHERE id = $1', [id]
        );

        if (checkBook.rowCount === 0) {
        return res.status(404).json({
            success: false,
            message: `Buku dengan ID ${id} tidak ditemukan`,
        });
        }

        const checkLoan = await pool.query(
            `SELECT id FROM loans WHERE book_id = $1 AND status IN ('borrowed', 'overdue')`, [id]
        );

        if (checkLoan.rowCount > 0) {
        return res.status(409).json({
            success: false,
            message: 'Buku tidak dapat dihapus karena sedang dalam status peminjaman',
        });
        }

        const deletedBook = checkBook.rows[0];
        await pool.query('DELETE FROM books WHERE id = $1', [id]);

        return res.status(200).json({
            success: true,
            message: `Buku "${deletedBook.title}" berhasil dihapus`,
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