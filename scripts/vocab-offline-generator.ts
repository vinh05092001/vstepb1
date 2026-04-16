import { dictionary as cmuDictionary } from "cmu-pronouncing-dictionary";

type AllowedLevel = "A1" | "A2" | "B1" | "B2";
type EntryType = "communication phrase" | "phrasal verb" | "single vocabulary word";
type EntryPos = "phrase" | "verb" | "noun";

export interface OfflineChunkEntry {
  phrase: string;
  base_word: string;
  ipa: string;
  pos: string;
  type: string;
  topic: string;
  subcategory: string;
  level: AllowedLevel;
  meaning_vi: string;
  example_en: string;
  example_vi: string;
  explanation_vi: string;
}

interface TopicItem {
  phraseEn: string;
  phraseVi: string;
  wordEn: string;
  wordVi: string;
  subcategory: string;
  level: AllowedLevel;
}

interface PatternDef {
  phraseEn: string;
  phraseVi: string;
  type: EntryType;
  pos: EntryPos;
  exampleLeadEn: string;
  exampleLeadVi: string;
  explanationLeadVi: string;
}

interface TopicConfig {
  topic: string;
  patterns: PatternDef[];
  items: TopicItem[];
}

const ARPABET_TO_IPA: Record<string, string> = {
  AA: "ɑː",
  AE: "æ",
  AH: "ʌ",
  AO: "ɔː",
  AW: "aʊ",
  AY: "aɪ",
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  EH: "ɛ",
  ER: "ɝ",
  EY: "eɪ",
  F: "f",
  G: "ɡ",
  HH: "h",
  IH: "ɪ",
  IY: "iː",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  OW: "oʊ",
  OY: "ɔɪ",
  P: "p",
  R: "r",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  UH: "ʊ",
  UW: "uː",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
};

const MANUAL_IPA: Record<string, string> = {
  to: "tu",
  do: "du",
  "to-do": "tu du",
  wi: "waɪ",
  fi: "faɪ",
  wifi: "waɪ faɪ",
  online: "ɒnlaɪn",
  email: "i meɪl",
  emails: "i meɪlz",
  app: "æp",
  apps: "æps",
  login: "lɒɡ ɪn",
  log: "lɒɡ",
  "check-in": "tʃek ɪn",
  workout: "wɜrkaʊt",
  bedtime: "bedtaɪm",
  lunchtime: "lʌntʃtaɪm",
  weekend: "wiːkend",
  weekday: "wiːkdeɪ",
  update: "ʌpdeɪt",
  updates: "ʌpdeɪts",
  feedback: "fiːdbæk",
  smartphone: "smɑrtfoʊn",
  internet: "ɪntərnet",
  podcast: "pɒdkæst",
  podcasts: "pɒdkæsts",
  livestream: "laɪvstriːm",
  playlist: "pleɪlɪst",
  playlists: "pleɪlɪsts",
  screenshot: "skriːnʃɒt",
  screenshots: "skriːnʃɒts",
  bluetooth: "bluːtuːθ",
  "wifi-password": "waɪ faɪ pæs wɜrd",
  overtime: "oʊvərtaɪm",
  checkup: "tʃek ʌp",
  warmup: "wɔrm ʌp",
  cooldown: "kuːl daʊn",
};

function pattern(
  phraseEn: string,
  phraseVi: string,
  type: EntryType,
  pos: EntryPos,
  exampleLeadEn: string,
  exampleLeadVi: string,
  explanationLeadVi: string
): PatternDef {
  return { phraseEn, phraseVi, type, pos, exampleLeadEn, exampleLeadVi, explanationLeadVi };
}

function item(
  phraseEn: string,
  phraseVi: string,
  wordEn: string,
  wordVi: string,
  subcategory: string,
  level: AllowedLevel
): TopicItem {
  return { phraseEn, phraseVi, wordEn, wordVi, subcategory, level };
}

const routinePatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc trao đổi về"),
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("manage", "xoay xở với", "communication phrase", "phrase", "She can", "Cô ấy có thể", "Dùng khi nói về việc xử lý hoặc xoay xở với"),
  pattern("prepare for", "chuẩn bị cho", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc chuẩn bị cho"),
  pattern("make time for", "dành thời gian cho", "communication phrase", "phrase", "I always", "Tôi luôn", "Dùng khi nói về việc sắp xếp thời gian cho"),
  pattern("deal with", "xử lý", "communication phrase", "phrase", "They have to", "Họ phải", "Dùng khi nói về việc đối mặt và xử lý"),
  pattern("focus on", "tập trung vào", "communication phrase", "phrase", "Try to", "Hãy cố", "Dùng khi nói về việc tập trung vào"),
  pattern("keep up with", "theo kịp", "phrasal verb", "verb", "It is hard to", "Thật khó để", "Cụm động từ dùng khi nói về việc theo kịp"),
  pattern("catch up on", "làm bù", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc làm bù hoặc cập nhật"),
];

const homePatterns = [
  pattern("clean", "dọn", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc dọn dẹp"),
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("fix", "sửa", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc sửa"),
  pattern("organize", "sắp xếp", "communication phrase", "phrase", "Let us", "Hãy", "Dùng khi nói về việc sắp xếp"),
  pattern("prepare", "chuẩn bị", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc chuẩn bị"),
  pattern("deal with", "xử lý", "communication phrase", "phrase", "We need to", "Chúng ta cần", "Dùng khi nói về việc xử lý"),
  pattern("talk about", "nói về", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc trao đổi về"),
  pattern("tidy up", "dọn gọn", "phrasal verb", "verb", "I should", "Tôi nên", "Cụm động từ dùng khi nói về việc dọn gọn"),
  pattern("sort out", "sắp xếp lại", "phrasal verb", "verb", "We have to", "Chúng ta phải", "Cụm động từ dùng khi nói về việc giải quyết hoặc sắp xếp lại"),
];

const selfCarePatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc trao đổi về"),
  pattern("improve", "cải thiện", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc cải thiện"),
  pattern("manage", "kiểm soát", "communication phrase", "phrase", "She needs to", "Cô ấy cần", "Dùng khi nói về việc kiểm soát"),
  pattern("work on", "rèn luyện", "communication phrase", "phrase", "I should", "Tôi nên", "Dùng khi nói về việc rèn luyện"),
  pattern("make time for", "dành thời gian cho", "communication phrase", "phrase", "He always", "Anh ấy luôn", "Dùng khi nói về việc dành thời gian cho"),
  pattern("deal with", "đối phó với", "communication phrase", "phrase", "It is important to", "Điều quan trọng là", "Dùng khi nói về việc đối phó với"),
  pattern("focus on", "tập trung vào", "communication phrase", "phrase", "Try to", "Hãy cố", "Dùng khi nói về việc tập trung vào"),
  pattern("cut down on", "cắt giảm", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc cắt giảm"),
  pattern("keep up with", "duy trì đều", "phrasal verb", "verb", "It is hard to", "Thật khó để", "Cụm động từ dùng khi nói về việc duy trì đều"),
];

const timePatterns = [
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("change", "thay đổi", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc thay đổi"),
  pattern("talk about", "nói về", "communication phrase", "phrase", "They often", "Họ thường", "Dùng khi nói về việc trao đổi về"),
  pattern("prepare for", "chuẩn bị cho", "communication phrase", "phrase", "I have to", "Tôi phải", "Dùng khi nói về việc chuẩn bị cho"),
  pattern("fit into", "xếp vào", "communication phrase", "phrase", "Can you", "Bạn có thể", "Dùng khi nói về việc xếp một việc vào lịch"),
  pattern("make time for", "dành thời gian cho", "communication phrase", "phrase", "I always", "Tôi luôn", "Dùng khi nói về việc sắp xếp thời gian cho"),
  pattern("push back", "dời lại", "phrasal verb", "verb", "We may have to", "Có thể chúng ta phải", "Cụm động từ dùng khi nói về việc dời lại"),
  pattern("catch up on", "làm bù", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc làm bù"),
];

const foodPatterns = [
  pattern("prepare", "chuẩn bị", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc chuẩn bị"),
  pattern("cook", "nấu", "communication phrase", "phrase", "We can", "Chúng ta có thể", "Dùng khi nói về việc nấu"),
  pattern("talk about", "nói về", "communication phrase", "phrase", "They often", "Họ thường", "Dùng khi nói về việc trao đổi về"),
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("enjoy", "thưởng thức", "communication phrase", "phrase", "We always", "Chúng tôi luôn", "Dùng khi nói về việc thưởng thức"),
  pattern("share", "chia sẻ", "communication phrase", "phrase", "Let us", "Hãy", "Dùng khi nói về việc chia sẻ"),
  pattern("ask for", "gọi", "communication phrase", "phrase", "You can", "Bạn có thể", "Dùng khi nói về việc yêu cầu hoặc gọi"),
  pattern("cut down on", "cắt giảm", "phrasal verb", "verb", "I should", "Tôi nên", "Cụm động từ dùng khi nói về việc cắt giảm"),
  pattern("use up", "dùng hết", "phrasal verb", "verb", "We need to", "Chúng ta cần", "Cụm động từ dùng khi nói về việc dùng hết"),
];

const shoppingPatterns = [
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("compare", "so sánh", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc so sánh"),
  pattern("pay for", "trả tiền cho", "communication phrase", "phrase", "We have to", "Chúng ta phải", "Dùng khi nói về việc thanh toán cho"),
  pattern("ask about", "hỏi về", "communication phrase", "phrase", "You should", "Bạn nên", "Dùng khi nói về việc hỏi về"),
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("return", "trả lại", "communication phrase", "phrase", "She wants to", "Cô ấy muốn", "Dùng khi nói về việc trả lại"),
  pattern("talk about", "nói về", "communication phrase", "phrase", "They often", "Họ thường", "Dùng khi nói về việc trao đổi về"),
  pattern("try on", "thử", "phrasal verb", "verb", "I want to", "Tôi muốn", "Cụm động từ dùng khi nói về việc thử"),
  pattern("look for", "tìm", "phrasal verb", "verb", "We are", "Chúng tôi đang", "Cụm động từ dùng khi nói về việc tìm kiếm"),
];

const transportPatterns = [
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("wait for", "chờ", "communication phrase", "phrase", "I have to", "Tôi phải", "Dùng khi nói về việc chờ"),
  pattern("talk about", "nói về", "communication phrase", "phrase", "They often", "Họ thường", "Dùng khi nói về việc trao đổi về"),
  pattern("change", "đổi", "communication phrase", "phrase", "We may need to", "Có thể chúng ta cần", "Dùng khi nói về việc thay đổi"),
  pattern("ask about", "hỏi về", "communication phrase", "phrase", "You can", "Bạn có thể", "Dùng khi nói về việc hỏi về"),
  pattern("deal with", "xử lý", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc xử lý"),
  pattern("get on", "lên", "phrasal verb", "verb", "We have to", "Chúng ta phải", "Cụm động từ dùng khi nói về việc lên phương tiện"),
  pattern("get off", "xuống", "phrasal verb", "verb", "Do not forget to", "Đừng quên", "Cụm động từ dùng khi nói về việc xuống phương tiện"),
];

const healthPatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc trao đổi về"),
  pattern("improve", "cải thiện", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc cải thiện"),
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("manage", "kiểm soát", "communication phrase", "phrase", "She needs to", "Cô ấy cần", "Dùng khi nói về việc kiểm soát"),
  pattern("prepare for", "chuẩn bị cho", "communication phrase", "phrase", "You should", "Bạn nên", "Dùng khi nói về việc chuẩn bị cho"),
  pattern("deal with", "đối phó với", "communication phrase", "phrase", "It helps to", "Sẽ tốt hơn nếu", "Dùng khi nói về việc đối phó với"),
  pattern("focus on", "tập trung vào", "communication phrase", "phrase", "Try to", "Hãy cố", "Dùng khi nói về việc tập trung vào"),
  pattern("work out", "tập luyện", "phrasal verb", "verb", "I usually", "Tôi thường", "Cụm động từ dùng khi nói về việc tập luyện"),
  pattern("cut down on", "cắt giảm", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc cắt giảm"),
];

const travelPatterns = [
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("book", "đặt", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc đặt"),
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("prepare for", "chuẩn bị cho", "communication phrase", "phrase", "They have to", "Họ phải", "Dùng khi nói về việc chuẩn bị cho"),
  pattern("talk about", "nói về", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc trao đổi về"),
  pattern("ask about", "hỏi về", "communication phrase", "phrase", "You can", "Bạn có thể", "Dùng khi nói về việc hỏi về"),
  pattern("pay for", "trả tiền cho", "communication phrase", "phrase", "We have to", "Chúng ta phải", "Dùng khi nói về việc trả tiền cho"),
  pattern("check in for", "làm thủ tục cho", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc làm thủ tục cho"),
  pattern("set off on", "khởi hành cho", "phrasal verb", "verb", "They will", "Họ sẽ", "Cụm động từ dùng khi nói về việc khởi hành cho"),
];

const weatherPatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "People often", "Mọi người thường", "Dùng khi nói về việc trao đổi về"),
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("prepare for", "chuẩn bị cho", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc chuẩn bị cho"),
  pattern("deal with", "đối phó với", "communication phrase", "phrase", "You need to", "Bạn cần", "Dùng khi nói về việc đối phó với"),
  pattern("wait for", "chờ", "communication phrase", "phrase", "We have to", "Chúng ta phải", "Dùng khi nói về việc chờ"),
  pattern("talk about", "bàn về", "communication phrase", "phrase", "They usually", "Họ thường", "Dùng khi nói về việc bàn về"),
  pattern("plan for", "chuẩn bị kế hoạch cho", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc tính trước cho"),
  pattern("cool down after", "hạ nhiệt sau", "phrasal verb", "verb", "We should", "Chúng ta nên", "Cụm động từ dùng khi nói về việc hạ nhiệt sau"),
  pattern("warm up for", "làm ấm người trước", "phrasal verb", "verb", "You can", "Bạn có thể", "Cụm động từ dùng khi nói về việc làm ấm người trước"),
];

const peoplePatterns = [
  pattern("talk to", "nói chuyện với", "communication phrase", "phrase", "I often", "Tôi thường", "Dùng khi nói về việc trò chuyện với"),
  pattern("hear from", "nhận tin từ", "communication phrase", "phrase", "I was happy to", "Tôi rất vui khi", "Dùng khi nói về việc nhận tin từ"),
  pattern("spend time with", "dành thời gian với", "communication phrase", "phrase", "We love to", "Chúng tôi thích", "Dùng khi nói về việc dành thời gian với"),
  pattern("help", "giúp", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc giúp"),
  pattern("check on", "hỏi thăm", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc hỏi thăm"),
  pattern("rely on", "trông cậy vào", "communication phrase", "phrase", "You can", "Bạn có thể", "Dùng khi nói về việc trông cậy vào"),
  pattern("learn from", "học từ", "communication phrase", "phrase", "We can", "Chúng ta có thể", "Dùng khi nói về việc học từ"),
  pattern("catch up with", "gặp lại để trò chuyện với", "phrasal verb", "verb", "I hope to", "Tôi hy vọng sẽ", "Cụm động từ dùng khi nói về việc gặp lại và cập nhật với"),
  pattern("open up to", "mở lòng với", "phrasal verb", "verb", "It is easier to", "Sẽ dễ hơn khi", "Cụm động từ dùng khi nói về việc mở lòng với"),
];

const emotionPatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "It helps to", "Sẽ tốt hơn nếu", "Dùng khi nói về việc chia sẻ về"),
  pattern("express", "thể hiện", "communication phrase", "phrase", "It is okay to", "Việc", "Dùng khi nói về việc thể hiện"),
  pattern("manage", "kiểm soát", "communication phrase", "phrase", "I try to", "Tôi cố", "Dùng khi nói về việc kiểm soát"),
  pattern("hide", "che giấu", "communication phrase", "phrase", "He tends to", "Anh ấy thường", "Dùng khi nói về việc che giấu"),
  pattern("deal with", "đối mặt với", "communication phrase", "phrase", "We need to", "Chúng ta cần", "Dùng khi nói về việc đối mặt với"),
  pattern("understand", "hiểu", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc hiểu"),
  pattern("show", "bộc lộ", "communication phrase", "phrase", "Do not be afraid to", "Đừng ngại", "Dùng khi nói về việc bộc lộ"),
  pattern("get over", "vượt qua", "phrasal verb", "verb", "It takes time to", "Cần thời gian để", "Cụm động từ dùng khi nói về việc vượt qua"),
  pattern("hold in", "kìm nén", "phrasal verb", "verb", "Try not to", "Hãy cố đừng", "Cụm động từ dùng khi nói về việc kìm nén"),
];

const communicationPatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc trao đổi về"),
  pattern("ask for", "yêu cầu", "communication phrase", "phrase", "You can", "Bạn có thể", "Dùng khi nói về việc yêu cầu"),
  pattern("reply to", "trả lời", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc trả lời"),
  pattern("explain", "giải thích", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc giải thích"),
  pattern("share", "chia sẻ", "communication phrase", "phrase", "Let us", "Hãy", "Dùng khi nói về việc chia sẻ"),
  pattern("listen to", "lắng nghe", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc lắng nghe"),
  pattern("respond to", "phản hồi", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc phản hồi"),
  pattern("write down", "ghi lại", "phrasal verb", "verb", "You should", "Bạn nên", "Cụm động từ dùng khi nói về việc ghi lại"),
  pattern("bring up", "đề cập", "phrasal verb", "verb", "I want to", "Tôi muốn", "Cụm động từ dùng khi nói về việc đề cập"),
];

const entertainmentPatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc trao đổi về"),
  pattern("enjoy", "thưởng thức", "communication phrase", "phrase", "I really", "Tôi rất", "Dùng khi nói về việc thưởng thức"),
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("share", "chia sẻ", "communication phrase", "phrase", "You can", "Bạn có thể", "Dùng khi nói về việc chia sẻ"),
  pattern("recommend", "giới thiệu", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc giới thiệu"),
  pattern("pay for", "trả tiền cho", "communication phrase", "phrase", "They have to", "Họ phải", "Dùng khi nói về việc trả tiền cho"),
  pattern("wait for", "chờ", "communication phrase", "phrase", "We cannot wait to", "Chúng tôi rất mong được", "Dùng khi nói về việc chờ đợi"),
  pattern("look up", "tìm", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc tìm"),
  pattern("sign up for", "đăng ký", "phrasal verb", "verb", "She wants to", "Cô ấy muốn", "Cụm động từ dùng khi nói về việc đăng ký"),
];

const studyPatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "Students often", "Học sinh thường", "Dùng khi nói về việc trao đổi về"),
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("prepare for", "chuẩn bị cho", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc chuẩn bị cho"),
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("focus on", "tập trung vào", "communication phrase", "phrase", "Try to", "Hãy cố", "Dùng khi nói về việc tập trung vào"),
  pattern("improve", "cải thiện", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc cải thiện"),
  pattern("talk about", "bàn về", "communication phrase", "phrase", "Teachers often", "Giáo viên thường", "Dùng khi nói về việc bàn về"),
  pattern("catch up on", "làm bù", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc làm bù"),
  pattern("look over", "xem lại", "phrasal verb", "verb", "You should", "Bạn nên", "Cụm động từ dùng khi nói về việc xem lại"),
];

const techPatterns = [
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("use", "sử dụng", "communication phrase", "phrase", "I often", "Tôi thường", "Dùng khi nói về việc sử dụng"),
  pattern("talk about", "nói về", "communication phrase", "phrase", "We sometimes", "Chúng tôi đôi khi", "Dùng khi nói về việc trao đổi về"),
  pattern("learn", "học cách dùng", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc học cách dùng"),
  pattern("set up", "thiết lập", "communication phrase", "phrase", "Can you", "Bạn có thể", "Dùng khi nói về việc thiết lập"),
  pattern("share", "chia sẻ", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc chia sẻ"),
  pattern("fix", "sửa", "communication phrase", "phrase", "We need to", "Chúng ta cần", "Dùng khi nói về việc sửa"),
  pattern("log in to", "đăng nhập vào", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc đăng nhập vào"),
  pattern("turn on", "bật", "phrasal verb", "verb", "Please", "Hãy", "Cụm động từ dùng khi nói về việc bật"),
];

const mediaPatterns = [
  pattern("check", "kiểm tra", "communication phrase", "phrase", "Please", "Hãy", "Dùng khi nói về việc kiểm tra"),
  pattern("read", "đọc", "communication phrase", "phrase", "I want to", "Tôi muốn", "Dùng khi nói về việc đọc"),
  pattern("watch", "xem", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc xem"),
  pattern("share", "chia sẻ", "communication phrase", "phrase", "You can", "Bạn có thể", "Dùng khi nói về việc chia sẻ"),
  pattern("talk about", "nói về", "communication phrase", "phrase", "They often", "Họ thường", "Dùng khi nói về việc trao đổi về"),
  pattern("save", "lưu", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc lưu"),
  pattern("follow", "theo dõi", "communication phrase", "phrase", "She likes to", "Cô ấy thích", "Dùng khi nói về việc theo dõi"),
  pattern("log out of", "đăng xuất khỏi", "phrasal verb", "verb", "Do not forget to", "Đừng quên", "Cụm động từ dùng khi nói về việc đăng xuất khỏi"),
  pattern("scroll through", "lướt qua", "phrasal verb", "verb", "I often", "Tôi thường", "Cụm động từ dùng khi nói về việc lướt qua"),
];

const workPatterns = [
  pattern("talk about", "nói về", "communication phrase", "phrase", "We often", "Chúng tôi thường", "Dùng khi nói về việc trao đổi về"),
  pattern("plan", "lên kế hoạch cho", "communication phrase", "phrase", "I need to", "Tôi cần", "Dùng khi nói về việc lên kế hoạch cho"),
  pattern("manage", "quản lý", "communication phrase", "phrase", "She can", "Cô ấy có thể", "Dùng khi nói về việc quản lý"),
  pattern("prepare for", "chuẩn bị cho", "communication phrase", "phrase", "We should", "Chúng ta nên", "Dùng khi nói về việc chuẩn bị cho"),
  pattern("deal with", "xử lý", "communication phrase", "phrase", "They have to", "Họ phải", "Dùng khi nói về việc xử lý"),
  pattern("focus on", "tập trung vào", "communication phrase", "phrase", "Try to", "Hãy cố", "Dùng khi nói về việc tập trung vào"),
  pattern("ask about", "hỏi về", "communication phrase", "phrase", "You can", "Bạn có thể", "Dùng khi nói về việc hỏi về"),
  pattern("follow up on", "theo dõi tiếp", "phrasal verb", "verb", "I need to", "Tôi cần", "Cụm động từ dùng khi nói về việc theo dõi tiếp"),
  pattern("take on", "nhận", "phrasal verb", "verb", "She may", "Cô ấy có thể", "Cụm động từ dùng khi nói về việc nhận"),
];

const TOPIC_CONFIGS: TopicConfig[] = [
  {
    topic: "Daily Life",
    patterns: routinePatterns,
    items: [
      item("daily tasks", "công việc hằng ngày", "task", "nhiệm vụ", "Routine", "A2"),
      item("the morning routine", "thói quen buổi sáng", "routine", "thói quen", "Routine", "A1"),
      item("weekend errands", "việc vặt cuối tuần", "errand", "việc vặt", "Errands", "B1"),
      item("the to-do list", "danh sách việc cần làm", "list", "danh sách", "Planning", "A2"),
      item("the bus timetable", "lịch xe buýt", "timetable", "lịch chạy xe", "Transport", "A2"),
      item("lunch plans", "kế hoạch bữa trưa", "lunchtime", "giờ ăn trưa", "Meals", "A1"),
      item("household chores", "việc nhà", "chore", "việc nhà", "Home", "A2"),
      item("a coffee break", "giờ nghỉ uống cà phê", "break", "giờ nghỉ", "Breaks", "A1"),
      item("monthly bills", "hóa đơn hằng tháng", "bill", "hóa đơn", "Money", "B1"),
      item("free time", "thời gian rảnh", "leisure", "thời gian thư giãn", "Lifestyle", "A1"),
      item("a phone call home", "cuộc gọi về nhà", "call", "cuộc gọi", "Family", "A2"),
      item("the laundry", "việc giặt giũ", "laundry", "việc giặt giũ", "Home", "A2"),
      item("a doctor appointment", "lịch hẹn bác sĩ", "appointment", "lịch hẹn", "Health", "B1"),
      item("the grocery list", "danh sách đồ cần mua", "groceries", "đồ tạp hóa", "Shopping", "A2"),
      item("evening plans", "kế hoạch buổi tối", "evening", "buổi tối", "Routine", "A1"),
      item("a quick lunch", "bữa trưa nhanh", "lunch", "bữa trưa", "Meals", "A1"),
    ],
  },
  {
    topic: "Home & Household",
    patterns: homePatterns,
    items: [
      item("the kitchen counter", "quầy bếp", "counter", "mặt quầy", "Kitchen", "A2"),
      item("the living room", "phòng khách", "living room", "phòng khách", "Rooms", "A1"),
      item("the bedroom closet", "tủ quần áo trong phòng ngủ", "closet", "tủ quần áo", "Storage", "A2"),
      item("the bathroom sink", "bồn rửa trong phòng tắm", "sink", "bồn rửa", "Bathroom", "A2"),
      item("the front door", "cửa trước", "door", "cửa", "Safety", "A1"),
      item("the house key", "chìa khóa nhà", "key", "chìa khóa", "Safety", "A1"),
      item("the washing machine", "máy giặt", "machine", "máy móc", "Appliances", "A2"),
      item("the dining table", "bàn ăn", "table", "bàn", "Dining", "A1"),
      item("the guest room", "phòng dành cho khách", "guest", "khách", "Rooms", "B1"),
      item("the water bill", "hóa đơn tiền nước", "water", "nước", "Bills", "A2"),
      item("window cleaning", "việc lau cửa sổ", "window", "cửa sổ", "Cleaning", "A2"),
      item("the garbage bag", "túi rác", "garbage", "rác", "Cleaning", "A1"),
      item("the repair job", "việc sửa chữa", "repair", "sửa chữa", "Maintenance", "B1"),
      item("the balcony plants", "cây ở ban công", "balcony", "ban công", "Plants", "A2"),
      item("the storage box", "hộp đựng đồ", "storage", "kho chứa", "Storage", "A2"),
      item("the floor lamp", "đèn đứng", "lamp", "đèn", "Appliances", "A1"),
    ],
  },
  {
    topic: "Personal Habits",
    patterns: selfCarePatterns,
    items: [
      item("sleep habits", "thói quen ngủ", "sleep", "giấc ngủ", "Sleep", "A2"),
      item("water intake", "lượng nước uống", "intake", "lượng hấp thụ", "Health", "B1"),
      item("screen time", "thời gian nhìn màn hình", "screen", "màn hình", "Technology", "A2"),
      item("the bedtime routine", "thói quen trước khi ngủ", "bedtime", "giờ đi ngủ", "Sleep", "A2"),
      item("a morning walk", "buổi đi bộ buổi sáng", "walk", "đi bộ", "Exercise", "A1"),
      item("snack choices", "lựa chọn đồ ăn vặt", "snack", "đồ ăn vặt", "Food", "A2"),
      item("study habits", "thói quen học tập", "habit", "thói quen", "Study", "A2"),
      item("spending habits", "thói quen chi tiêu", "spending", "chi tiêu", "Money", "B1"),
      item("an exercise plan", "kế hoạch tập luyện", "exercise", "bài tập", "Exercise", "A2"),
      item("stress levels", "mức độ căng thẳng", "stress", "căng thẳng", "Mind", "B1"),
      item("hair care", "việc chăm sóc tóc", "hair", "tóc", "Care", "A2"),
      item("reading time", "thời gian đọc sách", "reading", "việc đọc", "Leisure", "A1"),
      item("coffee intake", "lượng cà phê uống", "coffee", "cà phê", "Food", "A2"),
      item("daily notes", "ghi chú hằng ngày", "note", "ghi chú", "Planning", "A2"),
      item("weekend sleep", "giấc ngủ cuối tuần", "weekend", "cuối tuần", "Sleep", "A2"),
      item("phone habits", "thói quen dùng điện thoại", "phone", "điện thoại", "Technology", "A2"),
    ],
  },
  {
    topic: "Time & Schedules",
    patterns: timePatterns,
    items: [
      item("today's schedule", "lịch hôm nay", "schedule", "lịch trình", "Planning", "A1"),
      item("meeting times", "thời gian họp", "meeting", "cuộc họp", "Work", "A2"),
      item("the lunch break", "giờ nghỉ trưa", "breaktime", "giờ nghỉ", "Breaks", "A1"),
      item("a late start", "sự khởi đầu muộn", "start", "sự bắt đầu", "Routine", "A2"),
      item("weekend plans", "kế hoạch cuối tuần", "weekend", "cuối tuần", "Leisure", "A1"),
      item("the deadline", "hạn chót", "deadline", "hạn chót", "Work", "B1"),
      item("office hours", "giờ làm việc", "office", "văn phòng", "Work", "A2"),
      item("travel time", "thời gian di chuyển", "travel", "sự di chuyển", "Transport", "A2"),
      item("class hours", "giờ học", "class", "lớp học", "Education", "A1"),
      item("a free afternoon", "một buổi chiều rảnh", "afternoon", "buổi chiều", "Leisure", "A1"),
      item("the next appointment", "cuộc hẹn tiếp theo", "next", "tiếp theo", "Appointments", "A2"),
      item("the train time", "giờ tàu", "train", "tàu", "Transport", "A2"),
      item("a short delay", "sự chậm trễ ngắn", "delay", "sự chậm trễ", "Delays", "A2"),
      item("tomorrow morning", "sáng mai", "tomorrow", "ngày mai", "Planning", "A1"),
      item("bedtime plans", "kế hoạch trước giờ ngủ", "bedtime", "giờ đi ngủ", "Sleep", "A2"),
      item("the weekly calendar", "lịch hằng tuần", "calendar", "lịch", "Planning", "A2"),
    ],
  },
  {
    topic: "Food & Cooking",
    patterns: foodPatterns,
    items: [
      item("a simple breakfast", "bữa sáng đơn giản", "breakfast", "bữa sáng", "Meals", "A1"),
      item("dinner plans", "kế hoạch bữa tối", "dinner", "bữa tối", "Meals", "A1"),
      item("fresh ingredients", "nguyên liệu tươi", "ingredient", "nguyên liệu", "Cooking", "A2"),
      item("the shopping basket", "giỏ đi chợ", "basket", "cái giỏ", "Shopping", "A2"),
      item("a family recipe", "công thức nấu ăn của gia đình", "recipe", "công thức", "Cooking", "A2"),
      item("a quick snack", "món ăn nhẹ nhanh", "snack", "món ăn nhẹ", "Meals", "A1"),
      item("the lunch box", "hộp cơm", "box", "chiếc hộp", "Meals", "A1"),
      item("a hot drink", "đồ uống nóng", "drink", "đồ uống", "Drinks", "A1"),
      item("spicy food", "đồ ăn cay", "spice", "gia vị", "Taste", "A2"),
      item("homemade soup", "món súp tự nấu", "soup", "món súp", "Cooking", "A2"),
      item("a grocery order", "đơn mua đồ ăn", "order", "đơn hàng", "Shopping", "B1"),
      item("the dining menu", "thực đơn", "menu", "thực đơn", "Dining", "A2"),
      item("leftover rice", "cơm thừa", "rice", "cơm", "Cooking", "A1"),
      item("healthy meals", "bữa ăn lành mạnh", "meal", "bữa ăn", "Health", "A2"),
      item("table manners", "phép lịch sự trên bàn ăn", "manner", "cách cư xử", "Dining", "B1"),
      item("cooking oil", "dầu ăn", "oil", "dầu", "Cooking", "A2"),
    ],
  },
  {
    topic: "Shopping",
    patterns: shoppingPatterns,
    items: [
      item("the price tag", "thẻ giá", "price", "giá", "Pricing", "A1"),
      item("online deals", "ưu đãi trực tuyến", "deal", "ưu đãi", "Online", "A2"),
      item("a size chart", "bảng kích cỡ", "size", "kích cỡ", "Clothes", "A2"),
      item("the return policy", "chính sách đổi trả", "policy", "chính sách", "Service", "B1"),
      item("a gift order", "đơn đặt quà", "gift", "món quà", "Gifts", "A2"),
      item("payment options", "các hình thức thanh toán", "payment", "thanh toán", "Payments", "B1"),
      item("store hours", "giờ mở cửa của cửa hàng", "store", "cửa hàng", "Service", "A1"),
      item("the shopping list", "danh sách mua sắm", "shopping", "mua sắm", "Planning", "A1"),
      item("a discount code", "mã giảm giá", "discount", "giảm giá", "Online", "A2"),
      item("the receipt", "hóa đơn mua hàng", "receipt", "biên lai", "Payments", "A2"),
      item("a refund request", "yêu cầu hoàn tiền", "refund", "hoàn tiền", "Service", "B1"),
      item("product reviews", "đánh giá sản phẩm", "review", "đánh giá", "Online", "A2"),
      item("the checkout line", "hàng chờ thanh toán", "checkout", "quầy thanh toán", "Store", "A2"),
      item("a sale item", "món hàng giảm giá", "sale", "đợt giảm giá", "Pricing", "A1"),
      item("the cash register", "quầy tính tiền", "register", "máy tính tiền", "Store", "B1"),
      item("delivery updates", "cập nhật giao hàng", "delivery", "giao hàng", "Service", "A2"),
    ],
  },
  {
    topic: "Transportation",
    patterns: transportPatterns,
    items: [
      item("the bus", "xe buýt", "bus", "xe buýt", "Public Transit", "A1"),
      item("the train", "tàu hỏa", "train", "tàu hỏa", "Public Transit", "A1"),
      item("a taxi ride", "chuyến đi taxi", "taxi", "xe taxi", "Taxi", "A1"),
      item("the bus stop", "trạm xe buýt", "stop", "điểm dừng", "Public Transit", "A1"),
      item("the subway line", "tuyến tàu điện ngầm", "subway", "tàu điện ngầm", "Public Transit", "A2"),
      item("the traffic jam", "kẹt xe", "traffic", "giao thông", "Roads", "A2"),
      item("the parking spot", "chỗ đỗ xe", "parking", "chỗ đỗ xe", "Driving", "A2"),
      item("a train ticket", "vé tàu", "ticket", "vé", "Tickets", "A1"),
      item("the platform", "sân ga", "platform", "sân ga", "Stations", "B1"),
      item("the route change", "thay đổi lộ trình", "route", "tuyến đường", "Roads", "A2"),
      item("the morning commute", "chuyến đi làm buổi sáng", "commute", "việc đi làm", "Routine", "B1"),
      item("a seat on the bus", "một chỗ ngồi trên xe buýt", "seat", "ghế ngồi", "Public Transit", "A1"),
      item("the station entrance", "cổng vào nhà ga", "station", "nhà ga", "Stations", "A2"),
      item("the timetable board", "bảng giờ chạy", "board", "bảng thông tin", "Stations", "A2"),
      item("a bike lane", "làn đường cho xe đạp", "bike", "xe đạp", "Roads", "A2"),
      item("a travel card", "thẻ đi lại", "card", "thẻ", "Tickets", "A2"),
    ],
  },
  {
    topic: "Health & Fitness",
    patterns: healthPatterns,
    items: [
      item("regular exercise", "việc tập luyện đều đặn", "exercise", "việc tập luyện", "Exercise", "A2"),
      item("a health check", "buổi kiểm tra sức khỏe", "check", "lần kiểm tra", "Health", "A2"),
      item("a balanced diet", "chế độ ăn cân bằng", "diet", "chế độ ăn", "Nutrition", "A2"),
      item("your body weight", "cân nặng của bạn", "weight", "cân nặng", "Fitness", "A2"),
      item("a long walk", "một cuộc đi bộ dài", "walk", "cuộc đi bộ", "Exercise", "A1"),
      item("muscle pain", "đau cơ", "muscle", "cơ bắp", "Health", "B1"),
      item("the doctor visit", "buổi đi khám bác sĩ", "doctor", "bác sĩ", "Health", "A1"),
      item("a home workout", "buổi tập tại nhà", "workout", "buổi tập", "Exercise", "A2"),
      item("healthy habits", "thói quen lành mạnh", "habit", "thói quen", "Lifestyle", "A2"),
      item("stress control", "việc kiểm soát căng thẳng", "control", "sự kiểm soát", "Mind", "B1"),
      item("a running plan", "kế hoạch chạy bộ", "running", "việc chạy bộ", "Exercise", "A2"),
      item("the medicine schedule", "lịch uống thuốc", "medicine", "thuốc", "Health", "A2"),
      item("deep breathing", "hít thở sâu", "breathing", "hơi thở", "Mind", "A2"),
      item("a sore back", "lưng bị đau", "back", "lưng", "Health", "A2"),
      item("the gym membership", "gói thành viên phòng gym", "membership", "thẻ thành viên", "Fitness", "B1"),
      item("your energy level", "mức năng lượng của bạn", "energy", "năng lượng", "Mind", "A2"),
    ],
  },
  {
    topic: "Travel",
    patterns: travelPatterns,
    items: [
      item("a weekend trip", "chuyến đi cuối tuần", "trip", "chuyến đi", "Trips", "A1"),
      item("the hotel room", "phòng khách sạn", "hotel", "khách sạn", "Accommodation", "A1"),
      item("a travel plan", "kế hoạch du lịch", "travel", "du lịch", "Planning", "A2"),
      item("the passport check", "khâu kiểm tra hộ chiếu", "passport", "hộ chiếu", "Airport", "A2"),
      item("the flight ticket", "vé máy bay", "flight", "chuyến bay", "Flights", "A1"),
      item("a long journey", "hành trình dài", "journey", "hành trình", "Trips", "B1"),
      item("the check-in desk", "quầy làm thủ tục", "desk", "quầy", "Airport", "A2"),
      item("a day tour", "tour trong ngày", "tour", "chuyến tham quan", "Activities", "A2"),
      item("the travel bag", "túi du lịch", "bag", "túi", "Packing", "A1"),
      item("the room key", "chìa khóa phòng", "key", "chìa khóa", "Accommodation", "A1"),
      item("the boarding gate", "cửa ra máy bay", "gate", "cổng lên máy bay", "Airport", "B1"),
      item("a travel guide", "cẩm nang du lịch", "guide", "hướng dẫn", "Planning", "A2"),
      item("local transport", "phương tiện địa phương", "local", "địa phương", "Transport", "A2"),
      item("the luggage weight", "trọng lượng hành lý", "luggage", "hành lý", "Flights", "B1"),
      item("the travel budget", "ngân sách du lịch", "budget", "ngân sách", "Money", "B1"),
      item("the arrival time", "giờ đến nơi", "arrival", "sự đến nơi", "Flights", "A2"),
    ],
  },
  {
    topic: "Weather",
    patterns: weatherPatterns,
    items: [
      item("heavy rain", "mưa lớn", "rain", "mưa", "Rain", "A1"),
      item("hot weather", "thời tiết nóng", "weather", "thời tiết", "Heat", "A1"),
      item("a cold morning", "buổi sáng lạnh", "cold", "cái lạnh", "Cold", "A1"),
      item("strong wind", "gió mạnh", "wind", "gió", "Wind", "A2"),
      item("a sunny afternoon", "buổi chiều nắng", "sunny", "trời nắng", "Sun", "A1"),
      item("the weather report", "bản tin thời tiết", "report", "bản tin", "Forecast", "A2"),
      item("a rainy week", "một tuần mưa", "week", "tuần", "Rain", "A2"),
      item("the storm warning", "cảnh báo bão", "storm", "bão", "Storms", "B1"),
      item("humid air", "không khí ẩm", "humid", "độ ẩm cao", "Humidity", "B1"),
      item("cool evenings", "buổi tối mát", "cool", "sự mát mẻ", "Temperature", "A1"),
      item("the heat wave", "đợt nắng nóng", "heat", "cái nóng", "Heat", "B1"),
      item("a cloudy sky", "bầu trời nhiều mây", "cloud", "mây", "Sky", "A1"),
      item("weather changes", "sự thay đổi thời tiết", "change", "sự thay đổi", "Forecast", "A2"),
      item("the weekend forecast", "dự báo cuối tuần", "forecast", "dự báo", "Forecast", "A2"),
      item("dry air", "không khí khô", "dry", "sự khô hanh", "Humidity", "A2"),
      item("the winter wind", "gió mùa đông", "winter", "mùa đông", "Wind", "A2"),
      item("a foggy morning", "một buổi sáng có sương mù", "fog", "sương mù", "Fog", "A2"),
      item("spring sunshine", "nắng xuân", "sunshine", "ánh nắng", "Sun", "A2"),
    ],
  },
  {
    topic: "Family & Relationships",
    patterns: peoplePatterns,
    items: [
      item("your parents", "bố mẹ của bạn", "parent", "bố mẹ", "Parents", "A1"),
      item("your siblings", "anh chị em của bạn", "sibling", "anh chị em", "Siblings", "A2"),
      item("your grandparents", "ông bà của bạn", "grandparent", "ông bà", "Grandparents", "A1"),
      item("a close cousin", "một người anh chị em họ thân", "cousin", "anh chị em họ", "Relatives", "A2"),
      item("an older relative", "một người họ hàng lớn tuổi", "relative", "người họ hàng", "Relatives", "A2"),
      item("a family friend", "một người bạn của gia đình", "friend", "người bạn", "Friends", "A1"),
      item("your young child", "con nhỏ của bạn", "child", "đứa trẻ", "Children", "A1"),
      item("your partner", "người yêu hoặc bạn đời của bạn", "partner", "bạn đời", "Partners", "A2"),
      item("your in-laws", "gia đình bên chồng hoặc vợ", "in-law", "người thân bên chồng hoặc vợ", "Relatives", "B1"),
      item("your uncle", "chú hoặc cậu của bạn", "uncle", "chú hoặc cậu", "Relatives", "A1"),
      item("your aunt", "cô hoặc dì của bạn", "aunt", "cô hoặc dì", "Relatives", "A1"),
      item("your teenage son", "con trai tuổi teen của bạn", "son", "con trai", "Children", "A2"),
      item("your daughter", "con gái của bạn", "daughter", "con gái", "Children", "A1"),
      item("your spouse", "vợ hoặc chồng của bạn", "spouse", "vợ hoặc chồng", "Partners", "B1"),
      item("a new neighbor", "một người hàng xóm mới", "neighbor", "hàng xóm", "Neighbors", "A1"),
      item("your family group", "nhóm gia đình của bạn", "family", "gia đình", "Family", "A1"),
    ],
  },
  {
    topic: "Friends & Social Life",
    patterns: peoplePatterns,
    items: [
      item("a close friend", "một người bạn thân", "friend", "người bạn", "Friends", "A1"),
      item("your classmates", "các bạn cùng lớp của bạn", "classmate", "bạn cùng lớp", "School", "A2"),
      item("your coworkers", "đồng nghiệp của bạn", "coworker", "đồng nghiệp", "Work", "A2"),
      item("a new friend", "một người bạn mới", "newcomer", "người mới", "Friends", "A1"),
      item("your best friend", "bạn thân nhất của bạn", "bestie", "bạn thân", "Friends", "A2"),
      item("your old roommate", "bạn cùng phòng cũ của bạn", "roommate", "bạn cùng phòng", "Home", "B1"),
      item("your social group", "nhóm bạn của bạn", "group", "nhóm", "Social", "A2"),
      item("your team leader", "trưởng nhóm của bạn", "leader", "người dẫn dắt", "Work", "B1"),
      item("your club members", "các thành viên câu lạc bộ của bạn", "member", "thành viên", "Clubs", "A2"),
      item("a dinner guest", "một vị khách ăn tối", "guest", "khách", "Social", "A2"),
      item("your online friend", "bạn trên mạng của bạn", "online", "trực tuyến", "Online", "A2"),
      item("a travel buddy", "bạn đồng hành du lịch", "buddy", "bạn đồng hành", "Travel", "B1"),
      item("your weekend group", "nhóm đi chơi cuối tuần của bạn", "weekend", "cuối tuần", "Social", "A2"),
      item("a party host", "người chủ tiệc", "host", "chủ nhà", "Events", "B1"),
      item("your study partner", "bạn học của bạn", "study", "việc học", "Study", "A2"),
      item("your gym friend", "bạn tập gym của bạn", "gym", "phòng gym", "Fitness", "A2"),
    ],
  },
  {
    topic: "Emotions & Feelings",
    patterns: emotionPatterns,
    items: [
      item("your stress", "sự căng thẳng của bạn", "stress", "căng thẳng", "Stress", "A2"),
      item("your anger", "cơn giận của bạn", "anger", "cơn giận", "Negative", "A2"),
      item("your joy", "niềm vui của bạn", "joy", "niềm vui", "Positive", "A2"),
      item("your sadness", "nỗi buồn của bạn", "sadness", "nỗi buồn", "Negative", "A2"),
      item("your excitement", "sự háo hức của bạn", "excitement", "sự hào hứng", "Positive", "B1"),
      item("your worry", "nỗi lo của bạn", "worry", "nỗi lo", "Negative", "A2"),
      item("your fear", "nỗi sợ của bạn", "fear", "nỗi sợ", "Negative", "A2"),
      item("your confidence", "sự tự tin của bạn", "confidence", "sự tự tin", "Positive", "B1"),
      item("your disappointment", "sự thất vọng của bạn", "disappointment", "sự thất vọng", "Negative", "B1"),
      item("your gratitude", "lòng biết ơn của bạn", "gratitude", "lòng biết ơn", "Positive", "B2"),
      item("your frustration", "sự bực bội của bạn", "frustration", "sự bực bội", "Negative", "B1"),
      item("your relief", "sự nhẹ nhõm của bạn", "relief", "sự nhẹ nhõm", "Positive", "A2"),
      item("your guilt", "cảm giác có lỗi của bạn", "guilt", "cảm giác có lỗi", "Negative", "B1"),
      item("your pride", "niềm tự hào của bạn", "pride", "niềm tự hào", "Positive", "A2"),
      item("your loneliness", "sự cô đơn của bạn", "loneliness", "sự cô đơn", "Negative", "B1"),
      item("your surprise", "sự ngạc nhiên của bạn", "surprise", "sự ngạc nhiên", "Positive", "A2"),
    ],
  },
  {
    topic: "Communication",
    patterns: communicationPatterns,
    items: [
      item("a short message", "một tin nhắn ngắn", "message", "tin nhắn", "Messages", "A1"),
      item("a clear request", "một yêu cầu rõ ràng", "request", "yêu cầu", "Requests", "A2"),
      item("a phone call", "một cuộc gọi điện thoại", "phone", "điện thoại", "Calls", "A1"),
      item("a voice note", "một tin nhắn thoại", "voice", "giọng nói", "Messages", "A2"),
      item("an update", "một cập nhật", "update", "cập nhật", "Updates", "A2"),
      item("a quick reply", "một câu trả lời nhanh", "reply", "câu trả lời", "Replies", "A2"),
      item("an opinion", "một ý kiến", "opinion", "ý kiến", "Opinions", "A2"),
      item("a question", "một câu hỏi", "question", "câu hỏi", "Questions", "A1"),
      item("a reminder", "một lời nhắc", "reminder", "lời nhắc", "Planning", "A2"),
      item("a contact number", "một số liên lạc", "contact", "liên lạc", "Contacts", "A2"),
      item("a meeting point", "một điểm hẹn", "point", "điểm hẹn", "Meetings", "A2"),
      item("a clear answer", "một câu trả lời rõ ràng", "answer", "câu trả lời", "Replies", "A1"),
      item("a voice message", "một lời nhắn thoại", "audio", "âm thanh", "Messages", "A2"),
      item("a public announcement", "một thông báo công khai", "announcement", "thông báo", "Public", "B1"),
      item("a short introduction", "một lời giới thiệu ngắn", "introduction", "lời giới thiệu", "Social", "A2"),
      item("an urgent call", "một cuộc gọi khẩn", "urgent", "sự khẩn cấp", "Calls", "B1"),
    ],
  },
  {
    topic: "Entertainment",
    patterns: entertainmentPatterns,
    items: [
      item("a new movie", "một bộ phim mới", "movie", "bộ phim", "Movies", "A1"),
      item("a comedy show", "một chương trình hài", "comedy", "hài kịch", "Shows", "A2"),
      item("a music playlist", "một danh sách nhạc", "playlist", "danh sách phát", "Music", "A2"),
      item("a live concert", "một buổi hòa nhạc trực tiếp", "concert", "buổi hòa nhạc", "Music", "A2"),
      item("the latest episode", "tập mới nhất", "episode", "tập phim", "Series", "A2"),
      item("a game night", "một tối chơi game", "game", "trò chơi", "Games", "A1"),
      item("a ticket price", "giá vé", "ticket", "vé", "Tickets", "A1"),
      item("a streaming plan", "gói xem trực tuyến", "streaming", "xem trực tuyến", "Online", "B1"),
      item("the sound system", "hệ thống âm thanh", "sound", "âm thanh", "Devices", "B1"),
      item("a weekend show", "một chương trình cuối tuần", "show", "chương trình", "Shows", "A1"),
      item("a funny video", "một video vui", "video", "video", "Online", "A1"),
      item("a tv series", "một bộ phim truyền hình", "series", "loạt phim", "Series", "A2"),
      item("a dance class", "một lớp nhảy", "dance", "môn nhảy", "Activities", "A2"),
      item("a podcast episode", "một tập podcast", "podcast", "podcast", "Audio", "B1"),
      item("a book club", "một câu lạc bộ sách", "book", "sách", "Reading", "A2"),
      item("a live match", "một trận đấu trực tiếp", "match", "trận đấu", "Sports", "A2"),
    ],
  },
  {
    topic: "Education",
    patterns: studyPatterns,
    items: [
      item("the homework", "bài tập về nhà", "homework", "bài tập về nhà", "Study", "A1"),
      item("the class schedule", "lịch học", "class", "lớp học", "Planning", "A1"),
      item("an exam review", "buổi ôn thi", "exam", "bài thi", "Exams", "A2"),
      item("the lesson plan", "kế hoạch bài học", "lesson", "bài học", "Teaching", "A2"),
      item("a group project", "dự án nhóm", "project", "dự án", "Projects", "A2"),
      item("study notes", "ghi chú học tập", "notes", "ghi chú", "Study", "A1"),
      item("the school report", "báo cáo của trường", "school", "trường học", "Reports", "A2"),
      item("the final test", "bài kiểm tra cuối kỳ", "test", "bài kiểm tra", "Exams", "A2"),
      item("class discussion", "thảo luận trên lớp", "discussion", "thảo luận", "Classroom", "B1"),
      item("the reading task", "nhiệm vụ đọc", "reading", "việc đọc", "Study", "A1"),
      item("the writing task", "nhiệm vụ viết", "writing", "việc viết", "Study", "A2"),
      item("the answer sheet", "phiếu trả lời", "sheet", "tờ giấy", "Exams", "A2"),
      item("the school library", "thư viện trường", "library", "thư viện", "School", "A1"),
      item("a speaking test", "bài kiểm tra nói", "speaking", "việc nói", "Exams", "A2"),
      item("the teacher feedback", "phản hồi của giáo viên", "feedback", "phản hồi", "Teaching", "B1"),
      item("a study group", "nhóm học tập", "study", "việc học", "Study", "A2"),
      item("the language lab", "phòng thực hành ngôn ngữ", "lab", "phòng thực hành", "School", "B1"),
      item("the school counselor", "cố vấn học đường", "counselor", "cố vấn", "Support", "B1"),
    ],
  },
  {
    topic: "Technology (basic)",
    patterns: techPatterns,
    items: [
      item("the phone screen", "màn hình điện thoại", "screen", "màn hình", "Devices", "A1"),
      item("the laptop charger", "bộ sạc máy tính xách tay", "charger", "bộ sạc", "Devices", "A2"),
      item("a simple app", "một ứng dụng đơn giản", "app", "ứng dụng", "Apps", "A1"),
      item("the wifi password", "mật khẩu wifi", "wifi", "wifi", "Internet", "A2"),
      item("the internet connection", "kết nối internet", "internet", "internet", "Internet", "A2"),
      item("the battery level", "mức pin", "battery", "pin", "Devices", "A2"),
      item("a video call", "một cuộc gọi video", "video", "video", "Calls", "A2"),
      item("the account settings", "cài đặt tài khoản", "account", "tài khoản", "Accounts", "B1"),
      item("the browser tab", "thẻ trình duyệt", "browser", "trình duyệt", "Web", "B1"),
      item("a file download", "một lượt tải tệp", "file", "tệp", "Files", "A2"),
      item("the photo gallery", "thư viện ảnh", "gallery", "bộ sưu tập", "Photos", "A2"),
      item("the search bar", "thanh tìm kiếm", "search", "tìm kiếm", "Web", "A2"),
      item("the bluetooth speaker", "loa bluetooth", "bluetooth", "bluetooth", "Devices", "B1"),
      item("the phone update", "bản cập nhật điện thoại", "update", "cập nhật", "Devices", "A2"),
      item("the login page", "trang đăng nhập", "login", "đăng nhập", "Accounts", "A2"),
      item("a map app", "ứng dụng bản đồ", "map", "bản đồ", "Apps", "A1"),
      item("the camera roll", "thư viện ảnh trong điện thoại", "camera", "máy ảnh", "Photos", "A2"),
      item("a smart speaker", "loa thông minh", "speaker", "loa", "Devices", "B1"),
    ],
  },
  {
    topic: "Media & Internet",
    patterns: mediaPatterns,
    items: [
      item("the news feed", "bảng tin", "feed", "bảng tin", "Social Media", "A2"),
      item("online comments", "bình luận trực tuyến", "comment", "bình luận", "Social Media", "A2"),
      item("a blog post", "một bài blog", "blog", "blog", "Writing", "A2"),
      item("a news article", "một bài báo", "article", "bài báo", "News", "A2"),
      item("a short podcast", "một podcast ngắn", "podcast", "podcast", "Audio", "B1"),
      item("the video channel", "kênh video", "channel", "kênh", "Video", "A2"),
      item("the social page", "trang mạng xã hội", "social", "mạng xã hội", "Social Media", "A2"),
      item("the privacy setting", "cài đặt quyền riêng tư", "privacy", "quyền riêng tư", "Accounts", "B1"),
      item("the trending topic", "chủ đề đang thịnh hành", "trend", "xu hướng", "Social Media", "B1"),
      item("the live stream", "buổi phát trực tiếp", "livestream", "phát trực tiếp", "Video", "B1"),
      item("the inbox message", "tin nhắn trong hộp thư", "inbox", "hộp thư đến", "Messages", "A2"),
      item("the phone notification", "thông báo trên điện thoại", "notification", "thông báo", "Devices", "A2"),
      item("a shared link", "một đường dẫn được chia sẻ", "link", "đường dẫn", "Sharing", "A1"),
      item("the comment section", "phần bình luận", "section", "mục", "Social Media", "A2"),
      item("your online profile", "hồ sơ trực tuyến của bạn", "profile", "hồ sơ", "Accounts", "A2"),
      item("the search results", "kết quả tìm kiếm", "results", "kết quả", "Web", "A2"),
      item("the daily newsletter", "bản tin hằng ngày", "newsletter", "bản tin", "News", "B1"),
      item("the comment alert", "thông báo bình luận", "alert", "thông báo khẩn", "Social Media", "A2"),
    ],
  },
  {
    topic: "Work & Career",
    patterns: workPatterns,
    items: [
      item("the work schedule", "lịch làm việc", "work", "công việc", "Planning", "A2"),
      item("a new project", "một dự án mới", "project", "dự án", "Projects", "A2"),
      item("your job tasks", "nhiệm vụ công việc của bạn", "job", "công việc", "Tasks", "A2"),
      item("the office meeting", "cuộc họp ở văn phòng", "office", "văn phòng", "Meetings", "A2"),
      item("a job interview", "một cuộc phỏng vấn xin việc", "interview", "phỏng vấn", "Hiring", "B1"),
      item("the team update", "cập nhật của nhóm", "team", "nhóm", "Updates", "A2"),
      item("the monthly report", "báo cáo hằng tháng", "report", "báo cáo", "Reports", "B1"),
      item("a work email", "một email công việc", "email", "email", "Email", "A2"),
      item("your task list", "danh sách nhiệm vụ của bạn", "task", "nhiệm vụ", "Tasks", "A2"),
      item("the lunch meeting", "cuộc họp vào bữa trưa", "lunch", "bữa trưa", "Meetings", "B1"),
      item("a job offer", "một lời mời làm việc", "offer", "lời mời", "Hiring", "B1"),
      item("the training session", "buổi đào tạo", "training", "đào tạo", "Training", "A2"),
      item("the office deadline", "hạn chót ở công ty", "deadline", "hạn chót", "Planning", "B1"),
      item("a career goal", "mục tiêu nghề nghiệp", "career", "sự nghiệp", "Career", "B1"),
      item("the weekly target", "mục tiêu hằng tuần", "target", "mục tiêu", "Planning", "A2"),
      item("the work contract", "hợp đồng lao động", "contract", "hợp đồng", "Hiring", "B1"),
      item("the staff handbook", "sổ tay nhân viên", "handbook", "sổ tay", "Office", "B1"),
      item("the office badge", "thẻ nhân viên", "badge", "thẻ nhân viên", "Office", "A2"),
    ],
  },
  {
    topic: "Business Communication",
    patterns: workPatterns,
    items: [
      item("the client email", "email của khách hàng", "client", "khách hàng", "Clients", "A2"),
      item("a meeting agenda", "chương trình họp", "agenda", "chương trình", "Meetings", "B1"),
      item("the sales update", "cập nhật bán hàng", "sales", "bán hàng", "Updates", "B1"),
      item("the project brief", "bản tóm tắt dự án", "brief", "bản tóm tắt", "Projects", "B2"),
      item("the office presentation", "bài thuyết trình ở văn phòng", "presentation", "bài thuyết trình", "Presentations", "B1"),
      item("a follow-up email", "một email theo dõi", "follow-up", "thư theo dõi", "Email", "B1"),
      item("the business call", "cuộc gọi công việc", "business", "kinh doanh", "Calls", "A2"),
      item("the budget review", "buổi rà soát ngân sách", "budget", "ngân sách", "Finance", "B1"),
      item("the action points", "các đầu việc cần làm", "action", "hành động", "Meetings", "B1"),
      item("the contract terms", "điều khoản hợp đồng", "terms", "điều khoản", "Contracts", "B2"),
      item("the client feedback", "phản hồi của khách hàng", "feedback", "phản hồi", "Clients", "B1"),
      item("the phone conference", "hội nghị qua điện thoại", "conference", "hội nghị", "Calls", "B1"),
      item("the proposal draft", "bản dự thảo đề xuất", "proposal", "đề xuất", "Projects", "B2"),
      item("the team summary", "bản tóm tắt của nhóm", "summary", "bản tóm tắt", "Updates", "B1"),
      item("the meeting notes", "biên bản cuộc họp", "notes", "ghi chú", "Meetings", "A2"),
      item("the client request", "yêu cầu của khách hàng", "request", "yêu cầu", "Clients", "A2"),
      item("the invoice reminder", "lời nhắc về hóa đơn", "invoice", "hóa đơn", "Finance", "B1"),
      item("the vendor meeting", "cuộc họp với nhà cung cấp", "vendor", "nhà cung cấp", "Clients", "B2"),
    ],
  },
];

function normalizeSpacing(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function canonicalizePhrase(rawPhrase: string): string {
  return normalizeSpacing(
    rawPhrase
      .normalize("NFKC")
      .toLowerCase()
      .replace(/[’`]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/[^a-z0-9\s'\-]/g, " ")
  )
    .split(" ")
    .filter((token) => token && !["a", "an", "the"].includes(token))
    .join(" ");
}

function arpabetToIpa(value: string): string {
  const parts = value.split(/\s+/).filter(Boolean);
  return parts
    .map((part) => {
      const key = part.replace(/[012]/g, "");
      if (part.startsWith("#")) {
        return "";
      }
      return ARPABET_TO_IPA[key] ?? "";
    })
    .join("");
}

function tokenToIpa(token: string): string | null {
  const cleaned = token.toLowerCase().replace(/[^a-z'-]/g, "");
  if (!cleaned) {
    return null;
  }

  if (MANUAL_IPA[cleaned]) {
    return MANUAL_IPA[cleaned];
  }

  if (cleaned.includes("-")) {
    const parts = cleaned.split("-").map((part) => tokenToIpa(part)).filter(Boolean) as string[];
    return parts.length > 0 ? parts.join(" ") : null;
  }

  const direct = cmuDictionary[cleaned];
  if (direct) {
    return arpabetToIpa(direct);
  }

  if (cleaned.endsWith("s")) {
    const singular = cmuDictionary[cleaned.slice(0, -1)];
    if (singular) {
      return `${arpabetToIpa(singular)}z`;
    }
  }

  return null;
}

export function textToIpa(text: string): string {
  const tokens = text.split(/\s+/).filter(Boolean);
  const converted = tokens.map((token) => tokenToIpa(token)).filter(Boolean) as string[];
  if (converted.length !== tokens.length) {
    return "/ə/";
  }
  return `/${converted.join(" ")}/`;
}

function buildPatternEntry(topic: string, itemDef: TopicItem, patternDef: PatternDef): OfflineChunkEntry {
  const phrase = `${patternDef.phraseEn} ${itemDef.phraseEn}`;
  return {
    phrase,
    base_word: itemDef.wordEn,
    ipa: textToIpa(phrase),
    pos: patternDef.pos,
    type: patternDef.type,
    topic,
    subcategory: itemDef.subcategory,
    level: itemDef.level,
    meaning_vi: `${patternDef.phraseVi} ${itemDef.phraseVi}`,
    example_en: `${patternDef.exampleLeadEn} ${phrase}.`,
    example_vi: `${patternDef.exampleLeadVi} ${patternDef.phraseVi} ${itemDef.phraseVi}.`,
    explanation_vi: `${patternDef.explanationLeadVi} ${itemDef.phraseVi} trong giao tiếp hằng ngày.`,
  };
}

function buildSingleWordEntry(topic: string, itemDef: TopicItem): OfflineChunkEntry {
  return {
    phrase: itemDef.wordEn,
    base_word: itemDef.wordEn,
    ipa: textToIpa(itemDef.wordEn),
    pos: "noun",
    type: "single vocabulary word",
    topic,
    subcategory: itemDef.subcategory,
    level: itemDef.level,
    meaning_vi: itemDef.wordVi,
    example_en: `This ${itemDef.wordEn} matters in ${itemDef.phraseEn}.`,
    example_vi: `${itemDef.wordVi} rất quan trọng trong ${itemDef.phraseVi}.`,
    explanation_vi: `Từ này thường xuất hiện khi nói về ${itemDef.phraseVi}.`,
  };
}

function buildTopicPool(config: TopicConfig): OfflineChunkEntry[] {
  const entries: OfflineChunkEntry[] = [];
  for (const itemDef of config.items) {
    entries.push(buildSingleWordEntry(config.topic, itemDef));
  }

  for (const patternDef of config.patterns) {
    for (const itemDef of config.items) {
      entries.push(buildPatternEntry(config.topic, itemDef, patternDef));
    }
  }

  return entries;
}

export function generateOfflineEntriesForTopic(topic: string, neededCount: number, existingKeys: Set<string>, existingTopicKeys: Set<string>): OfflineChunkEntry[] {
  const config = TOPIC_CONFIGS.find((entry) => entry.topic === topic);
  if (!config) {
    throw new Error(`No offline topic config found for ${topic}`);
  }

  const output: OfflineChunkEntry[] = [];
  const localKeys = new Set<string>();

  for (const entry of buildTopicPool(config)) {
    const canonicalKey = canonicalizePhrase(entry.phrase);
    if (!canonicalKey || existingKeys.has(canonicalKey) || existingTopicKeys.has(canonicalKey) || localKeys.has(canonicalKey)) {
      continue;
    }

    output.push(entry);
    localKeys.add(canonicalKey);
    if (output.length >= neededCount) {
      break;
    }
  }

  return output;
}
