// ============================================================
// 節約管理カレンダー - Google Apps Script バックエンド
// ============================================================
// 【セットアップ手順】
// 1. Google スプレッドシートを新規作成
// 2. メニュー「拡張機能」→「Apps Script」を開く
// 3. このファイルの内容を全て貼り付けて保存
// 4. 「デプロイ」→「新しいデプロイ」→種類「ウェブアプリ」を選択
// 5. 実行ユーザー:「自分」、アクセス:「全員」に設定してデプロイ
// 6. 発行されたウェブアプリURLをindex.htmlのGAS_URLに貼り付ける
// ============================================================

var SHEET_NAME = 'savings';

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['key', 'value', 'updated_at']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// GET: ?key=savings_2026_05
function doGet(e) {
  try {
    var key = e.parameter.key;
    if (!key) {
      return respond({ success: false, error: 'key is required' });
    }
    var result = readValue(key);
    return respond({ success: true, data: result });
  } catch (err) {
    return respond({ success: false, error: err.message });
  }
}

// POST: { action: 'save', key: 'savings_2026_05', value: { goal: 30000, days: {...} } }
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (body.action === 'save') {
      writeValue(body.key, body.value);
      return respond({ success: true });
    }
    return respond({ success: false, error: 'Unknown action: ' + body.action });
  } catch (err) {
    return respond({ success: false, error: err.message });
  }
}

function readValue(key) {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      return JSON.parse(data[i][1]);
    }
  }
  return null;
}

function writeValue(key, value) {
  var sheet = getSheet();
  var data = sheet.getDataRange().getValues();
  var now = new Date().toISOString();
  var serialized = JSON.stringify(value);

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2, 1, 2).setValues([[serialized, now]]);
      return;
    }
  }
  sheet.appendRow([key, serialized, now]);
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
