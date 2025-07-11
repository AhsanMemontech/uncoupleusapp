import { supabase } from './supabaseClient';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  messages: ChatMessage[];
  updated_at: string;
}

const MAX_MESSAGES = 20;

export class ChatSessionManager {
  // Get chat session for user
  static async getChatSession(userId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('messages')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single()

      if (error) {
        console.error('Error fetching chat session:', error);
        return [];
      }

      // If no data found, return empty array
      if (!data) {
        //console.log('DEBUG: No chat session found for user, returning empty array');
        return [];
      }

      return data.messages || [];
    } catch (error) {
      console.error('Error in getChatSession:', error);
      return [];
    }
  }

  // Save chat session for user
  static async saveChatSession(userId: string, messages: ChatMessage[]): Promise<void> {
    try {
      // Keep only the last MAX_MESSAGES messages
      const trimmedMessages = messages.slice(-MAX_MESSAGES);

      const { error } = await supabase
        .from('chat_sessions')
        .upsert({
          user_id: userId,
          messages: trimmedMessages,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving chat session:', error);
      } else {
        //console.log('DEBUG: Chat session saved successfully');
      }
    } catch (error) {
      console.error('Error in saveChatSession:', error);
    }
  }

  // Add new message to chat session
  static async addMessage(userId: string, message: ChatMessage): Promise<void> {
    try {
      // Get current messages
      const currentMessages = await this.getChatSession(userId);
      
      // Add new message
      const updatedMessages = [...currentMessages, message];
      
      // Save updated session
      await this.saveChatSession(userId, updatedMessages);
    } catch (error) {
      console.error('Error in addMessage:', error);
    }
  }

  // Clear chat session for user
  static async clearChatSession(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing chat session:', error);
      } else {
        //console.log('DEBUG: Chat session cleared successfully');
      }
    } catch (error) {
      console.error('Error in clearChatSession:', error);
    }
  }
} 