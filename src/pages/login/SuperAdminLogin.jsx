import React, { useState} from 'react';
import {callApi } from '../../api';
import './SuperAdminLogin.css';

export default function SuperAdminLogin({onLoginSuccess}) {

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // आपके मौजूदा लॉगिन API को कॉल करने का फंक्शन
    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        // यहाँ प्रोडक्ट आईडी को फिक्स कर दिया गया है (अब यूजर को नहीं डालना पड़ेगा)
        const product_id = "Business_Software_Hub";
        try {
            // आपके बनाए हुए लॉगिन API का राउट यहाँ सेट करें (जैसे: /api/login)
            const { ok, data } = await callApi('/api/client-admin/api/login', 'POST', {
                user_id: userId,
                password: password,
                product_id: product_id
            });

            if (ok && data.token) {
                // टोकन और रोल को लोकल स्टोरेज में सेव करें
                localStorage.setItem("token", data.token);

                // पैरेंट कॉम्पोनेंट (App.js) को बताएं कि लॉगिन सफल हो गया है
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            } else {
                setError(data?.message || "लॉगिन विफल रहा!");
            }
        } catch (err) {
            console.error("लॉगिन एरर:", err);
            setError("सर्वर से कनेक्ट करने में समस्या आ रही है।");
        }
    }

    // 4. रिटर्न स्टेटमेंट (यहाँ HTML फाइल वाला कोड JSX में बदलकर आएगा)
    return (
        <div className="body-content">
            {/* बॉडी टैग के अंदर का सारा कोड यहाँ लिखें */}
            {/*-- 🔐 लॉगिन स्क्रीन (शुरुआत में दिखेगी) --*/}
            <div id="login-section" className="login-container">
                <h2>🔑 यूजर लॉगिन</h2>
                <form id="login-form" onSubmit={handleLogin}>
                    <label>यूजर आईडी (User ID):</label>
                    <input
                        type="text"
                        required
                        placeholder="यूजर आईडी डालें"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    <label>पासवर्ड (Password):</label>
                    <input
                        type="password"
                        required
                        placeholder="पासवर्ड डालें"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">लॉगिन करें</button>
                </form>
            </div>

        </div>
    );
}



