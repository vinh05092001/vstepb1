const fs = require('fs');
const dict = require('./node_modules/ipa-dict/lib/en_US.js');

const FILE_PATH = 'src/data/grammar-chunks.ts';
const raw = fs.readFileSync(FILE_PATH, 'utf8');
const data = JSON.parse(raw);

const targetIds = new Set([
  85, 96, 102, 106, 109, 111, 113, 114, 115, 116, 121, 122, 125, 128, 131, 136, 137,
  139, 140, 142, 143, 144, 147, 149, 151, 152, 154, 155, 156, 157, 158, 159, 160, 161,
  162, 163, 165, 166, 167, 174, 176, 177, 179, 185,
]);

const allowedTopics = new Set([
  'Daily Life',
  'Home & Household',
  'Personal Habits',
  'Time & Schedules',
  'Food & Cooking',
  'Shopping',
  'Transportation',
  'Health & Fitness',
  'Travel',
  'Weather',
  'Family & Relationships',
  'Friends & Social Life',
  'Emotions & Feelings',
  'Communication',
  'Entertainment',
  'Education',
  'Technology (basic)',
  'Media & Internet',
  'Work & Career',
  'Business Communication',
]);

const allowedLevels = new Set(['A1', 'A2', 'B1', 'B2']);
const stopwords = new Set(['a', 'an', 'the', 'to', 'for', 'of', 'with', 'on', 'at', 'in', 'up', 'out', 'off', 'back', 'down', 'over', 'through', 'into', 'from', 'your', 'my', 'our']);

const fallbackIpa = {
  email: 'ˈiːmeɪl',
  voicemail: 'ˈvɔɪsmeɪl',
  callback: 'ˈkɔːlbæk',
};

function cleanToken(token) {
  return token.toLowerCase().replace(/^[^a-z']+|[^a-z']+$/g, '');
}

