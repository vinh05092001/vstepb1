import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { textToIpa } from "./vocab-offline-generator";

interface ChunkEntry {
  id: number;
  phrase: string;
  base_word: string;
  ipa: string;
  pos: string;
  type: string;
  topic: string;
  subcategory: string;
  level: string;
  meaning_vi: string;
  example_en: string;
  example_vi: string;
  explanation_vi: string;
}

interface SeedItem {
  phrase: string;
  meaningVi: string;
  type?: string;
  pos?: string;
}

interface SeedGroup {
  topic: string;
  baseWord: string;
  subcategory: string;
  level: string;
  pos?: string;
  type?: string;
  exampleLeadEn: string;
  exampleLeadVi: string;
  explanationVi: string;
  items: SeedItem[];
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DATASET_PATH = path.join(ROOT_DIR, "src", "data", "grammar-chunks.ts");
const BACKUP_DIR = path.join(ROOT_DIR, "meta", "backups");

function ensureBackupDir(): void {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function backupFile(): string {
  ensureBackupDir();
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = path.join(BACKUP_DIR, `grammar-chunks.before-clean.${stamp}.ts`);
  fs.copyFileSync(DATASET_PATH, backupPath);
  return backupPath;
}

function findMatchingBracket(source: string, startIndex: number): number {
  let depth = 0;
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (char === "\\") {
        escaped = true;
        continue;
      }
      if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "[") {
      depth += 1;
      continue;
    }
    if (char === "]") {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }
  }

  throw new Error("Unable to parse array from grammar-chunks.ts");
}

function extractNamedArray(source: string, constantName: string): string {
  const declarationIndex = source.indexOf(`export const ${constantName}`);
  if (declarationIndex === -1) {
    throw new Error(`Could not locate ${constantName} in dataset file.`);
  }
  const equalsIndex = source.indexOf("=", declarationIndex);
  const arrayStart = source.indexOf("[", equalsIndex);
  const arrayEnd = findMatchingBracket(source, arrayStart);
  return source.slice(arrayStart, arrayEnd + 1);
}

function loadDataset(): { vocab: ChunkEntry[]; grammar: unknown[] } {
  const source = fs.readFileSync(DATASET_PATH, "utf8");
  return {
    vocab: JSON.parse(extractNamedArray(source, "VOCAB_CHUNKS")) as ChunkEntry[],
    grammar: JSON.parse(extractNamedArray(source, "GRAMMAR_PATTERNS")) as unknown[],
  };
}

function saveDataset(vocab: ChunkEntry[], grammar: unknown[]): void {
  const output = `export const VOCAB_CHUNKS = ${JSON.stringify(vocab, null, 2)};\n\nexport const GRAMMAR_PATTERNS = ${JSON.stringify(grammar, null, 2)};\n`;
  fs.writeFileSync(DATASET_PATH, output, "utf8");
}

function flattenGroups(groups: SeedGroup[]): ChunkEntry[] {
  return groups.flatMap((group) =>
    group.items.map((item) => ({
      id: 0,
      phrase: item.phrase,
      base_word: group.baseWord,
      ipa: textToIpa(item.phrase),
      pos: item.pos ?? group.pos ?? "phrase",
      type: item.type ?? group.type ?? "communication phrase",
      topic: group.topic,
      subcategory: group.subcategory,
      level: group.level,
      meaning_vi: item.meaningVi,
      example_en: `${group.exampleLeadEn} ${item.phrase}.`,
      example_vi: `${group.exampleLeadVi} ${item.meaningVi}.`,
      explanation_vi: group.explanationVi,
    }))
  );
}

