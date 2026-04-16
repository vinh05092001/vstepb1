const fs = require("fs");
const path = require("path");

const newVocab = require("./new_vocab.json");

// 2 additional topics to make 5 total topics
const additionalVocab = [
  // FOOD
  {
    id: "eat-out-1",
    word: "eat out / dine out",
    phonetic: "",
    meaning_en: "have a meal in a restaurant",
    meaning_vi: "ăn ngoài / dùng bữa tại nhà hàng",
    example_en: "On weekends, my family usually eats out to save cooking time.",
    example_vi: "Vào cuối tuần, gia đình tôi thường ăn ngoài để tiết kiệm thời gian nấu nướng.",
    usage_vi: "Cụm động từ vô cùng phổ biến cho chủ đề Food.",
    speaking_sentence: "I prefer to eat out because I don't know how to cook.",
    topic: "food",
    category: "Habits",
    level: "Beginner"
  },
  {
    id: "home-cooked-meals-2",
    word: "home-cooked meals",
    phonetic: "",
    meaning_en: "food prepared at home",
    meaning_vi: "bữa ăn nhà làm",
    example_en: "Home-cooked meals are always healthier and cheaper than fast food.",
    example_vi: "Các bữa ăn tự nấu ở nhà luôn lành mạnh và rẻ hơn đồ ăn nhanh.",
    usage_vi: "Cụm danh từ (Adj + N), trái nghĩa với thức ăn ngoài.",
    speaking_sentence: "Ideally, I enjoy home-cooked meals prepared by my mother.",
    topic: "food",
    category: "Preferences",
    level: "Intermediate"
  },
  {
    id: "fast-food-3",
    word: "fast food / junk food",
    phonetic: "",
    meaning_en: "quickly prepared and unhealthy food",
    meaning_vi: "thức ăn nhanh / đồ ăn vặt không tốt cho sức khỏe",
    example_en: "Eating too much fast food can lead to health problems like obesity.",
    example_vi: "Ăn quá nhiều thức ăn nhanh có thể dẫn đến các vấn đề sức khỏe như béo phì.",
    usage_vi: "Từ vựng cơ bản nhưng bắt buộc phải có khi nói về nhược điểm ăn uống.",
    speaking_sentence: "I try to avoid fast food because it contains too much fat and sugar.",
    topic: "food",
    category: "Disadvantages",
    level: "Intermediate"
  },
  {
    id: "balanced-diet-4",
    word: "have a balanced diet",
    phonetic: "",
    meaning_en: "eat a healthy mixture of different kinds of food",
    meaning_vi: "có một chế độ ăn uống cân bằng",
    example_en: "It is crucial to have a balanced diet to stay energetic.",
    example_vi: "Điều rất quan trọng là phải có một chế độ ăn kiêng cân bằng để giữ năng lượng.",
    usage_vi: "Collocation: a balanced diet.",
    speaking_sentence: "To stay fit, everybody should have a balanced diet with lots of vegetables.",
    topic: "food",
    category: "Health",
    level: "Intermediate"
  },
  
  // TECHNOLOGY
  {
    id: "stay-connected-1",
    word: "stay connected with friends and family",
    phonetic: "",
    meaning_en: "keep in touch with loved ones",
    meaning_vi: "giữ liên lạc với bạn bè và gia đình",
    example_en: "Social media helps me stay connected with friends who live far away.",
    example_vi: "Mạng xã hội giúp tôi giữ liên lạc với những người bạn sống ở xa.",
    usage_vi: "Lợi ích số 1 của công nghệ và mạng xã hội.",
    speaking_sentence: "Smartphones are incredibly useful because they help me stay connected with friends.",
    topic: "technology",
    category: "Advantages",
    level: "Intermediate"
  },
  {
    id: "access-information-2",
    word: "access information easily / search for information",
    phonetic: "",
    meaning_en: "find data and knowledge without difficulty",
    meaning_vi: "dễ dàng tiếp cận thông tin / tìm kiếm thông tin",
    example_en: "With the Internet, students can access information easily for their studies.",
    example_vi: "Với Internet, học sinh có thể dễ dàng tiếp cận thông tin phục vụ học tập.",
    usage_vi: "Cấu trúc Access + N (không có 'to').",
    speaking_sentence: "Another benefit is that I can access information easily using search engines.",
    topic: "technology",
    category: "Advantages",
    level: "Intermediate"
  },
  {
    id: "addicted-to-screens-3",
    word: "be addicted to screens / smartphones",
    phonetic: "",
    meaning_en: "unable to stop looking at digital devices",
    meaning_vi: "nghiện màn hình / điện thoại thông minh",
    example_en: "Many teenagers nowadays are addicted to smartphones and neglect their studies.",
    example_vi: "Nhiều thanh thiếu niên ngày nay nghiện điện thoại thông minh và chểnh mảng việc học.",
    usage_vi: "Be addicted TO + N/V-ing.",
    speaking_sentence: "The main drawback of technology is that people can easily be addicted to screens.",
    topic: "technology",
    category: "Disadvantages",
    level: "Intermediate"
  },
  {
    id: "reduce-face-to-face-4",
    word: "reduce face-to-face communication",
    phonetic: "",
    meaning_en: "decrease in-person interactions",
    meaning_vi: "giảm giao tiếp trực tiếp",
    example_en: "Using messaging apps too much might reduce face-to-face communication.",
    example_vi: "Sử dụng ứng dụng nhắn tin quá nhiều có thể làm suy giảm giao tiếp trực tiếp.",
    usage_vi: "Face-to-face communication (giao tiếp trực diện).",
    speaking_sentence: "Furthermore, heavy reliance on devices can reduce face-to-face communication.",
    topic: "technology",
    category: "Disadvantages",
    level: "Advanced"
  }
];

const totalVocab = [...newVocab, ...additionalVocab];

const vocabFilePath = path.join(__dirname, "src/data/vocabulary.ts");
let fileContent = fs.readFileSync(vocabFilePath, "utf8");

// Insert the new topics into VSTEP_TOPICS array
if (!fileContent.includes('"environment"')) {
    fileContent = fileContent.replace('["transport", "city", "countryside", "health", "environment", "hobbies", "job_study", "food", "technology", "house_flat", "languages", "person", "holiday"]', '["transport", "city", "countryside", "health", "environment", "hobbies", "job_study", "food", "technology", "house_flat", "languages", "person", "holiday"]'); 
    // Wait, let's just do a simpler replace for the topics array if it's missing.
    // Actually the VSTEP_TOPICS array is already ["transport", "city", "countryside", "health", "environment", "hobbies", "job_study", "food", "technology"] in the file because it was already updated by the user initially.
}

// Convert totalVocab to string
let vocabString = totalVocab.map(v => JSON.stringify(v, null, 4)).join(",\n  ") + "\n];\n";

// Replace the end of the array inside vocabulary.ts
fileContent = fileContent.replace(/\n\];\n/, ",\n  " + vocabString);

fs.writeFileSync(vocabFilePath, fileContent);
console.log("Successfully injected " + totalVocab.length + " new items into vocabulary.ts");
