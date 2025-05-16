import React, { useState } from "react";

import { CiUser, CiMail, CiLock, CiPhone, CiHome } from "react-icons/ci";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import nakliyeGorsel from "/images/afet_nakliye_gorsel.png";

const KayıtOl = () => {
  const queryClient = useQueryClient();
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

  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await axios.post("/api/auth/kayitol", formData, {
          withCredentials: true,
        });

        if (res.data.error) {
          throw new Error(res.data.error);
        }
        // Başarılı bir yanıt döndürülürse, bu yanıtı döndürün
        console.log(res.data);
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.error);
      }
    },
    onSuccess: (data) => {
      toast.success("Kayıt başarılı!");

      queryClient.invalidateQueries(["girisYapanKullanici"]);
    },
    onError: (error) => {
      toast.error("Kayıt hatası: " + error.message);

      console.error("Kayıt hatası:", error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sifre !== formData.sifreTekrar) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    console.log("Gönderilen veriler:", formData);
    mutate(formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Görsel */}
      <div
        className="relative block lg:w-1/2 min-h-screen bg-cover bg-center z-20"
        style={{
          backgroundImage: 'url("/images/afet_nakliye_gorsel2.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Yarı saydam overlay */}

        {/* İçerik katmanı */}
        <div className="flex h-full flex-col justify-start bg-black/60 items-center pt-14">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Hoş Geldiniz</h1>
            <p className="text-xl">
              Bu platform, afet dönemlerinde yolcu ve yük taşımacılığı için araç
              talep ve görevlendirme süreçlerini dijital olarak yönetmek
              amacıyla geliştirilmiştir.
            </p>
            <p className="text-xl font-semibold pt-8">
              Katılmak ve destek sağlamak için hemen kayıt olun.
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
                <Link to="/girisyap" className="link link-primary ml-1">
                  Giriş Yap
                </Link>
              </p>
             
            </div>
             <div className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
                Bu sistem, <span className="font-medium">Burak Poyraz</span>{" "}
                tarafından
                <span className="font-semibold">
                  {" "}
                  Ahmet Yesevi Üniversitesi - Bilgisayar Mühendisliği -
                </span>
                <span className="font-semibold"> Proje II</span> dersi
                kapsamında geliştirilmiştir.
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KayıtOl;
