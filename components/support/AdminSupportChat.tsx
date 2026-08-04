"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { uploadToCloudinary } from "@/lib/utils/compressImage";
import { HiOutlineChatBubbleLeftRight, HiOutlineXMark, HiOutlinePaperAirplane, HiOutlineArrowLeft, HiOutlinePhoto } from "react-icons/hi2";

type Message = {
  id: string;
  user_id: string;
  sender: "user" | "admin";
  message: string;
  image_url?: string | null;
  read_by_admin: boolean;
  read_by_user: boolean;
  created_at: string;
};

type Conversation = {
  user_id: string;
  full_name: string;
  role: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
};

export default function AdminSupportChat({ isAr }: { isAr: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
const [directUserName, setDirectUserName] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenDirect = (e: any) => {
      const { userId, fullName } = e.detail;
      setOpen(true);
      setDirectUserName(fullName || null);
      setActiveUserId(userId);
      fetchMessages(userId);
    };
    window.addEventListener("admin-open-chat", handleOpenDirect);
    return () => window.removeEventListener("admin-open-chat", handleOpenDirect);
  }, []);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("chat-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("chat-open");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("chat-open");
    };
  }, [open]);

  const fetchConversations = async () => {
    const supabase = createClient();
    const { data: allMessages } = await supabase
      .from("support_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!allMessages) return;

    const grouped: Record<string, Message[]> = {};
    allMessages.forEach((m) => {
      if (!grouped[m.user_id]) grouped[m.user_id] = [];
      grouped[m.user_id].push(m);
    });

    const userIds = Object.keys(grouped);
    if (userIds.length === 0) {
      setConversations([]);
      setTotalUnread(0);
      return;
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, role")
      .in("id", userIds);

    const convos: Conversation[] = userIds.map((uid) => {
      const msgs = grouped[uid];
      const profile = profiles?.find((p) => p.id === uid);
      const unread = msgs.filter((m) => m.sender === "user" && !m.read_by_admin).length;
      return {
        user_id: uid,
        full_name: profile?.full_name || "—",
        role: profile?.role || "",
        lastMessage: msgs[0]?.message || "",
        lastTime: msgs[0]?.created_at || "",
        unreadCount: unread,
      };
    });

    convos.sort((a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime());
    setConversations(convos);
    setTotalUnread(convos.reduce((sum, c) => sum + c.unreadCount, 0));
  };

  const fetchMessages = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  useEffect(() => {
    if (open) fetchConversations();
  }, [open]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("admin-support")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "support_messages" }, () => {
        if (open) {
          fetchConversations();
          if (activeUserId) fetchMessages(activeUserId);
        } else {
          fetchConversations();
        }
      })
      .subscribe();
    fetchConversations();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [open, activeUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const openConversation = async (userId: string) => {
    setActiveUserId(userId);
    await fetchMessages(userId);
    const supabase = createClient();
    await supabase
      .from("support_messages")
      .update({ read_by_admin: true })
      .eq("user_id", userId)
      .eq("sender", "user")
      .eq("read_by_admin", false);
    fetchConversations();
  };

  const handleSend = async () => {
    if (!input.trim() || !activeUserId) return;
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.from("support_messages").insert({
      user_id: activeUserId,
      sender: "admin",
      message: input.trim(),
    });
    setSending(false);
    if (!error) {
      setInput("");
      fetchMessages(activeUserId);
    }
  };

  const handleImageSend = async (file: File | undefined) => {
    if (!file || !activeUserId) return;
    if (!file.type.startsWith("image/")) return;
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file);
      const supabase = createClient();
      await supabase.from("support_messages").insert({
        user_id: activeUserId,
        sender: "admin",
        message: isAr ? "📷 صورة" : "📷 Image",
        image_url: url,
      });
      fetchMessages(activeUserId);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const roleLabel = (role: string) => {
    if (role === "agent") return isAr ? "وسيط" : "Agent";
    if (role === "developer") return isAr ? "مطوّر" : "Developer";
    return role;
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-9 h-9 rounded-full border border-aura-border flex items-center justify-center text-aura-muted hover:text-aura-accent hover:border-aura-accent transition-all duration-300"
        aria-label="Admin Support"
      >
        <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium">
            {totalUnread}
          </span>
        )}
      </button>

      {open && mounted && createPortal(
        <>
          <div className="fixed inset-0 z-[9998] bg-aura-dark/80 backdrop-blur-md" onClick={() => { setOpen(false); setActiveUserId(null); }} />
          <div className="fixed bottom-4 right-4 z-[9999] w-[360px] h-[460px] bg-aura-card rounded-2xl border border-aura-border shadow-2xl flex flex-col overflow-hidden">

            {!activeUserId ? (
              <>
                <div className="flex items-center justify-between px-5 py-4 border-b border-aura-border bg-aura-canvas">
                  <h3 className="text-sm font-medium text-aura-dark">{isAr ? "محادثات الدعم" : "Support Chats"}</h3>
                  <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full border border-aura-border flex items-center justify-center text-aura-muted">
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6">
                      <HiOutlineChatBubbleLeftRight className="w-10 h-10 text-aura-accent/30" />
                      <p className="text-xs text-aura-muted">{isAr ? "مفيش محادثات لسه" : "No conversations yet"}</p>
                    </div>
                  ) : (
                    conversations.map((c) => (
                      <button
                        key={c.user_id}
                        onClick={() => openConversation(c.user_id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-aura-canvas transition-colors border-b border-aura-border text-start"
                      >
                        <div className="w-9 h-9 rounded-full bg-aura-accent/20 flex items-center justify-center text-aura-accent text-xs font-medium shrink-0">
                          {c.full_name?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-medium text-aura-dark truncate">{c.full_name}</p>
                            <span className="text-[9px] text-aura-muted shrink-0">{roleLabel(c.role)}</span>
                          </div>
                          <p className="text-[11px] text-aura-muted truncate">{c.lastMessage}</p>
                        </div>
                        {c.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center font-medium shrink-0">
                            {c.unreadCount}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-aura-border bg-aura-canvas">
                <button onClick={() => { setActiveUserId(null); setDirectUserName(null); }} className="w-7 h-7 rounded-full flex items-center justify-center text-aura-muted hover:text-aura-dark">
                    <HiOutlineArrowLeft className={isAr ? "rotate-180" : ""} />
                  </button>
                 <p className="text-sm font-medium text-aura-dark flex-1 truncate">
                    {conversations.find((c) => c.user_id === activeUserId)?.full_name || directUserName || "—"}
                  </p>
                  <button onClick={() => { setOpen(false); setActiveUserId(null); }} className="w-7 h-7 rounded-full flex items-center justify-center text-aura-muted">
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                </div>
                <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${m.sender === "admin" ? "bg-aura-accent text-white rounded-br-md" : "bg-aura-canvas text-aura-dark rounded-bl-md border border-aura-border"}`}>
                        {m.image_url && (
                          <a href={m.image_url} target="_blank" rel="noopener noreferrer">
                            <img src={m.image_url} alt="" className="rounded-lg mb-1.5 max-w-full max-h-40 object-cover" />
                          </a>
                        )}
                        {m.message}
                        <p className={`text-[9px] mt-1 ${m.sender === "admin" ? "text-white/70" : "text-aura-muted"}`}>
                          {new Date(m.created_at).toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-aura-border flex items-center gap-2">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSend(e.target.files?.[0])} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-10 h-10 rounded-full border border-aura-border text-aura-muted hover:text-aura-accent hover:border-aura-accent flex items-center justify-center disabled:opacity-50 shrink-0 transition-colors"
                    aria-label={isAr ? "إرفاق صورة" : "Attach image"}
                  >
                    {uploadingImage ? (
                      <div className="w-4 h-4 border-2 border-aura-accent border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <HiOutlinePhoto className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={isAr ? "اكتب ردك..." : "Type your reply..."}
                    className="flex-1 px-4 py-2.5 rounded-full border border-aura-border bg-aura-canvas text-sm outline-none focus:border-aura-accent"
                  />
                  <button
                    onClick={handleSend}
                    disabled={sending || !input.trim()}
                    className="w-10 h-10 rounded-full bg-aura-accent text-white flex items-center justify-center disabled:opacity-50 shrink-0"
                  >
                    <HiOutlinePaperAirplane className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}