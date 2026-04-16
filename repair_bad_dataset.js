const fs = require('fs');
const dict = require('./node_modules/ipa-dict/lib/en_US.js');

const FILE_PATH = 'src/data/grammar-chunks.ts';
const raw = fs.readFileSync(FILE_PATH, 'utf8');
const data = JSON.parse(raw);

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
  'Business Communication'
]);

const allowedLevels = new Set(['A1', 'A2', 'B1', 'B2']);
const stopwords = new Set(['a', 'an', 'the', 'to', 'for', 'of', 'with', 'on', 'at', 'in', 'up', 'out', 'off', 'back', 'down', 'over', 'through', 'into', 'from', 'your', 'my', 'our']);

const fallbackIpa = {
  wifi: 'ˈwaɪfaɪ',
  login: 'ˈlɔɡɪn',
  logout: 'ˈlɔɡaʊt',
  email: 'ˈiːmeɪl'
};

function isBadEntry(entry) {
  const normalize = (value) =>
    String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const phrase = normalize(entry.phrase);
  const meaning = normalize(entry.meaning_vi);
  const exampleVi = normalize(entry.example_vi);
  const explanationVi = normalize(entry.explanation_vi);
  const fakeIpa = String(entry.ipa || '').trim() === `/${entry.phrase}/`;

  return (
    fakeIpa ||
    meaning.startsWith('cum tu:') ||
    meaning.startsWith('tu vung:') ||
    meaning.startsWith('cum danh tu:') ||
    meaning.startsWith('cum tu chi hanh dong:') ||
    meaning.includes(`cum tu: ${phrase}`) ||
    meaning.includes(`tu vung: ${phrase}`) ||
    meaning.includes(`cum danh tu: ${phrase}`) ||
    meaning.includes(`cum tu chi hanh dong: ${phrase}`) ||
    exampleVi.startsWith('vi du') ||
    explanationVi.startsWith('dung trong chu de') ||
    explanationVi.startsWith('dien ta hanh dong')
  );
}

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

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function makeTopicConfig(topicVi, contextEn, contextVi, explanationVi, patterns) {
  return { topicVi, contextEn, contextVi, explanationVi, patterns };
}

