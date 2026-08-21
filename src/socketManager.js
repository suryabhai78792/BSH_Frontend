const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const UserHistory = require('../../../models/UserHistory');

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', async (socket) => {
        const { token, productId } = socket.handshake.query;

        let userId = null;
        let name = null;
        let address = null;
        let mobile = null;


        // 3. 🟢 टोकन को वेरीफाई करके उसके अंदर से userId और name डिकोड करें
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'YOUR_JWT_SECRET'); // ध्यान रखें: यहाँ वही गुप्त चाबी (Secret Key) होनी चाहिए जिससे टोकन बना है
                userId = decoded.user_id;
                name = decoded.name; // 👈 टोकन के अंदर से असली नाम मिल गया!
                address = decoded.address;   // 👈 यहाँ गाँव/पता सेव करें
                mobile = decoded.mobile;    // 👈 यहाँ मोबाइल सेव करें
            } catch (err) {
                console.log("[Socket] अमान्य या एक्सपायर्ड टोकन:", err.message);
            }
        }

        if (userId && productId) {
            if (productId) socket.join(productId);
            console.log(`[Socket] ऑनलाइन: ${name} | यूजर: ${userId} | प्रोडक्ट: ${productId}`);

            // 1. 🟢 चेक करें कि क्या पिछले 3 मिनट में इसी यूजर का कोई सेशन बंद हुआ था (रीफ्रेश/रिएक्टिवेट)
            const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

            let recentClosedSession = await UserHistory.findOne({
                userId: userId,
                productId: productId,
                offlineDateTime: { $ne: null, $gte: threeMinutesAgo }
            });

            if (recentClosedSession) {
                // अगर पुराना सेशन मिल गया, तो नया रो मत बनाओ! पुराने वाले का offlineDateTime वापस null कर दो
                recentClosedSession.offlineDateTime = null;
                await recentClosedSession.save();

                socket.historyId = recentClosedSession._id;
                console.log(`[Socket] पुराना सेशन फिर से चालू हुआ: ${name}`);
            } else {
                // यदि नया लॉगिन है या काफी देर बाद आया है, तभी फ्रेश एंट्री बनाएं
                const newHistory = await UserHistory.create({
                    userId,
                    name: name,
                    mobile: mobile || 'उपलब्ध नहीं',   // 👈 यहाँ मोबाइल सेव करें
                    address: address || 'पता नहीं',    // 👈 यहाँ गाँव/पता सेव करें
                    productId,
                    onlineDateTime: new Date(),
                    offlineDateTime: null, // शुरू में यह खाली रहेगा ताकि यह 'ऑनलाइन' माना जाए
                    lastPing: new Date()
                });

                // यदि नया लॉगिन है या काफी देर बाद आया है, तभी फ्रेश एंट्री बनाएं
                // इस रिकॉर्ड की आईडी को सॉकेट में सुरक्षित रखें
                socket.historyId = newHistory._id;
                console.log(`[Socket] नया फ्रेश ऑनलाइन सेशन शुरू: ${name}`);
            }
        }

        // फ्रंटएंड को लाइव अपडेट भेजने के लिए ट्रिगर करें
        io.emit('refreshTable');

        // उस heartbeat पिंग को 'सुनने' (Listen करने) के लिए
        socket.on('client_heartbeat', async () => {
            if (socket.historyId) {
                await UserHistory.findByIdAndUpdate(socket.historyId, {
                    lastPing: new Date()
                });
            }
        });

        // 2. 🔴 जब यूजर डिस्कनेक्ट (ऑफलाइन) हो
        socket.on('disconnect', async () => {
            if (userId && productId) {
                console.log(`[Socket] ऑफलाइन: ${userId}`);

                // डेटाबेस के उसी रिकॉर्ड में 'offlineDateTime' अपडेट कर दें
                if (socket.historyId) {
                    await UserHistory.findByIdAndUpdate(socket.historyId, {
                        offlineDateTime: new Date() // 👈 यहाँ ऑफलाइन का समय आ जाएगा
                    });
                }
            }
            // फ्रंटएंड को बताएं कि डेटा बदल गया है, टेबल रीफ्रेश करें
            io.emit('refreshTable');
        });
    });

    return io;
}

module.exports = initSocket;