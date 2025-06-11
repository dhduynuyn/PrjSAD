import React, { useState, useRef, useEffect } from 'react';
import { BsSend } from 'react-icons/bs';
import { FiLoader } from 'react-icons/fi';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Xin chào! Tôi là trợ lý ảo tìm truyện. Bạn muốn đọc truyện có nội dung, thể loại, hay tình tiết như thế nào? Cứ miêu tả tự nhiên nhé!',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageMode, setImageMode] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: 'user', text: userMessage },
    ]);
    setInputValue('');
    setIsLoading(true);

    try {
          // Gọi API backend sử dụng phương thức GET với query
          const endpoint = imageMode
      ? `http://localhost:5000/chatbot/image?query=${encodeURIComponent(userMessage)}`
      : `http://localhost:5000/chatbot/ai?query=${encodeURIComponent(userMessage)}`;

    const response = await fetch(endpoint);

    // if (!response.ok) {
    //   throw new Error(`Lỗi từ server: ${response.statusText}`);
    // }

    console.log('Sending message to API:', userMessage, 'Image mode:', imageMode);

    console.log('response:', response);
    const data = await response.json();

    console.log('API response:', data);

    if (imageMode) {
      // Xử lý ảnh từ base64
      const base64Image = data.response; // Giả sử backend trả về chuỗi base64
      const imageUrl = `data:image/png;base64,${base64Image}`;

      console.log("Base64 image URL:", imageUrl);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', image: imageUrl },
      ]);
    } else {
      // Xử lý văn bản
      const textResponse = data.response;
      const formattedReply = textResponse.trim().replace(/\n/g, '<br />').replaceAll("**", "");

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: formattedReply, isHtml: true },
      ]);
    }


    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Rất xin lỗi, đã có sự cố kết nối với trợ lý ảo. Vui lòng thử lại sau ít phút.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 12rem)' }}>
        {/* Header */}
        <div className="bg-sky-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">AI Tìm Truyện</h1>
          <p className="text-sm opacity-90">Trợ lý ảo giúp bạn tìm được truyện ưng ý</p>
        </div>

        {/* Khung chat */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white flex-shrink-0">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-base ${
                    msg.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                  }`}
                >
                  {/* Sử dụng dangerouslySetInnerHTML để render HTML (dấu <br />) */}
                  {msg.image ? (
                  <img src={msg.image} alt="Generated" className="max-w-full rounded-lg" />
                ) : msg.isHtml ? (
                  <p dangerouslySetInnerHTML={{ __html: msg.text }} />
                ) : (
                  <p>{msg.text}</p>
                )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-end gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white flex-shrink-0">AI</div>
                <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-2xl rounded-bl-none flex items-center gap-3">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={imageMode}
              onChange={(e) => setImageMode(e.target.checked)}
              className="accent-sky-600"
            />
            Tạo hình ảnh
          </label>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ví dụ: Tìm truyện nữ chính mạnh mẽ, xuyên không về cổ đại..."
              className="flex-grow p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              className="bg-sky-600 text-white rounded-full hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed flex items-center justify-center w-12 h-12 flex-shrink-0"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Gửi"
            >
              {isLoading ? <FiLoader className="animate-spin text-2xl" /> : <BsSend className="text-xl" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}