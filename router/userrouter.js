import express from 'express'
const router = express.Router();
import { fileURLToPath } from 'url'
import multer from 'multer'
import path from 'path'
import { importUser, DataMongoDb, GeneratePdf, GenerateExcel } from '../controller/usercontroller.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import APP_STATUS from '../constants/constants.js';

const user = express();
user.use(express.static(path.resolve(__dirname, 'public')));
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

let upload = multer({ storage: storage })
router.post('/importuser', upload.single('file'), importUser);

router.get('/', async (req, resp) => {
    try {
        await DataMongoDb(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error mongodb data not add' })
    }
});

router.get("/generate-Excel", async (req, resp) => {
    try {
        await GenerateExcel(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error excel not download' })
    }
})

router.get('/generate-pdf', async (req, resp) => {
    try {
        await GeneratePdf(req, resp);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ Status: APP_STATUS.ERROR, error: 'An error Pdf not download' })
    }
});

export default router;
