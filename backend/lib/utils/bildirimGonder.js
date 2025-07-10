import { mailGonder } from './email.js';
import { smsGonder } from './sms.js';

/**
 * Bildirim gönderimi için yardımcı fonksiyon (E-posta ve SMS)
 * @param {Object} params - Bildirim gönderim parametreleri
 * @param {string} params.email - Alıcının e-posta adresi
 * @param {string} params.telefon - Alıcının telefon numarası (+90 ile başlamalı)
 * @param {string} params.subject - E-posta konusu
 * @param {string} params.html - E-posta HTML içeriği
 * @param {string} params.baslik - SMS başlığı
 * @param {string} params.mesaj - SMS mesaj içeriği
 * @param {Object} [params.konum] - Konum bilgisi (opsiyonel)
 * @param {number} params.konum.lat - Enlem
 * @param {number} params.konum.lng - Boylam
 * @param {string} params.konum.adres - Adres
 * @returns {Promise<{success: boolean, emailSent: boolean, smsSent: boolean, error?: string, warnings?: string[]}>}
 */
export const bildirimGonder = async({ email, telefon, subject, html, baslik, mesaj, konum }) => {
    let emailSent = false;
    let smsSent = false;
    let error = null;
    const warnings = [];

    try {
        // E-posta gönderimi
        if (email) {
            try {
                await mailGonder({
                    to: email,
                    subject,
                    html
                });
                emailSent = true;
                console.log("✅ E-posta gönderildi:", email);
            } catch (err) {
                console.error("❌ E-posta gönderme hatası:", err.message);
                warnings.push(`E-posta gönderilemedi: ${email}`);
            }
        }

        // SMS gönderimi
        if (telefon) {
            let smsIcerik = `${baslik}\n\n${mesaj}`;

            // Konum bilgisi varsa ekle
            if (konum) {
                smsIcerik += `\n\nKonum: ${konum.adres}\nHaritada görüntüle: https://www.google.com/maps?q=${konum.lat},${konum.lng}`;
            }

            const smsResult = await smsGonder({
                to: telefon,
                message: smsIcerik
            });

            if (!smsResult.success) {
                warnings.push(smsResult.error);
            } else {
                smsSent = true;
            }
        }

        // En az bir bildirim başarılı ise işlem başarılı sayılır
        const success = emailSent || smsSent;

        return {
            success,
            emailSent,
            smsSent,
            ...(warnings.length > 0 && { warnings }),
            ...(error && { error })
        };
    } catch (error) {
        console.error("❌ Bildirim gönderme hatası:", error.message);
        return {
            success: false,
            emailSent,
            smsSent,
            error: "Bildirim gönderilirken bir hata oluştu.",
            warnings
        };
    }
};