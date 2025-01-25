import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

function AiConversations() {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState<
  { sender: 'user' | 'ai'; text: string }[]
  >([]);

  // A reference to the scrollable chat container to keep the latest message visible
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scrolls to the bottom whenever 'messages' state updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Called when the user clicks the 'send' button
  const handleSendMessage = async () => {
    // Only proceed if there is a non-empty message
    if (!userMessage.trim()) {
      console.log('Message is empty. Not sending to AI.');
    }

    // Add the user's message to 'messages' state so it shows up on the UI
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

    console.log('Sending message to the AI route:', userMessage);

    try {
      const response = await axios.post('/api/aiConversation', {
        userId: 1, // hard coded for example
        prompt: userMessage,
      });

      console.log('AI responded with:', response.data);

      const { advice, tips } = response.data.structured;
      const fallbackResponse = response.data.conversation.response;

      let aiText = '';
      if (advice) {
        aiText += advice;
      }
      if (tips && tips.length > 0) {
        aiText = fallbackResponse;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }]);
    } catch (error) {
      console.error('Error calling AI conversation route:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Sorry, something went wrong. Try again later' },
      ]);
    }
    setUserMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen p-4">
      <h1 className="text-3xl font-bold mb-2 text-center">
        AI Social Anxiety Chat
      </h1>
      <p className="text-center mb-4 italic">
        &quot;Your personalized anxiety coach, powered by Gemini.&quot;
      </p>
      <div
        ref={chatContainerRef}
        className="w-full max-w-md flex-1 overflow-y-auto bg-secondary p-4 rounded-lg shadow"
      >
        {messages.map((msg, index) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            key={index}
            className={`my-2 p-2 rounded-md whitespace-pre-wrap ${
              msg.sender === 'user'
                ? 'bg-primary text-primary-foreground self-end'
                : 'bg-card text-card-foreground self-start'
            }`}
          >
            {msg.text}
          </motion.div>
        ))}
      </div>

      <div className="w-full max-w-md mt-2 flex gap-2">
        <Input
          // Controlled input for the user's typed message
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask me anything about social anxiety..."
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </div>
    </div>
  );
}

export default AiConversations;
