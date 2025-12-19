export const submitToSheet = async (data, sheetName) => {
  const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  if (!SCRIPT_URL) {
    throw new Error('Google Script URL is missing in .env file');
  }

  // 1. Create a FormData object (This prevents the CORS preflight check)
  const formData = new FormData();
  
  // 2. Append the sheet name
  formData.append('sheetName', sheetName);

  // 3. Append all other data fields
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  // 4. Send without custom headers!
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    body: formData, 
    // IMPORTANT: Do NOT set 'Content-Type' header here. 
    // Letting the browser set it automatically is what fixes the error.
  });

  const result = await response.json();
  return result;
};