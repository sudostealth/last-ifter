
/**
 * ==========================================
 * GOOGLE APPS SCRIPT BACKEND CODE
 * ==========================================
 *
 * INSTRUCTIONS FOR DEPLOYMENT:
 * 1. Copy all the code below into your Google Apps Script editor (Extensions > Apps Script).
 * 2. Click "Deploy" > "Manage deployments".
 * 3. Click the "Edit" (pencil) icon next to your existing deployment.
 * 4. Under "Version", select "New version".
 * 5. Ensure "Execute as" is set to "Me".
 * 6. Ensure "Who has access" is set to "Anyone".
 * 7. Click "Deploy".
 *
 * IF YOU DON'T HAVE A DEPLOYMENT YET:
 * 1. Click "Deploy" > "New deployment".
 * 2. Select type: "Web app".
 * 3. Execute as: "Me".
 * 4. Who has access: "Anyone".
 * 5. Click "Deploy".
 *
 * IMPORTANT: After deploying, ensure the URL in 'services/googleSheet.ts' matches the Web App URL.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Column Mapping:
    // A: Timestamp (new Date())
    // B: Name (data.name)
    // C: Student ID (data.studentId)
    // D: Email (data.email)
    // E: Phone (data.phone)
    // F: Batch (data.batch)
    // G: Dept (data.dept)
    // H: Payment Method (data.paymentMethod)
    // I: Sender No (data.senderNo)
    // J: Trx ID (data.trxId)

    sheet.appendRow([
      new Date(),
      data.name,
      data.studentId, // Ensure this matches your frontend key 'studentId'
      data.email,
      data.phone,
      data.batch,     // Added Batch
      data.dept,
      data.paymentMethod,
      data.senderNo,
      data.trxId
    ]);

    return ContentService.createTextOutput(JSON.stringify({"status": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"status": "error", "message": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    // Remove header row (assuming row 1 is headers)
    if (data.length > 0) {
      data.shift();
    }

    // Map rows to objects for the frontend
    // B: Name (index 1), C: Student ID (index 2), F: Batch (index 5), G: Dept (index 6)
    var registeredUsers = data.map(function(row) {
      return {
        name: row[1],
        studentId: row[2], // Full Student ID
        batch: row[5],
        dept: row[6]
      };
    }).filter(function(user) {
      return user.name && user.studentId; // Filter out empty rows
    });

    return ContentService.createTextOutput(JSON.stringify(registeredUsers))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({"error": error.message}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
