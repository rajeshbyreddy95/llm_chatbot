import streamlit as st
import requests
import re

BACKEND = "https://llm-chatbot-a7mw.onrender.com"

st.set_page_config(page_title="IntelliChat", layout="centered")

st.markdown(
    """
    <style>
    /* Page background and font */
    .main {
        background-color: #f5f7fa;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    /* Title style */
    .stApp > header {
        font-size: 2.5rem;
        font-weight: bold;
    }
    /* Input box style */
    div[role="textbox"] > div > textarea, input[type="text"] {
        font-size: 1.8rem !important;
        padding: 10px !important;
        border-radius: 8px !important;
        border: 1.5px solid #4a90e2 !important;
        
    }
    /* Button style */
    button[kind="primary"] {
        font-size: 1.6rem !important;
        background-color: #4a90e2 !important;
        border-radius: 8px !important;
        padding: 8px 20px !important;
        color: white !important;
    }
    /* Chat response style */
    .chat-response {
        font-size: 1.8rem;
        background-color: #e1ecf9;
        padding: 15px 20px;
        border-radius: 10px;
        margin-top: 15px;
        color: #202020;
        white-space: pre-wrap;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

st.title("💬 IntelliChat")

# Create the input box tied to session state
if "chat_msg" not in st.session_state:
    st.session_state.chat_msg = ""

chat_msg = st.text_input("Type your message:", key="chat_msg")

if st.button("Send"):
    if not st.session_state.chat_msg.strip():
        st.warning("Please type a message.")
    else:
        try:
            with st.spinner("Chatting..."):
                resp = requests.post(
                    f"{BACKEND}/chat",
                    json={"message": st.session_state.chat_msg},
                    timeout=30
                )
                resp.raise_for_status()
                ans = resp.json().get("response", "")
                clean_ans = re.sub(r'\[\d+\]', '', ans)

                st.markdown(f'<div class="chat-response">{clean_ans.strip()}</div>', unsafe_allow_html=True)


        except Exception as e:
            st.error(f"Error: {e}")
