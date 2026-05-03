# 💰 節約管理カレンダー

スマートフォン・PCの両方からアクセスし、データを共有できる節約管理ウェブアプリ。

## 概要

- **公開URL**: https://koutarou19921228.github.io/savings-calendar-/
- **ホスティング**: GitHub Pages（静的HTML）
- **バックエンド**: Google Apps Script + Google スプレッドシート
- **ビルドツール不要**: `index.html` 単体で動作

## 機能一覧

| 機能 | 説明 |
|------|------|
| カレンダー入力 | 日付をタップして節約金額・メモを入力 |
| 金額累計 | 同じ日に複数回入力すると合計が表示される |
| 入力履歴 | その日の入力ログを一覧表示・個別削除が可能 |
| 月間目標管理 | 目標金額を設定し達成率を追跡 |
| 円グラフ | 達成率をドーナツチャートで可視化（中央に達成率%表示） |
| 棒グラフ | 日別節約額の推移を棒グラフで表示 |
| 月ナビゲーション | 前月・次月への切り替え |
| セルの色分け | 100〜499円: 青、500〜999円: 緑、1000円以上: 赤グラデーション |
| マイナス入力 | 節約できなかった日はマイナス値を入力（白ハッチング表示） |
| クロスデバイス同期 | GAS経由でスマホ・PCのデータを共有 |
| オフライン対応 | localStorageにも保存するため、オフライン時もデータが残る |
| Enterキー保存 | 金額欄・メモ欄どちらでもEnterで即保存（メモはShift+Enterで改行） |

## 技術スタック

- **フロントエンド**: HTML / CSS / JavaScript（単一ファイル）
- **グラフ**: [Chart.js](https://www.chartjs.org/) (CDN)
- **データ永続化**: localStorage（ローカル）+ Google スプレッドシート（クラウド）
- **バックエンドAPI**: Google Apps Script Web App
- **ホスティング**: GitHub Pages

## ファイル構成

```
savings_plan/
├── index.html      # メインアプリ（HTML/CSS/JS すべて内包）
├── guide.html      # セットアップガイド（6ステップ解説）
└── gas/
    └── Code.gs     # Google Apps Script バックエンド
```

## データ構造（localStorage / Google スプレッドシート）

```json
{
  "savings_2026_05": {
    "goal": 10000,
    "days": {
      "2026-05-02": {
        "amount": 500,
        "entries": [
          { "amount": 500, "memo": "コーヒー節約", "time": "09:30" }
        ]
      }
    }
  }
}
```

## セットアップ手順

### 1. GitHub Pages で公開する

1. このリポジトリをGitHubにプッシュ
2. リポジトリの Settings → Pages → Source を `main` ブランチ / `root` に設定
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

### 2. Google Apps Script を設定する

1. [Google スプレッドシート](https://sheets.google.com)を新規作成
2. メニュー「拡張機能」→「Apps Script」を開く
3. `gas/Code.gs` の内容を全て貼り付けて保存
4. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」を選択
5. 実行ユーザー: **自分**、アクセス: **全員** に設定してデプロイ
6. 表示されたウェブアプリURLをコピー

### 3. index.html に GAS URL を設定する

```javascript
// index.html 内のこの行を書き換える
const GAS_URL = 'YOUR_GAS_WEB_APP_URL';  // ← 取得したURLに置き換える
```

## 実装履歴

| バージョン | 内容 |
|------------|------|
| v1.0 | 基本カレンダー・金額入力・月間グラフ（localStorage） |
| v1.1 | 達成率を円グラフ中央に表示 |
| v1.2 | 金額に応じたセルの色分け（青/緑/赤グラデーション） |
| v1.3 | GitHub Pages公開 + GAS/スプレッドシート連携 |
| v1.4 | セットアップガイド（guide.html）を作成 |
| v1.5 | モバイルレイアウト修正（ボタン折り返し、文字切れ対応） |
| v1.6 | モバイルでカレンダーをグラフより上に表示（order変更） |
| v1.7 | マイナス入力対応（白ハッチング・黒文字・達成率0%フロア） |
| v1.8 | 同日複数入力の金額累計・入力履歴リスト・個別削除 |
| v1.9 | モーダル内Enterキーで保存（金額欄・メモ欄どちらからでも） |
| v2.0 | モバイルでカレンダー/グラフの右端はみ出し修正 |

## GAS API 仕様

### GET `/exec?key=savings_2026_05`

月データを取得する。

```json
{ "success": true, "data": { "goal": 10000, "days": {} } }
```

### POST `/exec`

月データを保存する。

```json
{ "action": "save", "key": "savings_2026_05", "value": { "goal": 10000, "days": {} } }
```

> **Note**: CORS回避のため `Content-Type: text/plain` でリクエストを送信している。
