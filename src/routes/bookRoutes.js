import { Router } from 'express';
import {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} from '../controllers/bookController.js';
import { validateBook, validateId } from '../middleware/validate.js';

const router = Router();

router.get('/',       getAllBooks);
router.get('/:id',    validateId, getBookById);
router.post('/',      validateBook, createBook);
router.put('/:id',    validateId, validateBook, updateBook);
router.delete('/:id', validateId, deleteBook);

export default router;