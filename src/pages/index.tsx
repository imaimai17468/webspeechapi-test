import { useState, useEffect } from "react";

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState<string>("");
  const [transcript, setTranscript] = useState<string>("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = "ja-JP";
      recognition.continuous = true;
      recognition.interimResults = true;
      setRecognition(recognition);
    }
  }, []);

  useEffect(() => {
    if (!recognition) return;
    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
      setText("");
    }
  }, [isRecording]);

  useEffect(() => {
    if (!recognition) return;
    recognition.onresult = (event) => {
      const results = event.results;
      for (let i = event.resultIndex; i < results.length; i++) {
        if (results[i].isFinal) {
          setText((prevText) => prevText + results[i][0].transcript);
          setTranscript("");
        } else {
          setTranscript(results[i][0].transcript);
        }
      }
    };
  }, [recognition]);

  return (
    <main>
      <button
        onClick={() => {
          setIsRecording((prev) => !prev);
        }}
      >
        {isRecording ? "停止" : "録音開始"}
      </button>
      <div>
        <p>途中経過：{transcript}</p>
        <p>解析：{text}</p>
      </div>
    </main>
  );
}