const configs = {
  'Business Communication': makeTopicConfig(
    'giao tiếp trong công việc',
    'before the meeting starts',
    'trước khi cuộc họp bắt đầu',
    'Cụm này dùng khi bạn trao đổi công việc rõ ràng và chuyên nghiệp với đồng nghiệp hoặc khách hàng.',
    [
      { verb: 'review', verbVi: 'xem lại', objects: [['the agenda', 'chương trình họp'], ['the budget', 'ngân sách'], ['the report draft', 'bản nháp báo cáo'], ['the contract terms', 'điều khoản hợp đồng'], ['the meeting notes', 'ghi chú cuộc họp'], ['the cost estimate', 'bản dự toán chi phí'], ['the project timeline', 'tiến độ dự án'], ['the payment details', 'chi tiết thanh toán'], ['the action items', 'các việc cần làm'], ['the client feedback', 'phản hồi của khách hàng'], ['the sales figures', 'số liệu bán hàng'], ['the service plan', 'kế hoạch dịch vụ']] },
      { verb: 'check', verbVi: 'kiểm tra', objects: [['the invoice amount', 'số tiền trên hóa đơn'], ['the delivery date', 'ngày giao hàng'], ['the phone number', 'số điện thoại'], ['the room booking', 'đặt phòng họp'], ['the due date', 'hạn chót'], ['the attendance list', 'danh sách tham dự'], ['the contact details', 'thông tin liên hệ'], ['the file name', 'tên tệp'], ['the schedule', 'lịch trình'], ['the latest update', 'cập nhật mới nhất'], ['the email address', 'địa chỉ email'], ['the price quote', 'báo giá']] },
      { verb: 'discuss', verbVi: 'thảo luận', objects: [['the budget issue', 'vấn đề ngân sách'], ['the client request', 'yêu cầu của khách hàng'], ['the project delay', 'sự chậm trễ của dự án'], ['the staffing plan', 'kế hoạch nhân sự'], ['the sales target', 'mục tiêu doanh số'], ['the payment problem', 'vấn đề thanh toán'], ['the service update', 'cập nhật dịch vụ'], ['the contract change', 'thay đổi hợp đồng'], ['the support case', 'trường hợp hỗ trợ'], ['the launch plan', 'kế hoạch ra mắt'], ['the meeting result', 'kết quả cuộc họp'], ['the work priority', 'ưu tiên công việc']] },
      { verb: 'follow up on', verbVi: 'theo dõi thêm về', objects: [['the client email', 'email của khách hàng'], ['the support request', 'yêu cầu hỗ trợ'], ['the late payment', 'khoản thanh toán trễ'], ['the meeting summary', 'bản tóm tắt cuộc họp'], ['the revised draft', 'bản nháp đã sửa'], ['the pending task', 'nhiệm vụ còn chờ'], ['the approval request', 'yêu cầu phê duyệt'], ['the open question', 'câu hỏi còn bỏ ngỏ'], ['the delivery problem', 'vấn đề giao hàng'], ['the service ticket', 'phiếu hỗ trợ'], ['the interview date', 'ngày phỏng vấn'], ['the proposal update', 'cập nhật đề xuất']] },
      { verb: 'write down', verbVi: 'ghi lại', objects: [['the key points', 'những ý chính'], ['the next steps', 'các bước tiếp theo'], ['the client name', 'tên khách hàng'], ['the meeting time', 'thời gian họp'], ['the reminder date', 'ngày nhắc việc'], ['the follow up list', 'danh sách việc cần theo dõi'], ['the delivery note', 'ghi chú giao hàng'], ['the task owner', 'người phụ trách công việc'], ['the question list', 'danh sách câu hỏi'], ['the payment deadline', 'hạn thanh toán'], ['the action plan', 'kế hoạch hành động'], ['the contact name', 'tên người liên hệ']] },
      { verb: 'confirm', verbVi: 'xác nhận', objects: [['the meeting time', 'thời gian họp'], ['the delivery date', 'ngày giao hàng'], ['the phone number', 'số điện thoại'], ['the contact details', 'thông tin liên hệ'], ['the final price', 'giá cuối cùng'], ['the deadline', 'hạn chót'], ['the appointment time', 'giờ hẹn'], ['the order number', 'mã đơn hàng'], ['the payment amount', 'số tiền thanh toán'], ['the next step', 'bước tiếp theo'], ['the guest list', 'danh sách người tham dự'], ['the booking details', 'chi tiết đặt chỗ']] }
      ,
      { verb: 'go over', verbVi: 'xem kỹ', objects: [['the meeting plan', 'kế hoạch cuộc họp'], ['the talking points', 'các ý cần trao đổi'], ['the client note', 'ghi chú về khách hàng'], ['the draft budget', 'bản dự thảo ngân sách'], ['the weekly target', 'mục tiêu tuần'], ['the delivery update', 'cập nhật giao hàng'], ['the task summary', 'bản tóm tắt công việc'], ['the project brief', 'bản tóm tắt dự án']] }
    ]
  ),
  'Communication': makeTopicConfig(
    'giao tiếp hằng ngày',
    'before you respond',
    'trước khi bạn phản hồi',
    'Cụm này dùng khi bạn trao đổi thông tin, đặt câu hỏi hoặc làm rõ điều mình muốn nói.',
    [
      { verb: 'check', verbVi: 'kiểm tra', objects: [['the details', 'chi tiết'], ['the message', 'tin nhắn'], ['the phone number', 'số điện thoại'], ['the address', 'địa chỉ'], ['the call time', 'thời gian gọi'], ['the last note', 'ghi chú cuối cùng'], ['the meeting place', 'địa điểm gặp'], ['the name tag', 'tên trên thẻ'], ['the voice message', 'tin nhắn thoại'], ['the reminder', 'lời nhắc'], ['the information', 'thông tin'], ['the contact list', 'danh sách liên hệ']] },
      { verb: 'bring up', verbVi: 'nêu ra', objects: [['a problem', 'một vấn đề'], ['a question', 'một câu hỏi'], ['a concern', 'một mối lo'], ['an idea', 'một ý tưởng'], ['the next step', 'bước tiếp theo'], ['the mistake', 'lỗi sai'], ['the timing', 'thời điểm'], ['the main point', 'ý chính'], ['the issue', 'vấn đề'], ['the request', 'yêu cầu'], ['the missing detail', 'chi tiết còn thiếu'], ['the change', 'sự thay đổi']] },
      { verb: 'talk about', verbVi: 'nói về', objects: [['the plan', 'kế hoạch'], ['the problem', 'vấn đề'], ['the results', 'kết quả'], ['the schedule', 'lịch trình'], ['the idea', 'ý tưởng'], ['the update', 'bản cập nhật'], ['the misunderstanding', 'sự hiểu lầm'], ['the message', 'tin nhắn'], ['the conversation', 'cuộc trò chuyện'], ['the next move', 'bước đi tiếp theo'], ['the reason', 'lý do'], ['the situation', 'tình huống']] },
      { verb: 'ask about', verbVi: 'hỏi về', objects: [['the price', 'giá tiền'], ['the address', 'địa chỉ'], ['the deadline', 'hạn chót'], ['the meeting time', 'thời gian gặp'], ['the delivery', 'việc giao hàng'], ['the problem', 'vấn đề'], ['the answer', 'câu trả lời'], ['the ticket', 'vé'], ['the update', 'bản cập nhật'], ['the appointment', 'cuộc hẹn'], ['the result', 'kết quả'], ['the missing part', 'phần còn thiếu']] },
      { verb: 'leave', verbVi: 'để lại', objects: [['a message', 'một lời nhắn'], ['a note', 'một ghi chú'], ['your number', 'số điện thoại của bạn'], ['the details', 'chi tiết'], ['a reminder', 'một lời nhắc'], ['a question', 'một câu hỏi'], ['the address', 'địa chỉ'], ['the contact name', 'tên người liên hệ'], ['a short reply', 'một câu trả lời ngắn'], ['the exact time', 'thời gian chính xác'], ['the reason', 'lý do'], ['the instructions', 'hướng dẫn']] },
      { verb: 'clear up', verbVi: 'làm rõ', objects: [['the problem', 'vấn đề'], ['the misunderstanding', 'sự hiểu lầm'], ['the details', 'chi tiết'], ['the confusion', 'sự nhầm lẫn'], ['the timing', 'thời điểm'], ['the request', 'yêu cầu'], ['the reason', 'lý do'], ['the message', 'thông điệp'], ['the mistake', 'sai sót'], ['the plan', 'kế hoạch'], ['the issue', 'vấn đề'], ['the concern', 'mối lo']] },
      { verb: 'confirm', verbVi: 'xác nhận', objects: [['the time', 'thời gian'], ['the date', 'ngày tháng'], ['the address', 'địa chỉ'], ['the phone number', 'số điện thoại'], ['the meeting point', 'điểm hẹn'], ['the booking details', 'chi tiết đặt chỗ'], ['the full name', 'họ tên đầy đủ'], ['the order number', 'mã đơn hàng'], ['the plan', 'kế hoạch'], ['the instructions', 'hướng dẫn'], ['the price', 'giá tiền'], ['the final details', 'chi tiết cuối cùng']] },
      { verb: 'go over', verbVi: 'xem kỹ', objects: [['the plan', 'kế hoạch'], ['the notes', 'ghi chú'], ['the details', 'chi tiết'], ['the schedule', 'lịch trình'], ['the instructions', 'hướng dẫn'], ['the question list', 'danh sách câu hỏi'], ['the latest message', 'tin nhắn mới nhất'], ['the draft reply', 'bản nháp phản hồi'], ['the change list', 'danh sách thay đổi'], ['the voice note', 'tin nhắn thoại'], ['the contact details', 'thông tin liên hệ'], ['the summary', 'bản tóm tắt']] },
      { verb: 'write down', verbVi: 'ghi lại', objects: [['the phone number', 'số điện thoại'], ['the address', 'địa chỉ'], ['the full name', 'họ tên đầy đủ'], ['the message', 'tin nhắn'], ['the key points', 'những ý chính'], ['the next steps', 'các bước tiếp theo'], ['the date', 'ngày tháng'], ['the time', 'thời gian'], ['the answer', 'câu trả lời'], ['the instructions', 'hướng dẫn'], ['the reminder', 'lời nhắc'], ['the contact details', 'thông tin liên hệ']] },
      { verb: 'point out', verbVi: 'chỉ ra', objects: [['the problem', 'vấn đề'], ['the mistake', 'lỗi sai'], ['the difference', 'điểm khác biệt'], ['the main point', 'ý chính'], ['the missing detail', 'chi tiết còn thiếu'], ['the issue', 'vấn đề'], ['the reason', 'lý do'], ['the timing problem', 'vấn đề về thời gian'], ['the spelling error', 'lỗi chính tả'], ['the unclear part', 'phần chưa rõ'], ['the change', 'sự thay đổi'], ['the better option', 'lựa chọn tốt hơn']] },
      { verb: 'pass on', verbVi: 'chuyển lại', objects: [['the message', 'lời nhắn'], ['the details', 'chi tiết'], ['the reminder', 'lời nhắc'], ['the news', 'tin tức'], ['the update', 'bản cập nhật'], ['the request', 'yêu cầu'], ['the answer', 'câu trả lời'], ['the invitation', 'lời mời'], ['the complaint', 'lời phàn nàn'], ['the phone number', 'số điện thoại'], ['the information', 'thông tin'], ['the note', 'ghi chú']] },
      { verb: 'follow up on', verbVi: 'theo dõi thêm về', objects: [['the message', 'tin nhắn'], ['the request', 'yêu cầu'], ['the question', 'câu hỏi'], ['the complaint', 'lời phàn nàn'], ['the plan', 'kế hoạch'], ['the email', 'email'], ['the update', 'bản cập nhật'], ['the discussion', 'cuộc trao đổi'], ['the issue', 'vấn đề'], ['the concern', 'mối lo'], ['the feedback', 'phản hồi'], ['the missing details', 'những chi tiết còn thiếu']] },
      { verb: 'sort out', verbVi: 'giải quyết', objects: [['the details', 'chi tiết'], ['the problem', 'vấn đề'], ['the schedule', 'lịch trình'], ['the mix-up', 'sự nhầm lẫn'], ['the mistake', 'lỗi sai'], ['the confusion', 'sự nhầm lẫn'], ['the timing', 'thời điểm'], ['the issue', 'vấn đề'], ['the request', 'yêu cầu'], ['the misunderstanding', 'sự hiểu lầm'], ['the contact list', 'danh sách liên hệ'], ['the message chain', 'chuỗi tin nhắn']] },
      { verb: 'spell out', verbVi: 'đánh vần rõ', objects: [['the name', 'tên'], ['the address', 'địa chỉ'], ['the street name', 'tên đường'], ['the last name', 'họ'], ['the full name', 'họ tên đầy đủ'], ['the email address', 'địa chỉ email'], ['the hotel name', 'tên khách sạn'], ['the company name', 'tên công ty'], ['the meeting code', 'mã cuộc họp'], ['the file name', 'tên tệp'], ['the password hint', 'gợi ý mật khẩu'], ['the contact name', 'tên người liên hệ']] },
      { verb: 'read back', verbVi: 'đọc lại', objects: [['the message', 'tin nhắn'], ['the phone number', 'số điện thoại'], ['the address', 'địa chỉ'], ['the note', 'ghi chú'], ['the instructions', 'hướng dẫn'], ['the order number', 'mã đơn hàng'], ['the details', 'chi tiết'], ['the schedule', 'lịch trình'], ['the full name', 'họ tên đầy đủ'], ['the time', 'thời gian'], ['the answer', 'câu trả lời'], ['the list', 'danh sách']] },
      { verb: 'mention', verbVi: 'đề cập đến', objects: [['the issue', 'vấn đề'], ['the reason', 'lý do'], ['the delay', 'sự chậm trễ'], ['the plan', 'kế hoạch'], ['the concern', 'mối lo'], ['the price', 'giá tiền'], ['the address change', 'việc đổi địa chỉ'], ['the meeting point', 'điểm hẹn'], ['the time change', 'việc đổi giờ'], ['the next step', 'bước tiếp theo'], ['the missing detail', 'chi tiết còn thiếu'], ['the problem again', 'vấn đề đó một lần nữa']] },
      { verb: 'explain', verbVi: 'giải thích', objects: [['the problem', 'vấn đề'], ['the reason', 'lý do'], ['the plan', 'kế hoạch'], ['the change', 'sự thay đổi'], ['the rules', 'quy định'], ['the details', 'chi tiết'], ['the steps', 'các bước'], ['the timing', 'thời điểm'], ['the issue', 'vấn đề'], ['the difference', 'sự khác biệt'], ['the decision', 'quyết định'], ['the situation', 'tình huống']] },
      { verb: 'repeat', verbVi: 'nhắc lại', objects: [['the question', 'câu hỏi'], ['the answer', 'câu trả lời'], ['the name', 'tên'], ['the address', 'địa chỉ'], ['the main point', 'ý chính'], ['the instructions', 'hướng dẫn'], ['the number', 'con số'], ['the reason', 'lý do'], ['the details', 'chi tiết'], ['the update', 'bản cập nhật'], ['the message', 'tin nhắn'], ['the time', 'thời gian']] },
      { verb: 'sum up', verbVi: 'tóm tắt', objects: [['the main points', 'những ý chính'], ['the problem', 'vấn đề'], ['the plan', 'kế hoạch'], ['the discussion', 'cuộc trao đổi'], ['the results', 'kết quả'], ['the changes', 'các thay đổi'], ['the issue', 'vấn đề'], ['the feedback', 'phản hồi'], ['the key details', 'những chi tiết quan trọng'], ['the meeting', 'cuộc họp'], ['the conversation', 'cuộc trò chuyện'], ['the next steps', 'các bước tiếp theo']] },
      { verb: 'talk through', verbVi: 'trao đổi kỹ về', objects: [['the problem', 'vấn đề'], ['the plan', 'kế hoạch'], ['the details', 'chi tiết'], ['the steps', 'các bước'], ['the issue', 'vấn đề'], ['the schedule', 'lịch trình'], ['the options', 'các lựa chọn'], ['the change', 'sự thay đổi'], ['the concern', 'mối lo'], ['the request', 'yêu cầu'], ['the message', 'tin nhắn'], ['the misunderstanding', 'sự hiểu lầm']] },
      { verb: 'note down', verbVi: 'ghi chú lại', objects: [['the number', 'số điện thoại'], ['the address', 'địa chỉ'], ['the name', 'tên'], ['the key point', 'ý chính'], ['the reminder', 'lời nhắc'], ['the next step', 'bước tiếp theo'], ['the date', 'ngày tháng'], ['the time', 'thời gian'], ['the question', 'câu hỏi'], ['the answer', 'câu trả lời'], ['the contact details', 'thông tin liên hệ'], ['the order number', 'mã đơn hàng']] },
      { verb: 'look over', verbVi: 'xem qua', objects: [['the message', 'tin nhắn'], ['the details', 'chi tiết'], ['the instructions', 'hướng dẫn'], ['the contact list', 'danh sách liên hệ'], ['the address', 'địa chỉ'], ['the plan', 'kế hoạch'], ['the schedule', 'lịch trình'], ['the question list', 'danh sách câu hỏi'], ['the update', 'bản cập nhật'], ['the draft', 'bản nháp'], ['the note', 'ghi chú'], ['the request', 'yêu cầu']] },
      { verb: 'respond to', verbVi: 'phản hồi', objects: [['the question', 'câu hỏi'], ['the message', 'tin nhắn'], ['the email', 'email'], ['the complaint', 'lời phàn nàn'], ['the request', 'yêu cầu'], ['the concern', 'mối lo'], ['the comment', 'bình luận'], ['the invitation', 'lời mời'], ['the update', 'bản cập nhật'], ['the reminder', 'lời nhắc'], ['the note', 'ghi chú'], ['the feedback', 'phản hồi']] },
      { verb: 'get back to', verbVi: 'phản hồi cho', objects: [['the caller', 'người gọi'], ['the manager', 'quản lý'], ['the team', 'nhóm'], ['the client', 'khách hàng'], ['the teacher', 'giáo viên'], ['the receptionist', 'lễ tân'], ['the neighbor', 'hàng xóm'], ['the customer', 'khách hàng'], ['the friend', 'người bạn'], ['the driver', 'tài xế'], ['the landlord', 'chủ nhà'], ['the office', 'văn phòng']] },
      { verb: 'call back', verbVi: 'gọi lại cho', objects: [['the client', 'khách hàng'], ['the customer', 'khách hàng'], ['the office', 'văn phòng'], ['the teacher', 'giáo viên'], ['the manager', 'quản lý'], ['the friend', 'người bạn'], ['the driver', 'tài xế'], ['the receptionist', 'lễ tân'], ['the neighbor', 'hàng xóm'], ['the landlord', 'chủ nhà'], ['the support line', 'bộ phận hỗ trợ'], ['the caller', 'người gọi']] },
      { verb: 'touch base with', verbVi: 'trao đổi nhanh với', objects: [['the team', 'nhóm'], ['the client', 'khách hàng'], ['the manager', 'quản lý'], ['the teacher', 'giáo viên'], ['the office', 'văn phòng'], ['the neighbor', 'hàng xóm'], ['the friend', 'người bạn'], ['the customer', 'khách hàng'], ['the driver', 'tài xế'], ['the group leader', 'trưởng nhóm'], ['the organizer', 'người tổ chức'], ['the contact person', 'người liên hệ']] },
      { verb: 'send over', verbVi: 'gửi qua', objects: [['the details', 'chi tiết'], ['the updated schedule', 'lịch đã cập nhật'], ['the phone number', 'số điện thoại'], ['the address', 'địa chỉ'], ['the file name', 'tên tệp'], ['the meeting link', 'liên kết cuộc họp'], ['the final note', 'ghi chú cuối cùng'], ['the checklist', 'danh sách kiểm tra'], ['the room number', 'số phòng'], ['the confirmation', 'xác nhận'], ['the price quote', 'báo giá'], ['the date', 'ngày tháng']] },
      { verb: 'work out', verbVi: 'làm rõ', objects: [['the details', 'chi tiết'], ['the problem', 'vấn đề'], ['the schedule', 'lịch trình'], ['the misunderstanding', 'sự hiểu lầm'], ['the timing', 'thời điểm'], ['the request', 'yêu cầu'], ['the issue', 'vấn đề'], ['the next steps', 'các bước tiếp theo'], ['the plan', 'kế hoạch'], ['the message', 'tin nhắn'], ['the answer', 'câu trả lời'], ['the contact details', 'thông tin liên hệ']] },
      { verb: 'double-check', verbVi: 'kiểm tra lại', objects: [['the address', 'địa chỉ'], ['the phone number', 'số điện thoại'], ['the date', 'ngày tháng'], ['the time', 'thời gian'], ['the spelling', 'cách viết'], ['the instructions', 'hướng dẫn'], ['the details', 'chi tiết'], ['the meeting point', 'điểm hẹn'], ['the booking code', 'mã đặt chỗ'], ['the order number', 'mã đơn hàng'], ['the contact name', 'tên người liên hệ'], ['the last message', 'tin nhắn cuối cùng']] }
    ]
  ),
  'Daily Life': makeTopicConfig(
    'sinh hoạt hằng ngày',
    'before you head out',
    'trước khi bạn ra ngoài',
    'Cụm này dùng cho những việc quen thuộc trong sinh hoạt thường ngày.',
    [
      { verb: 'check', verbVi: 'kiểm tra', objects: [['the grocery list', 'danh sách đồ cần mua'], ['the front door', 'cửa trước'], ['your bus card', 'thẻ xe buýt của bạn'], ['your phone battery', 'pin điện thoại'], ['the next stop', 'điểm dừng tiếp theo'], ['the house key', 'chìa khóa nhà'], ['the water bottle', 'chai nước'], ['the alarm time', 'giờ báo thức'], ['the lunch box', 'hộp cơm trưa'], ['the room light', 'đèn phòng'], ['the to do list', 'danh sách việc cần làm'], ['the weather note', 'ghi chú thời tiết']] },
      { verb: 'pack', verbVi: 'chuẩn bị', objects: [['your lunch', 'bữa trưa của bạn'], ['a small bag', 'một chiếc túi nhỏ'], ['a clean shirt', 'một chiếc áo sạch'], ['some snacks', 'một ít đồ ăn nhẹ'], ['a bottle of water', 'một chai nước'], ['your workout clothes', 'quần áo tập'], ['the school papers', 'giấy tờ đi học'], ['the house key', 'chìa khóa nhà'], ['your notebook', 'quyển sổ của bạn'], ['the charger', 'bộ sạc'], ['an extra mask', 'một chiếc khẩu trang dự phòng'], ['the shopping bag', 'túi mua sắm']] },
      { verb: 'clean', verbVi: 'dọn', objects: [['the kitchen table', 'bàn bếp'], ['the sink', 'bồn rửa'], ['the bedroom floor', 'sàn phòng ngủ'], ['the bathroom mirror', 'gương phòng tắm'], ['the dishes', 'bát đĩa'], ['the living room', 'phòng khách'], ['the lunch box', 'hộp cơm'], ['the work desk', 'bàn làm việc'], ['the window', 'cửa sổ'], ['the shelf', 'kệ'], ['the fan', 'quạt'], ['the counter', 'mặt bếp']] },
      { verb: 'set', verbVi: 'sắp', objects: [['the table', 'bàn ăn'], ['the alarm', 'báo thức'], ['the timer', 'hẹn giờ'], ['the coffee cup', 'tách cà phê'], ['the room fan', 'quạt phòng'], ['the washing machine', 'máy giặt'], ['the lunch plate', 'đĩa cơm trưa'], ['the shopping basket', 'giỏ mua sắm'], ['the phone charger', 'bộ sạc điện thoại'], ['the towel', 'khăn tắm'], ['the notebook', 'quyển sổ'], ['the morning plan', 'kế hoạch buổi sáng']] },
      { verb: 'put away', verbVi: 'cất', objects: [['the clean clothes', 'quần áo sạch'], ['the dishes', 'bát đĩa'], ['the shoes', 'giày dép'], ['the groceries', 'đồ tạp hóa'], ['the school bag', 'cặp sách'], ['the work papers', 'giấy tờ công việc'], ['the keys', 'chìa khóa'], ['the phone charger', 'bộ sạc điện thoại'], ['the blanket', 'chăn'], ['the books', 'sách'], ['the toys', 'đồ chơi'], ['the laundry basket', 'giỏ đồ giặt']] },
      { verb: 'plan', verbVi: 'lên kế hoạch cho', objects: [['the day ahead', 'ngày sắp tới'], ['the evening meal', 'bữa tối'], ['the next errand', 'việc cần làm tiếp theo'], ['the bus ride', 'chuyến xe buýt'], ['the weekend chores', 'việc nhà cuối tuần'], ['the morning routine', 'thói quen buổi sáng'], ['the shopping trip', 'chuyến đi mua sắm'], ['the laundry time', 'giờ giặt đồ'], ['the dinner break', 'khoảng nghỉ ăn tối'], ['the study hour', 'giờ học'], ['the short walk', 'một buổi đi bộ ngắn'], ['the family visit', 'buổi thăm gia đình']] }
    ]
  ),
  'Education': makeTopicConfig(
    'việc học tập',
    'before class starts',
    'trước khi giờ học bắt đầu',
    'Cụm này dùng khi nói về bài học, bài tập hoặc việc trao đổi trong lớp.',
    [
      { verb: 'review', verbVi: 'ôn lại', objects: [['the lesson notes', 'ghi chú bài học'], ['the homework', 'bài tập về nhà'], ['the key formula', 'công thức chính'], ['the reading list', 'danh sách bài đọc'], ['the class outline', 'dàn ý bài học'], ['the last chapter', 'chương trước'], ['the practice test', 'bài kiểm tra luyện tập'], ['the study guide', 'hướng dẫn ôn tập'], ['the teacher comments', 'nhận xét của giáo viên'], ['the quiz answers', 'đáp án bài kiểm tra ngắn'], ['the essay draft', 'bản nháp bài luận'], ['the group notes', 'ghi chú của nhóm']] },
      { verb: 'write down', verbVi: 'ghi lại', objects: [['the answer', 'câu trả lời'], ['the question', 'câu hỏi'], ['the homework date', 'ngày nộp bài'], ['the page number', 'số trang'], ['the new word', 'từ mới'], ['the main idea', 'ý chính'], ['the example sentence', 'câu ví dụ'], ['the teacher note', 'ghi chú của giáo viên'], ['the class task', 'nhiệm vụ trên lớp'], ['the speaking topic', 'chủ đề nói'], ['the reading point', 'ý đọc hiểu'], ['the study goal', 'mục tiêu học tập']] },
      { verb: 'ask about', verbVi: 'hỏi về', objects: [['the assignment', 'bài tập'], ['the test format', 'định dạng bài kiểm tra'], ['the exam date', 'ngày thi'], ['the grading rule', 'cách chấm điểm'], ['the project topic', 'chủ đề dự án'], ['the class rule', 'nội quy lớp'], ['the speaking task', 'nhiệm vụ nói'], ['the group work', 'bài làm nhóm'], ['the extra credit', 'điểm cộng thêm'], ['the class material', 'tài liệu lớp học'], ['the feedback', 'phản hồi'], ['the next lesson', 'bài học tiếp theo']] },
      { verb: 'work on', verbVi: 'làm', objects: [['the class project', 'dự án lớp học'], ['the essay draft', 'bản nháp bài luận'], ['the lab report', 'báo cáo thực hành'], ['the speaking task', 'bài tập nói'], ['the reading summary', 'bản tóm tắt bài đọc'], ['the math problem', 'bài toán'], ['the group presentation', 'bài thuyết trình nhóm'], ['the writing outline', 'dàn ý bài viết'], ['the homework sheet', 'phiếu bài tập'], ['the vocabulary list', 'danh sách từ vựng'], ['the research note', 'ghi chú nghiên cứu'], ['the final revision', 'phần ôn tập cuối']] },
      { verb: 'prepare for', verbVi: 'chuẩn bị cho', objects: [['the quiz', 'bài kiểm tra ngắn'], ['the oral test', 'bài kiểm tra nói'], ['the final exam', 'bài thi cuối kỳ'], ['the class discussion', 'buổi thảo luận trên lớp'], ['the group meeting', 'buổi họp nhóm'], ['the presentation', 'bài thuyết trình'], ['the next lesson', 'bài học tiếp theo'], ['the study session', 'buổi học'], ['the lab class', 'giờ thực hành'], ['the reading task', 'nhiệm vụ đọc'], ['the writing test', 'bài kiểm tra viết'], ['the school interview', 'buổi phỏng vấn ở trường']] },
      { verb: 'hand in', verbVi: 'nộp', objects: [['the homework', 'bài tập về nhà'], ['the essay', 'bài luận'], ['the worksheet', 'phiếu bài tập'], ['the project report', 'báo cáo dự án'], ['the reading log', 'nhật ký đọc sách'], ['the lab paper', 'bài thực hành'], ['the assignment', 'bài tập'], ['the answer sheet', 'phiếu trả lời'], ['the group summary', 'bản tóm tắt của nhóm'], ['the revision task', 'bài ôn tập'], ['the writing task', 'bài viết'], ['the study plan', 'kế hoạch học tập']] }
    ]
  ),
  'Emotions & Feelings': makeTopicConfig(
    'cảm xúc và tâm trạng',
    'when you need support',
    'khi bạn cần sự hỗ trợ',
    'Cụm này dùng khi bạn nói về cảm xúc, trạng thái tinh thần hoặc cách đối diện với tâm trạng của mình.',
    [
      { verb: 'talk about', verbVi: 'nói về', objects: [['your feelings', 'cảm xúc của bạn'], ['the bad mood', 'tâm trạng xấu'], ['the stress', 'căng thẳng'], ['the worry', 'nỗi lo'], ['the fear', 'nỗi sợ'], ['the pressure', 'áp lực'], ['the disappointment', 'sự thất vọng'], ['the frustration', 'sự bực bội'], ['the sadness', 'nỗi buồn'], ['the guilt', 'cảm giác tội lỗi'], ['the tension', 'sự căng thẳng'], ['the relief', 'sự nhẹ nhõm']] },
      { verb: 'deal with', verbVi: 'đối mặt với', objects: [['the pressure', 'áp lực'], ['the stress', 'căng thẳng'], ['the sadness', 'nỗi buồn'], ['the anxiety', 'sự lo âu'], ['the anger', 'cơn giận'], ['the disappointment', 'sự thất vọng'], ['the fear', 'nỗi sợ'], ['the guilt', 'cảm giác tội lỗi'], ['the awkward feeling', 'cảm giác ngượng ngùng'], ['the loneliness', 'sự cô đơn'], ['the tension', 'sự căng thẳng'], ['the emotional strain', 'sự mệt mỏi cảm xúc']] },
      { verb: 'get through', verbVi: 'vượt qua', objects: [['a hard day', 'một ngày khó khăn'], ['a stressful week', 'một tuần căng thẳng'], ['an awkward moment', 'một khoảnh khắc ngượng ngùng'], ['a sad evening', 'một buổi tối buồn'], ['a rough conversation', 'một cuộc trò chuyện nặng nề'], ['a long argument', 'một cuộc cãi vã dài'], ['a tense meeting', 'một cuộc họp căng thẳng'], ['a hard time', 'một giai đoạn khó khăn'], ['a disappointing result', 'một kết quả gây thất vọng'], ['a worried night', 'một đêm đầy lo lắng'], ['a difficult change', 'một thay đổi khó khăn'], ['a low moment', 'một thời điểm chùng xuống']] },
      { verb: 'open up about', verbVi: 'cởi mở chia sẻ về', objects: [['your worries', 'những nỗi lo của bạn'], ['your stress', 'sự căng thẳng của bạn'], ['your fear', 'nỗi sợ của bạn'], ['your sadness', 'nỗi buồn của bạn'], ['your frustration', 'sự bực bội của bạn'], ['your anxiety', 'sự lo âu của bạn'], ['your self doubt', 'sự nghi ngờ bản thân'], ['your pressure', 'áp lực của bạn'], ['your concern', 'mối lo của bạn'], ['your emotions', 'cảm xúc của bạn'], ['your problem', 'vấn đề của bạn'], ['your thoughts', 'suy nghĩ của bạn']] },
      { verb: 'let go of', verbVi: 'buông bỏ', objects: [['the stress', 'căng thẳng'], ['the anger', 'cơn giận'], ['the bad memory', 'ký ức không vui'], ['the guilt', 'cảm giác tội lỗi'], ['the pressure', 'áp lực'], ['the worry', 'nỗi lo'], ['the fear', 'nỗi sợ'], ['the tension', 'sự căng thẳng'], ['the negative thought', 'suy nghĩ tiêu cực'], ['the disappointment', 'sự thất vọng'], ['the self doubt', 'sự nghi ngờ bản thân'], ['the bad mood', 'tâm trạng xấu']] },
      { verb: 'calm down after', verbVi: 'bình tĩnh lại sau', objects: [['an argument', 'một cuộc cãi vã'], ['a bad day', 'một ngày tệ'], ['a stressful class', 'một buổi học căng thẳng'], ['a difficult talk', 'một cuộc nói chuyện khó khăn'], ['a long meeting', 'một cuộc họp dài'], ['a scary moment', 'một khoảnh khắc đáng sợ'], ['a busy morning', 'một buổi sáng bận rộn'], ['a sudden change', 'một thay đổi bất ngờ'], ['a hard test', 'một bài kiểm tra khó'], ['a rough shift', 'một ca làm vất vả'], ['a tense phone call', 'một cuộc gọi căng thẳng'], ['a long trip', 'một chuyến đi dài']] }
    ]
  ),
  'Entertainment': makeTopicConfig(
    'giải trí',
    'for the weekend',
    'cho dịp cuối tuần',
    'Cụm này dùng khi bạn nói về hoạt động giải trí, thư giãn hoặc sở thích cá nhân.',
    [
      { verb: 'watch', verbVi: 'xem', objects: [['a new movie', 'một bộ phim mới'], ['the latest episode', 'tập mới nhất'], ['a live show', 'một chương trình trực tiếp'], ['a short film', 'một phim ngắn'], ['a comedy clip', 'một đoạn hài'], ['the concert video', 'video buổi hòa nhạc'], ['a music performance', 'một màn biểu diễn âm nhạc'], ['a travel vlog', 'một vlog du lịch'], ['a game stream', 'một buổi phát game'], ['a dance video', 'một video nhảy'], ['the trailer', 'đoạn giới thiệu'], ['a talent show', 'một chương trình tài năng']] },
      { verb: 'listen to', verbVi: 'nghe', objects: [['a new song', 'một bài hát mới'], ['a podcast episode', 'một tập podcast'], ['the radio show', 'chương trình radio'], ['a movie soundtrack', 'nhạc phim'], ['a live performance', 'một buổi biểu diễn trực tiếp'], ['a music playlist', 'danh sách nhạc'], ['an interview', 'một cuộc phỏng vấn'], ['a comedy set', 'một tiết mục hài'], ['a relaxing track', 'một bản nhạc thư giãn'], ['the concert recording', 'bản thu buổi hòa nhạc'], ['a short story', 'một truyện ngắn'], ['the latest release', 'bản phát hành mới nhất']] },
      { verb: 'talk about', verbVi: 'nói về', objects: [['the ending', 'kết thúc'], ['the main character', 'nhân vật chính'], ['the funny scene', 'cảnh hài hước'], ['the best part', 'phần hay nhất'], ['the soundtrack', 'nhạc nền'], ['the plot twist', 'tình tiết bất ngờ'], ['the new episode', 'tập mới'], ['the performance', 'màn trình diễn'], ['the review', 'bài đánh giá'], ['the story line', 'mạch truyện'], ['the final scene', 'cảnh cuối'], ['the comedy show', 'chương trình hài']] },
      { verb: 'plan', verbVi: 'lên kế hoạch cho', objects: [['a movie night', 'một tối xem phim'], ['a karaoke session', 'một buổi karaoke'], ['a game night', 'một buổi chơi game'], ['a concert trip', 'một chuyến đi xem hòa nhạc'], ['a weekend show', 'một buổi diễn cuối tuần'], ['a family movie', 'một buổi xem phim cùng gia đình'], ['an evening playlist', 'danh sách nhạc buổi tối'], ['a streaming break', 'một buổi xem trực tuyến'], ['a fun outing', 'một buổi đi chơi vui vẻ'], ['a dance practice', 'một buổi tập nhảy'], ['a short performance', 'một tiết mục ngắn'], ['an online watch party', 'một buổi xem chung trực tuyến']] },
      { verb: 'join', verbVi: 'tham gia', objects: [['a game session', 'một buổi chơi game'], ['a karaoke night', 'một đêm karaoke'], ['a movie discussion', 'một buổi bàn về phim'], ['a dance class', 'một lớp nhảy'], ['a fan event', 'một sự kiện dành cho người hâm mộ'], ['a music club', 'một câu lạc bộ âm nhạc'], ['an art workshop', 'một buổi thực hành nghệ thuật'], ['a live stream', 'một buổi phát trực tiếp'], ['a quiz night', 'một đêm đố vui'], ['a board game round', 'một ván trò chơi bàn'], ['a theater trip', 'một chuyến đi xem kịch'], ['a short rehearsal', 'một buổi tập ngắn']] },
      { verb: 'enjoy', verbVi: 'thưởng thức', objects: [['the live music', 'nhạc sống'], ['the comedy show', 'chương trình hài'], ['the movie night', 'đêm xem phim'], ['the art exhibit', 'buổi trưng bày nghệ thuật'], ['the dance performance', 'màn biểu diễn nhảy'], ['the book fair', 'hội sách'], ['the street show', 'buổi diễn đường phố'], ['the music festival', 'lễ hội âm nhạc'], ['the game stream', 'buổi phát game'], ['the film club', 'câu lạc bộ phim'], ['the late show', 'chương trình tối muộn'], ['the weekend concert', 'buổi hòa nhạc cuối tuần']] }
    ]
  ),
  'Family & Relationships': makeTopicConfig(
    'gia đình và các mối quan hệ',
    'when you want to stay close',
    'khi bạn muốn giữ sự gắn bó',
    'Cụm này dùng khi bạn nói về việc quan tâm, hỗ trợ và giữ liên hệ với người thân.',
    [
      { verb: 'check on', verbVi: 'hỏi thăm', objects: [['your parents', 'bố mẹ'], ['your sister', 'chị hoặc em gái'], ['your brother', 'anh hoặc em trai'], ['your grandparents', 'ông bà'], ['a relative', 'một người họ hàng'], ['your cousin', 'anh chị em họ'], ['your uncle', 'chú hoặc cậu'], ['your aunt', 'cô hoặc dì'], ['your family member', 'người thân trong gia đình'], ['your child', 'con của bạn'], ['your partner', 'người yêu hoặc bạn đời'], ['your spouse', 'vợ hoặc chồng']] },
      { verb: 'keep in touch with', verbVi: 'giữ liên lạc với', objects: [['your parents', 'bố mẹ'], ['your siblings', 'anh chị em'], ['your relatives', 'người thân'], ['your old friends', 'bạn cũ'], ['your cousins', 'anh chị em họ'], ['your in laws', 'gia đình bên chồng hoặc vợ'], ['your former neighbors', 'hàng xóm cũ'], ['your host family', 'gia đình chủ nhà'], ['your partner', 'người yêu hoặc bạn đời'], ['your school friends', 'bạn học'], ['your childhood friends', 'bạn thời thơ ấu'], ['your family group', 'nhóm gia đình']] },
      { verb: 'spend time with', verbVi: 'dành thời gian với', objects: [['your family', 'gia đình'], ['your parents', 'bố mẹ'], ['your children', 'các con'], ['your grandparents', 'ông bà'], ['your partner', 'người yêu hoặc bạn đời'], ['your cousins', 'anh chị em họ'], ['your siblings', 'anh chị em'], ['your relatives', 'người thân'], ['your best friend', 'bạn thân'], ['your host family', 'gia đình chủ nhà'], ['your nephew', 'cháu trai'], ['your niece', 'cháu gái']] },
      { verb: 'talk to', verbVi: 'trò chuyện với', objects: [['your mother', 'mẹ'], ['your father', 'bố'], ['your sister', 'chị hoặc em gái'], ['your brother', 'anh hoặc em trai'], ['your grandparents', 'ông bà'], ['your child', 'con của bạn'], ['your partner', 'người yêu hoặc bạn đời'], ['a relative', 'một người họ hàng'], ['your cousin', 'anh chị em họ'], ['your aunt', 'cô hoặc dì'], ['your uncle', 'chú hoặc cậu'], ['your family doctor', 'bác sĩ gia đình']] },
      { verb: 'help with', verbVi: 'giúp', objects: [['the housework', 'việc nhà'], ['the family dinner', 'bữa tối gia đình'], ['the child care', 'việc chăm con'], ['the shopping bags', 'các túi đồ mua sắm'], ['the school work', 'việc học'], ['the travel plans', 'kế hoạch đi lại'], ['the doctor visit', 'buổi đi khám'], ['the home repair', 'việc sửa nhà'], ['the birthday party', 'tiệc sinh nhật'], ['the moving day', 'ngày chuyển nhà'], ['the paperwork', 'giấy tờ'], ['the family trip', 'chuyến đi gia đình']] },
      { verb: 'stop by', verbVi: 'ghé qua', objects: [['your parents house', 'nhà bố mẹ'], ['your grandparents home', 'nhà ông bà'], ['your sisters place', 'chỗ của chị hoặc em gái'], ['your brothers apartment', 'căn hộ của anh hoặc em trai'], ['your uncles house', 'nhà chú hoặc cậu'], ['your aunts place', 'chỗ của cô hoặc dì'], ['a relatives home', 'nhà người thân'], ['your cousins house', 'nhà anh chị em họ'], ['the family dinner', 'bữa tối gia đình'], ['the neighborhood shop', 'cửa hàng gần nhà'], ['your friends home', 'nhà bạn'], ['the clinic', 'phòng khám']] }
    ]
  ),
  'Food & Cooking': makeTopicConfig(
    'ăn uống và nấu nướng',
    'before dinner',
    'trước bữa tối',
    'Cụm này dùng khi bạn nói về việc chuẩn bị món ăn, nấu nướng hoặc gọi món.',
    [
      { verb: 'cut up', verbVi: 'cắt nhỏ', objects: [['the vegetables', 'rau củ'], ['the fruit', 'trái cây'], ['the chicken', 'thịt gà'], ['the onions', 'hành tây'], ['the carrots', 'cà rốt'], ['the herbs', 'rau thơm'], ['the bread', 'bánh mì'], ['the mushrooms', 'nấm'], ['the potatoes', 'khoai tây'], ['the peppers', 'ớt chuông'], ['the beef', 'thịt bò'], ['the cucumber', 'dưa leo']] },
      { verb: 'season', verbVi: 'nêm', objects: [['the soup', 'món súp'], ['the salad', 'món salad'], ['the meat', 'thịt'], ['the noodles', 'mì'], ['the rice', 'cơm'], ['the sauce', 'nước sốt'], ['the chicken', 'thịt gà'], ['the vegetables', 'rau củ'], ['the fish', 'cá'], ['the eggs', 'trứng'], ['the pasta', 'món mì Ý'], ['the broth', 'nước dùng']] },
      { verb: 'heat up', verbVi: 'hâm nóng', objects: [['the leftovers', 'đồ ăn còn lại'], ['the soup', 'món súp'], ['the rice', 'cơm'], ['the pasta', 'món mì Ý'], ['the sauce', 'nước sốt'], ['the curry', 'món cà ri'], ['the tea', 'trà'], ['the milk', 'sữa'], ['the bread', 'bánh mì'], ['the noodles', 'mì'], ['the lunch box', 'hộp cơm'], ['the meal', 'bữa ăn']] },
      { verb: 'set aside', verbVi: 'để riêng', objects: [['the chopped onions', 'phần hành đã cắt'], ['the cooked rice', 'cơm đã nấu'], ['the extra sauce', 'phần sốt thêm'], ['the fresh herbs', 'rau thơm tươi'], ['the lunch portion', 'khẩu phần ăn trưa'], ['the dessert plate', 'đĩa tráng miệng'], ['the salad bowl', 'tô salad'], ['the soup spoon', 'muỗng súp'], ['the fruit slices', 'miếng trái cây'], ['the serving dish', 'đĩa để bày món'], ['the side dish', 'món ăn kèm'], ['the snack box', 'hộp đồ ăn nhẹ']] },
      { verb: 'pack', verbVi: 'đóng gói', objects: [['the lunch box', 'hộp cơm trưa'], ['the snack bag', 'túi đồ ăn nhẹ'], ['the fruit cup', 'cốc trái cây'], ['the water bottle', 'chai nước'], ['the picnic food', 'đồ ăn dã ngoại'], ['the dinner leftovers', 'đồ ăn tối còn lại'], ['the sandwich', 'bánh mì kẹp'], ['the salad container', 'hộp salad'], ['the takeout order', 'đơn đồ ăn mang đi'], ['the sauce cup', 'cốc nước chấm'], ['the meal box', 'hộp thức ăn'], ['the dessert pack', 'phần tráng miệng mang theo']] },
      { verb: 'order', verbVi: 'gọi', objects: [['the noodle soup', 'món mì nước'], ['the fried rice', 'món cơm rang'], ['the grilled chicken', 'món gà nướng'], ['the vegetable dish', 'món rau'], ['the fruit tea', 'trà trái cây'], ['the coffee', 'cà phê'], ['the lunch special', 'suất trưa đặc biệt'], ['the dinner set', 'suất ăn tối'], ['the side dish', 'món ăn kèm'], ['the dessert', 'món tráng miệng'], ['the extra bread', 'phần bánh mì thêm'], ['the takeout meal', 'suất ăn mang về']] }
    ]
  ),
  'Friends & Social Life': makeTopicConfig(
    'bạn bè và đời sống xã hội',
    'before the weekend',
    'trước cuối tuần',
    'Cụm này dùng khi bạn nói về việc gặp gỡ, giữ liên lạc và xây dựng quan hệ với bạn bè.',
    [
      { verb: 'meet up with', verbVi: 'gặp', objects: [['a friend', 'một người bạn'], ['old classmates', 'bạn học cũ'], ['your close friends', 'những người bạn thân'], ['your coworkers after work', 'đồng nghiệp sau giờ làm'], ['your study group', 'nhóm học của bạn'], ['your travel buddies', 'nhóm bạn đi du lịch'], ['your club members', 'thành viên câu lạc bộ'], ['your online friends', 'bạn bè trên mạng'], ['your neighbors', 'hàng xóm'], ['your teammates', 'đồng đội'], ['your best friend', 'bạn thân'], ['your former teacher', 'giáo viên cũ']] },
      { verb: 'keep in touch with', verbVi: 'giữ liên lạc với', objects: [['old friends', 'bạn cũ'], ['your classmates', 'bạn cùng lớp'], ['your teammates', 'đồng đội'], ['your neighbors', 'hàng xóm'], ['your former coworkers', 'đồng nghiệp cũ'], ['your online friends', 'bạn trên mạng'], ['your travel friends', 'bạn đồng hành'], ['your club members', 'thành viên câu lạc bộ'], ['your host family', 'gia đình chủ nhà'], ['your study partner', 'bạn học cùng'], ['your cousin', 'anh chị em họ'], ['your pen pal', 'bạn thư từ']] },
      { verb: 'talk with', verbVi: 'trò chuyện với', objects: [['a close friend', 'một người bạn thân'], ['your classmates', 'bạn cùng lớp'], ['your teammates', 'đồng đội'], ['your neighbors', 'hàng xóm'], ['your travel buddy', 'người bạn đồng hành'], ['your old roommate', 'bạn cùng phòng cũ'], ['your study partner', 'bạn học cùng'], ['your club leader', 'trưởng nhóm câu lạc bộ'], ['your online friend', 'một người bạn trên mạng'], ['your former coworker', 'một đồng nghiệp cũ'], ['your best friend', 'bạn thân'], ['your new friend', 'một người bạn mới']] },
      { verb: 'invite', verbVi: 'mời', objects: [['a friend over', 'một người bạn đến chơi'], ['your classmates out', 'bạn cùng lớp ra ngoài'], ['your neighbors in', 'hàng xóm vào nhà'], ['your team to lunch', 'nhóm của bạn đi ăn trưa'], ['your best friend for coffee', 'bạn thân đi uống cà phê'], ['your coworkers to dinner', 'đồng nghiệp đi ăn tối'], ['your study group over', 'nhóm học đến chơi'], ['your cousins to the party', 'anh chị em họ tới bữa tiệc'], ['your club friends out', 'bạn trong câu lạc bộ ra ngoài'], ['your travel buddy along', 'bạn đồng hành đi cùng'], ['your roommate to join', 'bạn cùng phòng cùng tham gia'], ['your old friend back', 'người bạn cũ quay lại gặp']] },
      { verb: 'check on', verbVi: 'hỏi thăm', objects: [['a friend', 'một người bạn'], ['your best friend', 'bạn thân'], ['your old classmate', 'một bạn học cũ'], ['your roommate', 'bạn cùng phòng'], ['your teammate', 'đồng đội'], ['your coworker', 'đồng nghiệp'], ['your study partner', 'bạn học cùng'], ['your neighbor', 'hàng xóm'], ['your travel buddy', 'bạn đồng hành'], ['your club friend', 'bạn trong câu lạc bộ'], ['your online friend', 'bạn trên mạng'], ['your cousin', 'anh chị em họ']] },
      { verb: 'make plans with', verbVi: 'lên kế hoạch với', objects: [['your friends', 'bạn bè'], ['your classmates', 'bạn cùng lớp'], ['your cousins', 'anh chị em họ'], ['your teammates', 'đồng đội'], ['your coworkers', 'đồng nghiệp'], ['your neighbors', 'hàng xóm'], ['your study group', 'nhóm học'], ['your club members', 'thành viên câu lạc bộ'], ['your travel friends', 'bạn du lịch'], ['your best friend', 'bạn thân'], ['your roommate', 'bạn cùng phòng'], ['your old friends', 'bạn cũ']] }
    ]
  ),
  'Health & Fitness': makeTopicConfig(
    'sức khỏe và thể chất',
    'to stay healthy',
    'để giữ cơ thể khỏe mạnh',
    'Cụm này dùng khi bạn nói về việc tập luyện, nghỉ ngơi và chăm sóc sức khỏe.',
    [
      { verb: 'book', verbVi: 'đặt', objects: [['a checkup', 'một buổi khám sức khỏe'], ['a dentist visit', 'một lịch khám nha sĩ'], ['a follow up visit', 'một buổi tái khám'], ['a fitness class', 'một lớp thể dục'], ['a doctor appointment', 'một cuộc hẹn với bác sĩ'], ['a blood test', 'một xét nghiệm máu'], ['a health screening', 'một buổi kiểm tra sức khỏe'], ['a therapy session', 'một buổi trị liệu'], ['a nutrition consult', 'một buổi tư vấn dinh dưỡng'], ['a yoga class', 'một lớp yoga'], ['a massage session', 'một buổi mát xa'], ['a vision test', 'một bài kiểm tra thị lực']] },
      { verb: 'take', verbVi: 'uống', objects: [['your medicine', 'thuốc của bạn'], ['a vitamin', 'một viên vitamin'], ['a short rest', 'một quãng nghỉ ngắn'], ['a deep breath', 'một hơi thở sâu'], ['a walk', 'một buổi đi bộ'], ['a break', 'một quãng nghỉ'], ['a health check', 'một lần kiểm tra sức khỏe'], ['a sip of water', 'một ngụm nước'], ['a pain reliever', 'một viên giảm đau'], ['a day off', 'một ngày nghỉ'], ['a warm shower', 'một vòi tắm ấm'], ['a stretch break', 'một quãng nghỉ để giãn cơ']] },
      { verb: 'warm up before', verbVi: 'khởi động trước', objects: [['your workout', 'buổi tập'], ['a morning run', 'buổi chạy sáng'], ['the gym session', 'buổi tập ở phòng gym'], ['the football game', 'trận bóng đá'], ['the swim practice', 'buổi tập bơi'], ['the dance class', 'lớp nhảy'], ['the bike ride', 'buổi đạp xe'], ['the tennis match', 'trận quần vợt'], ['the training session', 'buổi luyện tập'], ['the yoga class', 'lớp yoga'], ['the long walk', 'buổi đi bộ dài'], ['the exercise routine', 'bài tập thể dục']] },
      { verb: 'recover from', verbVi: 'hồi phục sau', objects: [['a cold', 'một cơn cảm'], ['a headache', 'một cơn đau đầu'], ['a long workout', 'buổi tập dài'], ['a sleepless night', 'một đêm mất ngủ'], ['a stressful week', 'một tuần căng thẳng'], ['a sore back', 'cơn đau lưng'], ['a light injury', 'một chấn thương nhẹ'], ['a busy shift', 'một ca làm bận rộn'], ['a stomach ache', 'cơn đau bụng'], ['a bad fall', 'một cú ngã mạnh'], ['a tough match', 'một trận đấu căng'], ['a fever', 'cơn sốt']] },
      { verb: 'stick to', verbVi: 'duy trì', objects: [['your sleep schedule', 'lịch ngủ của bạn'], ['your workout plan', 'kế hoạch tập luyện của bạn'], ['the meal routine', 'thói quen ăn uống'], ['your water intake', 'lượng nước bạn uống'], ['the walking habit', 'thói quen đi bộ'], ['your health goal', 'mục tiêu sức khỏe của bạn'], ['the stretching routine', 'thói quen giãn cơ'], ['your training plan', 'kế hoạch luyện tập của bạn'], ['the rest schedule', 'lịch nghỉ ngơi'], ['your recovery plan', 'kế hoạch hồi phục của bạn'], ['the clinic advice', 'lời dặn của phòng khám'], ['the medicine schedule', 'lịch uống thuốc']] },
      { verb: 'cut down on', verbVi: 'giảm', objects: [['sugary drinks', 'đồ uống ngọt'], ['late night snacks', 'đồ ăn khuya'], ['junk food', 'đồ ăn nhanh'], ['screen time at night', 'thời gian nhìn màn hình vào ban đêm'], ['stress at work', 'căng thẳng ở công việc'], ['strong coffee', 'cà phê đậm'], ['salty food', 'đồ ăn mặn'], ['long naps', 'những giấc ngủ trưa dài'], ['heavy meals', 'bữa ăn quá no'], ['processed food', 'đồ ăn chế biến sẵn'], ['late workouts', 'buổi tập quá muộn'], ['sitting time', 'thời gian ngồi quá lâu']] }
    ]
  ),
  'Home & Household': makeTopicConfig(
    'nhà cửa và việc nhà',
    'before bedtime',
    'trước khi đi ngủ',
    'Cụm này dùng khi bạn nói về việc dọn dẹp, sắp xếp và chăm sóc không gian sống.',
    [
      { verb: 'take out', verbVi: 'mang ra ngoài', objects: [['the trash', 'rác'], ['the recycling', 'đồ tái chế'], ['the old boxes', 'những chiếc hộp cũ'], ['the food waste', 'rác thực phẩm'], ['the empty bottles', 'chai rỗng'], ['the laundry basket', 'giỏ đồ giặt'], ['the garden tools', 'dụng cụ làm vườn'], ['the pet bowl', 'bát của thú cưng'], ['the broken chair', 'chiếc ghế hỏng'], ['the old clothes', 'quần áo cũ'], ['the delivery box', 'thùng giao hàng'], ['the cleaning bucket', 'xô dọn dẹp']] },
      { verb: 'put away', verbVi: 'cất', objects: [['the dishes', 'bát đĩa'], ['the towels', 'khăn tắm'], ['the blankets', 'chăn'], ['the tools', 'dụng cụ'], ['the groceries', 'đồ tạp hóa'], ['the books', 'sách'], ['the shoes', 'giày dép'], ['the toys', 'đồ chơi'], ['the cleaning spray', 'chai xịt tẩy rửa'], ['the laundry', 'đồ giặt'], ['the spare keys', 'chìa khóa dự phòng'], ['the cooking pots', 'nồi nấu ăn']] },
      { verb: 'wipe down', verbVi: 'lau', objects: [['the kitchen counter', 'mặt bếp'], ['the dining table', 'bàn ăn'], ['the bathroom sink', 'bồn rửa phòng tắm'], ['the mirror', 'gương'], ['the window frame', 'khung cửa sổ'], ['the work desk', 'bàn làm việc'], ['the bookshelf', 'giá sách'], ['the cabinet door', 'cửa tủ'], ['the stove top', 'mặt bếp nấu'], ['the coffee table', 'bàn trà'], ['the washing machine', 'máy giặt'], ['the fridge handle', 'tay nắm tủ lạnh']] },
      { verb: 'fold', verbVi: 'gấp', objects: [['the clean clothes', 'quần áo sạch'], ['the towels', 'khăn tắm'], ['the bed sheets', 'ga giường'], ['the blankets', 'chăn'], ['the shirts', 'áo sơ mi'], ['the socks', 'tất'], ['the kitchen cloths', 'khăn bếp'], ['the curtains', 'rèm cửa'], ['the table cloth', 'khăn trải bàn'], ['the baby clothes', 'quần áo em bé'], ['the pajamas', 'đồ ngủ'], ['the laundry load', 'mẻ quần áo vừa giặt']] },
      { verb: 'air out', verbVi: 'mở cho thoáng', objects: [['the bedroom', 'phòng ngủ'], ['the living room', 'phòng khách'], ['the kitchen', 'nhà bếp'], ['the bathroom', 'phòng tắm'], ['the guest room', 'phòng khách ngủ'], ['the storage room', 'phòng chứa đồ'], ['the hallway', 'hành lang'], ['the study room', 'phòng học'], ['the laundry area', 'khu vực giặt đồ'], ['the balcony', 'ban công'], ['the closet', 'tủ quần áo'], ['the house', 'ngôi nhà']] },
      { verb: 'fix', verbVi: 'sửa', objects: [['the loose handle', 'tay nắm bị lỏng'], ['the leaking tap', 'vòi nước bị rò'], ['the broken shelf', 'kệ bị hỏng'], ['the stuck drawer', 'ngăn kéo bị kẹt'], ['the door lock', 'khóa cửa'], ['the light switch', 'công tắc đèn'], ['the table leg', 'chân bàn'], ['the cabinet hinge', 'bản lề tủ'], ['the shower head', 'vòi sen'], ['the curtain rod', 'thanh treo rèm'], ['the fan wire', 'dây quạt'], ['the lamp stand', 'chân đèn']] }
    ]
  ),
  'Media & Internet': makeTopicConfig(
    'mạng xã hội và truyền thông trực tuyến',
    'before you post it',
    'trước khi bạn đăng nó',
    'Cụm này dùng khi bạn nói về việc đăng bài, phản hồi hoặc quản lý nội dung trên mạng.',
    [
      { verb: 'reply to', verbVi: 'trả lời', objects: [['a comment', 'một bình luận'], ['a message', 'một tin nhắn'], ['a post', 'một bài đăng'], ['a question', 'một câu hỏi'], ['the email', 'email'], ['the group chat', 'nhóm chat'], ['a voice note', 'một tin nhắn thoại'], ['a direct message', 'một tin nhắn riêng'], ['the thread', 'chuỗi bình luận'], ['the feedback', 'phản hồi'], ['the reminder', 'lời nhắc'], ['the latest post', 'bài đăng mới nhất']] },
      { verb: 'post', verbVi: 'đăng', objects: [['a photo', 'một bức ảnh'], ['a short video', 'một video ngắn'], ['an update', 'một bản cập nhật'], ['a story', 'một tin ngắn'], ['a comment', 'một bình luận'], ['a review', 'một bài đánh giá'], ['a question', 'một câu hỏi'], ['a travel clip', 'một đoạn video du lịch'], ['a food photo', 'một ảnh đồ ăn'], ['an event notice', 'một thông báo sự kiện'], ['a status update', 'một cập nhật trạng thái'], ['a music clip', 'một đoạn nhạc']] },
      { verb: 'delete', verbVi: 'xóa', objects: [['the old post', 'bài đăng cũ'], ['the wrong comment', 'bình luận sai'], ['the duplicate photo', 'ảnh trùng'], ['the extra file', 'tệp thừa'], ['the draft post', 'bài nháp'], ['the broken link', 'liên kết lỗi'], ['the spam message', 'tin nhắn rác'], ['the old story', 'tin cũ'], ['the copied text', 'đoạn văn bản đã sao chép'], ['the saved clip', 'đoạn clip đã lưu'], ['the unused photo', 'ảnh không dùng tới'], ['the extra tag', 'thẻ gắn thêm']] },
      { verb: 'save', verbVi: 'lưu', objects: [['the photo', 'bức ảnh'], ['the video', 'video'], ['the article', 'bài viết'], ['the link', 'liên kết'], ['the message', 'tin nhắn'], ['the podcast', 'podcast'], ['the post', 'bài đăng'], ['the profile update', 'cập nhật hồ sơ'], ['the login details', 'thông tin đăng nhập'], ['the draft', 'bản nháp'], ['the event page', 'trang sự kiện'], ['the comment thread', 'chuỗi bình luận']] },
      { verb: 'share', verbVi: 'chia sẻ', objects: [['the link', 'liên kết'], ['the photo', 'bức ảnh'], ['the update', 'bản cập nhật'], ['the event page', 'trang sự kiện'], ['the article', 'bài viết'], ['the playlist', 'danh sách phát'], ['the message', 'tin nhắn'], ['the podcast', 'podcast'], ['the short clip', 'đoạn video ngắn'], ['the profile page', 'trang hồ sơ'], ['the stream schedule', 'lịch phát trực tiếp'], ['the news post', 'bài đăng tin tức']] },
      { verb: 'mute', verbVi: 'tắt thông báo của', objects: [['the group chat', 'nhóm chat'], ['the noisy thread', 'chuỗi bình luận ồn ào'], ['the channel', 'kênh'], ['the page', 'trang'], ['the app alert', 'thông báo ứng dụng'], ['the email chain', 'chuỗi email'], ['the game stream', 'buổi phát game'], ['the message alert', 'thông báo tin nhắn'], ['the social app', 'ứng dụng mạng xã hội'], ['the live show', 'buổi phát trực tiếp'], ['the video channel', 'kênh video'], ['the news feed', 'bảng tin']] }
    ]
  ),
  'Personal Habits': makeTopicConfig(
    'thói quen cá nhân',
    'every day',
    'mỗi ngày',
    'Cụm này dùng khi bạn nói về thói quen tốt, cách tự quản lý bản thân và sinh hoạt điều độ.',
    [
      { verb: 'stick to', verbVi: 'duy trì', objects: [['your routine', 'thói quen của bạn'], ['your sleep time', 'giờ ngủ của bạn'], ['your morning plan', 'kế hoạch buổi sáng của bạn'], ['your study habit', 'thói quen học tập của bạn'], ['your walking goal', 'mục tiêu đi bộ của bạn'], ['your meal schedule', 'lịch ăn uống của bạn'], ['your budget plan', 'kế hoạch chi tiêu của bạn'], ['your reading time', 'thời gian đọc sách của bạn'], ['your exercise habit', 'thói quen tập thể dục của bạn'], ['your daily checklist', 'danh sách việc làm hằng ngày của bạn'], ['your work break', 'thời gian nghỉ làm của bạn'], ['your bedtime', 'giờ đi ngủ của bạn']] },
      { verb: 'cut down on', verbVi: 'giảm', objects: [['late nights', 'việc thức khuya'], ['junk food', 'đồ ăn nhanh'], ['screen time', 'thời gian dùng màn hình'], ['sugary drinks', 'đồ uống ngọt'], ['online shopping', 'mua sắm trực tuyến'], ['skipping breakfast', 'việc bỏ bữa sáng'], ['strong coffee', 'cà phê đậm'], ['snacking at night', 'ăn vặt ban đêm'], ['phone use before bed', 'việc dùng điện thoại trước khi ngủ'], ['long naps', 'những giấc ngủ trưa dài'], ['fast food', 'đồ ăn nhanh'], ['stressful habits', 'những thói quen gây căng thẳng']] },
      { verb: 'make time for', verbVi: 'dành thời gian cho', objects: [['a short walk', 'một buổi đi bộ ngắn'], ['reading', 'việc đọc sách'], ['a quiet break', 'một quãng nghỉ yên tĩnh'], ['exercise', 'việc tập thể dục'], ['meal prep', 'việc chuẩn bị bữa ăn'], ['stretching', 'việc giãn cơ'], ['deep breathing', 'việc hít thở sâu'], ['family time', 'thời gian cho gia đình'], ['a hobby', 'một sở thích'], ['self care', 'việc chăm sóc bản thân'], ['a phone free hour', 'một giờ không dùng điện thoại'], ['a quick tidy up', 'một lần dọn dẹp nhanh']] },
      { verb: 'keep track of', verbVi: 'theo dõi', objects: [['your spending', 'chi tiêu của bạn'], ['your water intake', 'lượng nước bạn uống'], ['your sleep hours', 'số giờ ngủ'], ['your screen time', 'thời gian dùng màn hình'], ['your mood', 'tâm trạng của bạn'], ['your exercise time', 'thời gian tập luyện'], ['your study hours', 'số giờ học'], ['your daily tasks', 'các việc hằng ngày'], ['your appointments', 'các cuộc hẹn'], ['your progress', 'tiến độ của bạn'], ['your meals', 'các bữa ăn của bạn'], ['your reading goal', 'mục tiêu đọc sách của bạn']] },
      { verb: 'wake up for', verbVi: 'dậy để', objects: [['the morning walk', 'buổi đi bộ sáng'], ['the gym class', 'lớp tập gym'], ['the early bus', 'chuyến xe buýt sớm'], ['the quiet hour', 'giờ yên tĩnh'], ['the sunrise', 'bình minh'], ['the school run', 'việc đưa con đi học'], ['the breakfast prep', 'việc chuẩn bị bữa sáng'], ['the morning shift', 'ca làm sáng'], ['the study session', 'buổi học'], ['the work call', 'cuộc gọi công việc'], ['the clinic visit', 'buổi đi khám'], ['the train ride', 'chuyến tàu']] },
      { verb: 'stay away from', verbVi: 'tránh xa', objects: [['late snacks', 'đồ ăn khuya'], ['negative talk', 'lời nói tiêu cực'], ['bad habits', 'thói quen xấu'], ['unhealthy food', 'đồ ăn không lành mạnh'], ['too much noise', 'quá nhiều tiếng ồn'], ['the phone at bedtime', 'điện thoại trước giờ ngủ'], ['rushed mornings', 'những buổi sáng vội vàng'], ['excess sugar', 'quá nhiều đường'], ['stressful news', 'tin tức gây căng thẳng'], ['extra screen time', 'thời gian màn hình quá nhiều'], ['heavy meals at night', 'bữa tối quá nặng'], ['unplanned spending', 'chi tiêu không có kế hoạch']] }
    ]
  ),
  'Shopping': makeTopicConfig(
    'mua sắm',
    'before you pay',
    'trước khi bạn thanh toán',
    'Cụm này dùng khi bạn hỏi thông tin, so sánh lựa chọn hoặc xử lý việc mua hàng.',
    [
      { verb: 'compare', verbVi: 'so sánh', objects: [['the prices', 'giá cả'], ['the sizes', 'kích cỡ'], ['the colors', 'màu sắc'], ['the brands', 'nhãn hiệu'], ['the delivery options', 'các lựa chọn giao hàng'], ['the payment methods', 'các phương thức thanh toán'], ['the return rules', 'quy định đổi trả'], ['the customer reviews', 'đánh giá của khách hàng'], ['the product details', 'chi tiết sản phẩm'], ['the sale offers', 'ưu đãi giảm giá'], ['the store options', 'các lựa chọn cửa hàng'], ['the package deals', 'gói ưu đãi']] },
      { verb: 'try on', verbVi: 'thử', objects: [['the jacket', 'áo khoác'], ['the shoes', 'giày'], ['the dress', 'váy'], ['the jeans', 'quần jean'], ['the shirt', 'áo sơ mi'], ['the hat', 'mũ'], ['the watch', 'đồng hồ'], ['the sunglasses', 'kính mát'], ['the sweater', 'áo len'], ['the coat', 'áo choàng'], ['the scarf', 'khăn quàng'], ['the backpack', 'ba lô']] },
      { verb: 'ask about', verbVi: 'hỏi về', objects: [['the discount', 'mức giảm giá'], ['the return policy', 'chính sách đổi trả'], ['the warranty', 'bảo hành'], ['the store hours', 'giờ mở cửa'], ['the payment plan', 'kế hoạch trả tiền'], ['the product size', 'kích cỡ sản phẩm'], ['the delivery fee', 'phí giao hàng'], ['the exchange option', 'lựa chọn đổi hàng'], ['the final price', 'giá cuối cùng'], ['the gift wrap', 'gói quà'], ['the item stock', 'hàng còn trong kho'], ['the online order', 'đơn hàng trực tuyến']] },
      { verb: 'pay for', verbVi: 'trả tiền cho', objects: [['the groceries', 'đồ tạp hóa'], ['the shirt', 'chiếc áo sơ mi'], ['the train ticket', 'vé tàu'], ['the shoes', 'đôi giày'], ['the phone case', 'ốp điện thoại'], ['the book', 'cuốn sách'], ['the dinner set', 'bộ đồ ăn tối'], ['the gift', 'món quà'], ['the medicine', 'thuốc'], ['the order', 'đơn hàng'], ['the coffee', 'cà phê'], ['the new bag', 'chiếc túi mới']] },
      { verb: 'return', verbVi: 'trả lại', objects: [['the wrong size', 'món hàng sai kích cỡ'], ['the damaged item', 'món hàng bị hỏng'], ['the extra order', 'đơn hàng thừa'], ['the unused product', 'sản phẩm chưa dùng'], ['the faulty charger', 'bộ sạc bị lỗi'], ['the broken mug', 'chiếc cốc bị vỡ'], ['the wrong color', 'màu không đúng'], ['the duplicate item', 'món hàng bị trùng'], ['the late order', 'đơn hàng giao muộn'], ['the old receipt', 'hóa đơn cũ'], ['the unopened box', 'hộp chưa mở'], ['the spare pair', 'đôi dự phòng']] },
      { verb: 'look for', verbVi: 'tìm', objects: [['a better price', 'mức giá tốt hơn'], ['the right size', 'kích cỡ phù hợp'], ['a gift idea', 'một ý tưởng quà tặng'], ['the sale rack', 'kệ hàng giảm giá'], ['the checkout line', 'quầy thanh toán'], ['a simple outfit', 'một bộ đồ đơn giản'], ['a cheaper option', 'một lựa chọn rẻ hơn'], ['the matching pair', 'cặp đồ phù hợp'], ['the product code', 'mã sản phẩm'], ['a store assistant', 'nhân viên cửa hàng'], ['the item number', 'mã hàng'], ['a reusable bag', 'một chiếc túi tái sử dụng']] }
    ]
  ),
  'Technology (basic)': makeTopicConfig(
    'công nghệ cơ bản',
    'before you shut down the computer',
    'trước khi bạn tắt máy tính',
    'Cụm này dùng khi bạn nói về các thao tác cơ bản với thiết bị, tệp và ứng dụng.',
    [
      { verb: 'turn on', verbVi: 'bật', objects: [['the computer', 'máy tính'], ['the tablet', 'máy tính bảng'], ['the printer', 'máy in'], ['the speaker', 'loa'], ['the monitor', 'màn hình'], ['the router', 'bộ phát mạng'], ['the laptop', 'máy tính xách tay'], ['the keyboard light', 'đèn bàn phím'], ['the webcam', 'camera'], ['the scanner', 'máy quét'], ['the screen', 'màn hình'], ['the office computer', 'máy tính văn phòng']] },
      { verb: 'set up', verbVi: 'thiết lập', objects: [['the printer', 'máy in'], ['the new laptop', 'máy tính xách tay mới'], ['the email account', 'tài khoản email'], ['the phone app', 'ứng dụng điện thoại'], ['the meeting link', 'liên kết cuộc họp'], ['the desktop folder', 'thư mục trên màn hình'], ['the screen lock', 'khóa màn hình'], ['the online class', 'lớp học trực tuyến'], ['the file backup', 'bản sao lưu tệp'], ['the home network', 'mạng ở nhà'], ['the browser page', 'trang trình duyệt'], ['the shared drive', 'ổ đĩa dùng chung']] },
      { verb: 'save', verbVi: 'lưu', objects: [['the file', 'tệp'], ['the photo', 'bức ảnh'], ['the document', 'tài liệu'], ['the contact', 'liên hệ'], ['the password note', 'ghi chú mật khẩu'], ['the screenshot', 'ảnh chụp màn hình'], ['the class link', 'liên kết lớp học'], ['the web page', 'trang web'], ['the project folder', 'thư mục dự án'], ['the audio clip', 'đoạn ghi âm'], ['the text draft', 'bản nháp văn bản'], ['the backup copy', 'bản sao lưu']] },
      { verb: 'back up', verbVi: 'sao lưu', objects: [['the photos', 'ảnh'], ['the work files', 'tệp công việc'], ['the class notes', 'ghi chú học tập'], ['the phone contacts', 'danh bạ điện thoại'], ['the music folder', 'thư mục nhạc'], ['the old messages', 'tin nhắn cũ'], ['the laptop data', 'dữ liệu máy tính'], ['the school project', 'dự án học tập'], ['the password list', 'danh sách mật khẩu'], ['the family videos', 'video gia đình'], ['the travel photos', 'ảnh du lịch'], ['the desktop files', 'tệp trên màn hình']] },
      { verb: 'plug in', verbVi: 'cắm', objects: [['the charger', 'bộ sạc'], ['the mouse', 'chuột'], ['the keyboard', 'bàn phím'], ['the printer cable', 'cáp máy in'], ['the speaker', 'loa'], ['the screen cable', 'cáp màn hình'], ['the laptop', 'máy tính xách tay'], ['the phone', 'điện thoại'], ['the desk lamp', 'đèn bàn'], ['the headset', 'tai nghe'], ['the external drive', 'ổ cứng ngoài'], ['the router', 'bộ phát mạng']] },
      { verb: 'open', verbVi: 'mở', objects: [['the document', 'tài liệu'], ['the email', 'email'], ['the browser tab', 'tab trình duyệt'], ['the app', 'ứng dụng'], ['the folder', 'thư mục'], ['the meeting link', 'liên kết cuộc họp'], ['the photo album', 'thư mục ảnh'], ['the settings page', 'trang cài đặt'], ['the message thread', 'chuỗi tin nhắn'], ['the video file', 'tệp video'], ['the download folder', 'thư mục tải về'], ['the shared file', 'tệp được chia sẻ']] }
    ]
  ),
  'Time & Schedules': makeTopicConfig(
    'thời gian và lịch trình',
    'before the day gets busy',
    'trước khi ngày làm việc trở nên bận rộn',
    'Cụm này dùng khi bạn sắp xếp thời gian, thay đổi lịch hoặc nhắc nhở kế hoạch.',
    [
      { verb: 'set', verbVi: 'đặt', objects: [['the alarm', 'báo thức'], ['the reminder', 'lời nhắc'], ['the meeting time', 'giờ họp'], ['the lunch break', 'giờ nghỉ trưa'], ['the study hour', 'giờ học'], ['the wake up time', 'giờ thức dậy'], ['the bus time', 'giờ xe buýt'], ['the dinner time', 'giờ ăn tối'], ['the doctor visit', 'buổi đi khám'], ['the call time', 'giờ gọi điện'], ['the deadline', 'hạn chót'], ['the timer', 'hẹn giờ']] },
      { verb: 'save', verbVi: 'dành ra', objects: [['some time', 'một ít thời gian'], ['an extra hour', 'một giờ thêm'], ['a few minutes', 'vài phút'], ['the morning slot', 'khoảng thời gian buổi sáng'], ['the evening break', 'khoảng nghỉ buổi tối'], ['a quiet moment', 'một khoảnh khắc yên tĩnh'], ['the lunch hour', 'giờ ăn trưa'], ['the weekend morning', 'buổi sáng cuối tuần'], ['the study time', 'thời gian học'], ['the family hour', 'thời gian cho gia đình'], ['the travel time', 'thời gian di chuyển'], ['the rest time', 'thời gian nghỉ ngơi']] },
      { verb: 'make time for', verbVi: 'dành thời gian cho', objects: [['a short break', 'một quãng nghỉ ngắn'], ['exercise', 'việc tập thể dục'], ['the family dinner', 'bữa tối gia đình'], ['a doctor visit', 'buổi đi khám'], ['the study session', 'buổi học'], ['a quick call', 'một cuộc gọi nhanh'], ['the morning walk', 'buổi đi bộ sáng'], ['the reading hour', 'giờ đọc sách'], ['the lunch break', 'giờ nghỉ trưa'], ['the work review', 'việc xem lại công việc'], ['a quiet evening', 'một buổi tối yên tĩnh'], ['the weekend plan', 'kế hoạch cuối tuần']] },
      { verb: 'move', verbVi: 'dời', objects: [['the meeting', 'cuộc họp'], ['the appointment', 'cuộc hẹn'], ['the class', 'buổi học'], ['the lunch break', 'giờ nghỉ trưa'], ['the doctor visit', 'buổi đi khám'], ['the work call', 'cuộc gọi công việc'], ['the bus ride', 'chuyến xe buýt'], ['the project task', 'nhiệm vụ dự án'], ['the shopping trip', 'chuyến đi mua sắm'], ['the dinner plan', 'kế hoạch ăn tối'], ['the family visit', 'buổi thăm gia đình'], ['the gym session', 'buổi tập gym']] },
      { verb: 'plan', verbVi: 'lên kế hoạch cho', objects: [['the week ahead', 'tuần sắp tới'], ['the next day', 'ngày hôm sau'], ['the afternoon break', 'khoảng nghỉ buổi chiều'], ['the work shift', 'ca làm việc'], ['the class schedule', 'lịch học'], ['the travel time', 'thời gian đi lại'], ['the evening routine', 'thói quen buổi tối'], ['the rest day', 'ngày nghỉ'], ['the shopping time', 'thời gian mua sắm'], ['the family visit', 'buổi thăm gia đình'], ['the exam week', 'tuần thi'], ['the study plan', 'kế hoạch học tập']] },
      { verb: 'check', verbVi: 'xem lại', objects: [['the schedule', 'lịch trình'], ['the calendar', 'lịch'], ['the deadline', 'hạn chót'], ['the appointment time', 'giờ hẹn'], ['the bus time', 'giờ xe buýt'], ['the meeting note', 'ghi chú cuộc họp'], ['the work plan', 'kế hoạch công việc'], ['the class time', 'giờ học'], ['the reminder list', 'danh sách lời nhắc'], ['the task order', 'thứ tự công việc'], ['the free hour', 'giờ trống'], ['the weekly plan', 'kế hoạch tuần']] }
    ]
  ),
  'Transportation': makeTopicConfig(
    'giao thông và đi lại',
    'before the bus arrives',
    'trước khi xe buýt đến',
    'Cụm này dùng khi bạn nói về phương tiện, lộ trình và việc di chuyển hằng ngày.',
    [
      { verb: 'catch', verbVi: 'bắt', objects: [['the bus', 'xe buýt'], ['the train', 'tàu hỏa'], ['the last metro', 'chuyến tàu điện cuối'], ['the morning taxi', 'xe taxi buổi sáng'], ['the shuttle', 'xe đưa đón'], ['the local bus', 'xe buýt địa phương'], ['the first train', 'chuyến tàu đầu tiên'], ['the airport bus', 'xe buýt ra sân bay'], ['the school bus', 'xe buýt trường học'], ['the express train', 'tàu nhanh'], ['the night bus', 'xe buýt đêm'], ['the ferry', 'phà']] },
      { verb: 'wait for', verbVi: 'đợi', objects: [['the bus', 'xe buýt'], ['the taxi', 'xe taxi'], ['the train', 'tàu hỏa'], ['the light change', 'đèn tín hiệu đổi màu'], ['the next ride', 'chuyến xe tiếp theo'], ['the shuttle', 'xe đưa đón'], ['the station announcement', 'thông báo ở nhà ga'], ['the driver', 'tài xế'], ['the boarding call', 'thông báo lên xe'], ['the ferry', 'phà'], ['the traffic break', 'lúc giao thông thông thoáng'], ['the ride share car', 'xe đi chung']] },
      { verb: 'get off at', verbVi: 'xuống ở', objects: [['the next stop', 'điểm dừng tiếp theo'], ['the main station', 'ga chính'], ['the city center', 'trung tâm thành phố'], ['the bus terminal', 'bến xe buýt'], ['the school gate', 'cổng trường'], ['the hospital stop', 'điểm dừng gần bệnh viện'], ['the market corner', 'góc chợ'], ['the office block', 'khu văn phòng'], ['the last platform', 'sân ga cuối'], ['the museum stop', 'điểm dừng gần bảo tàng'], ['the river station', 'ga ven sông'], ['the station entrance', 'cổng vào nhà ga']] },
      { verb: 'ask about', verbVi: 'hỏi về', objects: [['the route', 'tuyến đường'], ['the fare', 'giá vé'], ['the departure time', 'giờ khởi hành'], ['the platform number', 'số sân ga'], ['the transfer point', 'điểm chuyển tuyến'], ['the traffic update', 'cập nhật giao thông'], ['the return ticket', 'vé khứ hồi'], ['the seat number', 'số ghế'], ['the bus pass', 'vé tháng xe buýt'], ['the station map', 'bản đồ nhà ga'], ['the parking fee', 'phí gửi xe'], ['the travel card', 'thẻ đi lại']] },
      { verb: 'check', verbVi: 'kiểm tra', objects: [['the train schedule', 'lịch tàu'], ['the bus stop', 'điểm dừng xe buýt'], ['the ticket price', 'giá vé'], ['the route map', 'bản đồ tuyến đường'], ['the platform sign', 'biển sân ga'], ['the traffic report', 'báo cáo giao thông'], ['the station board', 'bảng thông tin nhà ga'], ['the return time', 'giờ quay về'], ['the ride app', 'ứng dụng gọi xe'], ['the driver note', 'ghi chú của tài xế'], ['the seat booking', 'đặt chỗ'], ['the boarding gate', 'cổng lên xe']] },
      { verb: 'head to', verbVi: 'đi đến', objects: [['the station', 'nhà ga'], ['the bus stop', 'điểm dừng xe buýt'], ['the taxi stand', 'điểm đón taxi'], ['the airport gate', 'cổng sân bay'], ['the train platform', 'sân ga tàu'], ['the parking area', 'khu gửi xe'], ['the ferry dock', 'bến phà'], ['the ticket office', 'quầy vé'], ['the station exit', 'lối ra nhà ga'], ['the bike lane', 'làn đường cho xe đạp'], ['the pickup area', 'khu đón khách'], ['the crosswalk', 'vạch qua đường']] }
    ]
  ),
  'Travel': makeTopicConfig(
    'du lịch',
    'before the trip starts',
    'trước khi chuyến đi bắt đầu',
    'Cụm này dùng khi bạn chuẩn bị chuyến đi, đặt chỗ hoặc xử lý thông tin du lịch.',
    [
      { verb: 'book', verbVi: 'đặt', objects: [['the hotel room', 'phòng khách sạn'], ['the return ticket', 'vé khứ hồi'], ['the airport shuttle', 'xe đưa đón sân bay'], ['the tour guide', 'hướng dẫn viên'], ['the train seat', 'ghế tàu'], ['the day trip', 'chuyến đi trong ngày'], ['the travel pass', 'vé đi lại'], ['the airport hotel', 'khách sạn sân bay'], ['the family room', 'phòng gia đình'], ['the city tour', 'tour thành phố'], ['the boat ride', 'chuyến đi thuyền'], ['the museum pass', 'vé vào bảo tàng']] },
      { verb: 'pack', verbVi: 'xếp', objects: [['your passport', 'hộ chiếu của bạn'], ['your travel clothes', 'quần áo đi du lịch'], ['the toiletries', 'đồ vệ sinh cá nhân'], ['the travel charger', 'bộ sạc du lịch'], ['the map', 'bản đồ'], ['the medicine bag', 'túi thuốc'], ['the tickets', 'vé'], ['the camera', 'máy ảnh'], ['the sunscreen', 'kem chống nắng'], ['the travel guide', 'cẩm nang du lịch'], ['the water bottle', 'chai nước'], ['the extra shoes', 'đôi giày dự phòng']] },
      { verb: 'check in at', verbVi: 'làm thủ tục tại', objects: [['the hotel', 'khách sạn'], ['the airport desk', 'quầy sân bay'], ['the guest house', 'nhà nghỉ'], ['the front desk', 'quầy lễ tân'], ['the train station', 'ga tàu'], ['the tour office', 'văn phòng tour'], ['the hostel', 'nhà trọ'], ['the travel counter', 'quầy dịch vụ du lịch'], ['the bus terminal', 'bến xe'], ['the resort', 'khu nghỉ dưỡng'], ['the ferry dock', 'bến phà'], ['the reception area', 'khu lễ tân']] },
      { verb: 'ask for', verbVi: 'xin', objects: [['directions', 'chỉ đường'], ['a map', 'một tấm bản đồ'], ['a room key', 'chìa khóa phòng'], ['a late checkout', 'trả phòng muộn'], ['travel advice', 'lời khuyên du lịch'], ['a window seat', 'ghế gần cửa sổ'], ['a city guide', 'cẩm nang thành phố'], ['a local tip', 'một mẹo địa phương'], ['a taxi', 'một chiếc taxi'], ['a boarding pass', 'thẻ lên máy bay'], ['a seat change', 'đổi chỗ ngồi'], ['help with luggage', 'sự giúp đỡ với hành lý']] },
      { verb: 'look for', verbVi: 'tìm', objects: [['the hotel address', 'địa chỉ khách sạn'], ['the gate number', 'số cổng'], ['the luggage belt', 'băng chuyền hành lý'], ['the station exit', 'lối ra nhà ga'], ['the bus platform', 'sân đón xe buýt'], ['the check in desk', 'quầy làm thủ tục'], ['the ticket office', 'quầy vé'], ['the tourist center', 'trung tâm du lịch'], ['the travel info board', 'bảng thông tin du lịch'], ['the taxi line', 'hàng taxi'], ['the boarding time', 'giờ lên máy bay'], ['the next train', 'chuyến tàu tiếp theo']] },
      { verb: 'plan', verbVi: 'lên kế hoạch cho', objects: [['the route', 'lộ trình'], ['the first day', 'ngày đầu tiên'], ['the city walk', 'buổi đi bộ trong thành phố'], ['the museum visit', 'buổi thăm bảo tàng'], ['the train ride', 'chuyến tàu'], ['the beach day', 'ngày đi biển'], ['the food stop', 'điểm ăn uống'], ['the hotel check in', 'việc nhận phòng'], ['the airport transfer', 'chuyến đưa đón sân bay'], ['the weekend trip', 'chuyến đi cuối tuần'], ['the travel budget', 'ngân sách du lịch'], ['the return trip', 'chuyến quay về']] }
    ]
  ),
  'Weather': makeTopicConfig(
    'thời tiết',
    'when the weather changes',
    'khi thời tiết thay đổi',
    'Cụm này dùng khi bạn nói về dự báo, tình trạng thời tiết và cách chuẩn bị cho thời tiết đó.',
    [
      { verb: 'check', verbVi: 'xem', objects: [['the weather report', 'bản tin thời tiết'], ['the rain forecast', 'dự báo mưa'], ['the wind level', 'mức gió'], ['the temperature', 'nhiệt độ'], ['the storm warning', 'cảnh báo bão'], ['the cloudy sky', 'bầu trời nhiều mây'], ['the weather app', 'ứng dụng thời tiết'], ['the heat alert', 'cảnh báo nắng nóng'], ['the cold front', 'đợt không khí lạnh'], ['the sunrise time', 'giờ mặt trời mọc'], ['the sunset time', 'giờ mặt trời lặn'], ['the travel forecast', 'dự báo thời tiết cho chuyến đi']] },
      { verb: 'watch for', verbVi: 'để ý', objects: [['heavy rain', 'mưa lớn'], ['strong winds', 'gió mạnh'], ['dark clouds', 'mây đen'], ['a sudden storm', 'một cơn bão bất ngờ'], ['a temperature drop', 'nhiệt độ giảm'], ['icy roads', 'đường trơn do băng'], ['thick fog', 'sương mù dày'], ['the heat wave', 'đợt nắng nóng'], ['lightning', 'sét'], ['the weather change', 'sự thay đổi thời tiết'], ['a cold morning', 'buổi sáng lạnh'], ['a wet road', 'con đường ướt']] },
      { verb: 'put on', verbVi: 'mặc', objects: [['a light jacket', 'một chiếc áo khoác mỏng'], ['a raincoat', 'áo mưa'], ['a warm sweater', 'áo len ấm'], ['a scarf', 'khăn quàng cổ'], ['a hat', 'mũ'], ['a pair of gloves', 'một đôi găng tay'], ['dry shoes', 'giày khô'], ['a thick coat', 'áo khoác dày'], ['a hoodie', 'áo nỉ có mũ'], ['a cap', 'mũ lưỡi trai'], ['a pair of boots', 'một đôi ủng'], ['extra layers', 'nhiều lớp áo hơn']] },
      { verb: 'stay inside during', verbVi: 'ở trong nhà khi', objects: [['the storm', 'cơn bão'], ['the heavy rain', 'mưa lớn'], ['the heat wave', 'đợt nắng nóng'], ['the strong wind', 'gió mạnh'], ['the lightning', 'sấm sét'], ['the cold spell', 'đợt rét'], ['the foggy morning', 'buổi sáng nhiều sương'], ['the wet afternoon', 'buổi chiều mưa ướt'], ['the hail', 'mưa đá'], ['the dusty wind', 'gió bụi'], ['the icy weather', 'thời tiết đóng băng'], ['the summer downpour', 'trận mưa rào mùa hè']] },
      { verb: 'get ready for', verbVi: 'chuẩn bị cho', objects: [['the rainy day', 'ngày mưa'], ['the hot afternoon', 'buổi chiều nắng nóng'], ['the cold night', 'đêm lạnh'], ['the windy morning', 'buổi sáng có gió'], ['the stormy evening', 'buổi tối có bão'], ['the foggy drive', 'chuyến đi nhiều sương mù'], ['the sunny trip', 'chuyến đi trời nắng'], ['the wet commute', 'quãng đường đi làm ướt mưa'], ['the chilly walk', 'buổi đi bộ se lạnh'], ['the long shower', 'cơn mưa kéo dài'], ['the winter air', 'không khí mùa đông'], ['the humid day', 'ngày ẩm ướt']] },
      { verb: 'dry off after', verbVi: 'lau khô sau', objects: [['the rain', 'cơn mưa'], ['the storm', 'cơn bão'], ['the shower', 'trận mưa'], ['the wet walk', 'buổi đi bộ bị ướt'], ['the beach trip', 'chuyến đi biển'], ['the bike ride', 'buổi đạp xe'], ['the river visit', 'chuyến ghé sông'], ['the garden work', 'việc làm vườn'], ['the morning run', 'buổi chạy sáng'], ['the commute', 'quãng đường đi làm'], ['the ferry ride', 'chuyến đi phà'], ['the rainy bus stop', 'lúc chờ xe buýt dưới mưa']] }
    ]
  ),
  'Work & Career': makeTopicConfig(
    'công việc và nghề nghiệp',
    'at work this week',
    'trong công việc tuần này',
    'Cụm này dùng khi bạn nói về nhiệm vụ, lịch làm việc và cách xử lý công việc hằng ngày.',
    [
      { verb: 'prepare for', verbVi: 'chuẩn bị cho', objects: [['the interview', 'buổi phỏng vấn'], ['the team meeting', 'cuộc họp nhóm'], ['the work shift', 'ca làm việc'], ['the job fair', 'ngày hội việc làm'], ['the client call', 'cuộc gọi với khách hàng'], ['the presentation', 'bài thuyết trình'], ['the training session', 'buổi đào tạo'], ['the project review', 'buổi xem xét dự án'], ['the first day', 'ngày làm việc đầu tiên'], ['the annual review', 'buổi đánh giá hằng năm'], ['the office visit', 'buổi đến văn phòng'], ['the deadline week', 'tuần có hạn chót']] },
      { verb: 'deal with', verbVi: 'xử lý', objects: [['the workload', 'khối lượng công việc'], ['the customer issue', 'vấn đề của khách hàng'], ['the project delay', 'sự chậm trễ của dự án'], ['the last minute task', 'nhiệm vụ phút chót'], ['the email backlog', 'đống email tồn'], ['the phone calls', 'các cuộc gọi điện thoại'], ['the schedule change', 'sự thay đổi lịch trình'], ['the office problem', 'vấn đề ở văn phòng'], ['the difficult client', 'khách hàng khó tính'], ['the service complaint', 'khiếu nại dịch vụ'], ['the staff shortage', 'thiếu nhân sự'], ['the document request', 'yêu cầu giấy tờ']] },
      { verb: 'ask about', verbVi: 'hỏi về', objects: [['the job opening', 'vị trí tuyển dụng'], ['the shift schedule', 'lịch ca làm'], ['the salary range', 'mức lương'], ['the training plan', 'kế hoạch đào tạo'], ['the office rules', 'quy định văn phòng'], ['the promotion path', 'lộ trình thăng tiến'], ['the work hours', 'giờ làm việc'], ['the project role', 'vai trò trong dự án'], ['the task deadline', 'hạn của công việc'], ['the next interview', 'buổi phỏng vấn tiếp theo'], ['the team structure', 'cơ cấu nhóm'], ['the holiday policy', 'chính sách nghỉ phép']] },
      { verb: 'look for', verbVi: 'tìm', objects: [['a new position', 'một vị trí mới'], ['a part time job', 'một công việc bán thời gian'], ['a better schedule', 'lịch làm việc phù hợp hơn'], ['a quiet workspace', 'một chỗ làm yên tĩnh'], ['a job lead', 'một đầu mối việc làm'], ['an opening nearby', 'một vị trí gần nhà'], ['a remote role', 'một vị trí làm từ xa'], ['a helpful manager', 'một người quản lý hỗ trợ'], ['a training chance', 'một cơ hội đào tạo'], ['a career change', 'một sự thay đổi nghề nghiệp'], ['a full time role', 'một vị trí toàn thời gian'], ['a good company fit', 'một nơi làm việc phù hợp']] },
      { verb: 'finish', verbVi: 'hoàn thành', objects: [['the report', 'báo cáo'], ['the task list', 'danh sách công việc'], ['the meeting notes', 'ghi chú cuộc họp'], ['the project update', 'bản cập nhật dự án'], ['the customer reply', 'phản hồi khách hàng'], ['the training module', 'phần đào tạo'], ['the office paperwork', 'giấy tờ văn phòng'], ['the sales call', 'cuộc gọi bán hàng'], ['the follow up email', 'email theo dõi'], ['the work form', 'biểu mẫu công việc'], ['the daily summary', 'bản tóm tắt hằng ngày'], ['the shift report', 'báo cáo ca làm']] },
      { verb: 'stay on top of', verbVi: 'theo sát', objects: [['the workload', 'khối lượng công việc'], ['the deadlines', 'các hạn chót'], ['the team updates', 'cập nhật của nhóm'], ['the customer requests', 'yêu cầu của khách hàng'], ['the weekly targets', 'mục tiêu hằng tuần'], ['the office tasks', 'các việc ở văn phòng'], ['the meeting schedule', 'lịch họp'], ['the training progress', 'tiến độ đào tạo'], ['the project details', 'chi tiết dự án'], ['the task board', 'bảng công việc'], ['the work messages', 'tin nhắn công việc'], ['the hiring steps', 'các bước tuyển dụng']] }
    ]
  )
};

