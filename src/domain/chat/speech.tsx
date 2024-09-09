import React, { useState } from "react";

const SpeechPage: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [language, setLanguage] = useState<string>("en-US");

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleSpeak = () => {
    if (text.trim() !== "") {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Multi-language Text to Speech</h1>
      <textarea
        value={text}
        onChange={handleTextChange}
        rows={10}
        cols={50}
        placeholder="Type your text here..."
        style={{ fontSize: "16px", width: "100%", marginBottom: "20px" }}
      />
      <br />
      <select
        value={language}
        onChange={handleLanguageChange}
        style={{ fontSize: "16px", marginBottom: "20px" }}
      >
        <option value="en-US">English (US)</option>
        <option value="ko-KR">Korean</option>
        <option value="zh-CN">Chinese (Simplified)</option>
        <option value="ja-JP">Japanese</option>
      </select>
      <br />
      <button
        onClick={handleSpeak}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Speak
      </button>
    </div>
  );
};

export default SpeechPage;
