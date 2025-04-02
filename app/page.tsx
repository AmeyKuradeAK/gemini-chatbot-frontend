"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setIsLoading(true); // Start loading animation

    try {
      const res = await fetch("https://gemini-chatbot-backend-tpw6.vercel.app//chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResponse(data.reply || "No response from Gemini.");
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponse("Error communicating with server.");
    } finally {
      setIsLoading(false); // End loading animation
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        alert("Code copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy code.");
      });
  };

  return (
    <div className="flex flex-col items-center p-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg animate-fadeIn">
      <h1 className="text-3xl font-extrabold text-white mb-4 animate-fadeInUp">Gemini Chatbot</h1>
      <div className="relative mb-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Ask something..."
          className="p-3 w-full rounded-lg shadow-lg border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="absolute right-2 top-2 flex items-center space-x-2">
          {isLoading && (
            <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
          )}
        </div>
      </div>
      <button
        onClick={sendMessage}
        className="p-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
      >
        Send
      </button>
      {response && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md animate-fadeInUp max-w-lg w-full overflow-auto">
          {/* Use ReactMarkdown and wrap in a div for styling */}
          <div className="whitespace-pre-wrap break-words text-lg text-gray-800">
            <ReactMarkdown components={{
              code({ inline, children }: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                const codeString = String(children).replace(/\n$/, '');
                return !inline ? (
                  <div className="relative">
                    <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm font-mono">{codeString}</code>
                    </pre>
                    <button
                      className="absolute top-2 right-2 bg-indigo-600 text-white rounded-md px-2 py-1 text-xs"
                      onClick={() => handleCopy(codeString)}
                    >
                      Copy
                    </button>
                  </div>
                ) : (
                  <code className="bg-gray-200 p-1 rounded-sm">{children}</code>
                );
              }
            }}>
              {response}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
