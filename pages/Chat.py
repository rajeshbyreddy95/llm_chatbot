import streamlit as st
import requests

BACKEND = "http://localhost:5040"

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
                st.write(ans)


        except Exception as e:
            st.error(f"Error: {e}")
