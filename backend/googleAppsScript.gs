// --- CONFIGURATION ---
const PRIVATE_LOGS_SHEET_ID = "-"; 
const PUBLIC_SHEET_ID = "-";

// *** PASTE YOUR CALENDLY TOKEN HERE ***
const CALENDLY_TOKEN = "-"; 

const SHEET_CONFIG = {
  'Anonymous': { columns: ['timestamp', 'category', 'message'] },
  'Public':    { columns: ['timestamp', 'name', 'roll_number', 'email', 'grievance_text'] }
  // Note: Meeting logic is handled manually below, so no config needed here.
};

// --- HELPER FUNCTIONS ---
const buildResponse = (payload) => 
  ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);

function doGet() { return buildResponse({ status: 'ready' }); }

// --- MAIN LOGIC ---
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); 
    if (!e || !e.parameter) return buildResponse({ status: 'error', message: 'No data' });

    const action = e.parameter.action; 

    if (action === 'logUser') {
      return handleUserLogin(e);
    } else if (action === 'logMeeting') {
      return handleMeeting(e); 
    } else {
      return handleGrievance(e);
    }

  } catch (error) {
    return buildResponse({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// --- WORKER 1: User History ---
function handleUserLogin(e) {
  const doc = SpreadsheetApp.openById(PRIVATE_LOGS_SHEET_ID);
  const sheet = doc.getSheetByName('Users');
  if (!sheet) return buildResponse({ status: 'error', message: 'Users tab missing' });
  sheet.appendRow([new Date(), e.parameter.name, e.parameter.email, e.parameter.sub]); 
  return buildResponse({ status: 'success' });
}

// --- WORKER 2: Grievances ---
function handleGrievance(e) {
  const doc = SpreadsheetApp.openById(PUBLIC_SHEET_ID);
  const sheetName = e.parameter.sheetName || 'Anonymous';
  const sheet = doc.getSheetByName(sheetName);
  if (!sheet) throw new Error(`Tab '${sheetName}' not found.`);

  const config = SHEET_CONFIG[sheetName];
  const newRow = config.columns.map(col => {
    if (col === 'timestamp') return new Date();
    return e.parameter[col] || '';
  });

  sheet.appendRow(newRow);
  SpreadsheetApp.flush();
  return buildResponse({ status: 'success' });
}

// --- WORKER 3: Fetch & Log Meeting Details ---
function handleMeeting(e) {
  const eventUri = e.parameter.event_uri;
  const inviteeUri = e.parameter.invitee_uri;

  if (!eventUri || !inviteeUri) throw new Error("Missing Calendly URIs");

  // --- SECURITY FIX: PREVENT TOKEN LEAK (SSRF) ---
  // Ensure the URLs actually belong to Calendly before attaching our secret token
  if (!eventUri.startsWith("https://api.calendly.com/") || 
      !inviteeUri.startsWith("https://api.calendly.com/")) {
    throw new Error("Security Alert: Invalid API Origin");
  }

  // 1. Fetch from Calendly
  const eventRes = UrlFetchApp.fetch(eventUri, { headers: { "Authorization": "Bearer " + CALENDLY_TOKEN } });
  const eventData = JSON.parse(eventRes.getContentText()).resource;
  
  const inviteeRes = UrlFetchApp.fetch(inviteeUri, { headers: { "Authorization": "Bearer " + CALENDLY_TOKEN } });
  const inviteeData = JSON.parse(inviteeRes.getContentText()).resource;

  // 2. Open the Sheet (Using Public ID since the tab is in that file)
  const doc = SpreadsheetApp.openById(PUBLIC_SHEET_ID); 
  
  // *** FIX: Using the EXACT name from your screenshot ***
  const sheet = doc.getSheetByName('Scheduled_Meeting'); 
  
  if (!sheet) throw new Error("Tab 'Scheduled_Meeting' missing.");

  // 3. Save Data
  const meetingDate = new Date(eventData.start_time).toLocaleString();
  const description = inviteeData.questions_and_answers ? 
    inviteeData.questions_and_answers.map(q => q.answer).join("; ") : "No description";

  sheet.appendRow([
    new Date(),
    "'" + meetingDate,       // Safe
    "'" + inviteeData.name,  // Safe
    "'" + inviteeData.email, // Safe
    "'" + description        // Safe
  ]);

  return buildResponse({ status: 'success', message: 'Meeting logged' });
}