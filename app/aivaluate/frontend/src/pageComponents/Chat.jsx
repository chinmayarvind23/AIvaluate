import React, { useEffect, useState } from "react";
import OpenAI from 'openai';
import MessageDto from "./MessageDto";

const Chat = ({ defaultInstruction }) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [assistant, setAssistant] = useState(null);
  const [thread, setThread] = useState(null);
  const [openai, setOpenai] = useState(null);

  const instructionContent = defaultInstruction?.content || "Default instruction content not found.";

  // The code below is utilizing the OpenAI Assistants API to create a chatbot where an instruction can be assigned to it
  useEffect(() => {
    initChatBot();
  }, []); // Initialize the chatbot when the component mounts

  // IMPORTANT: API key must be filled in for the chatbot to work
  // The API key is not included in the code snippet for security reasons
  // It is possible to save the key inside the .env file and access it using process.env.API_KEY
  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: "sk-None-XaPPxTdrmjtbPMzMTJeST3BlbkFJxwcwMmS5dSVC91JxGij4", // Ensure this environment variable is set correctly
      dangerouslyAllowBrowser: true,
    });

    // Create an assistant
    const assistant = await openai.beta.assistants.create({
      name: "Computer Science Expert",
      instructions: instructionContent,

      model: "gpt-4-1106-preview",
    });

    // Create a thread
    const thread = await openai.beta.threads.create();

    setOpenai(openai);
    setAssistant(assistant);
    setThread(thread);
  };

  // Create a new message object
  const createNewMessage = (content, isUser) => {
    const newMessage = new MessageDto(isUser, content);
    return newMessage;
  };

  // Send a message to the chatbot
  const handleSendMessage = async () => {
    const newMessage = createNewMessage(input, true);
    setMessages([...messages, newMessage]);
    setInput("");

    // Send a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Create a response
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Wait for the response to be ready
    while (response.status === "in_progress" || response.status === "queued") {
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);

    // Get the messages for the thread
    const messageList = await openai.beta.threads.messages.list(thread.id);

    // Find the last message for the current run
    const lastMessage = messageList.data
      .filter((message) => message.run_id === run.id && message.role === "assistant")
      .pop();

    // Print the last message coming from the assistant
    if (lastMessage) {
      const assistantMessage = createNewMessage(lastMessage.content[0]["text"].value, false);
      setMessages([...messages, assistantMessage]);
    }
  };

  // detect enter key and send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isWaiting) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full min-h-screen flex-col items-center justify-center">
      <div style={{ width: "80%", margin: "0 auto" }}>
        {/* Input area */}
        <div style={{ backgroundColor: "#f7f7f7", padding: "15px", borderRadius: "4px", marginBottom: "20px" }}>
          <textarea
            placeholder="Type your message here..."
            disabled={isWaiting}
            style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "10px" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            onKeyPress={handleKeyPress}
          ></textarea>
          <button
            onClick={handleSendMessage}
            disabled={isWaiting}
            style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Send
          </button>
        </div>

        {/* Message display area */}
        <div style={{ backgroundColor: "#e1f5fe", padding: "15px", borderRadius: "4px", minHeight: "300px" }}>
          {messages.map((message, index) => (
            <div key={index} style={{ margin: "10px 0", textAlign: message.isUser ? "right" : "left" }}>
              <div style={{ display: "inline-block", backgroundColor: message.isUser ? "#1186fe" : "#f1f1f1", color: message.isUser ? "#ffffff" : "#000000", padding: "10px", borderRadius: "8px" }}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
