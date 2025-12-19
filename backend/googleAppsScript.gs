const SHEET_CONFIG = {
  sheet_1_anonymous: {
    tabName: 'Anonymous',
    columns: ['timestamp', 'category', 'message'],
  },
  sheet_2_public: {
    tabName: 'Public',
    columns: ['timestamp', 'name', 'roll_number', 'email', 'grievance_text'],
  },
};

const buildResponse = (payload, statusCode) =>
  ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')
    .setHeader('Access-Control-Max-Age', '3600')
    .setStatusCode(statusCode);

function doGet() {
  return buildResponse({ status: 'ready', message: 'Use POST to submit grievances.' }, 200);
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000);
    const body = event?.postData?.contents;
    if (!body) {
      return buildResponse({ status: 'error', message: 'Missing request body.' }, 400);
    }

    const data = JSON.parse(body);
    const sheetKey = data?.sheetName;
    const payload = data?.payload;

    if (!sheetKey || !SHEET_CONFIG[sheetKey]) {
      return buildResponse({ status: 'error', message: 'Invalid sheet name.' }, 422);
    }
    if (!payload || typeof payload !== 'object') {
      return buildResponse({ status: 'error', message: 'Invalid payload.' }, 422);
    }

    appendRow(sheetKey, payload);
    return buildResponse({ status: 'success', message: 'Submission stored.' }, 200);
  } catch (error) {
    return buildResponse({ status: 'error', message: error.message }, 500);
  } finally {
    lock.releaseLock();
  }
}

function appendRow(sheetKey, payload) {
  const { tabName, columns } = SHEET_CONFIG[sheetKey];
  const sheet = SpreadsheetApp.getActive().getSheetByName(tabName);
  if (!sheet) {
    throw new Error(`Sheet tab not found: ${tabName}`);
  }

  const timestamp = payload.timestamp || new Date().toISOString();
  const row = columns.map((column) => (column === 'timestamp' ? timestamp : payload[column] || ''));
  sheet.appendRow(row);
}
