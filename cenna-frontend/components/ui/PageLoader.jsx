export default function PageLoader({ text = "Loading data..." }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto h-20 w-20">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-yellow-500 border-r-yellow-500" />

          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-black text-sm font-extrabold text-yellow-500">
            C
          </div>
        </div>

        <h2 className="mt-5 text-lg font-extrabold text-black">{text}</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please wait while CENNA loads your data.
        </p>
      </div>
    </div>
  );
}