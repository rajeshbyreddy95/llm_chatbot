export const API_BASE = "https://llm-chatbot-1-0nez.onrender.com";

/**
 * 💬 Chat API
 */
export const chatWithBot = async (message) => {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Backend error:", error);
      throw new Error("Server error");
    }

    const data = await res.json();
    if (!data.response) throw new Error("No response received from server");

    return data;
  } catch (err) {
    console.error("Chat API error:", err);
    throw err;
  }
};

/**
 * 📄 PDF Summarization API
 */
export const summarizePDF = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/summarize`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to summarize PDF");

  return res.json();
};
