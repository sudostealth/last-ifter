
import { RegistrationData } from '../types';

/**
 * Replace the GOOGLE_SCRIPT_URL with your deployed Apps Script Web App URL.
 * See backend/code.gs for the Apps Script logic.
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw9TONx2YzPhxTxkUtE1bGRDtuZTvziehDvtyuZgCymFT8FzrtleO-kebtPDKrx2nANLQ/exec';

export const submitToGoogleSheet = async (data: RegistrationData): Promise<boolean> => {
  try {
    // Note: Google Apps Script Web App requires POST requests with proper CORS or redirect handling.
    // In a real environment, you might need to handle 'no-cors' if not using a proxy.
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Use 'no-cors' if your script doesn't handle preflight OPTIONS
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    // With 'no-cors', we can't see the response status, so we assume success if no error is thrown
    return true; 
  } catch (error) {
    console.error('Submission failed:', error);
    return false;
  }
};

/**
 * GOOGLE APPS SCRIPT CODE (Paste this in Extensions > Apps Script)
 * 
 * function doPost(e) {
 *   try {
 *     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
 *     var data = JSON.parse(e.postData.contents);
 *     
 *     sheet.appendRow([
 *       new Date(),
 *       data.name,
 *       data.email,
 *       data.phone,
 *       data.batch,
 *       data.dept,
 *       data.paymentMethod,
 *       data.senderNo,
 *       data.trxId
 *     ]);
 *     
 *     return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (error) {
 *     return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message}))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 */
