import streamlit as st
import json
import time

# --- Konfigurasi Halaman Streamlit ---
st.set_page_config(
    page_title="AHIM SMART GENERATOR",
    page_icon="📚",
    layout="wide"
)

# --- Fungsi Database Pengganti (Local State) ---
if 'local_feedback' not in st.session_state:
    st.session_state.local_feedback = []

def save_feedback(name, feedback_text):
    try:
        new_feedback = {
            "name": name,
            "feedback": feedback_text,
            "timestamp": time.time()
        }
        st.session_state.local_feedback.insert(0, new_feedback)
        return True
    except Exception as e:
        st.error(f"Gagal menyimpan feedback: {e}")
        return False

def get_recent_feedback():
    return st.session_state.local_feedback[:5]

# --- Antarmuka Streamlit ---
st.title("📚 AHIM SMART GENERATOR")
st.markdown("Aplikasi ini adalah contoh integrasi **Streamlit**.")

# Tab Navigasi
tab1, tab2 = st.tabs(["Beranda", "Feedback"])

with tab1:
    st.header("Selamat Datang")
    st.write("""
    Ini adalah versi Streamlit dari AHIM SMART GENERATOR.
    
    Untuk menggunakan aplikasi ini secara penuh, Anda perlu:
    1. Mengatur kunci API Gemini di Streamlit Secrets.
    2. Menambahkan logika generasi konten menggunakan SDK Python Gemini.
    """)
    
    st.info("Catatan: Aplikasi utama saat ini dibangun menggunakan React (Node.js). File `app.py` ini disediakan sebagai titik awal jika Anda ingin memigrasikannya ke Streamlit.")

with tab2:
    st.header("Kirim Feedback (Tersimpan Lokal Sesi)")
    
    with st.form("feedback_form"):
        name = st.text_input("Nama Anda")
        feedback_text = st.text_area("Feedback atau Saran")
        submit_button = st.form_submit_button("Kirim Feedback")
        
        if submit_button:
            if name and feedback_text:
                if save_feedback(name, feedback_text):
                    st.success("Terima kasih! Feedback Anda telah disimpan sementara untuk sesi ini.")
                else:
                    st.error("Gagal menyimpan feedback.")
            else:
                st.warning("Mohon lengkapi nama dan feedback.")
                
    st.subheader("Feedback Terbaru (Sesi Ini)")
    recent_feedback = get_recent_feedback()
    
    if recent_feedback:
        for item in recent_feedback:
            with st.chat_message("user"):
                st.write(f"**{item['name']}**")
                st.write(item['feedback'])
    else:
        st.write("Belum ada feedback dalam sesi ini.")