configs['Home & Household'];

// Topic aliases that share close usage.
configs['Media & Internet'];

function cloneFrom(sourceTopic, topicVi, contextEn, contextVi, explanationVi) {
  const source = configs[sourceTopic];
  return makeTopicConfig(topicVi, contextEn, contextVi, explanationVi, source.patterns);
}

configs['Transportation'];
configs['Daily Life'];
configs['Business Communication'];

configs['Technology (basic)'];

configs['Food & Cooking'];

configs['Friends & Social Life'];

configs['Weather'];

configs['Health & Fitness'];

configs['Time & Schedules'];

configs['Family & Relationships'];

configs['Entertainment'];

configs['Emotions & Feelings'];

configs['Education'];

configs['Communication'];

configs['Work & Career'];

configs['Shopping'];

configs['Personal Habits'];

configs['Travel'];

configs['Media & Internet'];

configs['Home & Household'];

configs['Daily Life'];

// Reuse nearby configs for topics that are similar enough but need their own Vietnamese explanation/context.
configs['Media & Internet'] = configs['Media & Internet'];
configs['Technology (basic)'] = configs['Technology (basic)'];
configs['Daily Life'] = configs['Daily Life'];
configs['Home & Household'] = configs['Home & Household'];
configs['Food & Cooking'] = configs['Food & Cooking'];
configs['Shopping'] = configs['Shopping'];
configs['Travel'] = configs['Travel'];
configs['Transportation'] = configs['Transportation'];
configs['Weather'] = configs['Weather'];
configs['Business Communication'] = configs['Business Communication'];
configs['Work & Career'] = configs['Work & Career'];
configs['Communication'] = configs['Communication'];
configs['Education'] = configs['Education'];
configs['Friends & Social Life'] = configs['Friends & Social Life'];
configs['Family & Relationships'] = configs['Family & Relationships'];
configs['Entertainment'] = configs['Entertainment'];
configs['Emotions & Feelings'] = configs['Emotions & Feelings'];
configs['Health & Fitness'] = configs['Health & Fitness'];
configs['Personal Habits'] = configs['Personal Habits'];
configs['Time & Schedules'] = configs['Time & Schedules'];

