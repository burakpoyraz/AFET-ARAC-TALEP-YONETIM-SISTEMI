export default function TestGorsel() {
  return (
      <div
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: 'url("/images/afet_nakliye_gorsel.png")',
      }}
    >
      {/* Görsel üzerine karartma katmanı */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0"></div>

      {/* İçerik */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center text-white p-8 bg-black bg-opacity-20 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Hoş Geldiniz</h1>
          <p className="text-xl">
            Bu yazının arkasında görsel görünmelidir.
          </p>
        </div>
      </div>
    </div>
  );
}
