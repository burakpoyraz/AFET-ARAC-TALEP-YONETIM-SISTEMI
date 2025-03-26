import React, { useState } from "react";

import { CiUser, CiMail, CiLock, CiPhone, CiHome } from "react-icons/ci";

const KayıtOl = () => {
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    email: "",
    sifre: "",
    sifreTekrar: "",
    telefon: "",
    kurumFirmaAdi: "",
    kurumFirmaTuru: "kendi_adima",
    pozisyon: "",
  });

  const handleInputChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sifre !== formData.sifreTekrar) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    try {
      console.log(formData);
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Görsel */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/api/placeholder/800/1200")',
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="flex h-full items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Hoş Geldiniz</h1>
            <p className="text-xl">
              Hesap oluşturarak platformumuzun tüm özelliklerinden
              yararlanabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Form */}
      <div className="w-full lg:w-1/2 bg-base-200 flex items-center justify-center p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4 ">Kayıt Ol</h2>
            <form onSubmit={handleSubmit}>
              <label className="input validator mb-4 w-full flex items-center gap-2">
                <span className="opacity-50">
                  <CiUser />
                </span>
                <input
                  type="text"
                  name="ad"
                  required
                  placeholder="Adınız"
                  className="grow"
                  onChange={handleInputChanges}
                />
              </label>
              <label className="input validator mb-4 w-full flex items-center gap-2">
                <span className="opacity-50">
                  <CiUser />
                </span>
                <input
                  type="text"
                  name="soyad"
                  required
                  placeholder="Soyadınız"
                  className="grow"
                  onChange={handleInputChanges}
                />
              </label>
              <label className="input validator mb-4 w-full flex items-center gap-2">
                <span className="opacity-50">
                  <CiMail />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="E-posta"
                  className="grow"
                  onChange={handleInputChanges}
                />
              </label>
              <label className="input validator mb-4 w-full flex items-center gap-2">
                <span className="opacity-50">
                  <CiPhone />
                </span>
                <input
                  type="tel"
                  name="telefon"
                  required
                  placeholder="Telefon (5xx1234567)"
                  pattern="^[1-9][0-9]{9}$"
                  maxLength={10}
                  className="grow"
                  onChange={handleInputChanges}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // sadece rakam kalsın
                  }}
                />
              </label>
              <label className="input validator mb-4 w-full flex items-center gap-2">
                <span className="opacity-50">
                  <CiLock />
                </span>
                <input
                  type="password"
                  name="sifre"
                  required
                  placeholder="Şifre"
                  className="grow"
                  onChange={handleInputChanges}
                />
              </label>
              <label className="input validator mb-4 w-full flex items-center gap-2">
                <span className="opacity-50">
                  <CiLock />
                </span>
                <input
                  type="password"
                  name="sifreTekrar"
                  required
                  placeholder="Şifre Tekrar"
                  className="grow"
                  onChange={handleInputChanges}
                />
              </label>

              <select
                defaultValue=""
                name="kurumFirmaTuru"
                className="select mb-4 w-full"
                onChange={handleInputChanges}
                value={formData.kurumFirmaTuru}
              >
                <option value="kendi_adima">Kendi Adıma</option>
                <option value="kurulus_adina">Kuruluş Adına</option>
              </select>

              {formData.kurumFirmaTuru === "kurulus_adina" && (
                <div>
                  {" "}
                  <label className="input validator mb-4 w-full flex items-center gap-2">
                    <span className="opacity-50">
                      <CiHome />
                    </span>
                    <input
                      type="text"
                      name="kurumFirmaAdi"
                      required
                      placeholder="Kurum/Firma Adı"
                      className="grow"
                      onChange={handleInputChanges}
                    />
                  </label>
                  <label className="input validator mb-4 w-full flex items-center gap-2">
                    <span className="opacity-50">
                      <CiHome />
                    </span>
                    <input
                      type="text"
                      name="pozisyon"
                      required
                      placeholder="Pozisyon"
                      className="grow"
                      onChange={handleInputChanges}
                    />
                  </label>
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full">
                Kayıt Ol
              </button>
            </form>
            <div className="text-center mt-4">
              <p className="text-sm">
                Zaten hesabınız var mı?
                <a href="/login" className="link link-primary ml-1">
                  Giriş Yap
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KayıtOl;
