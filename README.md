# 🌈 Rainbow Keyboard

![Screen Recording 2025-04-26 at 10](https://github.com/user-attachments/assets/925f0cb4-9195-44fd-8af9-bbc2aed6394b)

https://www.youtube.com/watch?v=V5jZVXx117Y&feature=youtu.be

[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/g8Niqi0Ts9N)

**Engage young learners (0-2 years) with fun keyboard animations!**

Rainbow Keyboard is a full-screen web app for toddlers. Press any key and a giant,
colorful letter bursts onto the screen at a random spot — and the app reads the key
out loud. It turns random keyboard mashing into a playful first encounter with
letters, numbers, and sounds.

## 🎮 Demo

https://rainbow-keyboard.teraren.com/

## ✨ Features

* **Press-to-play:** Every keystroke renders a huge animated character.
* **Spoken letters:** Each key is read aloud via the browser's Web Speech API (with a queue so rapid presses don't overlap).
* **Vibrant colors:** Letters appear in a random rainbow color at a random position.
* **Smooth animations:** Powered by `framer-motion`.
* **Bilingual:** English and Japanese UI via locale dictionaries (`en` / `ja`).
* **Analytics ready:** Optional Google Analytics & Google Tag Manager tracking of key presses and sessions.

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org/) application. [pnpm](https://pnpm.io/) is
used as the package manager.

```bash
# Install dependencies
pnpm install

# Start the dev server (http://localhost:3000)
pnpm dev
```

Other scripts:

```bash
pnpm build   # Production build
pnpm start   # Run the production build
pnpm lint    # Lint with Next.js ESLint
```

Open the page in a browser and start pressing keys.

### Configuration

Set the following environment variable to enable Google Tag Manager (optional):

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

See [`GTM_SETUP.md`](./GTM_SETUP.md) for analytics details.

## 🛠️ Technologies Used

* **Next.js** — React framework for full-stack web apps.
* **React 19** — UI library.
* **framer-motion** — Animation library for React.
* **Tailwind CSS** — Utility-first CSS framework.
* **Radix UI** — Unstyled, accessible UI primitives.
* **TypeScript** — Typed JavaScript.
* **Web Speech API** — In-browser text-to-speech.

## 🤝 Contributing

Contributions are welcome!

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

* Special thanks to v0.

-----

## 日本語

# 🌈 Rainbow Keyboard

**0歳から2歳までの幼児向けに、楽しいキーボードアニメーションでインタラクションを促進！**

Rainbow Keyboard は幼児向けのフルスクリーン Web アプリです。どのキーを押しても、
大きくカラフルな文字が画面のランダムな位置に飛び出し、押したキーを音声で読み上げます。
でたらめなキーボード遊びを、文字・数字・音との楽しい最初の出会いに変えます。

## 🎮 デモ

https://rainbow-keyboard.teraren.com/

## ✨ 特徴

* **押すだけで楽しい:** キーを押すたびに巨大なアニメーション文字が表示されます。
* **読み上げ:** ブラウザの Web Speech API で各キーを音声読み上げ（連打しても重ならないキュー方式）。
* **鮮やかな色:** 文字はランダムな虹色・ランダムな位置で表示されます。
* **滑らかなアニメーション:** `framer-motion` を使用。
* **多言語対応:** ロケール辞書（`en` / `ja`）による英語・日本語 UI。
* **アナリティクス対応:** Google Analytics / Google Tag Manager によるキー押下・セッション計測（任意）。

## 🚀 はじめに

本アプリは [Next.js](https://nextjs.org/) 製で、パッケージマネージャーに
[pnpm](https://pnpm.io/) を使用します。

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動（http://localhost:3000）
pnpm dev
```

その他のスクリプト:

```bash
pnpm build   # 本番ビルド
pnpm start   # 本番ビルドの起動
pnpm lint    # Next.js ESLint によるチェック
```

ブラウザでページを開き、キーを押して遊んでください。

### 設定

Google Tag Manager を有効にするには、以下の環境変数を設定します（任意）:

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

アナリティクスの詳細は [`GTM_SETUP.md`](./GTM_SETUP.md) を参照してください。

## 🛠️ 使用技術

* **Next.js** — フルスタック Web アプリ向け React フレームワーク。
* **React 19** — UI ライブラリ。
* **framer-motion** — React のアニメーションライブラリ。
* **Tailwind CSS** — ユーティリティファーストの CSS フレームワーク。
* **Radix UI** — スタイルなしでアクセシブルな UI プリミティブ。
* **TypeScript** — 型付き JavaScript。
* **Web Speech API** — ブラウザ内テキスト読み上げ。

## 🤝 貢献

貢献は大歓迎です！

## 📄 ライセンス

このプロジェクトは MIT License の下でライセンスされています。

## 🙏 謝辞

* v0 ありがとう。
