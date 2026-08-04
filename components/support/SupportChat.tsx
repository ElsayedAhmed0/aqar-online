"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { uploadToCloudinary } from "@/lib/utils/compressImage";
import { HiOutlineXMark, HiOutlinePaperAirplane, HiOutlineChatBubbleLeftRight, HiOutlinePhoto } from "react-icons/hi2";
import { MdOutlineHeadsetMic } from "react-icons/md";

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

export default function SupportChat({ userId, isAr }: { userId: string | null; isAr: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMessages = async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("support_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (data) {
      setMessages(data);
      setUnreadCount(data.filter((m) => m.sender === "admin" && !m.read_by_user).length);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchMessages();
    const supabase = createClient();
    const channel = supabase
      .channel(`support-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "support_messages", filter: `user_id=eq.${userId}` },
        () => fetchMessages()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleOpen = async () => {
    setOpen(true);
    if (unreadCount > 0 && userId) {
      const supabase = createClient();
      await supabase
        .from("support_messages")
        .update({ read_by_user: true })
        .eq("user_id", userId)
        .eq("sender", "admin")
        .eq("read_by_user", false);
      setUnreadCount(0);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !userId) return;
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.from("support_messages").insert({
      user_id: userId,
      sender: "user",
      message: input.trim(),
    });
    setSending(false);
    if (!error) {
      setInput("");
      fetchMessages();
    }
  };

  const handleImageSend = async (file: File | undefined) => {
    if (!file || !userId) return;
    if (!file.type.startsWith("image/")) return;
    setUploadingImage(true);
    try {
      const url = await uploadToCloudinary(file);
      const supabase = createClient();
      await supabase.from("support_messages").insert({
        user_id: userId,
        sender: "user",
        message: isAr ? "📷 صورة" : "📷 Image",
        image_url: url,
      });
      fetchMessages();
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* زرار عائم ثابت */}
      {!open && mounted && createPortal(
        <button
          onClick={handleOpen}
          style={{ bottom: "50px", right: "16px" }}
          className="fixed z-[10000] w-14 h-14 rounded-full bg-aura-accent text-white shadow-2xl flex items-center justify-center hover:bg-aura-dark transition-all duration-300 hover:scale-105"
          aria-label="Support Chat"
        >
          <MdOutlineHeadsetMic className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>,
        document.body
      )}

      {/* نافذة الشات */}
      {open && mounted && createPortal(
        <>
          <div className="fixed inset-0 z-[9998] bg-aura-dark/80 backdrop-blur-md" onClick={() => setOpen(false)} />
          <div className="fixed bottom-4 right-4 z-[9999] w-[340px] h-[420px] bg-aura-card rounded-2xl border border-aura-border shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-aura-border bg-aura-canvas">
              <div>
                <h3 className="text-sm font-medium text-aura-dark">{isAr ? "الدعم الفني" : "Support"}</h3>
                <p className="text-[11px] text-aura-muted">{isAr ? "تواصل مباشر مع الأدمن" : "Direct line to admin"}</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full border border-aura-border flex items-center justify-center text-aura-muted">
                <HiOutlineXMark className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
              {!userId ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
                  <MdOutlineHeadsetMic className="w-10 h-10 text-aura-accent/30" />
                  <p className="text-xs text-aura-muted">{isAr ? "لازم تسجّل دخول الأول عشان تقدر تتواصل مع الدعم الفني" : "Please log in first to contact support"}</p>
                  <a href={`/${isAr ? "ar" : "en"}/login`} className="px-5 py-2.5 rounded-full bg-aura-accent text-white text-xs font-medium hover:bg-aura-dark transition-all">
                    {isAr ? "تسجيل الدخول" : "Log In"}
                  </a>
                </div>
             ) : messages.length === 0 ? (
                <div className="flex justify-start">
                  <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed bg-aura-canvas text-aura-dark rounded-bl-md border border-aura-border">
                    {isAr
                      ? "مرحبًا بكم في الدعم الفني الخاص بموقع عقار أونلاين 👋\nممكن نساعدك إزاي؟"
                      : "Welcome to Aqar Online support 👋\nHow can we help you?"}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${m.sender === "user" ? "bg-aura-accent text-white rounded-br-md" : "bg-aura-canvas text-aura-dark rounded-bl-md border border-aura-border"}`}>
                      {m.image_url && (
                        <a href={m.image_url} target="_blank" rel="noopener noreferrer">
                          <img src={m.image_url} alt="" className="rounded-lg mb-1.5 max-w-full max-h-40 object-cover" />
                        </a>
                      )}
                      {m.message}
                      <p className={`text-[9px] mt-1 ${m.sender === "user" ? "text-white/70" : "text-aura-muted"}`}>
                        {new Date(m.created_at).toLocaleTimeString(isAr ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {userId && (
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
                  placeholder={isAr ? "اكتب رسالتك..." : "Type your message..."}
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
            )}
          </div>
        </>,
        document.body
      )}
    </>
  );
}