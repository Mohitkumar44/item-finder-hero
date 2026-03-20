import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useChat, sendMessage } from "@/hooks/useChat";

interface ItemChatProps {
  itemId: string;
}

const ItemChat = ({ itemId }: ItemChatProps) => {
  const { user } = useAuth();
  const { messages } = useChat(itemId);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        Sign in to join the conversation
      </div>
    );
  }

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    try {
      await sendMessage(itemId, trimmed, user.uid, user.displayName || "Anonymous");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-foreground">Chat</h4>
      <ScrollArea className="h-48 rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex flex-col gap-2">
          {messages.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No messages yet. Start the conversation!
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.senderId === user.uid;
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
              >
                <span className="text-[10px] text-muted-foreground mb-0.5">
                  {isMe ? "You" : msg.senderName}
                </span>
                <div
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Type a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!text.trim() || sending}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ItemChat;
