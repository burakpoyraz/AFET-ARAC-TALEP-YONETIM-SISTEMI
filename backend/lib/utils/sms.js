import twilio from 'twilio';

/**
 * Telefon numarasını uluslararası formata çevirir
 * @param {string} phoneNumber - Telefon numarası
 * @returns {string} - Formatlanmış telefon numarası
 */
const formatPhoneNumber = (phoneNumber) => {
    // Eğer numara zaten +90 ile başlıyorsa olduğu gibi döndür
    if (phoneNumber.startsWith('+90')) {
        return phoneNumber;
    }

    // Numarayı temizle (sadece rakamları al)
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Eğer numara 0 ile başlıyorsa onu kaldır
    const withoutZero = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;

    // +90 ekle
    return `+90${withoutZero}`;
};

/**
 * SMS gönderimi için yardımcı fonksiyon
 * @param {Object} params - SMS gönderim parametreleri
 * @param {string} params.to - Alıcının telefon numarası (+90 ile başlamalı)
 * @param {string} params.message - Gönderilecek mesaj içeriği
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const smsGonder = async({ to, message }) => {
    try {
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        // Telefon numarasını formatla
        const formattedNumber = formatPhoneNumber(to);

        await client.messages.create({
            body: message,
            to: formattedNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        console.log("✅ SMS gönderildi:", formattedNumber);
        return { success: true };
    } catch (error) {
        // Twilio bölge hatası kontrolü
        if (error.code === 21408) {
            console.warn("⚠️ SMS gönderimi devre dışı bırakıldı: Twilio bölge kısıtlaması");
            return {
                success: false,
                error: "SMS servisi şu anda kullanılamıyor. Lütfen sistem yöneticisi ile iletişime geçin."
            };
        }

        // Doğrulanmamış numara hatası kontrolü
        if (error.code === 21608) {
            console.warn(`⚠️ Doğrulanmamış numara: ${to}`);
            return {
                success: false,
                error: "Bu telefon numarası SMS servisi için doğrulanmamış. Deneme hesabında sadece doğrulanmış numaralara SMS gönderilebilir."
            };
        }

        console.error("❌ SMS gönderme hatası:", error.message);
        return {
            success: false,
            error: "SMS gönderilemedi. Lütfen daha sonra tekrar deneyin."
        };
    }
};