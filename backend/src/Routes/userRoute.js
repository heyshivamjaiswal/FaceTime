import express from "express";
import { protectedRoute } from "../middleware/authMiddleware.js";
import { acceptFriendRequest,
         getFriendRequest,
         getMyFriends,
         getOutoingFriendReqs,
         getRecommendedUsers,
         sendFriendRequest } from "../controllers/userController.js";

const router = express.Router();


//apply auth middleware to all routes
router.use(protectedRoute);

router.get("/" , getRecommendedUsers);
router.get("/friends" , getMyFriends);

router.post("/friend-request/:id" , sendFriendRequest);
router.post("/friend-request/:id/accept" , acceptFriendRequest);

router.post("/friend-requests" , getFriendRequest);
router.post("/outgoing-friend-request" , getOutoingFriendReqs);

export default router;
