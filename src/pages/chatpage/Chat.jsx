import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage, fetchUserChats, clearChatState, deleteAllUserChats } from "../../redux/actions/ChatSlice";
import { Smile, Send, ArrowLeft, MoreVertical, CheckCheck, Loader2, Sparkles, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Picker from "emoji-picker-react";

function ChatPage() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { activeMessages = [], chats = [], loading = false } = useSelector(state => state.chat || {});
    const { user = null } = useSelector(state => state.auth || {});

    const [input, setInput] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const messagesEndRef = useRef(null);

    const myId = user?.id || user?._id;

    const activeChat = useMemo(() => chats.find(c => (c.id || c._id) === chatId), [chats, chatId]);

    const otherUserName = useMemo(() => {
        if (!activeChat) return "Chat";
        return myId === activeChat.buyerId ? activeChat.sellerName : activeChat.buyerName;
    }, [activeChat, myId]);

    const quickReplies = ["Is this still available?", "What is the final price?", "Can I see more photos?"];

    useEffect(() => {
        if (myId) dispatch(fetchUserChats(myId));
        if (chatId) dispatch(fetchMessages(chatId));
        return () => dispatch(clearChatState());
    }, [chatId, myId, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages]);

    const handleSend = async (textToSend = input) => {
        const messageText = typeof textToSend === 'string' ? textToSend : input;
        if (!messageText.trim() || !chatId || !myId) return;

        let receiverId = activeChat ? (myId === activeChat.buyerId ? activeChat.sellerId : activeChat.buyerId) : null;

        const requestPayload = {
            chatId: chatId,
            content: messageText,
            receiverId: receiverId
        };

        try {
            await dispatch(sendMessage({ request: requestPayload, senderId: myId })).unwrap();
            setInput("");
            setShowEmojiPicker(false);
        } catch (err) {
            console.error("Send failed:", err);
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm("Delete all conversations?")) {
            await dispatch(deleteAllUserChats(myId));
            navigate("/dashboard");
        }
    };

    if (loading && activeMessages.length === 0) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                <p className="text-gray-500 text-sm font-medium">Loading your conversation...</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white dark:bg-gray-950 overflow-hidden font-sans">
            <div className="flex-1 flex flex-col relative w-full max-w-4xl mx-auto border-x dark:border-gray-800 shadow-2xl">

                {/* Header */}
                <header className="px-4 py-3 border-b dark:border-gray-800 flex items-center justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        {/* BACK ARROW - UPDATED TO WHITE COLOR */}
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all group"
                        >
                            <ArrowLeft size={22} className="text-gray-700 dark:text-white" />
                        </button>

                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold shadow-sm">
                            {otherUserName?.charAt(0).toUpperCase()}
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-bold text-gray-900 dark:text-white leading-tight">{otherUserName}</h2>
                            <span className="text-[11px] text-green-500 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Active now
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                            <MoreVertical size={20} />
                        </button>
                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-2xl z-50 py-1"
                                >
                                    <button
                                        onClick={handleDeleteAll}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete Chat History
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-gray-950/30">
                    <AnimatePresence initial={false}>
                        {activeMessages.map((msg, idx) => {
                            const isMe = msg.senderId === myId;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl ${
                                        isMe
                                            ? "bg-blue-600 text-white rounded-br-none shadow-md"
                                            : "bg-white dark:bg-gray-800 dark:text-white border dark:border-gray-700 rounded-bl-none shadow-sm"
                                    }`}>
                                        <p className="text-[15px] leading-relaxed">{msg.content}</p>
                                        <div className={`flex items-center justify-end gap-1 mt-1 opacity-60 text-[10px] ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
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
                <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t dark:border-gray-800 bg-white dark:bg-gray-900 sticky bottom-0">
                    <Sparkles size={16} className="text-blue-500 mt-1 shrink-0" />
                    {quickReplies.map((reply, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(reply)}
                            className="whitespace-nowrap px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 transition-all bg-gray-50/50 dark:bg-gray-800/50"
                        >
                            {reply}
                        </button>
                    ))}
                </div>

                {/* Footer Input Area */}
                <footer className="p-4 bg-white dark:bg-gray-900 relative border-t dark:border-gray-800">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-2xl border dark:border-gray-700 focus-within:border-blue-400 transition-all shadow-inner">
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`transition-colors ${showEmojiPicker ? 'text-blue-500' : 'text-gray-400'}`}
                        >
                            <Smile size={22} />
                        </button>

                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={`Message ${otherUserName}...`}
                            className="flex-1 bg-transparent outline-none dark:text-white text-sm py-2"
                        />

                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-30 shadow-md"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    {/* Emoji Picker */}
                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-full mb-4 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden"
                            >
                                <Picker
                                    theme="auto"
                                    onEmojiClick={(emojiData) => setInput(prev => prev + emojiData.emoji)}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </footer>
            </div>
        </div>
    );
}

export default ChatPage;