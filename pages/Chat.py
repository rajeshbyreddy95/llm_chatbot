import streamlit as st
import requests
import re

BACKEND = "https://llm-chatbot-a7mw.onrender.com"

st.set_page_config(page_title="IntelliChat", layout="centered")


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
                # after getting ans from backend
                clean_ans = re.sub(r'\[\d+\]', '', ans)

                st.markdown(f'<div class="chat-response">{clean_ans.strip()}</div>', unsafe_allow_html=True)

        except Exception as e:
            st.error(f"Error: {e}")
