
import { RegistrationData } from '../types';

/**
 * Replace the GOOGLE_SCRIPT_URL with your deployed Apps Script Web App URL.
 * See backend/Code.js for the Apps Script logic.
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

export interface RegisteredUser {
  name: string;
  studentId: string;
  batch: string;
  dept: string;
}

export const fetchRegisteredUsers = async (): Promise<RegisteredUser[]> => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    // Validate data structure if needed
    if (Array.isArray(data)) {
      return data as RegisteredUser[];
    }
    return [];
  } catch (error) {
    console.error('Fetch failed:', error);
    return [];
  }
};
