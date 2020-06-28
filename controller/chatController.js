import { Chat } from "./../model/chatModel";
import { catchAsyncError } from "../utils/catchAsyncError";

export const socketSetup = (io, socket) => {
  io.on("connection", (socket) => {
    socket.on("chat", async (data) => {
      // Check Wheter User IS Sending TO His Friend.
      const chatdata = {
        profileId: data.profileId,
        friendId: data.friendId,
      };
      const chatExist = await Chat.find(chatdata);
      if (!chatExist || chatExist.length < 1) {
        await Chat.create({
          profileId: data.profileId,
          friendId: data.friendId,
        });

        await Chat.create({
          profileId: data.friendId,
          friendId: data.profileId,
        });

        await Chat.findOneAndUpdate(
          { profileId: data.profileId },
          { $push: { sent: data.message } }
        );
        await Chat.findOneAndUpdate(
          { profileId: data.friendId },
          { $push: { recieved: data.message } }
        );
      } else {
        await Chat.findOneAndUpdate(
          { profileId: data.profileId },
          { $push: { sent: data.message } }
        );
        await Chat.findOneAndUpdate(
          { profileId: data.friendId },
          { $push: { recieved: data.message } }
        );
      }

      io.sockets.emit("chat", data);
    });
  });
};
