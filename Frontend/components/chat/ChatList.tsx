import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface Conversation {
  partnerId: string;
  lastMessage: string;
  lastMessageDate: string;
  unread: number;
  partner: {
    name: string;
    avatar: string;
    role: string;
  };
}

interface ChatListProps {
  conversations: Conversation[];
  loading: boolean;
  activeConversation: string | null;
  onSelectConversation: (partnerId: string) => void;
}

export default function ChatList({
  conversations,
  loading,
  activeConversation,
  onSelectConversation,
}: ChatListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-muted-foreground">No conversations yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-2 pr-3">
        {conversations.map((conversation) => (
          <div
            key={conversation.partnerId}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${activeConversation === conversation.partnerId ? 'bg-muted' : 'hover:bg-muted/50'}`}
            onClick={() => onSelectConversation(conversation.partnerId)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.partner.avatar || '/placeholder.svg'} alt={conversation.partner.name} />
              <AvatarFallback>
                {conversation.partner.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium truncate">{conversation.partner.name}</h4>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(conversation.lastMessageDate), { addSuffix: true })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
                {conversation.unread > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
