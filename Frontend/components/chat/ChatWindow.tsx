import React, { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    avatar?: string;
  };
  receiver: {
    _id: string;
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
  isRead: boolean;
  attachment?: string;
  attachmentType?: 'image' | 'document' | 'link' | 'none';
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
  currentUserId: string;
  partnerTyping: boolean;
  partnerName: string;
}

export default function ChatWindow({
  messages,
  loading,
  error,
  currentUserId,
  partnerTyping,
  partnerName,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-muted-foreground">No messages yet</p>
        <p className="text-xs text-muted-foreground mt-2">Start the conversation by sending a message</p>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages = messages.reduce<{
    [date: string]: Message[];
  }>((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-4">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-xs text-muted-foreground">
                {date}
              </span>
            </div>
          </div>

          {dateMessages.map((message) => {
            const isCurrentUser = message.sender._id === currentUserId;
            return (
              <div
                key={message._id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender.avatar || '/placeholder.svg'} alt={message.sender.name} />
                      <AvatarFallback>
                        {message.sender.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div>
                    <div 
                      className={`px-4 py-2 rounded-lg ${isCurrentUser 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'}`}
                    >
                      <p>{message.text}</p>
                      {message.attachment && (
                        <div className="mt-2">
                          {message.attachmentType === 'image' ? (
                            <img 
                              src={message.attachment} 
                              alt="Attachment" 
                              className="max-w-full rounded" 
                            />
                          ) : message.attachmentType === 'link' ? (
                            <a 
                              href={message.attachment} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              {message.attachment}
                            </a>
                          ) : (
                            <a 
                              href={message.attachment} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View attachment
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {partnerTyping && (
        <div className="flex justify-start">
          <div className="flex items-center space-x-2 max-w-[80%]">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {partnerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="px-4 py-2 rounded-lg bg-muted rounded-tl-none">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
