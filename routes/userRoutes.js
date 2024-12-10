const router = require("express").Router();

const {
    registerUser,
    loginUser,
} = require("../controllers/authController");
const {
    resetPassword,
    otpGenerate,
    verifyOTP,
    updateUser,
    getUserProfile,
    updateStudyTime,
    getStudyTime
} = require("../controllers/userController");

const upload = require('../middleware/multerConfig');  

const { verifyToken } = require("../middleware/verifyToken");
const { fetchUser } = require("../middleware/fetchUser");


/************************ Auth Routes ************************/
router.post("/register", registerUser); // User signup
router.post("/login", loginUser);     // User login

/************************ User Routes ************************/
router.put("/reset-password", resetPassword); 
router.post("/generate-otp", otpGenerate);     
router.post("/verify-otp", verifyOTP); 
router.get("/user/getUserProfile/:userId",verifyToken,fetchUser, getUserProfile); 
// Route to upload profile picture
router.post('/user/uploadProfilePicture/:userId', upload.single('profilePicture'),verifyToken,fetchUser, updateUser);
router.post('/updateStudyTime/:userId',verifyToken,fetchUser, updateStudyTime);
router.get('/studyTime/:userId',verifyToken,fetchUser, getStudyTime);


module.exports = router;
