import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage, fetchUserChats, clearChatState } from "../../redux/actions/ChatSlice";
import { Smile, Send, ArrowLeft, MoreVertical, CheckCheck, User, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Picker from "emoji-picker-react";

function ChatPage() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Selectors with fallbacks
    const { activeMessages = [], chats = [], loading = false } = useSelector(state => state.chat || {});
    const { user = null } = useSelector(state => state.auth || {});

    const [input, setInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);

    // Get current user ID safely
    const myId = user?.id || user?._id;

    // 1. Find the active chat details safely
    const activeChat = useMemo(() => {
        return chats.find(c => (c.id || c._id) === chatId);
    }, [chats, chatId]);

    // 2. Determine other person's name safely (Fixes the "Name not showing" issue)
    const otherUserName = useMemo(() => {
        if (!activeChat) return "Chat";
        return myId === activeChat.buyerId ? activeChat.sellerName : activeChat.buyerName;
    }, [activeChat, myId]);

    const quickReplies = [
        "Is this still available?",
        "What is the final price?",
        "Where is the location?",
        "Can I see more photos?"
    ];

    // Load messages and chat list on mount
    useEffect(() => {
        if (myId) {
            dispatch(fetchUserChats(myId));
        }
        if (chatId) {
            dispatch(fetchMessages(chatId));
        }
        return () => dispatch(clearChatState());
    }, [chatId, myId, dispatch]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages]);

    // --- THE FIXED SEND FUNCTION ---
    const handleSend = async (textToSend = input) => {
        const messageText = typeof textToSend === 'string' ? textToSend : input;

        // Validation guards
        if (!messageText.trim()) return;
        if (!chatId) return alert("No Chat ID found");
        if (!myId) return alert("You must be logged in");

        // Calculate receiver ID safely (Fixes the "Not sending" issue)
        let receiverId = null;
        if (activeChat) {
            receiverId = myId === activeChat.buyerId ? activeChat.sellerId : activeChat.buyerId;
        }

        const messageRequest = {
            chatId: chatId,
            content: messageText,
            receiverId: receiverId // If this is null, your backend might need to handle it
        };

        try {
            // Dispatch and wait for result
            await dispatch(sendMessage({ request: messageRequest, senderId: myId })).unwrap();
            setInput("");
            setShowEmojiPicker(false);
        } catch (err) {
            console.error("Send Error:", err);
            alert("Failed to send: " + (err?.message || "Check console"));
        }
    };

    // Loading State
    if (loading && activeMessages.length === 0) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-gray-950">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                <p className="text-gray-500 animate-pulse text-sm">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden font-sans">
            <div className="flex-1 flex flex-col relative w-full max-w-4xl mx-auto border-x dark:border-gray-800">

                {/* Header */}
                <header className="px-4 py-3 border-b dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
                            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-sm">
                            {otherUserName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{otherUserName}</h2>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span className="text-[11px] text-gray-500 font-medium">Active now</span>
                            </div>
                        </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600"><MoreVertical size={20} /></button>
                </header>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-gray-950/30">
                    <AnimatePresence initial={false}>
                        {activeMessages.map((msg, idx) => {
                            const isMe = msg.senderId === myId;
                            return (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    key={msg.id || idx}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`group relative max-w-[85%] px-4 py-2.5 rounded-2xl ${
                                        isMe
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border dark:border-gray-700 shadow-sm"
                                    }`}>
                                        <p className="text-[15px] leading-relaxed">{msg.content}</p>
                                        <div className={`flex items-center gap-1 mt-1 justify-end opacity-60 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                            <span className="text-[10px]">
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                            </span>
                                            {isMe && <CheckCheck size={12} />}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t dark:border-gray-800 overflow-x-auto no-scrollbar flex gap-2">
                    <div className="flex items-center pr-2 border-r dark:border-gray-800 text-blue-500">
                        <Sparkles size={16} />
                    </div>
                    {quickReplies.map((reply, index) => (
                        <button
                            key={index}
                            onClick={() => handleSend(reply)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                            {reply}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <footer className="p-4 bg-white dark:bg-gray-900">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-2xl border dark:border-gray-700 relative">
                        <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-400 hover:text-blue-500"><Smile size={22} /></button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Message ${otherUserName}...`}
                            className="flex-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white py-2 text-sm"
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-30"
                        >
                            <Send size={18} />
                        </button>

                        {showEmojiPicker && (
                            <div className="absolute bottom-full mb-4 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden">
                                <Picker theme="auto" onEmojiClick={(emoji) => setInput(prev => prev + emoji.emoji)} />
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default ChatPage;