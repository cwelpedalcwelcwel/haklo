export function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <div className="mb-4 text-green-500">
          <i data-lucide="check-circle" className="w-16 h-16 mx-auto"></i>
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Płatność zakończona sukcesem!</h1>
        <p className="text-gray-300 mb-6">
          Dziękujemy za zakup. Możesz teraz wrócić do strony głównej i cieszyć się filmem.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          <i data-lucide="home" className="w-5 h-5 mr-2"></i>
          Wróć do strony głównej
        </a>
      </div>
    </div>
  );
}