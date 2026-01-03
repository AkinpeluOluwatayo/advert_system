import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage, fetchUserChats, clearChatState, deleteAllUserChats } from "../../redux/actions/ChatSlice";
import { Smile, Send, ArrowLeft, MoreVertical, CheckCheck, Loader2, Sparkles, Trash2, ShieldCheck } from "lucide-react";
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


        const interval = setInterval(() => {
            if (chatId) dispatch(fetchMessages(chatId));
        }, 5000);

        return () => {
            dispatch(clearChatState());
            clearInterval(interval);
        };
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

            setInput("");
            setShowEmojiPicker(false);

            await dispatch(sendMessage({ request: requestPayload, senderId: myId })).unwrap();
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
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-bold animate-pulse">Opening secure chat...</p>
            </div>
        );
    }

    return (
        <div className="flex h-[100dvh] bg-gray-50 dark:bg-gray-950 overflow-hidden font-sans">
            <div className="flex-1 flex flex-col relative w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">


                <header className="px-4 py-4 border-b dark:border-gray-800 flex items-center justify-between bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                        >
                            <ArrowLeft size={22} className="text-gray-700 dark:text-white" />
                        </button>

                        <div className="relative">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black shadow-lg">
                                {otherUserName?.charAt(0).toUpperCase()}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow-sm" />
                        </div>

                        <div className="flex flex-col">
                            <h2 className="font-black text-gray-900 dark:text-white leading-tight flex items-center gap-1">
                                {otherUserName} <ShieldCheck size={14} className="text-blue-500" />
                            </h2>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Verified Seller</span>
                        </div>
                    </div>

                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <MoreVertical size={20} />
                        </button>
                        <AnimatePresence>
                            {showMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-2xl z-50 py-2 overflow-hidden"
                                >
                                    <button
                                        onClick={handleDeleteAll}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <Trash2 size={18} /> Clear Conversation
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>


                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/20 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {activeMessages.map((msg, idx) => {
                            const isMe = msg.senderId === myId;
                            return (
                                <motion.div
                                    key={msg.id || idx}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                                        isMe
                                            ? "bg-blue-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none border dark:border-gray-700"
                                    }`}>
                                        <p className="text-[14px] font-medium leading-relaxed">{msg.content}</p>
                                        <div className={`flex items-center justify-end gap-1.5 mt-1.5 text-[9px] font-bold uppercase tracking-tighter ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                                            {isMe && <CheckCheck size={14} className="opacity-80" />}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                </div>


                <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t dark:border-gray-800 bg-white/50 dark:bg-gray-900/50">
                    <Sparkles size={16} className="text-blue-500 mt-1 shrink-0" />
                    {quickReplies.map((reply, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(reply)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white transition-all bg-white dark:bg-gray-800 active:scale-95 shadow-sm"
                        >
                            {reply}
                        </button>
                    ))}
                </div>


                <footer className="p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-800 z-40">
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500/50 transition-all border border-transparent dark:border-gray-700">
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className={`transition-colors ${showEmojiPicker ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Smile size={24} />
                        </button>

                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent outline-none dark:text-white text-sm py-2 font-medium"
                        />

                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-blue-500/20 active:scale-90"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-full mb-4 left-4 right-4 z-50 shadow-2xl rounded-2xl overflow-hidden border dark:border-gray-700"
                            >
                                <Picker
                                    theme="auto"
                                    width="100%"
                                    height={350}
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