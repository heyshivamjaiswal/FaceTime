import FriendRequest from "../models/friendReqest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
   try{
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUser = await User.find({
        $and: [
            {_id: {$ne: currentUserId}},
            {$id: {$nin: currentUser.friends}},
            {isOnboarded: true}
        ]
    })
    res.status(200).json(getRecommendedUsers)
   } catch(error){
    console.error("Error in getRecommendedUsers controller" , error.message);
    res.status(500).json({message:"Interanl Server Error"});
   }
}


export async function getMyFriends(req, res) {
    
    try{
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    }catch(error){
        console.error("Error in getMyFriends conroller" , error.message)
        res.status(500).json({message: "Internal server error"});
    }
}

export async function sendFriendRequest(req , res){

    try{
      const myId = req.user.id;
      const {id: recipientId} =   req.params;

      //preventing sending req to yourself
      if(myId === recipientId){
        return res.status(400).json({message: "You can't send friend request to yourself"});
      }
      
    
      const recipient = await User.findById(recipientId);
      if(!recipient){
        res.status(400).json({message: "Recipient not found"})
      }
     
      //check if user is already friends
      if(recipient.friends.includes(myId)){
        return res.status(400).json({message: "You are already with this user"})
      }

      //check if a request already exits
      const exitingRequest = await FriendRequest.findOne({
        $or:[
            {sender: myId , recipient: recipientId},
            {sender: recipientId , recipient: myId},
        ],
      });

      if(exitingRequest){
        return res
        .status(400)
        .json({message: "A friend request already exits between you and this user"});
      }

      const friendReqest = await FriendRequest.create({
        sender: myId,
        recipient: recipientId,
      });
      res.status(201).json(friendReqest);
    }catch(error){
        console.error("Error in sendFriendRequest controller" , error.message);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function acceptFriendRequest(req , res){
    try{
        const {id: requestId} = req.params;

        const friendReqest = await FriendRequest.findById(requestId);
        
        if(!friendReqest){
            return res.status(404).json({message: "Friend request not found"});
        }

        //verify the current user is the recipent 
        if(friendReqest.recipient.toString() !== req.user.id){
            return res.status(403).json({message: "You are not authorized to accept this request"});
        }

        friendReqest.status = "accepted";
        await friendReqest.save();

        //add each user to the other's freinds array
        await User.findByIdAndUpdate(friendReqest.sender,{
            $addToSet: {friends: friendReqest.recipient},
        });

        await User.findByIdAndUpdate(friendReqest.recipient, {
            $addToSet: {friends: friendReqest.sender},
        });

        res.status(200).json({message: "Friend request accepted"})
    }catch(error){
      console.log("Error in acceptFriendRequest controller" , error.message);
      res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getFriendRequest(req , res){
  try{
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("sender" , "fullName profilePic nativeLanguage learningLanguage");

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic");

    req.status(200).json({incomingReqs , acceptedReqs});
  }catch(error){
    console.log("Error in getPendingFriendReqest controller", error.message);
    res.status(500).json({message: "Internal Server Error"});
  }
}

export async function getOutoingFriendReqs(req , res){
  try{
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient" , "fullName profilePic nativeLangugage learningLanguage");

    req.status(200).json(outgoingRequests);
  }catch(error){
    console.log("Error in getOutgoingFriendReqs controller" , error.message);
    res.status(500).json({message: "Internal Server error"});
  }
}