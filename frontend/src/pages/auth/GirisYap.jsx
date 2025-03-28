import React from "react";
import { useState } from "react";
import { CiMail, CiLock } from "react-icons/ci";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";


const GirisYap = () => {

  const queryClient=useQueryClient();
  
  const [formData, setFormData] = useState({
    email: "",
    sifre: "",
  });

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { mutate, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await axios.post("/api/auth/girisyap", formData , {withCredentials: true});

        if (res.data.error) {
          throw new Error(res.data.error);
        }
        // Başarılı bir yanıt döndürülürse, bu yanıtı döndürün
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.error);
      }
    },
    onSuccess: (data) => {

      // Başarılı giriş sonrası yapılacak işlemler
      toast.success("Giriş başarılı!");
      queryClient.invalidateQueries(["girisYapanKullanici"]);
  
    

      console.log("Giriş başarılı:", data);
    },
    onError: (error) => {
      toast.error("Giriş hatası: " + error.message);
      console.error("Giriş hatası:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giriş doğrulama işlemleri
    if (formData.email && formData.sifre) {
      mutate(formData);
    } else {
      toast.error("Lütfen tüm alanları doldurun.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol Taraf - Görsel */}
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundColor: "#4a90e2", // Varsayılan arka plan rengi
        }}
      >
        <div className="flex h-full items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white p-8">
            <h1 className="text-4xl font-bold mb-4">Tekrar Hoş Geldiniz</h1>
            <p className="text-xl">
              Hesabınıza giriş yaparak platformumuzun tüm özelliklerinden
              yararlanabilirsiniz.
            </p>
          </div>
        </div>
      </div>

      {/* Sağ Taraf - Form */}
      <div className="w-full lg:w-1/2 bg-base-200 flex items-center justify-center p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-6 text-center">Giriş Yap</h2>
            <form onSubmit={handleSubmit}>
              <label className="input validator mb-4 w-full flex items-center gap-2">
                <span className="opacity-50">
                  <CiMail />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="E-posta Adresiniz"
                  className="grow"
                  value={formData.email}
                  onChange={handleInputChanges}
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
                  placeholder="Şifreniz"
                  className="grow"
                  value={formData.sifre}
                  onChange={handleInputChanges}
                />
              </label>

              <div className="flex justify-between items-center mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">Beni Hatırla</span>
                </label>
                <a
                  href="/sifre-sifirla"
                  className="text-sm text-primary hover:underline"
                >
                  Şifremi Unuttum
                </a>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Giriş Yap
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-sm">
                Hesabınız yok mu?
                <Link to="/kayitol" className="link link-primary ml-1">
                  Kayıt Ol
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GirisYap;
