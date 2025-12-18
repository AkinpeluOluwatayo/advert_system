import { useState, useRef, useEffect } from "react";
import Picker from "emoji-picker-react";
import { Paperclip, Smile, Send } from "lucide-react";

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new message is added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() && attachments.length === 0) return;
        const newMessage = {
            text: input,
            files: attachments,
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages([...messages, newMessage]);
        setInput("");
        setAttachments([]);
        setShowEmojiPicker(false);
    };

    const onEmojiClick = (emojiData) => {
        setInput((prev) => prev + emojiData.emoji);
    };

    const handleFileChange = (e) => {
        setAttachments(Array.from(e.target.files));
    };

    const quickMessages = [
        "Hi, is this still available?",
        "Can you provide more details?",
        "What's your best price?",
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between shadow">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    Chat with Seller
                </h2>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className="flex flex-col items-start space-y-1 max-w-full sm:max-w-xs">
                        {msg.text && (
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl break-words">
                                {msg.text}
                            </div>
                        )}
                        {msg.files?.map((file, i) => {
                            if (file.type.startsWith("image/")) {
                                return (
                                    <img
                                        key={i}
                                        src={URL.createObjectURL(file)}
                                        alt="attachment"
                                        className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl"
                                    />
                                );
                            } else if (file.type.startsWith("video/")) {
                                return (
                                    <video
                                        key={i}
                                        controls
                                        src={URL.createObjectURL(file)}
                                        className="w-64 h-36 sm:w-72 sm:h-44 rounded-xl"
                                    />
                                );
                            } else {
                                return (
                                    <p key={i} className="text-sm text-gray-700 dark:text-gray-300">
                                        {file.name}
                                    </p>
                                );
                            }
                        })}
                        <span className="text-xs text-gray-400">{msg.timestamp}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick suggested messages */}
            <div className="px-4 sm:px-6 py-2 flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-800">
                {quickMessages.map((msg, idx) => (
                    <button
                        key={idx}
                        onClick={() => setInput(msg)}
                        className="bg-white dark:bg-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        {msg}
                    </button>
                ))}
            </div>

            {/* Input area */}
            <div className="px-4 sm:px-6 py-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex flex-col sm:flex-row gap-2 items-center relative">
                {showEmojiPicker && (
                    <div className="absolute bottom-20 sm:bottom-24 left-4 sm:left-6 z-50">
                        <Picker onEmojiClick={onEmojiClick} />
                    </div>
                )}

                <div className="flex items-center gap-2 w-full">
                    <button
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                        <Smile size={24} />
                    </button>

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />

                    <label className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                        <Paperclip size={24} />
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </label>

                    <button
                        onClick={sendMessage}
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
