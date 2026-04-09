"use client";
import { MessageSquare, Mail, Linkedin } from "lucide-react";

const MOCK_MESSAGES = [
  { id: "1", type: "email", from: "John Smith", company: "Acme Corp", preview: "Thanks for reaching out! I'd love to learn more...", time: "2h ago", unread: true },
  { id: "2", type: "linkedin", from: "Sarah Johnson", company: "TechStart", preview: "Hi! I saw your message and I'm interested...", time: "5h ago", unread: true },
  { id: "3", type: "email", from: "Marc Dubois", company: "Global Inc", preview: "Could we schedule a call next week?", time: "1d ago", unread: false },
  { id: "4", type: "whatsapp", from: "Ana Lima", company: "Startup XY", preview: "Bonjour, merci pour votre message!", time: "2d ago", unread: false },
];

const TYPE_ICONS: Record<string, any> = {
  email: Mail,
  linkedin: Linkedin,
  whatsapp: MessageSquare,
};

const TYPE_COLORS: Record<string, string> = {
  email: "bg-blue-100 text-blue-600",
  linkedin: "bg-sky-100 text-sky-600",
  whatsapp: "bg-green-100 text-green-600",
};

export default function InboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {MOCK_MESSAGES.filter((m) => m.unread).length} unread
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {MOCK_MESSAGES.map((msg, i) => {
          const Icon = TYPE_ICONS[msg.type];
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-4 px-6 py-4 cursor-pointer hover:bg-gray-50 transition ${i < MOCK_MESSAGES.length - 1 ? "border-b border-gray-100" : ""} ${msg.unread ? "bg-blue-50/30" : ""}`}
            >
              <div className={`p-2 rounded-lg flex-shrink-0 ${TYPE_COLORS[msg.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium text-gray-900 ${msg.unread ? "font-semibold" : ""}`}>{msg.from}</span>
                    <span className="text-gray-400 text-sm">· {msg.company}</span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">{msg.preview}</p>
              </div>
              {msg.unread && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 text-center">
        <MessageSquare className="h-8 w-8 text-blue-400 mx-auto mb-2" />
        <p className="text-sm text-blue-700 font-medium">Full inbox integration coming soon</p>
        <p className="text-xs text-blue-500 mt-1">Connect your email, LinkedIn, and WhatsApp accounts to see all replies here</p>
      </div>
    </div>
  );
}
