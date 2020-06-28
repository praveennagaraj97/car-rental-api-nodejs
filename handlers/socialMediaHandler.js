import { Email } from "../utils/nodeMailer";
import { catchAsyncError } from "../utils/catchAsyncError";
import { AppError } from "../utils/appError";

// Social Media
export const sendRequest = (
  socialMediaProfile,
  SMFriendRequest,
  SMFriends,
  responseObj
) =>
  catchAsyncError(async (req, res, next) => {
    // Check If User Sends request To Himself
    if (req.body.friendId == req.body.profileId)
      return next(new AppError("You Are Always Friend To Yourself 😁", 400));

    // Check Whether There Are Already Friends
    const friendshipStatus = await SMFriends.findOne({
      friends: [req.body.profileId, req.body.friendId],
    });
    if (friendshipStatus)
      return next(new AppError(`You Are Already Friends`, 405));

    // Check FriendRequest has been sent already
    const request = await SMFriendRequest.findOne({
      friends: [req.body.profileId, req.body.friendId],
    });

    const recievedRequest = await SMFriendRequest.findOne({
      friends: [req.body.friendId, req.body.profileId],
    });
    if (request)
      return next(new AppError("Friend Request Has Already Been Sent", 406));
    if (recievedRequest)
      return next(
        new AppError(
          "You Already Got An Request From This User - Accept that request to become friends",
          406
        )
      );

    // Check IF The User Exist To Send Request.
    const friendExist = await socialMediaProfile
      .findById(req.body.friendId)
      .populate({
        path: "userId",
        select: "username email",
      });
    if (!friendExist)
      return next(
        new AppError(
          "User Doesn't exist / Account Might Have Been Deleted",
          404
        )
      );

    if (!friendExist.userId) {
      return next(new AppError("Sorry This Person has Left Our Services", 500));
    }
    // Get sender name(req) and Reciever Email(friendExist).

    const newRequest = await SMFriendRequest.create(req.body);
    if (!newRequest)
      return next(new AppError("Failed To Send Friend Request", 500));

    const acceptLink = `{{URL}}/socialmedia/acceptrequests/${req.profile._id}`;

    const user = {
      username: friendExist.userId.username,
      email: friendExist.userId.email,
    };

    const url = `${req.protocol}://${req.get(
      "host"
    )}/socialmedia/acceptrequests/${req.profile._id}`;

    await new Email(user, url).sendFriendRequestAlert(req.loggedUser.username);

    responseObj.request = "Email Has been Sent Successfully";
    responseObj.acceptLink = acceptLink;

    res.status(200).json(responseObj);
  });

export const respondToRequest = (
  SMProfile,
  SMFriendrequest,
  SMFriends,
  responseObj
) =>
  catchAsyncError(async (req, res, next) => {
    // Check If Request Exist
    const requestExist = await SMFriendrequest.findOne({
      friends: [req.params.id, req.profile._id],
    });

    if (!requestExist) return next(new AppError("Request Not Found", 404));

    await SMFriends.create({
      profileId: req.profile._id,
      friendId: req.params.id,
    });

    // Make Friend To Each Other
    await SMFriends.create({
      profileId: req.params.id,
      friendId: req.profile._id,
    });

    // Delete The Request

    const friendRequest = await SMFriendrequest.findOne({
      friends: [req.params.id, req.profile._id],
    });

    await SMFriendrequest.findByIdAndDelete(friendRequest._id);

    // Send Mail To The One Who sent Request For Current Reciever

    const recievedRequestSender = await SMProfile.findById(
      req.params.id
    ).populate({
      path: "userId",
      select: "email username",
    });

    const user = {
      username: recievedRequestSender.userId.username,
      email: recievedRequestSender.userId.email,
    };

    await new Email(user, "").acceptedRequest(req.loggedUser.username);

    responseObj.status = `You  And ${recievedRequestSender.userId.username} are Friends Now 😍.`;

    res.status(200).json(responseObj);
  });
