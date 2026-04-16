const fs = require('fs');
const path = require('path');

const OUT_FILE = path.join(__dirname, '..', 'src', 'data', 'grammar-chunks.ts');

const LEVEL_QUOTA_VOCAB = {
  'A2': 900,
  'B1-core': 1200,
  'B1-advanced': 600,
  'B2': 300
};

const LEVEL_QUOTA_GRAMMAR = {
  'A2': 36,
  'B1-core': 48,
  'B1-advanced': 24,
  'B2': 12
};

const TOPICS = [
  {
    name: 'Daily Life',
    subcategories: ['Morning routine', 'Time management', 'Home tasks', 'Personal habits'],
    nouns: [['routine', 'thói quen'], ['schedule', 'lịch trình'], ['habit', 'thói quen'], ['task', 'nhiệm vụ'], ['calendar', 'lịch'], ['energy', 'năng lượng'], ['focus', 'sự tập trung'], ['break', 'khoảng nghỉ']],
    verbs: [['organize', 'sắp xếp'], ['plan', 'lên kế hoạch'], ['prepare', 'chuẩn bị'], ['relax', 'thư giãn'], ['balance', 'cân bằng'], ['wake up', 'thức dậy'], ['clean', 'dọn dẹp']],
    adjs: [['busy', 'bận rộn'], ['productive', 'năng suất'], ['organized', 'ngăn nắp'], ['simple', 'đơn giản'], ['flexible', 'linh hoạt']],
    phrasals: [['get up', 'thức dậy', 'get'], ['slow down', 'chậm lại', 'slow'], ['catch up', 'theo kịp', 'catch'], ['sort out', 'sắp xếp ổn thỏa', 'sort'], ['stick to', 'bám sát', 'stick'], ['cut back on', 'cắt giảm', 'cut'], ['wind down', 'thả lỏng', 'wind'], ['go over', 'xem lại', 'go'], ['set aside', 'để dành', 'set'], ['keep up with', 'theo kịp', 'keep']]
  },
  {
    name: 'Family & Relationships',
    subcategories: ['Family life', 'Friendship', 'Communication', 'Conflict resolution'],
    nouns: [['family', 'gia đình'], ['friendship', 'tình bạn'], ['trust', 'sự tin tưởng'], ['support', 'sự hỗ trợ'], ['argument', 'cuộc tranh cãi'], ['apology', 'lời xin lỗi'], ['respect', 'sự tôn trọng'], ['bond', 'sự gắn kết']],
    verbs: [['care', 'quan tâm'], ['support', 'ủng hộ'], ['forgive', 'tha thứ'], ['apologize', 'xin lỗi'], ['share', 'chia sẻ'], ['encourage', 'động viên'], ['listen', 'lắng nghe']],
    adjs: [['close', 'gắn bó'], ['honest', 'chân thành'], ['supportive', 'biết hỗ trợ'], ['patient', 'kiên nhẫn'], ['kind', 'tử tế']],
    phrasals: [['open up', 'mở lòng', 'open'], ['make up', 'làm lành', 'make'], ['get along', 'hòa hợp', 'get'], ['reach out', 'chủ động liên hệ', 'reach'], ['talk over', 'thảo luận kỹ', 'talk'], ['grow apart', 'dần xa cách', 'grow'], ['lean on', 'dựa vào', 'lean'], ['break up', 'chia tay', 'break'], ['check in on', 'hỏi thăm', 'check'], ['calm down', 'bình tĩnh lại', 'calm']]
  },
  {
    name: 'Education',
    subcategories: ['Classroom interaction', 'Self-study', 'Assignments', 'Learning strategies'],
    nouns: [['lesson', 'bài học'], ['assignment', 'bài tập'], ['feedback', 'phản hồi'], ['discussion', 'thảo luận'], ['research', 'nghiên cứu'], ['note', 'ghi chú'], ['presentation', 'bài thuyết trình'], ['progress', 'tiến bộ']],
    verbs: [['review', 'ôn lại'], ['explain', 'giải thích'], ['summarize', 'tóm tắt'], ['practice', 'luyện tập'], ['present', 'trình bày'], ['analyze', 'phân tích'], ['improve', 'cải thiện']],
    adjs: [['clear', 'rõ ràng'], ['practical', 'thực tế'], ['confident', 'tự tin'], ['focused', 'tập trung'], ['effective', 'hiệu quả']],
    phrasals: [['hand in', 'nộp', 'hand'], ['look up', 'tra cứu', 'look'], ['go over', 'xem lại', 'go'], ['figure out', 'tìm ra', 'figure'], ['point out', 'chỉ ra', 'point'], ['write down', 'ghi lại', 'write'], ['read through', 'đọc kỹ', 'read'], ['catch on', 'hiểu ra', 'catch'], ['fall behind', 'tụt lại phía sau', 'fall'], ['work on', 'làm về', 'work']]
  },
  {
    name: 'Work & Career',
    subcategories: ['Job search', 'Workplace communication', 'Meetings', 'Career growth'],
    nouns: [['career', 'sự nghiệp'], ['deadline', 'hạn chót'], ['meeting', 'cuộc họp'], ['project', 'dự án'], ['interview', 'buổi phỏng vấn'], ['salary', 'mức lương'], ['promotion', 'sự thăng chức'], ['teamwork', 'làm việc nhóm']],
    verbs: [['apply', 'ứng tuyển'], ['negotiate', 'thương lượng'], ['coordinate', 'phối hợp'], ['report', 'báo cáo'], ['lead', 'dẫn dắt'], ['deliver', 'hoàn thành'], ['improve', 'nâng cao']],
    adjs: [['professional', 'chuyên nghiệp'], ['reliable', 'đáng tin cậy'], ['efficient', 'hiệu quả'], ['motivated', 'có động lực'], ['flexible', 'linh hoạt']],
    phrasals: [['take on', 'đảm nhận', 'take'], ['follow up', 'theo dõi tiếp', 'follow'], ['step up', 'nỗ lực hơn', 'step'], ['turn down', 'từ chối', 'turn'], ['carry out', 'thực hiện', 'carry'], ['speak up', 'lên tiếng', 'speak'], ['wrap up', 'kết thúc', 'wrap'], ['bring up', 'đề cập', 'bring'], ['fill in', 'thay thế tạm thời', 'fill'], ['move up', 'thăng tiến', 'move']]
  },
  {
    name: 'Technology',
    subcategories: ['Devices', 'Apps', 'Online communication', 'Digital safety'],
    nouns: [['device', 'thiết bị'], ['app', 'ứng dụng'], ['password', 'mật khẩu'], ['update', 'bản cập nhật'], ['account', 'tài khoản'], ['notification', 'thông báo'], ['file', 'tệp'], ['privacy', 'quyền riêng tư']],
    verbs: [['install', 'cài đặt'], ['update', 'cập nhật'], ['upload', 'tải lên'], ['download', 'tải xuống'], ['connect', 'kết nối'], ['share', 'chia sẻ'], ['protect', 'bảo vệ']],
    adjs: [['digital', 'kỹ thuật số'], ['secure', 'an toàn'], ['fast', 'nhanh'], ['user-friendly', 'dễ dùng'], ['private', 'riêng tư']],
    phrasals: [['log in', 'đăng nhập', 'log'], ['log out', 'đăng xuất', 'log'], ['back up', 'sao lưu', 'back'], ['set up', 'thiết lập', 'set'], ['sign up', 'đăng ký', 'sign'], ['shut down', 'tắt', 'shut'], ['plug in', 'cắm vào', 'plug'], ['scroll through', 'lướt qua', 'scroll'], ['turn on', 'bật', 'turn'], ['turn off', 'tắt', 'turn']]
  },
  {
    name: 'Health',
    subcategories: ['Healthy habits', 'Symptoms', 'Doctor visits', 'Mental well-being'],
    nouns: [['health', 'sức khỏe'], ['sleep', 'giấc ngủ'], ['stress', 'căng thẳng'], ['symptom', 'triệu chứng'], ['medicine', 'thuốc'], ['exercise', 'việc tập luyện'], ['diet', 'chế độ ăn'], ['recovery', 'sự hồi phục']],
    verbs: [['exercise', 'tập thể dục'], ['rest', 'nghỉ ngơi'], ['recover', 'hồi phục'], ['avoid', 'tránh'], ['breathe', 'hít thở'], ['stretch', 'giãn cơ'], ['treat', 'điều trị']],
    adjs: [['healthy', 'khỏe mạnh'], ['tired', 'mệt mỏi'], ['fit', 'dẻo dai'], ['balanced', 'cân bằng'], ['calm', 'bình tĩnh']],
    phrasals: [['work out', 'tập luyện', 'work'], ['cut down on', 'cắt giảm', 'cut'], ['pass out', 'ngất xỉu', 'pass'], ['warm up', 'khởi động', 'warm'], ['slow down', 'chậm lại', 'slow'], ['come down with', 'bị mắc (bệnh)', 'come'], ['get over', 'vượt qua', 'get'], ['check out', 'kiểm tra', 'check'], ['build up', 'tăng cường', 'build'], ['wear out', 'kiệt sức', 'wear']]
  },
  {
    name: 'Environment',
    subcategories: ['Pollution', 'Recycling', 'Climate', 'Green habits'],
    nouns: [['environment', 'môi trường'], ['pollution', 'ô nhiễm'], ['recycling', 'tái chế'], ['waste', 'rác thải'], ['energy', 'năng lượng'], ['climate', 'khí hậu'], ['nature', 'thiên nhiên'], ['resource', 'tài nguyên']],
    verbs: [['reduce', 'giảm'], ['reuse', 'tái sử dụng'], ['recycle', 'tái chế'], ['protect', 'bảo vệ'], ['save', 'tiết kiệm'], ['plant', 'trồng'], ['clean', 'làm sạch']],
    adjs: [['green', 'xanh'], ['clean', 'sạch'], ['sustainable', 'bền vững'], ['eco-friendly', 'thân thiện môi trường'], ['renewable', 'tái tạo']],
    phrasals: [['throw away', 'vứt đi', 'throw'], ['pick up', 'nhặt lên', 'pick'], ['cut back on', 'cắt giảm', 'cut'], ['switch off', 'tắt', 'switch'], ['run out of', 'cạn kiệt', 'run'], ['clean up', 'dọn sạch', 'clean'], ['use up', 'dùng hết', 'use'], ['give off', 'thải ra', 'give'], ['break down', 'phân hủy', 'break'], ['sort out', 'phân loại', 'sort']]
  },
  {
    name: 'Travel',
    subcategories: ['Planning', 'At the airport', 'Accommodation', 'Experiences'],
    nouns: [['trip', 'chuyến đi'], ['destination', 'điểm đến'], ['ticket', 'vé'], ['hotel', 'khách sạn'], ['passport', 'hộ chiếu'], ['luggage', 'hành lý'], ['map', 'bản đồ'], ['reservation', 'đặt chỗ']],
    verbs: [['book', 'đặt'], ['pack', 'đóng gói'], ['explore', 'khám phá'], ['check', 'kiểm tra'], ['travel', 'du lịch'], ['visit', 'tham quan'], ['plan', 'lập kế hoạch']],
    adjs: [['convenient', 'tiện lợi'], ['crowded', 'đông đúc'], ['comfortable', 'thoải mái'], ['local', 'địa phương'], ['memorable', 'đáng nhớ']],
    phrasals: [['check in', 'làm thủ tục nhận phòng/chuyến bay', 'check'], ['check out', 'trả phòng', 'check'], ['set off', 'khởi hành', 'set'], ['get on', 'lên (xe/tàu)', 'get'], ['get off', 'xuống (xe/tàu)', 'get'], ['look around', 'tham quan xung quanh', 'look'], ['stop by', 'ghé qua', 'stop'], ['head back', 'quay trở lại', 'head'], ['drop off', 'đưa đến', 'drop'], ['pick up', 'đón', 'pick']]
  },
  {
    name: 'Culture & Media',
    subcategories: ['News', 'Social media', 'Traditions', 'Entertainment media'],
    nouns: [['culture', 'văn hóa'], ['tradition', 'truyền thống'], ['news', 'tin tức'], ['article', 'bài viết'], ['podcast', 'chương trình podcast'], ['comment', 'bình luận'], ['audience', 'khán giả'], ['trend', 'xu hướng']],
    verbs: [['share', 'chia sẻ'], ['post', 'đăng'], ['comment', 'bình luận'], ['follow', 'theo dõi'], ['read', 'đọc'], ['watch', 'xem'], ['discuss', 'thảo luận']],
    adjs: [['popular', 'phổ biến'], ['traditional', 'truyền thống'], ['modern', 'hiện đại'], ['creative', 'sáng tạo'], ['reliable', 'đáng tin cậy']],
    phrasals: [['log on', 'truy cập', 'log'], ['scroll down', 'cuộn xuống', 'scroll'], ['speak out', 'lên tiếng', 'speak'], ['go viral', 'lan truyền mạnh', 'go'], ['tune in', 'theo dõi', 'tune'], ['switch over', 'chuyển kênh', 'switch'], ['point out', 'chỉ ra', 'point'], ['cut off', 'ngắt kết nối', 'cut'], ['look back on', 'nhìn lại', 'look'], ['sum up', 'tóm lại', 'sum']]
  },
  {
    name: 'Food & Lifestyle',
    subcategories: ['Cooking', 'Eating out', 'Nutrition', 'Daily choices'],
    nouns: [['meal', 'bữa ăn'], ['ingredient', 'nguyên liệu'], ['recipe', 'công thức nấu ăn'], ['snack', 'đồ ăn nhẹ'], ['diet', 'chế độ ăn'], ['portion', 'khẩu phần'], ['flavor', 'hương vị'], ['lifestyle', 'lối sống']],
    verbs: [['cook', 'nấu ăn'], ['order', 'gọi món'], ['taste', 'nếm'], ['prepare', 'chuẩn bị'], ['avoid', 'tránh'], ['choose', 'lựa chọn'], ['eat', 'ăn']],
    adjs: [['spicy', 'cay'], ['fresh', 'tươi'], ['healthy', 'lành mạnh'], ['sweet', 'ngọt'], ['light', 'nhẹ']],
    phrasals: [['eat out', 'ăn ngoài', 'eat'], ['cut out', 'cắt bỏ', 'cut'], ['fill up', 'ăn no', 'fill'], ['warm up', 'hâm nóng', 'warm'], ['mix in', 'trộn vào', 'mix'], ['pick out', 'chọn ra', 'pick'], ['go without', 'nhịn/không có', 'go'], ['lay out', 'bày ra', 'lay'], ['try out', 'thử', 'try'], ['cook up', 'nấu nhanh', 'cook']]
  },
  {
    name: 'Housing',
    subcategories: ['Renting', 'Home maintenance', 'Neighborhood', 'Moving'],
    nouns: [['apartment', 'căn hộ'], ['rent', 'tiền thuê'], ['landlord', 'chủ nhà'], ['roommate', 'bạn cùng phòng'], ['repair', 'việc sửa chữa'], ['furniture', 'đồ nội thất'], ['neighborhood', 'khu dân cư'], ['utility bill', 'hóa đơn tiện ích']],
    verbs: [['rent', 'thuê'], ['move', 'chuyển nhà'], ['decorate', 'trang trí'], ['repair', 'sửa chữa'], ['clean', 'dọn dẹp'], ['arrange', 'sắp xếp'], ['share', 'dùng chung']],
    adjs: [['quiet', 'yên tĩnh'], ['spacious', 'rộng rãi'], ['cozy', 'ấm cúng'], ['affordable', 'hợp túi tiền'], ['convenient', 'thuận tiện']],
    phrasals: [['move in', 'chuyển vào', 'move'], ['move out', 'chuyển đi', 'move'], ['fix up', 'sửa sang', 'fix'], ['clean up', 'dọn dẹp', 'clean'], ['pay for', 'trả tiền cho', 'pay'], ['look after', 'trông coi', 'look'], ['set up', 'sắp xếp', 'set'], ['turn on', 'bật', 'turn'], ['turn off', 'tắt', 'turn'], ['sort out', 'giải quyết ổn thỏa', 'sort']]
  },
  {
    name: 'Transportation',
    subcategories: ['Public transit', 'Road travel', 'Commuting', 'Travel planning'],
    nouns: [['bus', 'xe buýt'], ['train', 'tàu hỏa'], ['station', 'nhà ga'], ['route', 'tuyến đường'], ['traffic', 'giao thông'], ['ticket', 'vé'], ['driver', 'tài xế'], ['commute', 'việc đi lại']],
    verbs: [['drive', 'lái xe'], ['ride', 'đi (xe)'], ['park', 'đỗ xe'], ['commute', 'đi làm hằng ngày'], ['wait', 'chờ'], ['transfer', 'chuyển tuyến'], ['book', 'đặt']],
    adjs: [['crowded', 'đông đúc'], ['safe', 'an toàn'], ['fast', 'nhanh'], ['slow', 'chậm'], ['reliable', 'đáng tin cậy']],
    phrasals: [['get in', 'lên xe (nhỏ)', 'get'], ['get out', 'ra khỏi xe', 'get'], ['get on', 'lên xe (lớn)', 'get'], ['get off', 'xuống xe', 'get'], ['pull over', 'tấp vào lề', 'pull'], ['speed up', 'tăng tốc', 'speed'], ['slow down', 'giảm tốc', 'slow'], ['drop off', 'thả xuống', 'drop'], ['pick up', 'đón', 'pick'], ['set out', 'lên đường', 'set']]
  },
  {
    name: 'Shopping',
    subcategories: ['Buying essentials', 'Comparing products', 'Payment', 'Customer service'],
    nouns: [['price', 'giá'], ['discount', 'giảm giá'], ['receipt', 'hóa đơn'], ['refund', 'hoàn tiền'], ['quality', 'chất lượng'], ['brand', 'thương hiệu'], ['cart', 'giỏ hàng'], ['order', 'đơn hàng']],
    verbs: [['buy', 'mua'], ['compare', 'so sánh'], ['pay', 'thanh toán'], ['return', 'trả lại'], ['order', 'đặt mua'], ['choose', 'chọn'], ['check', 'kiểm tra']],
    adjs: [['cheap', 'rẻ'], ['expensive', 'đắt'], ['worthwhile', 'đáng tiền'], ['available', 'có sẵn'], ['convenient', 'tiện lợi']],
    phrasals: [['try on', 'thử (đồ)', 'try'], ['pay for', 'trả tiền cho', 'pay'], ['sell out', 'bán hết', 'sell'], ['pick out', 'chọn ra', 'pick'], ['check out', 'thanh toán', 'check'], ['send back', 'gửi trả lại', 'send'], ['look for', 'tìm kiếm', 'look'], ['line up', 'xếp hàng', 'line'], ['come in', 'vào cửa hàng', 'come'], ['shop around', 'tham khảo giá', 'shop']]
  },
  {
    name: 'Entertainment',
    subcategories: ['Movies', 'Music', 'Games', 'Leisure activities'],
    nouns: [['movie', 'phim'], ['series', 'loạt phim'], ['concert', 'buổi hòa nhạc'], ['game', 'trò chơi'], ['show', 'chương trình'], ['episode', 'tập phim'], ['ticket', 'vé'], ['performance', 'buổi biểu diễn']],
    verbs: [['watch', 'xem'], ['listen', 'nghe'], ['play', 'chơi'], ['enjoy', 'thưởng thức'], ['stream', 'phát trực tuyến'], ['join', 'tham gia'], ['recommend', 'giới thiệu']],
    adjs: [['fun', 'vui'], ['exciting', 'hấp dẫn'], ['boring', 'nhàm chán'], ['popular', 'phổ biến'], ['amazing', 'tuyệt vời']],
    phrasals: [['hang out', 'đi chơi', 'hang'], ['turn on', 'mở', 'turn'], ['turn off', 'tắt', 'turn'], ['cheer up', 'vui lên', 'cheer'], ['sing along', 'hát theo', 'sing'], ['join in', 'tham gia', 'join'], ['go out', 'ra ngoài', 'go'], ['stay in', 'ở nhà', 'stay'], ['look forward to', 'mong chờ', 'look'], ['switch on', 'bật', 'switch']]
  },
  {
    name: 'Weather',
    subcategories: ['Daily weather', 'Seasonal changes', 'Forecast', 'Extreme weather'],
    nouns: [['weather', 'thời tiết'], ['rain', 'mưa'], ['sunshine', 'ánh nắng'], ['storm', 'bão'], ['wind', 'gió'], ['temperature', 'nhiệt độ'], ['forecast', 'dự báo'], ['humidity', 'độ ẩm']],
    verbs: [['rain', 'mưa'], ['shine', 'chiếu sáng'], ['drop', 'giảm'], ['rise', 'tăng'], ['change', 'thay đổi'], ['check', 'xem'], ['prepare', 'chuẩn bị']],
    adjs: [['sunny', 'nắng'], ['rainy', 'mưa'], ['cloudy', 'nhiều mây'], ['windy', 'nhiều gió'], ['humid', 'ẩm']],
    phrasals: [['cool down', 'mát đi', 'cool'], ['heat up', 'nóng lên', 'heat'], ['clear up', 'tạnh ráo', 'clear'], ['blow over', 'qua đi', 'blow'], ['warm up', 'ấm lên', 'warm'], ['dry up', 'khô đi', 'dry'], ['pour down', 'mưa xối xả', 'pour'], ['come up', 'xảy ra', 'come'], ['set in', 'bắt đầu (thời tiết)', 'set'], ['roll in', 'kéo đến', 'roll']]
  }
];