function wordToIpa(word) {
  const cleaned = cleanToken(word);
  if (!cleaned) {
    return '';
  }
  if (cleaned.includes('-')) {
    return cleaned
      .split('-')
      .map((part) => wordToIpa(part).replace(/^\//, '').replace(/\/$/, ''))
      .filter(Boolean)
      .join('-');
  }
  if (fallbackIpa[cleaned]) {
    return fallbackIpa[cleaned];
  }
  const fromDict = dict.get(cleaned);
  if (fromDict && fromDict[0]) {
    return fromDict[0].trim().replace(/^\//, '').replace(/\/$/, '');
  }
  return cleaned;
}

function phraseToIpa(phrase) {
  const parts = phrase
    .split(/\s+/)
    .map((part) => wordToIpa(part))
    .filter(Boolean);
  return `/${parts.join(' ')}/`;
}

function baseWordFromPhrase(phrase) {
  const tokens = phrase
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z']/g, ''))
    .filter(Boolean)
    .filter((token) => !stopwords.has(token));
  return tokens[tokens.length - 1] || phrase.toLowerCase();
}

function buildCandidates(config) {
  const candidates = [];
  for (const pattern of config.patterns) {
    for (const [objectEn, objectVi] of pattern.objects) {
      const phrase = `${pattern.verb} ${objectEn}`.replace(/\s+/g, ' ').trim();
      const meaningVi = `${pattern.verbVi} ${objectVi}`;
      candidates.push({
        phrase,
        meaning_vi: meaningVi,
        example_en: `Please ${phrase} ${config.contextEn}.`,
        example_vi: `Hãy ${meaningVi} ${config.contextVi}.`,
        explanation_vi: config.explanation_vi,
      });
    }
  }
  return candidates;
}

const conversationConfig = {
  contextEn: 'before you respond',
  contextVi: 'trước khi bạn phản hồi',
  explanation_vi: 'Cụm này dùng khi bạn trao đổi thông tin, đặt câu hỏi hoặc làm rõ điều mình muốn nói.',
  patterns: [
    { verb: 'check', verbVi: 'kiểm tra', objects: [['the details', 'chi tiết'], ['the message', 'tin nhắn'], ['the information', 'thông tin'], ['the contact list', 'danh sách liên hệ'], ['the phone number', 'số điện thoại'], ['the address', 'địa chỉ']] },
    { verb: 'bring up', verbVi: 'nêu ra', objects: [['a problem', 'một vấn đề'], ['a question', 'một câu hỏi'], ['a concern', 'một mối lo'], ['the main point', 'ý chính'], ['the issue', 'vấn đề'], ['the next step', 'bước tiếp theo']] },
    { verb: 'ask about', verbVi: 'hỏi về', objects: [['the deadline', 'hạn chót'], ['the problem', 'vấn đề'], ['the answer', 'câu trả lời'], ['the missing part', 'phần còn thiếu'], ['the update', 'bản cập nhật'], ['the details', 'chi tiết']] },
    { verb: 'leave', verbVi: 'để lại', objects: [['a message', 'một lời nhắn'], ['a note', 'một ghi chú'], ['a reminder', 'một lời nhắc'], ['the details', 'chi tiết'], ['the instructions', 'hướng dẫn'], ['your number', 'số điện thoại của bạn']] },
    { verb: 'clear up', verbVi: 'làm rõ', objects: [['the confusion', 'sự nhầm lẫn'], ['the misunderstanding', 'sự hiểu lầm'], ['the details', 'chi tiết'], ['the request', 'yêu cầu'], ['the issue', 'vấn đề'], ['the mistake', 'sai sót']] },
    { verb: 'go over', verbVi: 'xem kỹ', objects: [['the notes', 'ghi chú'], ['the details', 'chi tiết'], ['the plan', 'kế hoạch'], ['the schedule', 'lịch trình'], ['the latest message', 'tin nhắn mới nhất'], ['the summary', 'bản tóm tắt']] },
    { verb: 'write down', verbVi: 'ghi lại', objects: [['the phone number', 'số điện thoại'], ['the address', 'địa chỉ'], ['the key points', 'những ý chính'], ['the answer', 'câu trả lời'], ['the instructions', 'hướng dẫn'], ['the reminder', 'lời nhắc']] },
    { verb: 'point out', verbVi: 'chỉ ra', objects: [['the problem', 'vấn đề'], ['the mistake', 'lỗi sai'], ['the difference', 'điểm khác biệt'], ['the missing detail', 'chi tiết còn thiếu'], ['the unclear part', 'phần chưa rõ'], ['the better option', 'lựa chọn tốt hơn']] },
    { verb: 'pass on', verbVi: 'chuyển lại', objects: [['the message', 'lời nhắn'], ['the details', 'chi tiết'], ['the reminder', 'lời nhắc'], ['the update', 'bản cập nhật'], ['the request', 'yêu cầu'], ['the information', 'thông tin']] },
    { verb: 'follow up on', verbVi: 'theo dõi thêm về', objects: [['the question', 'câu hỏi'], ['the request', 'yêu cầu'], ['the issue', 'vấn đề'], ['the discussion', 'cuộc trao đổi'], ['the feedback', 'phản hồi'], ['the message', 'tin nhắn']] },
    { verb: 'sort out', verbVi: 'giải quyết', objects: [['the details', 'chi tiết'], ['the problem', 'vấn đề'], ['the schedule', 'lịch trình'], ['the confusion', 'sự nhầm lẫn'], ['the request', 'yêu cầu'], ['the misunderstanding', 'sự hiểu lầm']] },
    { verb: 'spell out', verbVi: 'đánh vần rõ', objects: [['the name', 'tên'], ['the address', 'địa chỉ'], ['the street name', 'tên đường'], ['the email address', 'địa chỉ email'], ['the hotel name', 'tên khách sạn'], ['the contact name', 'tên người liên hệ']] },
    { verb: 'read back', verbVi: 'đọc lại', objects: [['the message', 'tin nhắn'], ['the phone number', 'số điện thoại'], ['the address', 'địa chỉ'], ['the note', 'ghi chú'], ['the instructions', 'hướng dẫn'], ['the details', 'chi tiết']] },
    { verb: 'mention', verbVi: 'đề cập đến', objects: [['the issue', 'vấn đề'], ['the reason', 'lý do'], ['the delay', 'sự chậm trễ'], ['the concern', 'mối lo'], ['the time change', 'việc đổi giờ'], ['the next step', 'bước tiếp theo']] },
    { verb: 'explain', verbVi: 'giải thích', objects: [['the problem', 'vấn đề'], ['the reason', 'lý do'], ['the change', 'sự thay đổi'], ['the details', 'chi tiết'], ['the timing', 'thời điểm'], ['the situation', 'tình huống']] },
    { verb: 'repeat', verbVi: 'nhắc lại', objects: [['the question', 'câu hỏi'], ['the answer', 'câu trả lời'], ['the name', 'tên'], ['the address', 'địa chỉ'], ['the main point', 'ý chính'], ['the message', 'tin nhắn']] },
    { verb: 'sum up', verbVi: 'tóm tắt', objects: [['the main points', 'những ý chính'], ['the problem', 'vấn đề'], ['the discussion', 'cuộc trao đổi'], ['the results', 'kết quả'], ['the feedback', 'phản hồi'], ['the next steps', 'các bước tiếp theo']] },
    { verb: 'talk through', verbVi: 'trao đổi kỹ về', objects: [['the problem', 'vấn đề'], ['the details', 'chi tiết'], ['the steps', 'các bước'], ['the issue', 'vấn đề'], ['the options', 'các lựa chọn'], ['the misunderstanding', 'sự hiểu lầm']] },
  ],
};

const planningConfig = {
  contextEn: 'before you make a final decision',
  contextVi: 'trước khi bạn đưa ra quyết định cuối cùng',
  explanation_vi: 'Cụm này dùng khi bạn xác nhận thời gian, sắp xếp kế hoạch hoặc kiểm tra thông tin cần thiết.',
  patterns: [
    { verb: 'confirm', verbVi: 'xác nhận', objects: [['the time', 'thời gian'], ['the date', 'ngày tháng'], ['the address', 'địa chỉ'], ['the meeting point', 'điểm hẹn'], ['the booking details', 'chi tiết đặt chỗ'], ['the final details', 'chi tiết cuối cùng']] },
    { verb: 'check', verbVi: 'xem lại', objects: [['the schedule', 'lịch trình'], ['the calendar', 'lịch'], ['the deadline', 'hạn chót'], ['the appointment time', 'giờ hẹn'], ['the details', 'chi tiết'], ['the weekly plan', 'kế hoạch tuần']] },
    { verb: 'set', verbVi: 'đặt', objects: [['the meeting time', 'thời gian họp'], ['the reminder', 'lời nhắc'], ['the deadline', 'hạn chót'], ['the call time', 'giờ gọi điện'], ['the next appointment', 'cuộc hẹn tiếp theo'], ['the meeting date', 'ngày họp']] },
    { verb: 'go over', verbVi: 'xem kỹ', objects: [['the plan', 'kế hoạch'], ['the schedule', 'lịch trình'], ['the notes', 'ghi chú'], ['the checklist', 'danh sách kiểm tra'], ['the meeting details', 'chi tiết cuộc họp'], ['the next steps', 'các bước tiếp theo']] },
    { verb: 'double-check', verbVi: 'kiểm tra lại', objects: [['the time', 'thời gian'], ['the address', 'địa chỉ'], ['the date', 'ngày tháng'], ['the booking code', 'mã đặt chỗ'], ['the contact name', 'tên người liên hệ'], ['the phone number', 'số điện thoại']] },
  ],
};

const planningIds = new Set([113, 139, 144, 160, 179]);
const usedPhrases = new Set(data.filter((entry) => !targetIds.has(entry.id)).map((entry) => entry.phrase.trim().toLowerCase()));

function takeCandidates(config, count) {
  const picked = [];
  for (const candidate of buildCandidates(config)) {
    const key = candidate.phrase.toLowerCase();
    if (usedPhrases.has(key)) {
      continue;
    }
    usedPhrases.add(key);
    picked.push(candidate);
    if (picked.length === count) {
      return picked;
    }
  }
  throw new Error(`Not enough candidates. Need ${count}, got ${picked.length}`);
}

const targetEntries = data.filter((entry) => targetIds.has(entry.id)).sort((a, b) => a.id - b.id);
if (targetEntries.length !== targetIds.size) {
  throw new Error(`Expected ${targetIds.size} target entries, found ${targetEntries.length}`);
}

const conversationEntries = targetEntries.filter((entry) => !planningIds.has(entry.id));
const planningEntries = targetEntries.filter((entry) => planningIds.has(entry.id));

const conversationReplacements = takeCandidates(conversationConfig, conversationEntries.length);
const planningReplacements = takeCandidates(planningConfig, planningEntries.length);

let conversationIndex = 0;
let planningIndex = 0;
for (const entry of data) {
  if (!targetIds.has(entry.id)) {
    continue;
  }
  const replacement = planningIds.has(entry.id)
    ? planningReplacements[planningIndex++]
    : conversationReplacements[conversationIndex++];

  entry.phrase = replacement.phrase;
  entry.base_word = baseWordFromPhrase(replacement.phrase);
  entry.ipa = phraseToIpa(replacement.phrase);
  entry.pos = 'phrase';
  entry.type = 'communication phrase';
  entry.meaning_vi = replacement.meaning_vi;
  entry.example_en = replacement.example_en;
  entry.example_vi = replacement.example_vi;
  entry.explanation_vi = replacement.explanation_vi;
}

const blacklist = /(share a (clear|friendly|polite|quick|calm)|confirm a clear|look over the better|feel ready for the hard|head out for the hotel)/;
for (const entry of data) {
  if (entry.id < 85 || entry.id > 185) {
    continue;
  }
  if (!allowedTopics.has(entry.topic)) {
    throw new Error(`Invalid topic at ID ${entry.id}: ${entry.topic}`);
  }
  if (!allowedLevels.has(entry.level)) {
    throw new Error(`Invalid level at ID ${entry.id}: ${entry.level}`);
  }
  if (targetIds.has(entry.id)) {
    const fieldText = `${entry.ipa}\n${entry.meaning_vi}\n${entry.example_vi}\n${entry.explanation_vi}`;
    if (fieldText.includes('?') || /cum tu:|vi du|dung trong chu de|dien ta/i.test(fieldText)) {
      throw new Error(`Corruption remains at ID ${entry.id}`);
    }
    if (/^\/[A-Za-z0-9 \-]+\/$/.test(entry.ipa)) {
      throw new Error(`Fake IPA remains at ID ${entry.id}`);
    }
    if (blacklist.test(entry.phrase.toLowerCase())) {
      throw new Error(`Blacklisted phrase remains at ID ${entry.id}`);
    }
  }
}

const seen = new Set();
for (const entry of data) {
  const key = entry.phrase.trim().toLowerCase();
  if (seen.has(key)) {
    throw new Error(`Duplicate phrase found: ${entry.phrase}`);
  }
  seen.add(key);
}

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({ replacedCount: targetIds.size, ids: Array.from(targetIds).sort((a, b) => a - b) }, null, 2));