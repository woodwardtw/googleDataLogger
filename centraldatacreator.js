function onOpen() {
    var ui = SpreadsheetApp.getUi();
    // Or DocumentApp or FormApp.
    ui.createMenu('Extra Powers')
        .addItem('DEPLOY', 'makeFiles')
        .addToUi();
}


function makeFiles() {
  //gets spreadsheet
   var ss = SpreadsheetApp.getActiveSpreadsheet(); //get spreadsheet   
   var sheet = ss.getSheetByName('Info'); //get sheet
  
  //gets the enclosing folder
   var ssId = ss.getId();
   var driveFile = DriveApp.getFileById(ssId); 
  
   var parentFolder = driveFile.getParents();
   var folder = DriveApp.getFolderById(parentFolder.next().getId()); //ASSUMES one parent folder, you could always hard code it in
  
  //get schools
  var schools = sheet.getRange("A2:A").getValues();
  var schoolsLastRow = schools.filter(String).length;
  
  //get categories
  var catVals = sheet.getRange("E2:E").getValues();
  var appVals = sheet.getRange("F2:F").getValues();
 
  //get start/end times
  var startTimeVals = sheet.getRange("C2:C").getValues();
  var endTimeVals = sheet.getRange("D2:D").getValues();

  //get emails for sharing directly with ITRT or onsite admin
   var emailVals = sheet.getRange("G2:G").getValues();

  //create template ss 
  var templateId = DriveApp.getFilesByName('base school template').next().getId();
  var templateSs = SpreadsheetApp.openById(templateId);
  var mainSheet = templateSs.getSheets()[0];
  
  //set header values and data validation for the main sheet
  mainSheet.getRange("A1:E1").setBackground("#424242").setFontStyle("bold").setFontColor("#fff");//sets header styles
  //sets header values
  mainSheet.getRange("A1").setValue("Date");
  mainSheet.getRange("B1").setValue("Meeting Time");
  mainSheet.getRange("C1").setValue("Meeting Type");  
  
//data validation - set hidden sheet and values  
   var validation =  templateSs.insertSheet('validation');
    validation.getRange("A1:A"+catVals.length).setValues(catVals);  
    validation.getRange("B1:B"+appVals.length).setValues(appVals);
    validation.hideSheet();

//Make folders and files per school
  for (i = 0; i < schoolsLastRow; i++) { 
    Logger.log('school leng- ' + schools.length)
    var newFolder = folder.createFolder(schools[i]); //creates folder
    newFolder.addEditor(emailVals[i]);
    var schoolFolderId = DriveApp.getFoldersByName(schools[i]).next().getId(); //gets folder ID    
    Logger.log('i count - '+i);
    var newSs = DriveApp.getFileById(templateId).makeCopy(schools[i] + ' data', newFolder); //copies ss over
    var newSsId = DriveApp.getFilesByName(schools[i] + ' data').next().getId();
    var newSsUrl = newSs.getId();
    
    var startTime = SpreadsheetApp.openById(newSsId).getSheetByName('validation').getRange('C1');
    var endTime = SpreadsheetApp.openById(newSsId).getSheetByName('validation').getRange('C2');
    
    startTime.setValue(startTimeVals[i]).setNumberFormat('h:mm:ss am/pm');//set time value*******************
    endTime.setValue(endTimeVals[i]).setNumberFormat('h:mm:ss am/pm');  
    
    //write new sheet IDs to master sheet for later
    var dataSheet = ss.getSheetByName('Research');
    dataSheet.getRange('A'+(i+2)).setValue(schools[i]);
    dataSheet.getRange('B'+(i+2)).setValue(newSsUrl);
  }     
}



function myTest(){
  var ss = SpreadsheetApp.getActiveSpreadsheet(); //get spreadsheet
  Logger.log(ss.getId());
   var sheet = ss.getSheets()[0]; //get sheet
  
  
}


//********************testing stuff and random non-production stuff
function theCleaner(){       
  var ss = SpreadsheetApp.openById('1Zld-1tWo9XsUYlTRwljAulGwwE4cPcU2G95yI2i8kOE');
  var validation =  ss.getSheetByName('validation');
  ss.deleteSheet(validation);
}
