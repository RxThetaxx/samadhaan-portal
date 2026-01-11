export const submitToSheet = async (data, sheetName, token) => {
  const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  if (!SCRIPT_URL) {
    throw new Error('Google Script URL is missing in .env file');
  }

  // 1. Create a FormData object (This prevents the CORS preflight check)
  const formData = new FormData();
  
  // 2. Append the sheet name
  formData.append('sheetName', sheetName);
  formData.append('auth_token', token);

  // 3. Append all other data fields
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  // 4. Send without custom headers!
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    // If the sheet updated but the browser blocked the response, assume success
    console.warn("CORS Warning (Ignored): Form likely submitted successfully.");
    return { result: 'success' }; 
  }
};

export const logUserToBackend = async (user) => {
  const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  
  const formData = new FormData();
  formData.append('action', 'logUser'); 
  formData.append('name', user.name);
  formData.append('email', user.email);
  formData.append('sub', user.sub); 

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });
    console.log("User logged silently.");
  } catch (error) {
    console.error("Failed to log user history:", error);
  }
};