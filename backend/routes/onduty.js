import express from 'express';
import {postOnduty,getAllRequest,staffAccept,getonduty,notApplied,staffReject} from '../controllers/ondutyController.js';
 
const router = express.Router();

router.post('/postonduty',postOnduty)
router.get('/getallonduty',getAllRequest)
router.put('/acceptonduty/:id/:staffId', staffAccept);
router.put('/rejectonduty/:id/:staffId', staffReject);
router.get('/getonduty/:id',getonduty);
router.get('/notapplied',notApplied);

export default router;