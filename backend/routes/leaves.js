import express from 'express';
import {postLeave,getAllRequest,staffAccept,getLeave,notApplied,staffReject} from '../controllers/leaveController.js';
 
const router = express.Router();

router.post('/postleave',postLeave)
router.get('/getallleave',getAllRequest)
router.put('/acceptleave/:id/:staffId', staffAccept);
router.put('/acceptreject/:id/:staffId', staffReject);
router.get('/getleave/:id',getLeave);
router.get('/notapplied',notApplied);

export default router;