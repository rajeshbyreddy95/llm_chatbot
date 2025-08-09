import streamlit as st
import requests
import pandas as pd
import json

BACKEND = "http://localhost:5040"

st.title("📂 File Summarize & Q&A")
uploaded_file = st.file_uploader("Upload a file", type=["pdf", "csv", "xlsx", "txt"])

if st.button("Summarize / Process File"):
    if not uploaded_file:
        st.sidebar.error("Please upload a file first.")
    else:
        file_ext = uploaded_file.name.split(".")[-1].lower()

        if file_ext == "pdf":
            with st.spinner("Uploading and summarizing PDF..."):
                files = {"file": (uploaded_file.name, uploaded_file.getvalue(), "application/pdf")}
                try:
                    resp = requests.post(f"{BACKEND}/summarize", files=files, timeout=120)
                    resp.raise_for_status()
                    data = resp.json()
                    if "summary" in data:
                        st.session_state["summaries"] = data["summary"]
                        st.session_state["file_text"] = None
                        st.success("PDF summarization complete.")
                    else:
                        st.error("No summary returned: " + json.dumps(data))
                except Exception as e:
                    st.error(f"Error: {e}")

        elif file_ext == "csv":
            with st.spinner("Processing CSV file..."):
                try:
                    df = pd.read_csv(uploaded_file)
                    st.session_state["file_text"] = df.to_string(index=False)
                    st.session_state.pop("summaries", None)
                    st.success("CSV file processed for Q&A.")
                except Exception as e:
                    st.error(f"Error reading CSV file: {e}")

        elif file_ext == "xlsx":
            with st.spinner("Processing XLSX file..."):
                try:
                    excel_data = pd.read_excel(uploaded_file, sheet_name=None)
                    combined_text = ""
                    for sheet_name, df in excel_data.items():
                        combined_text += f"\n\n### Sheet: {sheet_name}\n"
                        combined_text += df.to_string(index=False)
                    st.session_state["file_text"] = combined_text
                    st.session_state.pop("summaries", None)
                    st.success("XLSX file processed for Q&A.")
                except Exception as e:
                    st.error(f"Error reading XLSX file: {e}")

        elif file_ext == "txt":
            with st.spinner("Processing TXT file..."):
                try:
                    text_content = uploaded_file.read().decode("utf-8")
                    st.session_state["file_text"] = text_content
                    st.session_state.pop("summaries", None)
                    st.success("TXT file processed for Q&A.")
                except Exception as e:
                    st.error(f"Error reading TXT file: {e}")

# === PDF Flow ===
if "summaries" in st.session_state:
    summaries = st.session_state["summaries"]
    pages = list(summaries.keys())
    selected_page = st.selectbox("Choose a page to use as context", ["All pages"] + pages)
    show_raw = st.checkbox("Show raw HTML summary", value=False)

    for p in pages:
        with st.expander(p, expanded=False):
            summary_html = summaries[p]
            if show_raw:
                st.code(summary_html)
            st.markdown(summary_html, unsafe_allow_html=True)

    st.markdown("---")
    question = st.text_input("Enter your question")
    if st.button("Ask with context"):
        if not question.strip():
            st.warning("Please type a question.")
        else:
            page_text = "\n\n".join([summaries[p] for p in pages]) if selected_page == "All pages" else summaries[selected_page]
            payload = {"message": question, "page_text": page_text}
            try:
                with st.spinner("Getting answer..."):
                    resp = requests.post(f"{BACKEND}/ask_with_context", json=payload, timeout=60)
                    resp.raise_for_status()
                    ans = resp.json().get("response", "")
                    st.markdown("**Answer:**")
                    st.write(ans)
            except Exception as e:
                st.error(f"Error: {e}")

# === CSV / XLSX / TXT Flow ===
elif "file_text" in st.session_state and st.session_state["file_text"]:
    question = st.text_input("Enter your question")
    if st.button("Ask from file"):
        if not question.strip():
            st.warning("Please type a question.")
        else:
            payload = {"message": question, "page_text": st.session_state["file_text"]}
            try:
                with st.spinner("Getting answer..."):
                    resp = requests.post(f"{BACKEND}/ask_with_context", json=payload, timeout=60)
                    resp.raise_for_status()
                    ans = resp.json().get("response", "")
                    st.markdown("**Answer:**")
                    st.write(ans)
            except Exception as e:
                st.error(f"Error: {e}")
