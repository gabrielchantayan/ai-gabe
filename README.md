# AI Gabe 🤖

## 📝 Project Overview
This is a project to train an LLM on my messages to replicate me, Gabe.

## 🛠️ Prerequisites
- Node.js (version 16+ recommended) 🟢
- TypeScript 💻
- npm or yarn 📦

## 📲 Preparing Instagram Data

### 1. 📥 Download Instagram Data
1. Go to Instagram Settings
2. Navigate to "Privacy and Security"
3. Select "Download Data"
4. Choose "JSON" as the format
5. Request a download of your Instagram data

### 2. 📂 Prepare the `ig-msg-raw` Folder
- After downloading your Instagram data, locate the Messages folder
- This folder typically contains JSON files for each conversation
- Copy ALL conversation JSON files into the `ig-msg-raw/` directory of this project

Here is the following command I used to copy the files: 📋
```bash
cd /path/to/your/instagram/messages
for d in */ ; do
  for f in "${d}"*.json; do
    [ -e "$f" ] || continue
    cp "$f" "/path/to/ai-gabe/ig-msg-raw/${d%/}_$(basename "$f")"
  done
done
```

#### 🗂️ Expected `ig-msg-raw` Folder Structure
```
ig-msg-raw/
├── user1_message1.json
├── user2_message1.json
└── user3_message1.json
```

### 🚨 Important Notes
- Files should be direct exports from Instagram's data download
- Do not modify the original JSON files

## 🔄 Processing Workflow

### Step 1: 📊 Convert Raw Messages to CSV
Run the conversion script to transform raw JSON messages into a CSV format:

```bash
npm run convert
```

This script will:
- Read all JSON files from `ig-msg-raw/`
- Extract message data
- Generate a CSV file with standardized message information

### Step 2: 🔮 Divine Conversations
After CSV generation, run the divine conversations script:

```bash
npm run divine-ig
```

This script will:
- Process the generated CSV
- Extract meaningful conversation insights
- Prepare data for further analysis

## 🛠️ Troubleshooting
- Ensure all JSON files are valid Instagram message exports
- Check that you have the latest version of Node.js and TypeScript
- Verify file permissions in the `ig-msg-raw/` directory

---

🌟 Made with ❤️ and 🧠 by Gabe
<sup>*i hate writing readme files thank claude for this*</sup>