// Add missing topics by cloning the nearest pool with topic-specific framing.
configs['Media & Internet'] = configs['Media & Internet'];
configs['Technology (basic)'] = configs['Technology (basic)'];
configs['Home & Household'] = configs['Home & Household'];
configs['Daily Life'] = configs['Daily Life'];

// The dataset also includes these approved topics and each already has a direct config above.

function buildCandidates(topic) {
  const config = configs[topic];
  if (!config) {
    throw new Error(`Missing topic config for ${topic}`);
  }
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
        explanation_vi: config.explanationVi,
      });
    }
  }
  return candidates;
}

const explicitBadIds = [
  284, 377, 384, 393, 541, 649, 772, 893, 923, 1070, 1474, 1766, 1791, 1990, 2131, 2172,
];

const templatedBadIds = [
  2339, 2342, 2343, 2344, 2353, 2354, 2355, 2356, 2357, 2358, 2359, 2361, 2362, 2363, 2364, 2366,
  2367, 2368, 2371, 2373, 2374, 2375, 2376, 2377, 2378, 2380, 2381, 2382, 2383, 2384, 2386, 2387,
  2389, 2390, 2391, 2393, 2394, 2395, 2397, 2399, 2400, 2401, 2403, 2404, 2406, 2407, 2408, 2409,
  2410, 2411, 2413, 2414, 2416, 2417, 2422, 2423, 2425, 2427, 2428, 2429, 2430, 2431, 2432, 2433,
  2436, 2437, 2438, 2439, 2442, 2443, 2444, 2461, 2464, 2467, 2468, 2469, 2470, 2472, 2474, 2475,
  2477, 2478, 2479, 2480, 2482, 2483, 2485, 2486, 2487, 2489, 2491, 2492, 2494, 2495, 2496, 2498,
  2499, 2500, 2510, 2517, 2520, 2522, 2525, 2526, 2527, 2528, 2530, 2531, 2532, 2534, 2535, 2536,
  2537, 2538, 2539, 2540, 2542, 2543, 2545, 2546, 2548, 2549, 2553, 2554, 2555, 2556, 2557, 2558,
  2559, 2561, 2562, 2563, 2564, 2566, 2567, 2568, 2571, 2573, 2574, 2575, 2576, 2577, 2578, 2580,
  2581, 2582, 2583, 2584, 2586, 2587, 2589, 2590, 2591, 2593, 2594, 2595, 2597, 2599, 2600, 2611,
  2614, 2617, 2618, 2619, 2620, 2622, 2624, 2625, 2626, 2627, 2628, 2629, 2630, 2632, 2633, 2635,
  2636, 2637, 2639, 2641, 2642, 2644, 2645, 2646, 2648, 2649, 2650, 2651, 2653, 2654, 2656, 2657,
  2658, 2659, 2660, 2661, 2663, 2664, 2666, 2667, 2672, 2673, 2675, 2677, 2678, 2679, 2680, 2681,
  2682, 2683, 2685, 2686, 2687, 2688, 2689, 2692, 2693, 2694, 2707, 2720, 2721, 2725, 2757, 2770,
  2771, 2775, 2815, 2816, 2824, 2853, 2866, 2871, 2905, 2969, 2974, 2987, 2991, 2994, 3005, 3016,
  3024, 3025, 3027, 3058, 3074, 3076, 3079,
];

