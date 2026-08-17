// src/api.js

export const API_BASE_URL = import.meta.env.VITE_API_URL; // आपका रेंडर लाइव लिंक

// एक कॉमन फेच फंक्शन ताकि बार-बार कोड न लिखना पड़े
export async function callApi(endpoint, method = "GET", data = null, token = null) {
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
            body: data ? JSON.stringify(data) : null
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const result = await response.json();

        return { ok: response.ok, data: result };
    } catch (err) {
        console.error("API Error:", err);
        return { ok: false, message: "सर्वर से कनेक्ट करने में समस्या आई।" };
    }
}