const dailySeeds: SeedGroup[] = [
  {
    topic: "Daily Life",
    baseWord: "task",
    subcategory: "Routine",
    level: "A2",
    exampleLeadEn: "I need to",
    exampleLeadVi: "Tôi cần",
    explanationVi: "Cụm này dùng khi nói về việc xử lý hoặc hoàn thành những việc nhỏ trong ngày.",
    items: [
      { phrase: "finish a task", meaningVi: "hoàn thành một việc" },
      { phrase: "get a task done", meaningVi: "làm xong một việc" },
      { phrase: "check off a task", meaningVi: "đánh dấu một việc là đã xong", type: "phrasal verb", pos: "verb" },
      { phrase: "work on a task", meaningVi: "làm một việc" },
      { phrase: "stay on task", meaningVi: "giữ tập trung vào việc đang làm" },
      { phrase: "take care of a task", meaningVi: "xử lý một việc" },
      { phrase: "cross a task off your list", meaningVi: "gạch một việc khỏi danh sách", type: "phrasal verb", pos: "verb" },
      { phrase: "run through the task list", meaningVi: "xem lại danh sách việc cần làm", type: "phrasal verb", pos: "verb" },
      { phrase: "put off a task", meaningVi: "hoãn một việc", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "routine",
    subcategory: "Routine",
    level: "A1",
    exampleLeadEn: "On busy mornings, I usually",
    exampleLeadVi: "Vào những buổi sáng bận rộn, tôi thường",
    explanationVi: "Những cụm này phù hợp khi nói về thói quen buổi sáng và nhịp sinh hoạt hằng ngày.",
    items: [
      { phrase: "get ready for the day", meaningVi: "chuẩn bị cho một ngày mới" },
      { phrase: "stick to a morning routine", meaningVi: "giữ đúng thói quen buổi sáng" },
      { phrase: "wake up on time", meaningVi: "thức dậy đúng giờ" },
      { phrase: "get dressed quickly", meaningVi: "mặc đồ nhanh" },
      { phrase: "set an alarm", meaningVi: "đặt báo thức" },
      { phrase: "leave the house early", meaningVi: "ra khỏi nhà sớm" },
      { phrase: "rush through the routine", meaningVi: "làm mọi thứ thật vội" },
      { phrase: "head out in a hurry", meaningVi: "đi ra ngoài trong lúc vội", type: "phrasal verb", pos: "verb" },
      { phrase: "slow down in the morning", meaningVi: "chậm lại vào buổi sáng" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "errand",
    subcategory: "Errands",
    level: "B1",
    exampleLeadEn: "On Saturdays, I usually",
    exampleLeadVi: "Vào thứ Bảy, tôi thường",
    explanationVi: "Cụm này rất hữu ích khi nói về việc đi làm những việc nhỏ như mua đồ, gửi đồ hoặc thanh toán.",
    items: [
      { phrase: "run errands", meaningVi: "chạy việc vặt" },
      { phrase: "pick up a few things", meaningVi: "mua vài thứ", type: "phrasal verb", pos: "verb" },
      { phrase: "drop something off", meaningVi: "mang thứ gì đó đến gửi", type: "phrasal verb", pos: "verb" },
      { phrase: "stop by the bank", meaningVi: "ghé qua ngân hàng", type: "phrasal verb", pos: "verb" },
      { phrase: "go out for supplies", meaningVi: "đi mua đồ cần thiết" },
      { phrase: "pick up groceries on the way home", meaningVi: "ghé mua đồ ăn trên đường về", type: "phrasal verb", pos: "verb" },
      { phrase: "get a few things done", meaningVi: "làm xong vài việc" },
      { phrase: "swing by the post office", meaningVi: "ghé qua bưu điện", type: "phrasal verb", pos: "verb" },
      { phrase: "cross errands off the list", meaningVi: "gạch từng việc vặt khỏi danh sách", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "list",
    subcategory: "Planning",
    level: "A2",
    exampleLeadEn: "Before I start work, I",
    exampleLeadVi: "Trước khi bắt đầu làm việc, tôi",
    explanationVi: "Những cụm này được dùng khi nói về việc ghi lại, kiểm tra hoặc cập nhật danh sách việc cần làm.",
    items: [
      { phrase: "make a to-do list", meaningVi: "lập danh sách việc cần làm" },
      { phrase: "check the list again", meaningVi: "kiểm tra lại danh sách" },
      { phrase: "cross something off the list", meaningVi: "gạch một việc khỏi danh sách", type: "phrasal verb", pos: "verb" },
      { phrase: "keep the list handy", meaningVi: "để danh sách ở chỗ dễ lấy" },
      { phrase: "look over the list", meaningVi: "xem lại danh sách", type: "phrasal verb", pos: "verb" },
      { phrase: "add something to the list", meaningVi: "thêm một việc vào danh sách" },
      { phrase: "write the list down", meaningVi: "ghi danh sách ra", type: "phrasal verb", pos: "verb" },
      { phrase: "work through the list", meaningVi: "làm lần lượt từng việc trong danh sách" },
      { phrase: "update the list", meaningVi: "cập nhật danh sách" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "timetable",
    subcategory: "Transport",
    level: "A2",
    exampleLeadEn: "When I take the bus, I usually",
    exampleLeadVi: "Khi đi xe buýt, tôi thường",
    explanationVi: "Cụm này phù hợp khi nói về việc xem giờ xe buýt, đón xe hoặc hỏi thông tin di chuyển.",
    items: [
      { phrase: "check the bus timetable", meaningVi: "kiểm tra lịch xe buýt" },
      { phrase: "catch the early bus", meaningVi: "đón chuyến xe buýt sớm" },
      { phrase: "wait at the bus stop", meaningVi: "đợi ở trạm xe buýt" },
      { phrase: "get on the bus", meaningVi: "lên xe buýt", type: "phrasal verb", pos: "verb" },
      { phrase: "get off the bus", meaningVi: "xuống xe buýt", type: "phrasal verb", pos: "verb" },
      { phrase: "top up the bus card", meaningVi: "nạp thêm tiền vào thẻ xe buýt", type: "phrasal verb", pos: "verb" },
      { phrase: "change buses downtown", meaningVi: "đổi xe ở trung tâm" },
      { phrase: "ask when the next bus leaves", meaningVi: "hỏi khi nào chuyến xe tiếp theo rời bến" },
      { phrase: "miss the bus stop", meaningVi: "đi quá trạm cần xuống" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "lunch",
    subcategory: "Meals",
    level: "A1",
    exampleLeadEn: "On busy days, I usually",
    exampleLeadVi: "Vào những ngày bận rộn, tôi thường",
    explanationVi: "Những cụm này hữu ích khi nói về bữa trưa, giờ nghỉ trưa hoặc việc ăn uống giữa ngày.",
    items: [
      { phrase: "grab lunch", meaningVi: "ăn trưa nhanh" },
      { phrase: "pack lunch", meaningVi: "chuẩn bị cơm trưa mang theo" },
      { phrase: "eat out for lunch", meaningVi: "ra ngoài ăn trưa" },
      { phrase: "meet for lunch", meaningVi: "hẹn gặp để ăn trưa" },
      { phrase: "skip lunch", meaningVi: "bỏ bữa trưa" },
      { phrase: "take lunch to work", meaningVi: "mang bữa trưa đến chỗ làm" },
      { phrase: "order lunch", meaningVi: "gọi bữa trưa" },
      { phrase: "squeeze in lunch", meaningVi: "tranh thủ ăn trưa" },
      { phrase: "eat lunch at your desk", meaningVi: "ăn trưa tại bàn làm việc" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "chore",
    subcategory: "Home",
    level: "A2",
    exampleLeadEn: "Before dinner, I usually",
    exampleLeadVi: "Trước bữa tối, tôi thường",
    explanationVi: "Cụm này phù hợp khi nói về những việc nhà quen thuộc như dọn dẹp, rửa chén hoặc cất đồ.",
    items: [
      { phrase: "do the dishes", meaningVi: "rửa bát" },
      { phrase: "take out the trash", meaningVi: "mang rác ra ngoài", type: "phrasal verb", pos: "verb" },
      { phrase: "sweep the floor", meaningVi: "quét sàn" },
      { phrase: "mop the kitchen floor", meaningVi: "lau sàn bếp" },
      { phrase: "wipe the table", meaningVi: "lau bàn" },
      { phrase: "clean up after dinner", meaningVi: "dọn dẹp sau bữa tối", type: "phrasal verb", pos: "verb" },
      { phrase: "fold the clothes", meaningVi: "gấp quần áo" },
      { phrase: "put things away", meaningVi: "cất đồ vào chỗ", type: "phrasal verb", pos: "verb" },
      { phrase: "tidy up after yourself", meaningVi: "tự dọn phần của mình", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "break",
    subcategory: "Breaks",
    level: "A1",
    exampleLeadEn: "Around mid-morning, I usually",
    exampleLeadVi: "Vào giữa buổi sáng, tôi thường",
    explanationVi: "Những cụm này dùng khi nói về việc nghỉ ngắn, uống cà phê hoặc tạm rời bàn làm việc.",
    items: [
      { phrase: "take a coffee break", meaningVi: "nghỉ uống cà phê" },
      { phrase: "grab a quick coffee", meaningVi: "lấy một cốc cà phê nhanh" },
      { phrase: "head out for coffee", meaningVi: "ra ngoài uống cà phê", type: "phrasal verb", pos: "verb" },
      { phrase: "get back from a break", meaningVi: "quay lại sau giờ nghỉ", type: "phrasal verb", pos: "verb" },
      { phrase: "catch up over coffee", meaningVi: "trò chuyện cập nhật với nhau bên cà phê", type: "phrasal verb", pos: "verb" },
      { phrase: "step away for a coffee", meaningVi: "rời bàn một lúc để đi uống cà phê" },
      { phrase: "take a short break", meaningVi: "nghỉ ngắn" },
      { phrase: "grab a coffee to go", meaningVi: "mua cà phê mang đi" },
      { phrase: "take five minutes off", meaningVi: "nghỉ năm phút" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "bill",
    subcategory: "Money",
    level: "B1",
    exampleLeadEn: "At the end of the month, I need to",
    exampleLeadVi: "Vào cuối tháng, tôi cần",
    explanationVi: "Cụm này dùng khi nói về việc thanh toán, kiểm tra hoặc xoay xở với các hóa đơn định kỳ.",
    items: [
      { phrase: "pay the bills", meaningVi: "thanh toán các hóa đơn" },
      { phrase: "split the bills", meaningVi: "chia tiền hóa đơn" },
      { phrase: "check the due date", meaningVi: "kiểm tra ngày đến hạn" },
      { phrase: "set money aside for bills", meaningVi: "để riêng tiền trả hóa đơn" },
      { phrase: "go over the bills", meaningVi: "xem lại các hóa đơn", type: "phrasal verb", pos: "verb" },
      { phrase: "cover the bills", meaningVi: "lo đủ tiền trả hóa đơn" },
      { phrase: "fall behind on the bills", meaningVi: "bị chậm thanh toán hóa đơn", type: "phrasal verb", pos: "verb" },
      { phrase: "pay a bill online", meaningVi: "trả hóa đơn trực tuyến" },
      { phrase: "keep up with the bills", meaningVi: "theo kịp việc trả hóa đơn", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "free time",
    subcategory: "Lifestyle",
    level: "A1",
    exampleLeadEn: "After work, I like to",
    exampleLeadVi: "Sau giờ làm, tôi thích",
    explanationVi: "Cụm này phù hợp khi nói về việc thư giãn, tận hưởng thời gian rảnh hoặc ở một mình để nghỉ ngơi.",
    items: [
      { phrase: "enjoy some free time", meaningVi: "tận hưởng thời gian rảnh" },
      { phrase: "make the most of your free time", meaningVi: "tận dụng tốt thời gian rảnh" },
      { phrase: "relax after work", meaningVi: "thư giãn sau giờ làm" },
      { phrase: "take it easy for a while", meaningVi: "thư thả một lúc" },
      { phrase: "have time for yourself", meaningVi: "có thời gian cho bản thân" },
      { phrase: "wind down at home", meaningVi: "thư giãn ở nhà", type: "phrasal verb", pos: "verb" },
      { phrase: "spend some time alone", meaningVi: "dành chút thời gian một mình" },
      { phrase: "unwind for a bit", meaningVi: "xả stress một lúc" },
      { phrase: "fill your free time with hobbies", meaningVi: "lấp thời gian rảnh bằng sở thích" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "call",
    subcategory: "Family",
    level: "A2",
    exampleLeadEn: "In the evening, I usually",
    exampleLeadVi: "Vào buổi tối, tôi thường",
    explanationVi: "Những cụm này được dùng khi nói về việc gọi điện, nhắn lại hoặc giữ liên lạc với gia đình.",
    items: [
      { phrase: "call home", meaningVi: "gọi điện về nhà" },
      { phrase: "ring your parents", meaningVi: "gọi cho bố mẹ" },
      { phrase: "leave a message at home", meaningVi: "để lại lời nhắn ở nhà" },
      { phrase: "check in with your family", meaningVi: "liên lạc hỏi thăm gia đình", type: "phrasal verb", pos: "verb" },
      { phrase: "return a call home", meaningVi: "gọi lại về nhà" },
      { phrase: "make a quick call home", meaningVi: "gọi nhanh về nhà" },
      { phrase: "stay on the phone with family", meaningVi: "nói chuyện điện thoại với gia đình" },
      { phrase: "catch up with your family by phone", meaningVi: "gọi điện để hỏi thăm và cập nhật với gia đình", type: "phrasal verb", pos: "verb" },
      { phrase: "hear from home", meaningVi: "nhận tin từ nhà", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "laundry",
    subcategory: "Home",
    level: "A2",
    exampleLeadEn: "At the weekend, I usually",
    exampleLeadVi: "Cuối tuần, tôi thường",
    explanationVi: "Cụm này phù hợp khi nói về việc giặt giũ, phơi đồ hoặc cất quần áo sạch.",
    items: [
      { phrase: "do the laundry", meaningVi: "giặt đồ" },
      { phrase: "load the washing machine", meaningVi: "cho quần áo vào máy giặt" },
      { phrase: "hang up the clothes", meaningVi: "treo quần áo lên", type: "phrasal verb", pos: "verb" },
      { phrase: "fold the laundry", meaningVi: "gấp quần áo đã giặt" },
      { phrase: "run a wash cycle", meaningVi: "chạy một chu trình giặt" },
      { phrase: "wait for the laundry to dry", meaningVi: "đợi quần áo khô" },
      { phrase: "separate the whites", meaningVi: "tách riêng đồ trắng" },
      { phrase: "sort the laundry", meaningVi: "phân loại quần áo cần giặt" },
      { phrase: "put the clean clothes away", meaningVi: "cất quần áo sạch vào chỗ", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "appointment",
    subcategory: "Health",
    level: "B1",
    exampleLeadEn: "When I need medical advice, I usually",
    exampleLeadVi: "Khi cần tư vấn y tế, tôi thường",
    explanationVi: "Những cụm này được dùng khi nói về việc đặt lịch, đổi lịch hoặc liên hệ với phòng khám.",
    items: [
      { phrase: "make a doctor's appointment", meaningVi: "đặt lịch hẹn bác sĩ" },
      { phrase: "book an appointment", meaningVi: "đặt một cuộc hẹn" },
      { phrase: "reschedule the appointment", meaningVi: "đổi lịch hẹn" },
      { phrase: "cancel an appointment", meaningVi: "hủy lịch hẹn" },
      { phrase: "show up on time for the appointment", meaningVi: "đến đúng giờ cho cuộc hẹn", type: "phrasal verb", pos: "verb" },
      { phrase: "check in at the clinic", meaningVi: "làm thủ tục ở phòng khám", type: "phrasal verb", pos: "verb" },
      { phrase: "wait for the doctor", meaningVi: "đợi bác sĩ" },
      { phrase: "ask for an earlier appointment", meaningVi: "xin lịch hẹn sớm hơn" },
      { phrase: "call the clinic back", meaningVi: "gọi lại cho phòng khám", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "groceries",
    subcategory: "Shopping",
    level: "A2",
    exampleLeadEn: "Before shopping, I usually",
    exampleLeadVi: "Trước khi đi mua đồ, tôi thường",
    explanationVi: "Cụm này phù hợp khi nói về việc ghi chú đồ cần mua và đi chợ theo kế hoạch.",
    items: [
      { phrase: "write a grocery list", meaningVi: "viết danh sách đồ cần mua" },
      { phrase: "add milk to the grocery list", meaningVi: "thêm sữa vào danh sách đi chợ" },
      { phrase: "shop from a list", meaningVi: "mua đồ theo danh sách" },
      { phrase: "stick to the grocery list", meaningVi: "bám sát danh sách đồ cần mua" },
      { phrase: "see what's on the list", meaningVi: "xem trong danh sách có gì" },
      { phrase: "write down what you need", meaningVi: "ghi ra những thứ cần mua", type: "phrasal verb", pos: "verb" },
      { phrase: "forget the grocery list", meaningVi: "quên danh sách đi chợ" },
      { phrase: "pick up what's on the list", meaningVi: "mua những gì có trong danh sách", type: "phrasal verb", pos: "verb" },
      { phrase: "plan the week's groceries", meaningVi: "lên kế hoạch đồ ăn cho cả tuần" },
    ],
  },
  {
    topic: "Daily Life",
    baseWord: "evening",
    subcategory: "Routine",
    level: "A1",
    exampleLeadEn: "For tonight, I might",
    exampleLeadVi: "Tối nay, tôi có thể",
    explanationVi: "Những cụm này dùng khi nói về việc sắp xếp thời gian buổi tối hoặc thay đổi kế hoạch sau giờ làm.",
    items: [
      { phrase: "make plans for the evening", meaningVi: "lên kế hoạch cho buổi tối" },
      { phrase: "spend the evening at home", meaningVi: "dành buổi tối ở nhà" },
      { phrase: "keep the evening free", meaningVi: "để buổi tối trống" },
      { phrase: "change your evening plans", meaningVi: "thay đổi kế hoạch buổi tối" },
      { phrase: "have a quiet evening", meaningVi: "có một buổi tối yên tĩnh" },
      { phrase: "go out after work", meaningVi: "ra ngoài sau giờ làm" },
      { phrase: "head home early", meaningVi: "về nhà sớm", type: "phrasal verb", pos: "verb" },
      { phrase: "settle on evening plans", meaningVi: "chốt kế hoạch buổi tối" },
      { phrase: "make dinner plans", meaningVi: "lên kế hoạch bữa tối" },
    ],
  },
];

const homeSeeds: SeedGroup[] = [
  {
    topic: "Home & Household",
    baseWord: "counter",
    subcategory: "Kitchen",
    level: "A2",
    exampleLeadEn: "Before dinner, I usually",
    exampleLeadVi: "Trước bữa tối, tôi thường",
    explanationVi: "Cụm này hữu ích khi nói về việc dọn, lau hoặc sắp xếp khu vực bếp.",
    items: [
      { phrase: "wipe down the kitchen counter", meaningVi: "lau sạch quầy bếp" },
      { phrase: "clear off the kitchen counter", meaningVi: "dọn hết đồ trên quầy bếp", type: "phrasal verb", pos: "verb" },
      { phrase: "keep the kitchen counter tidy", meaningVi: "giữ quầy bếp gọn gàng" },
      { phrase: "put the groceries on the counter", meaningVi: "đặt đồ ăn lên quầy bếp", type: "phrasal verb", pos: "verb" },
      { phrase: "set the plates on the counter", meaningVi: "đặt đĩa lên quầy bếp" },
      { phrase: "move the toaster off the counter", meaningVi: "dời máy nướng bánh ra khỏi quầy" },
      { phrase: "clean up the counter", meaningVi: "dọn gọn quầy bếp", type: "phrasal verb", pos: "verb" },
      { phrase: "dry the kitchen counter", meaningVi: "lau khô quầy bếp" },
      { phrase: "leave the keys on the counter", meaningVi: "để chìa khóa trên quầy" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "living room",
    subcategory: "Rooms",
    level: "A1",
    exampleLeadEn: "At home, we often",
    exampleLeadVi: "Ở nhà, chúng tôi thường",
    explanationVi: "Những cụm này phù hợp khi nói về việc sinh hoạt, nghỉ ngơi hoặc dọn dẹp phòng khách.",
    items: [
      { phrase: "tidy up the living room", meaningVi: "dọn gọn phòng khách", type: "phrasal verb", pos: "verb" },
      { phrase: "sit in the living room", meaningVi: "ngồi trong phòng khách" },
      { phrase: "vacuum the living room", meaningVi: "hút bụi phòng khách" },
      { phrase: "turn on the living room lights", meaningVi: "bật đèn phòng khách", type: "phrasal verb", pos: "verb" },
      { phrase: "relax in the living room", meaningVi: "thư giãn trong phòng khách" },
      { phrase: "straighten up the living room", meaningVi: "sắp xếp lại phòng khách", type: "phrasal verb", pos: "verb" },
      { phrase: "move the chairs in the living room", meaningVi: "di chuyển ghế trong phòng khách" },
      { phrase: "keep the living room neat", meaningVi: "giữ phòng khách ngăn nắp" },
      { phrase: "clean up the living room", meaningVi: "dọn phòng khách", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "closet",
    subcategory: "Storage",
    level: "A2",
    exampleLeadEn: "When I clean my room, I",
    exampleLeadVi: "Khi dọn phòng, tôi",
    explanationVi: "Cụm này dùng khi nói về việc cất quần áo, sắp xếp tủ hoặc lấy đồ trong tủ.",
    items: [
      { phrase: "hang clothes in the closet", meaningVi: "treo quần áo vào tủ" },
      { phrase: "put the clothes back in the closet", meaningVi: "cất quần áo lại vào tủ", type: "phrasal verb", pos: "verb" },
      { phrase: "clean out the closet", meaningVi: "dọn sạch tủ quần áo", type: "phrasal verb", pos: "verb" },
      { phrase: "sort the clothes in the closet", meaningVi: "phân loại quần áo trong tủ" },
      { phrase: "make room in the closet", meaningVi: "tạo chỗ trống trong tủ" },
      { phrase: "take a coat out of the closet", meaningVi: "lấy áo khoác ra khỏi tủ", type: "phrasal verb", pos: "verb" },
      { phrase: "keep the closet tidy", meaningVi: "giữ tủ quần áo gọn gàng" },
      { phrase: "stack sweaters in the closet", meaningVi: "xếp áo len trong tủ" },
      { phrase: "open the closet door", meaningVi: "mở cửa tủ quần áo" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "sink",
    subcategory: "Bathroom",
    level: "A2",
    exampleLeadEn: "After using the bathroom, please",
    exampleLeadVi: "Sau khi dùng phòng tắm, hãy",
    explanationVi: "Những cụm này phù hợp khi nói về việc dùng bồn rửa, lau chùi hoặc giữ khu vực này sạch sẽ.",
    items: [
      { phrase: "clean the bathroom sink", meaningVi: "lau bồn rửa trong phòng tắm" },
      { phrase: "wash your hands at the sink", meaningVi: "rửa tay ở bồn rửa" },
      { phrase: "wipe around the sink", meaningVi: "lau quanh bồn rửa" },
      { phrase: "rinse the sink", meaningVi: "xả sạch bồn rửa" },
      { phrase: "leave the soap by the sink", meaningVi: "để xà phòng cạnh bồn rửa" },
      { phrase: "unclog the sink", meaningVi: "thông bồn rửa" },
      { phrase: "dry the sink area", meaningVi: "lau khô khu vực bồn rửa" },
      { phrase: "turn on the tap", meaningVi: "mở vòi nước", type: "phrasal verb", pos: "verb" },
      { phrase: "clean up around the sink", meaningVi: "dọn quanh bồn rửa", type: "phrasal verb", pos: "verb" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "door",
    subcategory: "Safety",
    level: "A1",
    exampleLeadEn: "Before I leave, I always",
    exampleLeadVi: "Trước khi ra ngoài, tôi luôn",
    explanationVi: "Cụm này rất hữu ích khi nói về việc mở, đóng hoặc kiểm tra cửa ra vào.",
    items: [
      { phrase: "lock the front door", meaningVi: "khóa cửa trước" },
      { phrase: "answer the front door", meaningVi: "ra mở cửa cho khách" },
      { phrase: "close the front door", meaningVi: "đóng cửa trước" },
      { phrase: "open the front door", meaningVi: "mở cửa trước" },
      { phrase: "check the front door", meaningVi: "kiểm tra cửa trước" },
      { phrase: "hear a knock at the front door", meaningVi: "nghe tiếng gõ cửa trước" },
      { phrase: "leave your shoes by the front door", meaningVi: "để giày cạnh cửa trước" },
      { phrase: "wait at the front door", meaningVi: "đợi ở cửa trước" },
      { phrase: "keep the front door closed", meaningVi: "giữ cửa trước đóng" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "key",
    subcategory: "Safety",
    level: "A1",
    exampleLeadEn: "Before I go out, I have to",
    exampleLeadVi: "Trước khi ra ngoài, tôi phải",
    explanationVi: "Những cụm này dùng khi nói về việc cầm, cất hoặc tìm chìa khóa nhà.",
    items: [
      { phrase: "grab the house key", meaningVi: "cầm chìa khóa nhà" },
      { phrase: "forget the house key", meaningVi: "quên chìa khóa nhà" },
      { phrase: "put the house key away", meaningVi: "cất chìa khóa nhà đi", type: "phrasal verb", pos: "verb" },
      { phrase: "keep a spare house key", meaningVi: "giữ một chìa khóa nhà dự phòng" },
      { phrase: "hand over the house key", meaningVi: "giao chìa khóa nhà", type: "phrasal verb", pos: "verb" },
      { phrase: "find the house key", meaningVi: "tìm chìa khóa nhà" },
      { phrase: "bring the house key with you", meaningVi: "mang chìa khóa nhà theo" },
      { phrase: "leave the house key on the table", meaningVi: "để chìa khóa nhà trên bàn" },
      { phrase: "lose the house key", meaningVi: "làm mất chìa khóa nhà" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "washing machine",
    subcategory: "Appliances",
    level: "A2",
    exampleLeadEn: "On laundry day, I usually",
    exampleLeadVi: "Vào ngày giặt đồ, tôi thường",
    explanationVi: "Cụm này hữu ích khi nói về việc dùng máy giặt, kiểm tra máy hoặc chờ máy chạy xong.",
    items: [
      { phrase: "load the washing machine", meaningVi: "cho đồ vào máy giặt" },
      { phrase: "unload the washing machine", meaningVi: "lấy đồ ra khỏi máy giặt" },
      { phrase: "run the washing machine", meaningVi: "cho máy giặt chạy" },
      { phrase: "turn off the washing machine", meaningVi: "tắt máy giặt", type: "phrasal verb", pos: "verb" },
      { phrase: "clean the washing machine filter", meaningVi: "làm sạch bộ lọc máy giặt" },
      { phrase: "wait for the washing machine to finish", meaningVi: "đợi máy giặt chạy xong" },
      { phrase: "check the washing machine door", meaningVi: "kiểm tra cửa máy giặt" },
      { phrase: "leave the washing machine open", meaningVi: "để máy giặt mở" },
      { phrase: "start the washing machine", meaningVi: "khởi động máy giặt" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "table",
    subcategory: "Dining",
    level: "A1",
    exampleLeadEn: "Before dinner, we",
    exampleLeadVi: "Trước bữa tối, chúng tôi",
    explanationVi: "Những cụm này phù hợp khi nói về việc bày biện, dọn dẹp hoặc ngồi quanh bàn ăn.",
    items: [
      { phrase: "set the dining table", meaningVi: "bày bàn ăn" },
      { phrase: "clear the dining table", meaningVi: "dọn bàn ăn" },
      { phrase: "wipe the dining table", meaningVi: "lau bàn ăn" },
      { phrase: "sit at the dining table", meaningVi: "ngồi ở bàn ăn" },
      { phrase: "lay the plates on the table", meaningVi: "đặt đĩa lên bàn" },
      { phrase: "gather around the dining table", meaningVi: "quây quần quanh bàn ăn" },
      { phrase: "keep the dining table clean", meaningVi: "giữ bàn ăn sạch sẽ" },
      { phrase: "move the chairs around the table", meaningVi: "di chuyển ghế quanh bàn" },
      { phrase: "leave your bag on the dining table", meaningVi: "để túi của bạn trên bàn ăn" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "guest room",
    subcategory: "Rooms",
    level: "B1",
    exampleLeadEn: "When family visit, we usually",
    exampleLeadVi: "Khi người thân đến chơi, chúng tôi thường",
    explanationVi: "Cụm này dùng khi nói về việc chuẩn bị, dọn dẹp hoặc sắp xếp phòng dành cho khách.",
    items: [
      { phrase: "get the guest room ready", meaningVi: "chuẩn bị phòng khách cho sẵn" },
      { phrase: "clean the guest room", meaningVi: "dọn phòng khách dành cho khách" },
      { phrase: "put clean sheets in the guest room", meaningVi: "thay ga sạch trong phòng khách" },
      { phrase: "show someone to the guest room", meaningVi: "đưa ai đó vào phòng dành cho khách" },
      { phrase: "keep the guest room tidy", meaningVi: "giữ phòng dành cho khách gọn gàng" },
      { phrase: "open the window in the guest room", meaningVi: "mở cửa sổ trong phòng khách" },
      { phrase: "leave a towel in the guest room", meaningVi: "để khăn trong phòng khách" },
      { phrase: "sleep in the guest room", meaningVi: "ngủ ở phòng dành cho khách" },
      { phrase: "stay in the guest room", meaningVi: "ở trong phòng dành cho khách" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "bill",
    subcategory: "Bills",
    level: "A2",
    exampleLeadEn: "At the end of the month, I need to",
    exampleLeadVi: "Cuối tháng, tôi cần",
    explanationVi: "Những cụm này phù hợp khi nói về việc xem, thanh toán hoặc hỏi lại hóa đơn tiền nước.",
    items: [
      { phrase: "pay the water bill", meaningVi: "trả hóa đơn tiền nước" },
      { phrase: "check the water bill", meaningVi: "kiểm tra hóa đơn tiền nước" },
      { phrase: "split the water bill", meaningVi: "chia tiền hóa đơn nước" },
      { phrase: "look over the water bill", meaningVi: "xem lại hóa đơn tiền nước", type: "phrasal verb", pos: "verb" },
      { phrase: "ask about the water bill", meaningVi: "hỏi về hóa đơn tiền nước" },
      { phrase: "set money aside for the water bill", meaningVi: "để riêng tiền trả hóa đơn nước" },
      { phrase: "download the water bill", meaningVi: "tải hóa đơn tiền nước xuống" },
      { phrase: "be late with the water bill", meaningVi: "trả chậm hóa đơn tiền nước" },
      { phrase: "deal with the water bill online", meaningVi: "xử lý hóa đơn tiền nước trực tuyến" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "window",
    subcategory: "Cleaning",
    level: "A2",
    exampleLeadEn: "When the room feels stuffy, I",
    exampleLeadVi: "Khi căn phòng bí bách, tôi",
    explanationVi: "Cụm này hữu ích khi nói về việc mở, lau hoặc đóng cửa sổ trong nhà.",
    items: [
      { phrase: "clean the windows", meaningVi: "lau cửa sổ" },
      { phrase: "wipe the windows", meaningVi: "lau các ô kính" },
      { phrase: "open the windows", meaningVi: "mở cửa sổ" },
      { phrase: "close the windows", meaningVi: "đóng cửa sổ" },
      { phrase: "look out the window", meaningVi: "nhìn ra ngoài cửa sổ", type: "phrasal verb", pos: "verb" },
      { phrase: "leave the window open", meaningVi: "để cửa sổ mở" },
      { phrase: "dry the window glass", meaningVi: "lau khô mặt kính cửa sổ" },
      { phrase: "pull the window shut", meaningVi: "kéo cửa sổ lại cho kín", type: "phrasal verb", pos: "verb" },
      { phrase: "wash the window frame", meaningVi: "rửa khung cửa sổ" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "garbage",
    subcategory: "Cleaning",
    level: "A1",
    exampleLeadEn: "After dinner, I usually",
    exampleLeadVi: "Sau bữa tối, tôi thường",
    explanationVi: "Những cụm này phù hợp khi nói về việc thay túi rác, mang rác ra ngoài hoặc dọn rác trong nhà.",
    items: [
      { phrase: "take out the garbage bag", meaningVi: "mang túi rác ra ngoài", type: "phrasal verb", pos: "verb" },
      { phrase: "tie up the garbage bag", meaningVi: "buộc kín túi rác", type: "phrasal verb", pos: "verb" },
      { phrase: "change the garbage bag", meaningVi: "thay túi rác" },
      { phrase: "put the garbage bag by the door", meaningVi: "để túi rác cạnh cửa", type: "phrasal verb", pos: "verb" },
      { phrase: "fill the garbage bag", meaningVi: "làm đầy túi rác" },
      { phrase: "carry the garbage bag outside", meaningVi: "mang túi rác ra ngoài" },
      { phrase: "throw away the garbage bag", meaningVi: "vứt túi rác đi", type: "phrasal verb", pos: "verb" },
      { phrase: "replace the garbage bag", meaningVi: "thay túi rác mới" },
      { phrase: "keep an extra garbage bag", meaningVi: "để sẵn một túi rác dự phòng" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "repair",
    subcategory: "Maintenance",
    level: "B1",
    exampleLeadEn: "When something breaks, we need to",
    exampleLeadVi: "Khi có thứ bị hỏng, chúng ta cần",
    explanationVi: "Cụm này dùng khi nói về việc đặt thợ, theo dõi hoặc hoàn tất việc sửa chữa trong nhà.",
    items: [
      { phrase: "arrange a repair job", meaningVi: "sắp xếp một việc sửa chữa" },
      { phrase: "book a repair job", meaningVi: "đặt lịch sửa chữa" },
      { phrase: "wait for the repair job", meaningVi: "đợi việc sửa chữa được thực hiện" },
      { phrase: "check on the repair job", meaningVi: "kiểm tra tiến độ sửa chữa", type: "phrasal verb", pos: "verb" },
      { phrase: "finish the repair job", meaningVi: "hoàn tất việc sửa chữa" },
      { phrase: "pay for the repair job", meaningVi: "trả tiền cho việc sửa chữa" },
      { phrase: "put off the repair job", meaningVi: "hoãn việc sửa chữa", type: "phrasal verb", pos: "verb" },
      { phrase: "handle the repair job", meaningVi: "xử lý việc sửa chữa" },
      { phrase: "talk about the repair job", meaningVi: "bàn về việc sửa chữa" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "balcony",
    subcategory: "Plants",
    level: "A2",
    exampleLeadEn: "Every morning, I",
    exampleLeadVi: "Mỗi sáng, tôi",
    explanationVi: "Những cụm này phù hợp khi nói về việc chăm cây ở ban công như tưới cây, di chuyển chậu hoặc cắt tỉa.",
    items: [
      { phrase: "water the balcony plants", meaningVi: "tưới cây ở ban công" },
      { phrase: "move the balcony plants", meaningVi: "di chuyển cây ở ban công" },
      { phrase: "trim the balcony plants", meaningVi: "cắt tỉa cây ở ban công" },
      { phrase: "check the balcony plants", meaningVi: "kiểm tra cây ở ban công" },
      { phrase: "bring the balcony plants inside", meaningVi: "mang cây ở ban công vào trong", type: "phrasal verb", pos: "verb" },
      { phrase: "leave the balcony plants outside", meaningVi: "để cây ở ban công bên ngoài" },
      { phrase: "add soil to the balcony plants", meaningVi: "thêm đất cho cây ở ban công" },
      { phrase: "line up the balcony plants", meaningVi: "xếp hàng các chậu cây ở ban công", type: "phrasal verb", pos: "verb" },
      { phrase: "keep the balcony plants alive", meaningVi: "giữ cho cây ở ban công luôn sống tốt" },
    ],
  },
  {
    topic: "Home & Household",
    baseWord: "storage",
    subcategory: "Storage",
    level: "A2",
    exampleLeadEn: "When I tidy up, I",
    exampleLeadVi: "Khi dọn nhà, tôi",
    explanationVi: "Cụm này dùng khi nói về việc đóng gói, dán nhãn hoặc cất đồ vào hộp đựng.",
    items: [
      { phrase: "open the storage box", meaningVi: "mở hộp đựng đồ" },
      { phrase: "close the storage box", meaningVi: "đóng hộp đựng đồ" },
      { phrase: "label the storage box", meaningVi: "dán nhãn hộp đựng đồ" },
      { phrase: "pack the storage box", meaningVi: "xếp đồ vào hộp đựng" },
      { phrase: "unpack the storage box", meaningVi: "lấy đồ ra khỏi hộp", type: "phrasal verb", pos: "verb" },
      { phrase: "move the storage box", meaningVi: "di chuyển hộp đựng đồ" },
      { phrase: "stack the storage box", meaningVi: "xếp chồng hộp đựng đồ" },
      { phrase: "keep old photos in the storage box", meaningVi: "cất ảnh cũ trong hộp đựng" },
      { phrase: "put winter clothes in the storage box", meaningVi: "cất quần áo mùa đông vào hộp", type: "phrasal verb", pos: "verb" },
    ],
  },
];

function buildReplacements(startId: number, groups: SeedGroup[]): ChunkEntry[] {
  return flattenGroups(groups).map((entry, index) => ({ ...entry, id: startId + index }));
}

function main(): void {
  const backupPath = backupFile();
  const { vocab, grammar } = loadDataset();

  const dailyReplacements = buildReplacements(16, dailySeeds);
  const homeReplacements = buildReplacements(166, homeSeeds);
  const replacementMap = new Map<number, ChunkEntry>([...
    dailyReplacements,
    ...homeReplacements,
  ].map((entry) => [entry.id, entry]));

  const updatedVocab = vocab.map((entry) => replacementMap.get(entry.id) ?? entry);
  saveDataset(updatedVocab, grammar);

  console.log(`Backup created: ${backupPath}`);
  console.log(`Replaced ${replacementMap.size} templated entries.`);
  console.log(`IDs: 16-150, 166-300`);
}

main();