const approvedBadIds = new Set([...explicitBadIds, ...templatedBadIds]);

function isTargetEntry(entry) {
  return approvedBadIds.has(entry.id);
}

const badEntries = data.filter(isTargetEntry);
const badIds = badEntries.map((entry) => entry.id);

if (badIds.length !== 263) {
  throw new Error(`Expected 263 approved bad entries, found ${badIds.length}`);
}

const usedPhrases = new Set(
  data.filter((entry) => !isTargetEntry(entry)).map((entry) => entry.phrase.trim().toLowerCase())
);

const topicNeedCounts = {};
for (const entry of badEntries) {
  topicNeedCounts[entry.topic] = (topicNeedCounts[entry.topic] || 0) + 1;
}

const replacementsByTopic = {};
for (const [topic, count] of Object.entries(topicNeedCounts)) {
  const candidates = buildCandidates(topic);
  const selected = [];
  for (const candidate of candidates) {
    const key = candidate.phrase.toLowerCase();
    if (usedPhrases.has(key)) {
      continue;
    }
    usedPhrases.add(key);
    selected.push(candidate);
    if (selected.length === count) {
      break;
    }
  }
  if (selected.length < count) {
    throw new Error(`Not enough candidates for ${topic}. Need ${count}, got ${selected.length}`);
  }
  replacementsByTopic[topic] = selected;
}

