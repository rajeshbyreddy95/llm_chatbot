from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import pdfplumber
from dotenv import load_dotenv
from langchain_perplexity import ChatPerplexity
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import HumanMessage
import traceback
import time
import json
import os
import re

# ----------------------------------
# ⚙️ Initialization
# ----------------------------------
load_dotenv()
app = Flask(__name__)
CORS(app, origins=["https://llm-chatbot-rho.vercel.app"])


# Initialize LLM
llm = ChatPerplexity(model="sonar", temperature=0.6)

# ----------------------------------
# 📄 PDF Summarizer Prompt
# ----------------------------------
prompt_template = """
You are a professional summarizer.
Summarize the following page content into a short paragraph.
Add an HTML <br> after each sentence.

Page content:
{page_text}
"""
prompt = PromptTemplate(template=prompt_template, input_variables=["page_text"])


# ----------------------------------
# 📘 PDF SUMMARIZER ENDPOINT
# ----------------------------------
@app.route("/summarize", methods=["POST"])
def summarize():
    page_data = {}
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        with pdfplumber.open(file) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if not text or not text.strip():
                    page_data[f"Page {i+1}"] = "No readable text on this page.<hr>"
                    continue

                final_prompt = prompt.format(page_text=text)
                response = llm.invoke([HumanMessage(content=final_prompt)])
                page_data[f"Page {i+1}"] = response.content.strip() + "<hr>"

        return jsonify({"summary": page_data})
    except Exception as e:
        print("Error:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ----------------------------------
# 💬 NORMAL CHAT ENDPOINT
# ----------------------------------
# ----------------------------------
# 💬 NORMAL CHAT ENDPOINT (non-streaming)
# ----------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    """
    Chat endpoint that returns a full Markdown-formatted response.
    Automatically formats code, tables, and structured content like GPT.
    Handles greetings locally for instant short replies.
    """
    try:
        data = request.get_json(force=True)
        user_input = (data.get("message") or "").strip()

        if not user_input:
            return jsonify({"error": "Message is required"}), 400

        lower_input = user_input.lower().strip()

        # ✅ Detect and handle greetings instantly
        if re.match(r"^(hi|hello|hey|good\s(morning|evening)|how\sare\syou)[!. ]*$", lower_input):
            return jsonify({
                "response": "Hey there 👋! How can I help you today?"
            })

        # Detect intent
        small_talk_keywords = ["hi", "hello", "hey", "good morning", "good evening", "how are you"]
        code_keywords = ["code", "example", "snippet", "program", "write", "implement", "show"]
        langs = ["python", "java", "javascript", "c++", "c#", "go", "rust", "typescript", "html", "css"]

        is_small_talk = any(k in lower_input for k in small_talk_keywords)
        is_code_request = any(k in lower_input for k in code_keywords + langs)

        # System prompt setup
        if is_small_talk:
            system_prompt = (
                "You are a friendly conversational chatbot like ChatGPT. "
                "Keep replies short and warm, avoid over-explaining. "
                "Use Markdown formatting for readability."
            )

        elif is_code_request:
            system_prompt = (
                "You are ChatGPT, a professional coding assistant. "
                "Always respond with properly formatted **Markdown fenced code blocks** "
                "using the correct language identifier (```python, ```java, etc.). "
                "Start with the code, then provide a brief explanation below. "
                "Use bullet points and short sections for clarity."
            )

        else:
            system_prompt = (
                "You are ChatGPT, a structured AI assistant. "
                "Always format responses using **Markdown** for readability. "
                "Use the following stylistic rules:\n\n"
                "• Use **bold section headings** with emojis (e.g., ## 📘 Overview)\n"
                "• Use bullet points or numbered lists for organization\n"
                "• Use tables for comparisons or structured data\n"
                "• Maintain a friendly, conversational tone\n"
                "• Use emojis or icons for visual clarity"
            )

        final_prompt = f"{system_prompt}\n\nUser says: {user_input}"

        # Call LLM
        response = llm.invoke([HumanMessage(content=final_prompt)])
        raw_text = response.content.strip()
        clean_response = re.sub(r"\[\d+\]", "", raw_text)

        # ✅ Auto-detect code and wrap if missing Markdown fences
        if any(x in clean_response.lower() for x in ["public class", "def ", "#include", "console.log", "System.out.println"]):
            if "```" not in clean_response:
                detected_lang = (
                    "java" if "public class" in clean_response else
                    "python" if "def " in clean_response or "print(" in clean_response else
                    "cpp" if "#include" in clean_response else
                    "javascript"
                )
                clean_response = f"```{detected_lang}\n{clean_response}\n```"

        print("\n✅ Response sent:\n", clean_response[:400])
        return jsonify({"response": clean_response})

    except Exception as e:
        print("❌ Error in /chat:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ----------------------------------
# ⚡ STREAMING CHAT ENDPOINT
# ----------------------------------
@app.route("/chat/stream", methods=["POST"])
def chat_stream():
    """Stream responses while preserving Markdown formatting."""
    try:
        data = request.get_json()
        user_input = (data.get("message") or "").strip()
        if not user_input:
            return jsonify({"error": "Message is required"}), 400

        # Detect if it's a coding question
        code_keywords = ["code", "example", "snippet", "program", "write", "implement", "show"]
        langs = ["python", "java", "javascript", "c++", "go", "rust", "typescript"]
        is_code_request = any(k in user_input.lower() for k in code_keywords + langs)

        if is_code_request:
            system_prompt = (
                "You are ChatGPT, a coding assistant. "
                "Always respond using proper Markdown fenced code blocks with correct language syntax "
                "(e.g., ```java or ```python). "
                "Include a short explanation below the code. "
                "Do not wrap the entire response in quotes or inline code."
            )
        else:
            system_prompt = (
                "You are a conversational AI assistant. "
                "Stream responses naturally and clearly."
            )

        final_prompt = f"{system_prompt}\n\nUser says: {user_input}"

        # Generate full response
        response = llm.invoke([HumanMessage(content=final_prompt)])
        text = re.sub(r"\[\d+\]", "", response.content.strip())

        # ✅ Auto-wrap if Markdown fences missing
        if any(x in text.lower() for x in ["public class", "def ", "#include", "console.log"]):
            if "```" not in text:
                detected_lang = "java" if "public class" in text else "python"
                text = f"```{detected_lang}\n{text}\n```"

        def generate():
            # Stream in small chunks for smooth UI
            words = text.split()
            buffer = ""
            for w in words:
                buffer += w + " "
                yield f"data: {json.dumps({'token': buffer})}\n\n"
                time.sleep(0.02)
                buffer = ""
            yield "data: [DONE]\n\n"

        return Response(generate(), mimetype="text/event-stream")

    except Exception as e:
        print("Error in /chat/stream:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ----------------------------------
# 📄 ASK WITH CONTEXT ENDPOINT
# ----------------------------------
@app.route("/ask_with_context", methods=["POST"])
def ask_with_context():
    """Answer questions using contextual text (e.g. PDF pages)."""
    try:
        data = request.get_json()
        user_input = (data.get("message") or "").strip()
        page_text = (data.get("page_text") or "").strip()

        if not user_input:
            return jsonify({"error": "Message is required"}), 400

        system_prompt = (
            "You are an assistant that answers questions using the provided page text. "
            "If the answer exists there, mention that it comes from the document. "
            "If not, say you don’t know and suggest next steps."
        )

        combined_prompt = (
            f"{system_prompt}\n\nPage content:\n{page_text}\n\nUser question:\n{user_input}"
        )

        response = llm.invoke([HumanMessage(content=combined_prompt)])
        text = re.sub(r"\[\d+\]", "", response.content.strip())

        return jsonify({"response": text})

    except Exception as e:
        print("Error in /ask_with_context:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ----------------------------------
# 🚀 RUN SERVER
# ----------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5040, debug=True, use_reloader=False)
