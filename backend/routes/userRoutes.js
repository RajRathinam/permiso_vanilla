import express from 'express';
import { loginUser,changePassword,getAllUsers ,addStudent,addNewStaff,getAllStaffs} from '../controllers/userController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();


router.post('/login', loginUser);// Login route
router.put('/changepassword',changePassword);
router.get('/all',getAllUsers)
router.post('/addnewuser',upload.single('profileImg'), addStudent)
router.post('/addnewstaff',addNewStaff)
router.get('/getallStaffs',getAllStaffs)


export default router;
