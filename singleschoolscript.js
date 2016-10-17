
//single school script
//adds menu item
function onOpen() {
  SpreadsheetApp.getUi() 
      .createMenu('Add Time')
      .addItem('Do it!', 'addTime')
      .addToUi();
}


//set validation elements 
function validationRighter(){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
  
    var meetColumn = ss.getSheetByName('Sheet1').getRange('C2:C'); //meeting types
    var meetValidationValues = ss.getSheetByName('validation').getRange('A1:A40').getValues();
    var meetRule = SpreadsheetApp.newDataValidation().requireValueInList(meetValidationValues).build();
    meetColumn.setDataValidation(meetRule);
  
    var appColumn = ss.getSheetByName('Sheet1').getRange('D2:D'); //application options
    var appValidationValues = ss.getSheetByName('validation').getRange('B1:B40').getValues();
    var appRule = SpreadsheetApp.newDataValidation().requireValueInList(appValidationValues).build();
    appColumn.setDataValidation(appRule);
  
    var userColumn = ss.getSheetByName('Sheet1').getRange('E2:E'); //teacher signup options
    var userValidationValues = ss.getEditors();
    Logger.log(userValidationValues);
    var userRule = SpreadsheetApp.newDataValidation().requireValueInList(userValidationValues).build();
    userColumn.setDataValidation(userRule);
 
}


//add time sidebar creation
function addTime() {
  var html = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('Add Time')
      .setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
}

//enter days in 15 min intervals
function enterDay(theDate,startTime,endTime) {
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getActiveSheet();
 var lastRow = parseInt(sheet.getLastRow())+1;
  
  var startH = startTime.split(':')[0];
  var endH = endTime.split(':')[0];
  var startM = startTime.split(':')[1];
  var d = new Date();
  d.setHours(startH);
  d.setMinutes(startM);  
  
  var totalHours = endH-startH;
    
  for (i = 0; i < (totalHours*4)+1; i++) { 
    sheet.getRange("A"+(lastRow+i)).setValue(theDate);
    
    var mins = (d.getMinutes()<10?'0':'') + d.getMinutes();//make sure has leading 0
    sheet.getRange("B"+(lastRow+i)).setValue(d.getHours()+':'+mins);
    d = new Date(d.getTime() + (15*60000)); //adds 15 mins
  }
}

function hideAllRows(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  sheet.hideRows(2, lastRow);
}


function processForm(formObject) {
  var theDate = formObject.theDate;
  var startTime = formObject.startTime;
  var endTime = formObject.endTime;
  var hideRows = formObject.hider;
  Logger.log(hideRows);
  if (hideRows === 'on'){
    hideAllRows();
  }
  
  enterDay(theDate, startTime, endTime);
  validationRighter();
  
}

function getDefaultStartTime(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('validation');
  var am = sheet.getRange("C1").getValue();
   h = (am.getHours()<10?'0':'') + am.getHours(),
   m = (am.getMinutes()<10?'0':'') + am.getMinutes();
   var startHr = h + ':' + m;
   return startHr;
}

function getDefaultEndTime(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('validation');
  var pm = sheet.getRange("C2").getValue();
   h = (pm.getHours()<10?'0':'') + pm.getHours(),
   m = (pm.getMinutes()<10?'0':'') + pm.getMinutes();
  var endHr = h + ':' + m;;
  Logger.log(endHr);
  return endHr;
}