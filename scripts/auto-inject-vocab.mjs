import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let envContent = '';
try { envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8'); }
catch (e) { try { envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8'); } catch (err) { } }

const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) envVars[match[1].trim()] = match[2].trim();
});

const GITHUB_TOKEN = envVars['GITHUB_MODELS_TOKEN'] || process.env.GITHUB_MODELS_TOKEN || "";

const prompt = `
Tôi đang xây dựng dữ liệu từ vựng cho ứng dụng luyện thi VSTEP.
Hãy đóng vai một chuyên gia ngôn ngữ tiếng Anh, tạo giúp tôi một danh sách 20 Từ vựng / Cụm từ (Vocabulary Chunks) ngẫu nhiên, trình độ B1 hoặc B2.

YÊU CẦU BẮT BUỘC:
1. Phải trộn lẫn các loại danh từ gốc, động từ, tính từ (word) và các cụm đi kèm chúng.
2. Trả về DUY NHẤT một chuỗi Array JSON hợp lệ.
3. Code cần tuân thủ CHÍNH XÁC cấu trúc Schema dưới đây:

[
  {
    "phrase": "artificial intelligence",
    "base_word": "intelligence",
    "word_type": "noun", // hoặc verb, adj
    "type": "collocation", // chữ đơn lẻ là 'word', cụm là 'collocation' hoặc 'expression'
    "topic": "Technology",
    "subcategory": "innovations", // tự phân loại chủ đề con
    "level": "B1",
    "ipa": "/ˌɑːrtɪˈfɪʃl ɪnˈtelɪdʒəns/",
    "meaning_vi": "trí tuệ nhân tạo",
    "explanation_vi": "Khả năng của máy tính thực hiện các tác vụ cần thông minh của con người.",
    "example_en": "Artificial intelligence is changing the way we work."
  }
]
`;

async function callGithubDirect() {
    console.log("⏳ Đang gọi Github Models API chờ sinh từ vựng...");
    if (!GITHUB_TOKEN) throw new Error("Thieu GITHUB_MODELS_TOKEN trong file .env.local");

    const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GITHUB_TOKEN}`
        },
        body: JSON.stringify({
            model: "gpt-4o",
            messages: [
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        })
    });

    if (!res.ok) throw new Error("Github API loi: " + res.status);
    const data = await res.json();
    let text = data.choices[0].message.content.trim();
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    text = text.trim();
    return JSON.parse(text);
}

async function injectIntoDataFile(newItems) {
    console.log(`⏳ Đang chèn ${newItems.length} từ vào file src/data/grammar-chunks.ts ...`);
    const filePath = path.join(__dirname, '../src/data/grammar-chunks.ts');
    let content = fs.readFileSync(filePath, 'utf-8');

    // Tìm vị trí của mảng export const VOCAB_CHUNKS = [
    const marker = "export const VOCAB_CHUNKS = [";
    const insertIndex = content.indexOf(marker);

    if (insertIndex === -1) {
        console.error("❌ Không tìm thấy mảng VOCAB_CHUNKS trong file!");
        return;
    }

    const actualInsertPoint = insertIndex + marker.length;

    let itemsString = "";
    newItems.forEach(item => {
        itemsString += `\n  ${JSON.stringify(item, null, 2).split('\\n').join('\n').replace(/\}$/, '  },')}`;
    });

    const newContent = content.slice(0, actualInsertPoint) + itemsString + content.slice(actualInsertPoint);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log("✅ Thành công! Đã thêm từ vựng mới thẳng vào code.");
}

async function run() {
    try {
        let items;
        const localJsonPath = path.join(__dirname, 'new-vocab.json');

        if (fs.existsSync(localJsonPath)) {
            console.log("⚡ Tìm thấy file 'new-vocab.json'! Đang đọc dữ liệu do bạn paste từ ChatGPT...");
            const fileData = fs.readFileSync(localJsonPath, 'utf-8');
            items = JSON.parse(fileData);
            console.log(`✅ Đã đọc thành công ${items.length} từ vựng từ file local!`);
        } else {
            console.log("⚠️ Không tìm thấy file 'new-vocab.json', tiến hành gọi AI tự động...");
            items = await callGithubDirect();
        }

        await injectIntoDataFile(items);

        if (fs.existsSync(localJsonPath)) {
            fs.renameSync(localJsonPath, localJsonPath + ".done");
            console.log("♻️ Đã đổi tên file thành 'new-vocab.json.done' để tránh chèn trùng lặp lần sau.");
        }
    } catch (e) {
        console.error("❌ Lỗi:", e.message);
    }
}

run();