const TOPIC_ITEM_COUNT = 200;

const TOPIC_TAG = Object.fromEntries(TOPICS.map((t) => [t.name, t.name.toLowerCase().replace(/&/g, 'and')]));

function normalizeIpa(phrase) {
  return `/${phrase.toLowerCase().replace(/[^a-z\s-]/g, '').replace(/\s+/g, ' ').trim()}/`;
}

function levelPool(quotaMap) {
  const result = [];
  Object.entries(quotaMap).forEach(([level, count]) => {
    for (let i = 0; i < count; i += 1) result.push(level);
  });
  return result;
}

function seededShuffle(arr) {
  let seed = 987654321;
  const out = [...arr];
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function nounVariants(base, meaning) {
  return [
    { phrase: base, type: 'word', meaning_vi: meaning, explanation_vi: `Dùng để nói về ${meaning} trong giao tiếp hằng ngày.`, example_en: `We talked about ${base} this morning.`, example_vi: `Sáng nay chúng tôi đã nói về ${meaning}.` },
    { phrase: `talk about ${base}`, type: 'expression', meaning_vi: `nói về ${meaning}`, explanation_vi: 'Dùng khi bắt đầu hoặc duy trì cuộc trò chuyện về một chủ đề.', example_en: `Can we talk about ${base} for a minute?`, example_vi: `Mình có thể nói về ${meaning} một chút được không?` },
    { phrase: `learn about ${base}`, type: 'expression', meaning_vi: `tìm hiểu về ${meaning}`, explanation_vi: 'Dùng khi muốn biết thêm thông tin.', example_en: `I want to learn about ${base} this week.`, example_vi: `Tuần này tôi muốn tìm hiểu thêm về ${meaning}.` },
    { phrase: `ask about ${base}`, type: 'expression', meaning_vi: `hỏi về ${meaning}`, explanation_vi: 'Dùng khi cần xin thông tin từ người khác.', example_en: `I asked her about ${base}.`, example_vi: `Tôi đã hỏi cô ấy về ${meaning}.` },
    { phrase: `deal with ${base}`, type: 'expression', meaning_vi: `xử lý ${meaning}`, explanation_vi: 'Dùng khi nói về việc giải quyết một vấn đề.', example_en: `We need to deal with ${base} step by step.`, example_vi: `Chúng ta cần xử lý ${meaning} từng bước.` },
    { phrase: `care about ${base}`, type: 'expression', meaning_vi: `quan tâm đến ${meaning}`, explanation_vi: 'Dùng để thể hiện điều bạn coi trọng.', example_en: `I really care about ${base}.`, example_vi: `Tôi thật sự quan tâm đến ${meaning}.` },
    { phrase: `worry about ${base}`, type: 'expression', meaning_vi: `lo lắng về ${meaning}`, explanation_vi: 'Dùng khi bày tỏ sự lo ngại.', example_en: `Don\'t worry about ${base} too much.`, example_vi: `Đừng lo lắng quá nhiều về ${meaning}.` },
    { phrase: `improve your ${base}`, type: 'expression', meaning_vi: `cải thiện ${meaning} của bạn`, explanation_vi: 'Dùng khi khuyên ai đó phát triển kỹ năng hoặc thói quen.', example_en: `Try to improve your ${base} little by little.`, example_vi: `Hãy thử cải thiện ${meaning} của bạn từng chút một.` },
    { phrase: `personal ${base}`, type: 'collocation', meaning_vi: `${meaning} cá nhân`, explanation_vi: 'Cụm từ mô tả khía cạnh cá nhân của một vấn đề.', example_en: `Everyone has a personal ${base}.`, example_vi: `Ai cũng có ${meaning} mang tính cá nhân.` },
    { phrase: `daily ${base}`, type: 'collocation', meaning_vi: `${meaning} hằng ngày`, explanation_vi: 'Dùng để nói về điều lặp lại trong sinh hoạt hằng ngày.', example_en: `Daily ${base} makes life easier.`, example_vi: `${meaning} hằng ngày giúp cuộc sống dễ hơn.` }
  ];
}

function verbVariants(base, meaning) {
  return [
    { phrase: base, type: 'word', meaning_vi: meaning, explanation_vi: `Động từ cơ bản dùng nhiều trong giao tiếp hằng ngày.`, example_en: `I usually ${base} after work.`, example_vi: `Tôi thường ${meaning} sau giờ làm.` },
    { phrase: `try to ${base}`, type: 'expression', meaning_vi: `cố gắng ${meaning}`, explanation_vi: 'Dùng khi diễn đạt nỗ lực cá nhân.', example_en: `I try to ${base} every day.`, example_vi: `Tôi cố gắng ${meaning} mỗi ngày.` },
    { phrase: `need to ${base}`, type: 'expression', meaning_vi: `cần ${meaning}`, explanation_vi: 'Dùng khi nói về điều cần thiết.', example_en: `We need to ${base} before noon.`, example_vi: `Chúng ta cần ${meaning} trước buổi trưa.` },
    { phrase: `${base} together`, type: 'expression', meaning_vi: `${meaning} cùng nhau`, explanation_vi: 'Dùng khi nói về hoạt động chung.', example_en: `Let\'s ${base} together this evening.`, example_vi: `Tối nay chúng ta hãy ${meaning} cùng nhau nhé.` },
    { phrase: `${base} at home`, type: 'expression', meaning_vi: `${meaning} ở nhà`, explanation_vi: 'Dùng cho bối cảnh đời sống thường ngày.', example_en: `I prefer to ${base} at home.`, example_vi: `Tôi thích ${meaning} ở nhà hơn.` },
    { phrase: `${base} in public`, type: 'expression', meaning_vi: `${meaning} nơi công cộng`, explanation_vi: 'Dùng khi nói về hành vi nơi công cộng.', example_en: `It\'s not easy to ${base} in public.`, example_vi: `Không dễ để ${meaning} ở nơi công cộng.` },
    { phrase: `${base} more often`, type: 'expression', meaning_vi: `${meaning} thường xuyên hơn`, explanation_vi: 'Dùng khi đưa lời khuyên tích cực.', example_en: `You should ${base} more often.`, example_vi: `Bạn nên ${meaning} thường xuyên hơn.` },
    { phrase: `${base} right away`, type: 'expression', meaning_vi: `${meaning} ngay lập tức`, explanation_vi: 'Dùng khi cần hành động ngay.', example_en: `Can you ${base} right away?`, example_vi: `Bạn có thể ${meaning} ngay được không?` },
    { phrase: `${base} clearly`, type: 'collocation', meaning_vi: `${meaning} rõ ràng`, explanation_vi: 'Dùng để nhấn mạnh cách thực hiện dễ hiểu.', example_en: `Please ${base} clearly.`, example_vi: `Làm ơn ${meaning} thật rõ ràng.` },
    { phrase: `${base} carefully`, type: 'collocation', meaning_vi: `${meaning} cẩn thận`, explanation_vi: 'Dùng để nhấn mạnh sự cẩn trọng khi làm việc.', example_en: `Make sure to ${base} carefully.`, example_vi: `Nhớ ${meaning} cẩn thận nhé.` }
  ];
}

function adjVariants(base, meaning) {
  return [
    { phrase: base, type: 'word', meaning_vi: meaning, explanation_vi: 'Tính từ dùng để mô tả trạng thái hoặc đặc điểm phổ biến.', example_en: `This place is really ${base}.`, example_vi: `Nơi này thật sự ${meaning}.` },
    { phrase: `really ${base}`, type: 'collocation', meaning_vi: `rất ${meaning}`, explanation_vi: 'Dùng để nhấn mạnh mức độ.', example_en: `I\'m really ${base} today.`, example_vi: `Hôm nay tôi thấy rất ${meaning}.` },
    { phrase: `${base} enough`, type: 'expression', meaning_vi: `${meaning} đủ`, explanation_vi: 'Dùng để diễn đạt mức độ vừa đủ.', example_en: `Is this ${base} enough for you?`, example_vi: `Cái này đã ${meaning} đủ với bạn chưa?` },
    { phrase: `too ${base}`, type: 'expression', meaning_vi: `quá ${meaning}`, explanation_vi: 'Dùng khi điều gì đó vượt mức mong muốn.', example_en: `It\'s too ${base} for me right now.`, example_vi: `Lúc này nó quá ${meaning} với tôi.` },
    { phrase: `more ${base}`, type: 'expression', meaning_vi: `${meaning} hơn`, explanation_vi: 'Dùng trong so sánh hoặc khi muốn thay đổi tích cực.', example_en: `I want to be more ${base}.`, example_vi: `Tôi muốn trở nên ${meaning} hơn.` },
    { phrase: `${base} these days`, type: 'expression', meaning_vi: `${meaning} dạo này`, explanation_vi: 'Dùng để mô tả tình trạng gần đây.', example_en: `I feel ${base} these days.`, example_vi: `Dạo này tôi cảm thấy ${meaning}.` },
    { phrase: `${base} for daily use`, type: 'expression', meaning_vi: `${meaning} cho dùng hằng ngày`, explanation_vi: 'Dùng để nói về tính phù hợp trong thực tế.', example_en: `This option is ${base} for daily use.`, example_vi: `Lựa chọn này ${meaning} cho việc dùng hằng ngày.` },
    { phrase: `${base} in real life`, type: 'expression', meaning_vi: `${meaning} trong đời thực`, explanation_vi: 'Dùng để nhấn mạnh trải nghiệm thực tế.', example_en: `It sounds good and feels ${base} in real life.`, example_vi: `Nghe thì hay và thực tế cũng rất ${meaning}.` },
    { phrase: `keep it ${base}`, type: 'expression', meaning_vi: `giữ mọi thứ ${meaning}`, explanation_vi: 'Cụm nói tự nhiên dùng khi đưa lời khuyên.', example_en: `Let\'s keep it ${base}.`, example_vi: `Mình cứ giữ mọi thứ ${meaning} nhé.` },
    { phrase: `stay ${base}`, type: 'expression', meaning_vi: `giữ trạng thái ${meaning}`, explanation_vi: 'Dùng để động viên hoặc nhắc nhở.', example_en: `Just stay ${base} and breathe.`, example_vi: `Cứ giữ bình tĩnh và hít thở nhé.` }
  ];
}

function makeUniqueEntry(entry, topic, seen, attempt = 0) {
  let phrase = entry.phrase;
  while (seen.has(phrase.toLowerCase())) {
    if (attempt === 0 && entry.type === 'word') {
      phrase = `${TOPIC_TAG[topic].split(' ')[0]} ${entry.phrase}`;
    } else if (attempt === 1) {
      phrase = `${entry.phrase} at ${TOPIC_TAG[topic]}`;
    } else if (attempt === 2) {
      phrase = `${entry.phrase} with people`;
    } else {
      phrase = `${entry.phrase} ${attempt + 1}`;
    }
    attempt += 1;
  }
  seen.add(phrase.toLowerCase());
  return {
    ...entry,
    phrase,
    ipa: normalizeIpa(phrase)
  };
}

function generateTopicItems(topicCfg, globalSeen) {
  const candidates = [];

  // Keep phrasal verbs early so every topic includes this type.
  topicCfg.phrasals.forEach(([phrase, meaning, base]) => {
    candidates.push({
      phrase,
      type: 'phrasal_verb',
      meaning_vi: meaning,
      explanation_vi: 'Cụm động từ thường gặp trong giao tiếp đời sống.',
      example_en: `I\'ll ${phrase} later today.`,
      example_vi: `Hôm nay tôi sẽ ${meaning} sau nhé.`,
      base_word: base,
      word_type: 'verb'
    });
  });

  topicCfg.nouns.forEach(([base, meaning]) => {
    nounVariants(base, meaning).forEach((item) => {
      candidates.push({ ...item, base_word: base, word_type: 'noun' });
    });
  });

  topicCfg.verbs.forEach(([base, meaning]) => {
    verbVariants(base, meaning).forEach((item) => {
      candidates.push({ ...item, base_word: base.split(' ')[0], word_type: 'verb' });
    });
  });

  topicCfg.adjs.forEach(([base, meaning]) => {
    adjVariants(base, meaning).forEach((item) => {
      candidates.push({ ...item, base_word: base, word_type: 'adj' });
    });
  });

  const out = [];
  let index = 0;
  while (out.length < TOPIC_ITEM_COUNT) {
    const source = candidates[index % candidates.length];
    const withTopic = {
      ...source,
      topic: topicCfg.name,
      subcategory: topicCfg.subcategories[out.length % topicCfg.subcategories.length],
      level: ''
    };
    out.push(makeUniqueEntry(withTopic, topicCfg.name, globalSeen));
    index += 1;
  }

  return out;
}

function generateVocabulary() {
  const seen = new Set();
  const all = [];

  TOPICS.forEach((topicCfg) => {
    const topicItems = generateTopicItems(topicCfg, seen);
    all.push(...topicItems);
  });

  const levels = seededShuffle(levelPool(LEVEL_QUOTA_VOCAB));
  all.forEach((item, idx) => {
    item.level = levels[idx];
  });

  return all;
}

const GRAMMAR_CATEGORY_META = [
  ['Sentence Frames', 'Mẫu câu'],
  ['Conversation Structures', 'Cấu trúc hội thoại'],
  ['Opinion & Discussion', 'Nêu ý kiến và thảo luận'],
  ['Agreement & Disagreement', 'Đồng ý và không đồng ý'],
  ['Suggestions & Advice', 'Gợi ý và lời khuyên'],
  ['Requests & Offers', 'Yêu cầu và đề nghị giúp đỡ'],
  ['Cause & Effect', 'Nguyên nhân và kết quả'],
  ['Problem & Solution', 'Vấn đề và giải pháp'],
  ['Connectors', 'Từ nối'],
  ['Quantifiers', 'Lượng từ'],
  ['Comparatives', 'So sánh'],
  ['Relative Clauses', 'Mệnh đề quan hệ'],
  ['Conditionals', 'Câu điều kiện'],
  ['Passive Voice', 'Câu bị động'],
  ['Modal Verbs', 'Động từ khuyết thiếu'],
  ['Reported Speech', 'Câu tường thuật']
];

const GRAMMAR_QUOTA = Object.fromEntries(GRAMMAR_CATEGORY_META.map(([cat], idx) => [cat, idx < 8 ? 8 : 7]));

const GRAMMAR_BANK = {
  'Sentence Frames': [
    ['It is important to + V', 'It is important to drink enough water every day.', 'Việc uống đủ nước mỗi ngày là rất quan trọng.', 'Dùng để nhấn mạnh một hành động cần thiết hoặc có ích.'],
    ['It is hard to + V', 'It is hard to stay focused when you are tired.', 'Thật khó để giữ tập trung khi bạn mệt.', 'Dùng để nói một việc khó thực hiện.'],
    ['The best way to + V is to + V', 'The best way to relax is to take a short walk.', 'Cách tốt nhất để thư giãn là đi dạo một lúc.', 'Dùng để giới thiệu cách làm hiệu quả nhất.'],
    ['One thing I like about + noun is + clause', 'One thing I like about this city is that people are friendly.', 'Một điều tôi thích ở thành phố này là mọi người thân thiện.', 'Dùng để nêu điểm bạn yêu thích về một điều gì đó.'],
    ['One thing I do not like about + noun is + clause', 'One thing I do not like about this app is that it drains my battery.', 'Một điều tôi không thích ở ứng dụng này là nó hao pin.', 'Dùng để nêu điểm bạn chưa hài lòng.'],
    ['It takes + time + to + V', 'It takes ten minutes to get to the station.', 'Mất mười phút để đến nhà ga.', 'Dùng để nói thời gian cần cho một việc.'],
    ['I find it + adjective + to + V', 'I find it helpful to write down new words.', 'Tôi thấy việc ghi lại từ mới rất hữu ích.', 'Dùng để chia sẻ cảm nhận cá nhân về một hành động.'],
    ['What helps me most is + noun/clause', 'What helps me most is a clear daily plan.', 'Điều giúp tôi nhiều nhất là một kế hoạch hằng ngày rõ ràng.', 'Dùng để nhấn mạnh yếu tố hữu ích nhất.']
  ],
  'Conversation Structures': [
    ['Do you mind if + clause?', 'Do you mind if I open the window?', 'Bạn có phiền nếu tôi mở cửa sổ không?', 'Dùng để xin phép một cách lịch sự.'],
    ['Would you mind + V-ing?', 'Would you mind waiting for five minutes?', 'Bạn có phiền đợi năm phút không?', 'Dùng để nhờ ai đó làm việc gì một cách nhẹ nhàng.'],
    ['By the way, + clause', 'By the way, I saw Anna at the cafe.', 'À mà này, tôi đã gặp Anna ở quán cà phê.', 'Dùng để chuyển sang thông tin bổ sung trong hội thoại.'],
    ['As far as I know, + clause', 'As far as I know, the store closes at nine.', 'Theo những gì tôi biết thì cửa hàng đóng cửa lúc chín giờ.', 'Dùng khi nói thông tin bạn biết nhưng không khẳng định tuyệt đối.'],
    ['To be honest, + clause', 'To be honest, I need more time to decide.', 'Thật lòng mà nói, tôi cần thêm thời gian để quyết định.', 'Dùng để mở đầu ý kiến chân thành.'],
    ['Can I ask you something?', 'Can I ask you something?', 'Tôi hỏi bạn một chuyện được không?', 'Dùng để mở đầu khi muốn hỏi điều riêng hoặc quan trọng.'],
    ['That makes sense.', 'That makes sense.', 'Nghe hợp lý đấy.', 'Dùng để thể hiện bạn hiểu và thấy hợp lý.'],
    ['I get what you mean.', 'I get what you mean.', 'Tôi hiểu ý bạn.', 'Dùng để xác nhận bạn đã hiểu điều người khác nói.']
  ],
  'Opinion & Discussion': [
    ['I think + clause', 'I think we should leave a bit earlier.', 'Tôi nghĩ chúng ta nên đi sớm hơn một chút.', 'Dùng để nêu ý kiến cá nhân.'],
    ['I feel that + clause', 'I feel that this plan is more practical.', 'Tôi cảm thấy kế hoạch này thực tế hơn.', 'Dùng để nói cảm nhận mang tính cá nhân.'],
    ['In my opinion, + clause', 'In my opinion, walking is the easiest way to stay active.', 'Theo ý kiến của tôi, đi bộ là cách dễ nhất để vận động.', 'Dùng để đưa ra quan điểm rõ ràng.'],
    ['From my point of view, + clause', 'From my point of view, online meetings save time.', 'Từ góc nhìn của tôi, họp trực tuyến tiết kiệm thời gian.', 'Dùng để trình bày góc nhìn riêng.'],
    ['I agree that + clause', 'I agree that clear communication prevents problems.', 'Tôi đồng ý rằng giao tiếp rõ ràng giúp tránh rắc rối.', 'Dùng để thể hiện sự đồng thuận với một ý kiến.'],
    ['I am not sure if + clause', 'I am not sure if this is the best option.', 'Tôi không chắc đây có phải lựa chọn tốt nhất không.', 'Dùng khi bạn còn do dự hoặc chưa có đủ thông tin.'],
    ['What do you think about + noun?', 'What do you think about working from home?', 'Bạn nghĩ sao về việc làm việc tại nhà?', 'Dùng để mời người khác chia sẻ quan điểm.'],
    ['I would say + clause', 'I would say this depends on the situation.', 'Tôi sẽ nói rằng điều này phụ thuộc vào tình huống.', 'Dùng để đưa nhận định một cách mềm mại.']
  ],
  'Agreement & Disagreement': [
    ['I agree with + noun/pronoun', 'I agree with you on that point.', 'Tôi đồng ý với bạn ở điểm đó.', 'Dùng để đồng ý trực tiếp với ai đó.'],
    ['I totally agree.', 'I totally agree.', 'Tôi hoàn toàn đồng ý.', 'Dùng để nhấn mạnh mức độ đồng ý.'],
    ['I see your point, but + clause', 'I see your point, but we may need more data.', 'Tôi hiểu ý bạn, nhưng có lẽ chúng ta cần thêm dữ liệu.', 'Dùng để phản hồi lịch sự khi chưa hoàn toàn đồng ý.'],
    ['I am afraid I disagree.', 'I am afraid I disagree.', 'E rằng tôi không đồng ý.', 'Dùng để không đồng ý theo cách lịch sự.'],
    ['I do not think so.', 'I do not think so.', 'Tôi không nghĩ vậy.', 'Dùng để phản bác ngắn gọn.'],
    ['You might be right, but + clause', 'You might be right, but timing is still a problem.', 'Bạn có thể đúng, nhưng thời điểm vẫn là vấn đề.', 'Dùng để công nhận một phần rồi đưa ý khác.'],
    ['That is true, however + clause', 'That is true, however we cannot do it today.', 'Điều đó đúng, tuy nhiên hôm nay chúng ta không thể làm được.', 'Dùng để chuyển từ đồng ý sang giới hạn thực tế.'],
    ['I see it differently.', 'I see it differently.', 'Tôi nhìn nhận khác một chút.', 'Dùng để thể hiện góc nhìn khác mà không quá đối đầu.']
  ],
  'Suggestions & Advice': [
    ['You should + V', 'You should take a short break.', 'Bạn nên nghỉ ngắn một chút.', 'Dùng để đưa lời khuyên thông dụng.'],
    ['You should not + V', 'You should not skip breakfast.', 'Bạn không nên bỏ bữa sáng.', 'Dùng để khuyên tránh một hành động.'],
    ['Why do not we + V?', 'Why do not we call her now?', 'Hay là mình gọi cho cô ấy bây giờ?', 'Dùng để gợi ý làm gì cùng nhau.'],
    ['Let us + V', 'Let us start with the easy part.', 'Hãy bắt đầu với phần dễ trước.', 'Dùng để đề xuất hành động chung.'],
    ['If I were you, I would + V', 'If I were you, I would ask for feedback.', 'Nếu tôi là bạn, tôi sẽ xin phản hồi.', 'Dùng để đưa lời khuyên mang tính cá nhân.'],
    ['It would be better to + V', 'It would be better to leave early.', 'Sẽ tốt hơn nếu đi sớm.', 'Dùng để gợi ý phương án tốt hơn.'],
    ['How about + V-ing?', 'How about meeting after lunch?', 'Hay là gặp nhau sau bữa trưa?', 'Dùng để đưa ra gợi ý thân mật.'],
    ['You could + V', 'You could try a different approach.', 'Bạn có thể thử cách khác.', 'Dùng để gợi ý mang tính lựa chọn.']
  ],
  'Requests & Offers': [
    ['Could you + V, please?', 'Could you send me the file, please?', 'Bạn có thể gửi cho tôi tệp đó được không?', 'Dùng để nhờ giúp lịch sự.'],
    ['Can you + V?', 'Can you help me with this bag?', 'Bạn có thể giúp tôi với cái túi này không?', 'Dùng để yêu cầu trực tiếp, thân thiện.'],
    ['Would you like me to + V?', 'Would you like me to call a taxi?', 'Bạn có muốn tôi gọi taxi không?', 'Dùng để đề nghị giúp đỡ.'],
    ['Can I + V?', 'Can I use your charger for a minute?', 'Tôi dùng nhờ sạc của bạn một lát được không?', 'Dùng để xin phép.'],
    ['May I + V?', 'May I sit here?', 'Tôi ngồi đây được không?', 'Dùng để xin phép trang trọng hơn.'],
    ['Let me + V', 'Let me carry that for you.', 'Để tôi xách giúp bạn cái đó.', 'Dùng để chủ động đề nghị giúp.'],
    ['Do you want me to + V?', 'Do you want me to check it again?', 'Bạn muốn tôi kiểm tra lại không?', 'Dùng để hỏi xem có cần mình hỗ trợ không.'],
    ['Would you mind if I + V?', 'Would you mind if I opened the door?', 'Bạn có phiền nếu tôi mở cửa không?', 'Dùng để xin phép rất lịch sự.']
  ],
  'Cause & Effect': [
    ['Because + clause, + clause', 'Because I was tired, I went to bed early.', 'Vì tôi mệt nên tôi đi ngủ sớm.', 'Dùng để nêu nguyên nhân trước kết quả.'],
    ['+ clause because + clause', 'I stayed home because it was raining.', 'Tôi ở nhà vì trời mưa.', 'Dùng để nêu nguyên nhân sau kết quả.'],
    ['So + clause', 'It was late, so we took a taxi.', 'Trời đã khuya nên chúng tôi đi taxi.', 'Dùng để nêu kết quả tự nhiên.'],
    ['That is why + clause', 'I forgot my keys, that is why I am waiting outside.', 'Tôi quên chìa khóa, nên giờ tôi đang đợi bên ngoài.', 'Dùng để giải thích lý do của tình huống hiện tại.'],
    ['As a result, + clause', 'As a result, the room feels much cleaner now.', 'Kết quả là căn phòng giờ sạch hơn nhiều.', 'Dùng để nối với kết quả sau hành động.'],
    ['Since + clause, + clause', 'Since it is sunny, we can walk to the park.', 'Vì trời nắng nên chúng ta có thể đi bộ ra công viên.', 'Dùng để nêu lý do khi hai bên đều hiểu bối cảnh.'],
    ['Due to + noun, + clause', 'Due to traffic, we arrived a bit late.', 'Do kẹt xe nên chúng tôi đến hơi muộn.', 'Dùng để nêu nguyên nhân bằng cụm danh từ.'],
    ['Therefore, + clause', 'Therefore, we need to adjust the plan.', 'Vì vậy, chúng ta cần điều chỉnh kế hoạch.', 'Dùng để kết luận và nêu hướng xử lý.']
  ],
  'Problem & Solution': [
    ['The problem is that + clause', 'The problem is that we do not have enough time.', 'Vấn đề là chúng ta không có đủ thời gian.', 'Dùng để nêu vấn đề trực tiếp.'],
    ['One solution is to + V', 'One solution is to divide the task into small steps.', 'Một giải pháp là chia nhiệm vụ thành các bước nhỏ.', 'Dùng để đưa ra một giải pháp cụ thể.'],
    ['To solve this, + clause', 'To solve this, we can ask for extra help.', 'Để giải quyết việc này, chúng ta có thể nhờ thêm hỗ trợ.', 'Dùng để chuyển từ vấn đề sang giải pháp.'],
    ['What we can do is + V', 'What we can do is start with the most urgent part.', 'Điều chúng ta có thể làm là bắt đầu với phần gấp nhất.', 'Dùng để gợi ý hành động thực tế.'],
    ['A simple way to fix this is to + V', 'A simple way to fix this is to communicate earlier.', 'Một cách đơn giản để xử lý việc này là trao đổi sớm hơn.', 'Dùng khi đưa giải pháp dễ áp dụng.'],
    ['This can be solved by + V-ing', 'This can be solved by setting clear priorities.', 'Việc này có thể được giải quyết bằng cách đặt ưu tiên rõ ràng.', 'Dùng để nói cách giải quyết chung.'],
    ['The key is to + V', 'The key is to stay calm and focus on one task at a time.', 'Mấu chốt là giữ bình tĩnh và tập trung từng việc một.', 'Dùng để nhấn mạnh yếu tố quyết định.'],
    ['A practical option is to + V', 'A practical option is to share the workload.', 'Một phương án thực tế là chia sẻ khối lượng công việc.', 'Dùng để đưa ra phương án khả thi trong thực tế.']
  ],
  'Connectors': [
    ['First, ... Then, ... Finally, ...', 'First, check the details. Then, confirm the plan. Finally, send a message.', 'Đầu tiên, kiểm tra chi tiết. Sau đó, xác nhận kế hoạch. Cuối cùng, gửi một tin nhắn.', 'Dùng để sắp xếp trình tự hành động rõ ràng.'],
    ['However, + clause', 'However, I still need a little more time.', 'Tuy nhiên, tôi vẫn cần thêm một chút thời gian.', 'Dùng để nêu ý đối lập nhẹ.'],
    ['In addition, + clause', 'In addition, we should prepare a backup plan.', 'Ngoài ra, chúng ta nên chuẩn bị một kế hoạch dự phòng.', 'Dùng để thêm ý bổ sung.'],
    ['For example, + clause', 'For example, you can keep notes on your phone.', 'Ví dụ, bạn có thể ghi chú trên điện thoại.', 'Dùng để đưa ví dụ minh họa.'],
    ['Meanwhile, + clause', 'Meanwhile, I will check the schedule.', 'Trong lúc đó, tôi sẽ kiểm tra lịch trình.', 'Dùng để nói hai việc xảy ra song song.'],
    ['In contrast, + clause', 'In contrast, my brother prefers studying at night.', 'Ngược lại, em trai tôi thích học vào buổi tối.', 'Dùng để so sánh sự khác biệt.'],
    ['Besides, + clause', 'Besides, we already have enough materials.', 'Hơn nữa, chúng ta đã có đủ tài liệu.', 'Dùng để bổ sung lý do hoặc thông tin.'],
    ['In short, + clause', 'In short, we need a simpler plan.', 'Nói ngắn gọn, chúng ta cần một kế hoạch đơn giản hơn.', 'Dùng để tóm tắt ý chính.']
  ],
  'Quantifiers': [
    ['a few + plural noun', 'I have a few ideas to share.', 'Tôi có vài ý tưởng để chia sẻ.', 'Dùng cho số lượng ít nhưng đủ dùng với danh từ đếm được.'],
    ['a little + uncountable noun', 'I need a little time to think.', 'Tôi cần một chút thời gian để suy nghĩ.', 'Dùng với danh từ không đếm được, lượng nhỏ.'],
    ['many + plural noun', 'Many people work from home now.', 'Nhiều người hiện làm việc tại nhà.', 'Dùng cho số lượng lớn với danh từ đếm được.'],
    ['much + uncountable noun', 'I do not have much energy today.', 'Hôm nay tôi không có nhiều năng lượng.', 'Dùng với danh từ không đếm được, thường trong câu phủ định/hỏi.'],
    ['a lot of + noun', 'We have a lot of options.', 'Chúng ta có rất nhiều lựa chọn.', 'Dùng phổ biến cho cả danh từ đếm được và không đếm được.'],
    ['plenty of + noun', 'There is plenty of food in the kitchen.', 'Có rất nhiều đồ ăn trong bếp.', 'Dùng để nhấn mạnh số lượng dồi dào.'],
    ['not enough + noun', 'There is not enough space in this bag.', 'Không có đủ chỗ trong chiếc túi này.', 'Dùng khi số lượng không đáp ứng nhu cầu.'],
    ['too many/too much + noun', 'We bought too many snacks.', 'Chúng tôi đã mua quá nhiều đồ ăn vặt.', 'Dùng khi số lượng vượt mức cần thiết.']
  ],
  'Comparatives': [
    ['A is + comparative + than B', 'This route is faster than the other one.', 'Tuyến đường này nhanh hơn tuyến kia.', 'Dùng để so sánh hai đối tượng.'],
    ['A is as + adjective + as B', 'This phone is as light as my old one.', 'Chiếc điện thoại này nhẹ ngang chiếc cũ của tôi.', 'Dùng để nói hai đối tượng ngang bằng nhau.'],
    ['A is not as + adjective + as B', 'Today is not as cold as yesterday.', 'Hôm nay không lạnh bằng hôm qua.', 'Dùng để nói mức độ thấp hơn đối tượng so sánh.'],
    ['The + comparative, the + comparative', 'The earlier we leave, the less traffic we face.', 'Chúng ta đi càng sớm thì càng ít gặp kẹt xe.', 'Dùng để diễn tả mối quan hệ tỉ lệ.'],
    ['A is the + superlative + noun', 'This is the easiest way to explain it.', 'Đây là cách dễ nhất để giải thích chuyện đó.', 'Dùng để nói mức độ cao nhất trong nhóm.'],
    ['A is much/far + comparative + than B', 'Taking the train is much cheaper than flying.', 'Đi tàu rẻ hơn đi máy bay rất nhiều.', 'Dùng để nhấn mạnh chênh lệch rõ rệt.'],
    ['Compared to + noun, + clause', 'Compared to last month, I feel more confident now.', 'So với tháng trước, bây giờ tôi tự tin hơn.', 'Dùng để so sánh với mốc hoặc đối tượng khác.'],
    ['A is becoming + comparative', 'The weather is becoming warmer.', 'Thời tiết đang trở nên ấm hơn.', 'Dùng để nói xu hướng thay đổi theo thời gian.']
  ],
  'Relative Clauses': [
    ['The person who + clause', 'The person who called me is my neighbor.', 'Người đã gọi cho tôi là hàng xóm của tôi.', 'Dùng who để bổ nghĩa cho người.'],
    ['The thing that + clause', 'The thing that surprised me most was his calm voice.', 'Điều làm tôi ngạc nhiên nhất là giọng nói bình tĩnh của anh ấy.', 'Dùng that để bổ nghĩa cho sự vật/sự việc.'],
    ['The place where + clause', 'This is the place where we first met.', 'Đây là nơi chúng tôi gặp nhau lần đầu.', 'Dùng where để nói về địa điểm.'],
    ['The time when + clause', 'That was the time when I changed jobs.', 'Đó là thời điểm tôi đổi việc.', 'Dùng when để nói về thời gian.'],
    ['The reason why + clause', 'The reason why I left early was traffic.', 'Lý do tôi về sớm là vì kẹt xe.', 'Dùng why để nói lý do.'],
    ['Noun, which + clause', 'I bought a chair, which is very comfortable.', 'Tôi đã mua một cái ghế, cái ghế đó rất thoải mái.', 'Dùng which để thêm thông tin bổ sung về vật.'],
    ['Noun, who + clause', 'My aunt, who lives nearby, visits us often.', 'Dì tôi, người sống gần đây, hay ghé thăm chúng tôi.', 'Dùng who để thêm thông tin bổ sung về người.'],
    ['Noun, whose + noun + clause', 'I have a friend whose ideas are always practical.', 'Tôi có một người bạn mà ý tưởng của bạn ấy luôn rất thực tế.', 'Dùng whose để chỉ sự sở hữu.']
  ],
  'Conditionals': [
    ['If + present simple, + will + V', 'If it rains, we will stay inside.', 'Nếu trời mưa, chúng ta sẽ ở trong nhà.', 'Dùng cho điều kiện có thể xảy ra trong hiện tại/tương lai.'],
    ['If + past simple, + would + V', 'If I had more time, I would cook at home more often.', 'Nếu tôi có nhiều thời gian hơn, tôi sẽ nấu ăn ở nhà thường xuyên hơn.', 'Dùng cho tình huống giả định ở hiện tại.'],
    ['If + past perfect, + would have + V3', 'If I had left earlier, I would have caught the train.', 'Nếu tôi rời đi sớm hơn, tôi đã kịp chuyến tàu.', 'Dùng cho giả định trái với quá khứ.'],
    ['Unless + clause, + clause', 'Unless you rest, you will feel exhausted.', 'Nếu bạn không nghỉ ngơi, bạn sẽ thấy kiệt sức.', 'Dùng để nói điều kiện phủ định.'],
    ['If I were you, I would + V', 'If I were you, I would call and ask directly.', 'Nếu tôi là bạn, tôi sẽ gọi và hỏi trực tiếp.', 'Dùng để đưa lời khuyên.'],
    ['As long as + clause, + clause', 'As long as we communicate clearly, we can solve this.', 'Miễn là chúng ta giao tiếp rõ ràng, chúng ta có thể giải quyết việc này.', 'Dùng để đặt điều kiện đủ.'],
    ['In case + clause, + clause', 'In case you are late, send me a message.', 'Trong trường hợp bạn đến muộn, hãy nhắn cho tôi.', 'Dùng để chuẩn bị cho khả năng có thể xảy ra.'],
    ['Should + subject + V, + clause', 'Should you need help, just let me know.', 'Nếu bạn cần giúp đỡ, cứ nói với tôi.', 'Cách nói trang trọng, tương đương if trong điều kiện.']
  ],
  'Passive Voice': [
    ['S + am/is/are + V3/ed', 'Dinner is served at seven.', 'Bữa tối được phục vụ lúc bảy giờ.', 'Dùng khi muốn nhấn mạnh hành động hoặc kết quả, không cần nêu người làm.'],
    ['S + was/were + V3/ed', 'The room was cleaned this morning.', 'Căn phòng đã được dọn sáng nay.', 'Dùng cho hành động bị động trong quá khứ.'],
    ['S + will be + V3/ed', 'The package will be delivered tomorrow.', 'Gói hàng sẽ được giao vào ngày mai.', 'Dùng cho hành động bị động trong tương lai.'],
    ['S + can/should/must be + V3/ed', 'This issue should be discussed calmly.', 'Vấn đề này nên được thảo luận một cách bình tĩnh.', 'Dùng để nêu nghĩa vụ/khuyến nghị trong bị động.'],
    ['S + has/have been + V3/ed', 'The documents have been sent already.', 'Các tài liệu đã được gửi rồi.', 'Dùng để nhấn mạnh kết quả đã hoàn thành.'],
    ['S + is/are being + V3/ed', 'The road is being repaired right now.', 'Con đường đang được sửa ngay lúc này.', 'Dùng cho hành động bị động đang diễn ra.'],
    ['It is said/believed that + clause', 'It is believed that walking daily improves mood.', 'Người ta tin rằng đi bộ hằng ngày giúp cải thiện tâm trạng.', 'Dùng để nêu nhận định chung, mang tính khách quan.']
  ],
  'Modal Verbs': [
    ['can + V', 'You can call me anytime.', 'Bạn có thể gọi cho tôi bất cứ lúc nào.', 'Dùng để diễn tả khả năng hoặc sự cho phép.'],
    ['could + V', 'Could you speak a bit slower?', 'Bạn có thể nói chậm hơn một chút được không?', 'Dùng để yêu cầu lịch sự hoặc nói khả năng trong quá khứ.'],
    ['may + V', 'You may sit here if you like.', 'Bạn có thể ngồi đây nếu muốn.', 'Dùng để xin phép hoặc cho phép trang trọng.'],
    ['might + V', 'It might rain later tonight.', 'Có thể tối nay trời sẽ mưa.', 'Dùng để nói khả năng không chắc chắn.'],
    ['must + V', 'You must wear a helmet on this road.', 'Bạn phải đội mũ bảo hiểm trên tuyến đường này.', 'Dùng để nói nghĩa vụ bắt buộc.'],
    ['should + V', 'You should drink more water.', 'Bạn nên uống nhiều nước hơn.', 'Dùng để đưa lời khuyên.'],
    ['have to + V', 'I have to leave now.', 'Tôi phải đi ngay bây giờ.', 'Dùng để nói việc bắt buộc do hoàn cảnh.']
  ],
  'Reported Speech': [
    ['S + said that + clause', 'She said that she was running late.', 'Cô ấy nói rằng cô ấy đang đến muộn.', 'Dùng để tường thuật lời nói gián tiếp.'],
    ['S + told + object + that + clause', 'He told me that the store was closed.', 'Anh ấy nói với tôi rằng cửa hàng đã đóng cửa.', 'Dùng khi có tân ngữ chỉ người nghe.'],
    ['S + asked + if/whether + clause', 'They asked if we were ready to leave.', 'Họ hỏi liệu chúng tôi đã sẵn sàng đi chưa.', 'Dùng để tường thuật câu hỏi Yes/No.'],
    ['S + asked + object + to + V', 'She asked me to wait outside.', 'Cô ấy bảo tôi đợi bên ngoài.', 'Dùng để tường thuật lời yêu cầu.'],
    ['S + advised + object + to + V', 'My friend advised me to rest early.', 'Bạn tôi khuyên tôi nên nghỉ sớm.', 'Dùng để tường thuật lời khuyên.'],
    ['S + suggested + V-ing', 'He suggested taking a short break.', 'Anh ấy gợi ý nghỉ ngắn một chút.', 'Dùng để tường thuật lời gợi ý chung.'],
    ['S + promised + to + V', 'I promised to call her back.', 'Tôi hứa sẽ gọi lại cho cô ấy.', 'Dùng để tường thuật lời hứa.']
  ]
};

function generateGrammar() {
  const items = [];
  GRAMMAR_CATEGORY_META.forEach(([category, category_vi]) => {
    const quota = GRAMMAR_QUOTA[category];
    const source = GRAMMAR_BANK[category];
    for (let i = 0; i < quota; i += 1) {
      const row = source[i % source.length];
      items.push({
        pattern: row[0],
        category,
        category_vi,
        level: '',
        example: row[1],
        example_vi: row[2],
        explanation_vi: row[3]
      });
    }
  });

  const levels = seededShuffle(levelPool(LEVEL_QUOTA_GRAMMAR));
  items.forEach((item, idx) => {
    item.level = levels[idx];
  });

  return items;
}

function validate(vocab, grammar) {
  if (vocab.length !== 3000) throw new Error(`VOCAB_CHUNKS count mismatch: ${vocab.length}`);
  if (grammar.length !== 120) throw new Error(`GRAMMAR_PATTERNS count mismatch: ${grammar.length}`);

  const vocabKeys = ['topic', 'phrase', 'meaning_vi', 'explanation_vi', 'ipa', 'type', 'example_en', 'example_vi', 'subcategory', 'level', 'base_word', 'word_type'];
  const grammarKeys = ['pattern', 'category', 'category_vi', 'level', 'example', 'example_vi', 'explanation_vi'];

  const validTypes = new Set(['word', 'collocation', 'phrasal_verb', 'expression']);
  const validWordTypes = new Set(['noun', 'verb', 'adj']);

  const seen = new Set();
  vocab.forEach((item, idx) => {
    vocabKeys.forEach((k) => {
      if (!(k in item)) throw new Error(`Missing key ${k} at vocab index ${idx}`);
    });
    if (!validTypes.has(item.type)) throw new Error(`Invalid vocab type at index ${idx}: ${item.type}`);
    if (!validWordTypes.has(item.word_type)) throw new Error(`Invalid word_type at index ${idx}: ${item.word_type}`);
    if (seen.has(item.phrase.toLowerCase())) throw new Error(`Duplicate phrase: ${item.phrase}`);
    seen.add(item.phrase.toLowerCase());
    if (!/[À-ỹ]/.test(item.meaning_vi + item.explanation_vi + item.example_vi)) {
      throw new Error(`Vietnamese diacritics missing at vocab index ${idx}`);
    }
    if (/vstep|ielts|toeic/i.test(item.example_en + item.explanation_vi + item.example_vi)) {
      throw new Error(`Exam reference found at vocab index ${idx}`);
    }
  });

  grammar.forEach((item, idx) => {
    grammarKeys.forEach((k) => {
      if (!(k in item)) throw new Error(`Missing key ${k} at grammar index ${idx}`);
    });
    if (!/[À-ỹ]/.test(item.category_vi + item.example_vi + item.explanation_vi)) {
      throw new Error(`Vietnamese diacritics missing at grammar index ${idx}`);
    }
    if (/vstep|ielts|toeic/i.test(item.example + item.explanation_vi + item.example_vi)) {
      throw new Error(`Exam reference found at grammar index ${idx}`);
    }
  });

  const vocabLevelCount = vocab.reduce((acc, x) => ((acc[x.level] = (acc[x.level] || 0) + 1), acc), {});
  const grammarLevelCount = grammar.reduce((acc, x) => ((acc[x.level] = (acc[x.level] || 0) + 1), acc), {});

  Object.entries(LEVEL_QUOTA_VOCAB).forEach(([level, expected]) => {
    if (vocabLevelCount[level] !== expected) throw new Error(`Vocab level ${level} mismatch: ${vocabLevelCount[level]} != ${expected}`);
  });
  Object.entries(LEVEL_QUOTA_GRAMMAR).forEach(([level, expected]) => {
    if (grammarLevelCount[level] !== expected) throw new Error(`Grammar level ${level} mismatch: ${grammarLevelCount[level]} != ${expected}`);
  });
}

function writeFile(vocab, grammar) {
  const content = [
    `export const VOCAB_CHUNKS = ${JSON.stringify(vocab, null, 2)};`,
    '',
    `export const GRAMMAR_PATTERNS = ${JSON.stringify(grammar, null, 2)};`,
    ''
  ].join('\n');

  fs.writeFileSync(OUT_FILE, content, 'utf8');
}

function main() {
  const vocab = generateVocabulary();
  const grammar = generateGrammar();

  validate(vocab, grammar);
  writeFile(vocab, grammar);

  console.log('Regenerated src/data/grammar-chunks.ts');
  console.log('VOCAB_CHUNKS:', vocab.length);
  console.log('GRAMMAR_PATTERNS:', grammar.length);
}

main();
