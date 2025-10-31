export default function MapsKeyBanner() {
  const hasKey = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (hasKey) return null;
  return (
    <div className="p-3 text-sm rounded bg-yellow-100 border border-yellow-300 text-yellow-900 mb-4">
      <strong>Google Maps key is missing.</strong> Address search is disabled.
      You can continue with manual measurement (lat/long or basic form).
    </div>
  );
}
