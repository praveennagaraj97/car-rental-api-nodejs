import { Chat } from "./../model/chatModel";

export const socketSetup = (io, socket) => {
  io.on("connection", (socket) => {
    socket.on("chat", async (data) => {
      const chats = await Chat.find();
      chats[0].message.push(data.message);
      await chats[0].save();

      io.sockets.emit("chat", chats);
    });
  });
};

export const startChat = async (req, res, next) => {
  const chats = await Chat.find({});
  res.render("chat/chat", { chats });
};