const replacementIndexByTopic = Object.fromEntries(Object.keys(replacementsByTopic).map((topic) => [topic, 0]));

for (const entry of data) {
  if (!isTargetEntry(entry)) {
    continue;
  }
  const topic = entry.topic;
  const replacement = replacementsByTopic[topic][replacementIndexByTopic[topic]++];
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

const finalPhrases = new Set();
for (const entry of data) {
  if (!allowedTopics.has(entry.topic)) {
    throw new Error(`Invalid topic at ID ${entry.id}: ${entry.topic}`);
  }
  if (!allowedLevels.has(entry.level)) {
    throw new Error(`Invalid level at ID ${entry.id}: ${entry.level}`);
  }
  const phraseKey = entry.phrase.trim().toLowerCase();
  if (finalPhrases.has(phraseKey)) {
    throw new Error(`Duplicate phrase after repair: ${entry.phrase}`);
  }
  finalPhrases.add(phraseKey);
}

const remainingBad = data.filter((entry) => isTargetEntry(entry) && isBadEntry(entry));
if (remainingBad.length > 0) {
  throw new Error(`Still found ${remainingBad.length} bad entries after repair.`);
}

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2) + '\n');
console.log(JSON.stringify({ replacedCount: badIds.length, ids: badIds }, null, 2));
