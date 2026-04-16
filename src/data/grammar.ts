export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Beginner" | "Intermediate" | "Advanced";

export interface GrammarStructure {
  id: number;
  category: string;
  topic: string;
  subcategory: string;
  pattern: string;
  structure: string;
  level: Level | string;
  meaning_vi: string;
  usage_vi: string;
  example_en: string;
  example_vi: string;
  tags: string[];
}

export const GRAMMAR_STRUCTURES: GrammarStructure[] = [
  {
    "id": 1,
    "category": "Core Grammar",
    "topic": "Present Simple",
    "subcategory": "Basic",
    "pattern": "S + V(s/es)",
    "structure": "Subject + Base Verb (+s/es) + Object",
    "level": "A2",
    "meaning_vi": "Diễn tả sự thật, thói quen hoặc lịch trình cố định.",
    "usage_vi": "Sử dụng để nói về các hoạt động diễn ra thường xuyên trong công việc hoặc cuộc sống hàng ngày.",
    "example_en": "Our team usually meets on Monday mornings to discuss the weekly plan.",
    "example_vi": "Nhóm của chúng tôi thường họp vào sáng thứ Hai để thảo luận về kế hoạch hàng tuần.",
    "tags": [
      "habit",
      "routine",
      "schedule"
    ]
  },
  {
    "id": 2,
    "category": "Core Grammar",
    "topic": "Present Continuous",
    "subcategory": "Basic",
    "pattern": "S + am/is/are + V-ing",
    "structure": "Subject + to be + Verb-ing",
    "level": "A2",
    "meaning_vi": "Đang làm gì đó, hoặc một xu hướng hiện tại.",
    "usage_vi": "Dùng để mô tả một dự án đang diễn ra hoặc một sự việc mang tính chất tạm thời.",
    "example_en": "We are currently working on a new marketing campaign.",
    "example_vi": "Chúng tôi hiện đang thực hiện một chiến dịch tiếp thị mới.",
    "tags": [
      "ongoing",
      "current_trend",
      "projects"
    ]
  },
  {
    "id": 3,
    "category": "Core Grammar",
    "topic": "Present Perfect",
    "subcategory": "Professional",
    "pattern": "S + have/has + V3/ed",
    "structure": "Subject + have/has + Past Participle",
    "level": "B1",
    "meaning_vi": "Đã làm gì đó (nhấn mạnh kết quả).",
    "usage_vi": "Rất phổ biến khi báo cáo tiến độ công việc hoặc nói về kinh nghiệm làm việc.",
    "example_en": "I have already sent the report to the client.",
    "example_vi": "Tôi đã gửi báo cáo cho khách hàng rồi.",
    "tags": [
      "progress",
      "experience",
      "reporting"
    ]
  },
  {
    "id": 4,
    "category": "Core Grammar",
    "topic": "Present Perfect Continuous",
    "subcategory": "Professional",
    "pattern": "S + have/has been + V-ing",
    "structure": "Subject + have/has + been + Verb-ing",
    "level": "B2",
    "meaning_vi": "Đã và đang làm gì đó liên tục.",
    "usage_vi": "Dùng để nhấn mạnh quá trình của một hành động bắt đầu trong quá khứ và vẫn đang tiếp diễn.",
    "example_en": "We have been trying to solve this bug since yesterday.",
    "example_vi": "Chúng tôi đã và đang cố gắng khắc phục lỗi này từ hôm qua.",
    "tags": [
      "ongoing_process",
      "duration",
      "problem_solving"
    ]
  },
  {
    "id": 5,
    "category": "Core Grammar",
    "topic": "Past Simple",
    "subcategory": "Basic",
    "pattern": "S + V2/ed",
    "structure": "Subject + Past Verb + Object",
    "level": "A2",
    "meaning_vi": "Đã làm gì đó trong quá khứ.",
    "usage_vi": "Dùng để kể lại một sự kiện hoặc hành động đã kết thúc hoàn toàn.",
    "example_en": "We launched the new product last quarter.",
    "example_vi": "Chúng tôi đã ra mắt sản phẩm mới vào quý trước.",
    "tags": [
      "completed_action",
      "past_events",
      "reporting"
    ]
  },
  {
    "id": 6,
    "category": "Core Grammar",
    "topic": "Future Forms",
    "subcategory": "Workplace",
    "pattern": "S + will/going to + V",
    "structure": "Subject + will / be going to + Base Verb",
    "level": "A2",
    "meaning_vi": "Sẽ làm gì đó.",
    "usage_vi": "Dùng 'will' cho quyết định tức thời/lời hứa, và 'going to' cho kế hoạch đã định sẵn.",
    "example_en": "I will send you the details later today.",
    "example_vi": "Tôi sẽ gửi cho bạn thông tin chi tiết vào cuối ngày hôm nay.",
    "tags": [
      "plans",
      "promises",
      "future_actions"
    ]
  },
  {
    "id": 7,
    "category": "Core Grammar",
    "topic": "Conditionals",
    "subcategory": "Basic",
    "pattern": "If + S + V (present), S + will + V",
    "structure": "If + Present Simple, Subject + will + Base Verb",
    "level": "B1",
    "meaning_vi": "Nếu... thì... (Điều kiện loại 1).",
    "usage_vi": "Dùng để nói về một tình huống có thể xảy ra trong tương lai và kết quả của nó.",
    "example_en": "If we delay the launch, we will lose market share.",
    "example_vi": "Nếu chúng ta trì hoãn việc ra mắt, chúng ta sẽ mất thị phần.",
    "tags": [
      "consequences",
      "possibility",
      "negotiation"
    ]
  },
  {
    "id": 8,
    "category": "Core Grammar",
    "topic": "Conditionals",
    "subcategory": "Professional",
    "pattern": "If + S + V2/ed, S + would + V",
    "structure": "If + Past Simple, Subject + would + Base Verb",
    "level": "B2",
    "meaning_vi": "Nếu... thì... (Điều kiện loại 2).",
    "usage_vi": "Dùng để đưa ra giả định không có thật ở hiện tại, thường dùng khi đề xuất giải pháp thay thế.",
    "example_en": "If we had a larger budget, we would hire more developers.",
    "example_vi": "Nếu chúng ta có ngân sách lớn hơn, chúng ta sẽ thuê thêm lập trình viên.",
    "tags": [
      "hypothetical",
      "proposals",
      "problem_solving"
    ]
  },
  {
    "id": 9,
    "category": "Core Grammar",
    "topic": "Passive Voice",
    "subcategory": "Formal",
    "pattern": "S + be + V3/ed",
    "structure": "Subject + to be + Past Participle",
    "level": "B1",
    "meaning_vi": "Được/bị làm gì đó.",
    "usage_vi": "Dùng nhiều trong văn bản công việc hoặc khi không muốn nhấn mạnh người thực hiện hành động.",
    "example_en": "The final report must be submitted by Friday.",
    "example_vi": "Báo cáo cuối cùng phải được nộp trước thứ Sáu.",
    "tags": [
      "formal_writing",
      "processes",
      "focus_on_action"
    ]
  },
  {
    "id": 10,
    "category": "Core Grammar",
    "topic": "Reported Speech",
    "subcategory": "Workplace",
    "pattern": "S + said/told + (that) + S + V (past)",
    "structure": "Reporting Subject + reporting verb + (that) + Subject + Backshifted Verb",
    "level": "B2",
    "meaning_vi": "Ai đó đã nói rằng...",
    "usage_vi": "Dùng để tường thuật lại lời nói của người khác, đặc biệt quan trọng trong các cuộc họp.",
    "example_en": "The manager said that we needed to cut costs.",
    "example_vi": "Người quản lý nói rằng chúng ta cần cắt giảm chi phí.",
    "tags": [
      "reporting",
      "meetings",
      "information_sharing"
    ]
  },
  {
    "id": 11,
    "category": "Opinions & Discussion",
    "topic": "Expressing Opinions",
    "subcategory": "Basic",
    "pattern": "I think that...",
    "structure": "I think (that) + Clause",
    "level": "A2",
    "meaning_vi": "Tôi nghĩ rằng...",
    "usage_vi": "Cách cơ bản và tự nhiên nhất để diễn đạt ý kiến trong giao tiếp hàng ngày.",
    "example_en": "I think that this design looks much better.",
    "example_vi": "Tôi nghĩ rằng thiết kế này trông đẹp hơn nhiều.",
    "tags": [
      "opinion",
      "casual",
      "discussion"
    ]
  },
  {
    "id": 12,
    "category": "Opinions & Discussion",
    "topic": "Expressing Opinions",
    "subcategory": "Neutral",
    "pattern": "In my opinion, ...",
    "structure": "In my opinion, + Clause",
    "level": "B1",
    "meaning_vi": "Theo ý kiến của tôi,...",
    "usage_vi": "Dùng để nêu ý kiến một cách lịch sự, phù hợp trong cả công việc và giao tiếp thông thường.",
    "example_en": "In my opinion, we should focus on customer retention first.",
    "example_vi": "Theo ý kiến của tôi, chúng ta nên tập trung vào việc giữ chân khách hàng trước.",
    "tags": [
      "opinion",
      "meetings",
      "professional"
    ]
  },
  {
    "id": 13,
    "category": "Opinions & Discussion",
    "topic": "Giving Perspectives",
    "subcategory": "Professional",
    "pattern": "From my perspective, ...",
    "structure": "From my perspective, + Clause",
    "level": "B2",
    "meaning_vi": "Từ góc độ của tôi,...",
    "usage_vi": "Dùng khi bạn muốn đưa ra nhận định dựa trên chuyên môn hoặc vị trí của mình.",
    "example_en": "From my perspective, the technical risks are too high.",
    "example_vi": "Từ góc độ của tôi, rủi ro kỹ thuật là quá cao.",
    "tags": [
      "perspective",
      "formal",
      "analysis"
    ]
  },
  {
    "id": 14,
    "category": "Opinions & Discussion",
    "topic": "Strong Opinions",
    "subcategory": "Strong",
    "pattern": "I strongly believe that...",
    "structure": "I strongly believe that + Clause",
    "level": "B2",
    "meaning_vi": "Tôi hoàn toàn tin rằng...",
    "usage_vi": "Dùng để nhấn mạnh niềm tin và sự chắc chắn của bạn về một vấn đề.",
    "example_en": "I strongly believe that this investment will pay off.",
    "example_vi": "Tôi hoàn toàn tin rằng khoản đầu tư này sẽ sinh lời.",
    "tags": [
      "strong_opinion",
      "conviction",
      "persuasion"
    ]
  },
  {
    "id": 15,
    "category": "Opinions & Discussion",
    "topic": "Expressing Opinions",
    "subcategory": "Neutral",
    "pattern": "It seems to me that...",
    "structure": "It seems to me that + Clause",
    "level": "B1",
    "meaning_vi": "Dường như đối với tôi là...",
    "usage_vi": "Một cách nói nhẹ nhàng, tránh áp đặt khi đưa ra quan điểm cá nhân.",
    "example_en": "It seems to me that we are drifting away from the main topic.",
    "example_vi": "Đối với tôi dường như chúng ta đang đi xa khỏi chủ đề chính.",
    "tags": [
      "soft_opinion",
      "diplomatic",
      "meetings"
    ]
  },
  {
    "id": 16,
    "category": "Opinions & Discussion",
    "topic": "Giving Perspectives",
    "subcategory": "Discussion",
    "pattern": "As far as I'm concerned, ...",
    "structure": "As far as I'm concerned, + Clause",
    "level": "B2",
    "meaning_vi": "Theo như tôi quan tâm/nghĩ thì...",
    "usage_vi": "Dùng để giới hạn ý kiến chỉ ở góc độ cá nhân của người nói, đôi khi mang sắc thái dứt khoát.",
    "example_en": "As far as I'm concerned, the matter is closed.",
    "example_vi": "Theo những gì tôi nghĩ, vấn đề này đã khép lại.",
    "tags": [
      "personal_view",
      "assertive",
      "discussion"
    ]
  },
  {
    "id": 17,
    "category": "Agreement & Disagreement",
    "topic": "Agreeing",
    "subcategory": "Basic",
    "pattern": "I agree with you that...",
    "structure": "I agree with you that + Clause",
    "level": "A2",
    "meaning_vi": "Tôi đồng ý với bạn rằng...",
    "usage_vi": "Cách phổ biến nhất để thể hiện sự đồng tình với ý kiến của ai đó.",
    "example_en": "I agree with you that the deadline is too tight.",
    "example_vi": "Tôi đồng ý với bạn rằng hạn chót là quá gắt gao.",
    "tags": [
      "agreement",
      "basic",
      "collaboration"
    ]
  },
  {
    "id": 18,
    "category": "Agreement & Disagreement",
    "topic": "Agreeing",
    "subcategory": "Strong",
    "pattern": "I couldn't agree more.",
    "structure": "I couldn't agree more",
    "level": "B1",
    "meaning_vi": "Tôi hoàn toàn đồng ý (không thể đồng ý hơn nữa).",
    "usage_vi": "Sử dụng khi bạn tán thành 100% với những gì người khác vừa nói.",
    "example_en": "You said we need to focus on quality, and I couldn't agree more.",
    "example_vi": "Bạn nói chúng ta cần tập trung vào chất lượng, và tôi hoàn toàn đồng ý.",
    "tags": [
      "strong_agreement",
      "support",
      "conversational"
    ]
  },
  {
    "id": 19,
    "category": "Agreement & Disagreement",
    "topic": "Agreeing",
    "subcategory": "Discussion",
    "pattern": "That's exactly what I was thinking.",
    "structure": "That is exactly what I was thinking",
    "level": "B1",
    "meaning_vi": "Đó chính xác là những gì tôi đang nghĩ.",
    "usage_vi": "Dùng khi ai đó nói trúng suy nghĩ của bạn.",
    "example_en": "Let's postpone the meeting. - That's exactly what I was thinking.",
    "example_vi": "Hãy hoãn cuộc họp lại. - Đó chính xác là những gì tôi đang nghĩ.",
    "tags": [
      "agreement",
      "enthusiastic",
      "brainstorming"
    ]
  },
  {
    "id": 20,
    "category": "Agreement & Disagreement",
    "topic": "Disagreeing",
    "subcategory": "Polite",
    "pattern": "I see your point, but...",
    "structure": "I see your point, but + Clause",
    "level": "B1",
    "meaning_vi": "Tôi hiểu ý của bạn, nhưng...",
    "usage_vi": "Một cách lịch sự để từ chối hoặc phản đối, ghi nhận ý kiến trước khi đưa ra ý trái chiều.",
    "example_en": "I see your point, but we don't have the budget for that.",
    "example_vi": "Tôi hiểu ý của bạn, nhưng chúng ta không có ngân sách cho việc đó.",
    "tags": [
      "disagreement",
      "polite",
      "diplomatic"
    ]
  },
  {
    "id": 21,
    "category": "Agreement & Disagreement",
    "topic": "Disagreeing",
    "subcategory": "Polite",
    "pattern": "I'm not so sure about that.",
    "structure": "I am not so sure about that",
    "level": "A2",
    "meaning_vi": "Tôi không chắc về điều đó lắm.",
    "usage_vi": "Cách nói giảm nói tránh khi bạn không đồng ý, tránh gây căng thẳng.",
    "example_en": "This software is completely secure. - I'm not so sure about that.",
    "example_vi": "Phần mềm này hoàn toàn bảo mật. - Tôi không chắc về điều đó lắm.",
    "tags": [
      "soft_disagreement",
      "doubt",
      "casual"
    ]
  },
  {
    "id": 22,
    "category": "Agreement & Disagreement",
    "topic": "Disagreeing",
    "subcategory": "Formal",
    "pattern": "I politely disagree.",
    "structure": "I politely disagree / I must politely disagree",
    "level": "B2",
    "meaning_vi": "Tôi xin phép được không đồng ý.",
    "usage_vi": "Dùng trong ngữ cảnh rất trang trọng hoặc chuyên nghiệp khi phản đối ý kiến.",
    "example_en": "I politely disagree with the new policy changes.",
    "example_vi": "Tôi xin phép không đồng tình với những thay đổi chính sách mới.",
    "tags": [
      "formal",
      "disagreement",
      "professional"
    ]
  },
  {
    "id": 23,
    "category": "Suggestions & Advice",
    "topic": "Making Suggestions",
    "subcategory": "Basic",
    "pattern": "We should consider + V-ing / Noun",
    "structure": "We should consider + Verb-ing / Noun phrase",
    "level": "B1",
    "meaning_vi": "Chúng ta nên xem xét việc...",
    "usage_vi": "Dùng để đề xuất một ý tưởng hoặc giải pháp một cách hợp lý và chuyên nghiệp.",
    "example_en": "We should consider updating our website design.",
    "example_vi": "Chúng ta nên xem xét việc cập nhật thiết kế trang web của mình.",
    "tags": [
      "suggestion",
      "problem_solving",
      "meetings"
    ]
  },
  {
    "id": 24,
    "category": "Suggestions & Advice",
    "topic": "Making Suggestions",
    "subcategory": "Neutral",
    "pattern": "It would be better to...",
    "structure": "It would be better to + Base Verb",
    "level": "B1",
    "meaning_vi": "Sẽ tốt hơn nếu...",
    "usage_vi": "Dùng khi bạn muốn đề xuất một phương án tốt hơn phương án hiện tại.",
    "example_en": "It would be better to wait until we have all the data.",
    "example_vi": "Sẽ tốt hơn nếu chờ cho đến khi chúng ta có đủ dữ liệu.",
    "tags": [
      "advice",
      "alternative",
      "decision_making"
    ]
  },
  {
    "id": 25,
    "category": "Suggestions & Advice",
    "topic": "Making Suggestions",
    "subcategory": "Discussion",
    "pattern": "How about + V-ing?",
    "structure": "How about + Verb-ing?",
    "level": "A2",
    "meaning_vi": "Việc... thì sao?",
    "usage_vi": "Cách rất tự nhiên và thân thiện để đưa ra một gợi ý trong thảo luận nhóm.",
    "example_en": "How about having a quick call to clear this up?",
    "example_vi": "Việc gọi một cuộc điện thoại nhanh để làm rõ điều này thì sao?",
    "tags": [
      "casual_suggestion",
      "brainstorming",
      "informal"
    ]
  },
  {
    "id": 26,
    "category": "Suggestions & Advice",
    "topic": "Giving Advice",
    "subcategory": "Professional",
    "pattern": "I highly recommend that...",
    "structure": "I highly recommend that + Subject + Base Verb",
    "level": "B2",
    "meaning_vi": "Tôi đánh giá cao/khuyên chân thành rằng...",
    "usage_vi": "Dùng khi bạn có sự tự tin vào lời khuyên của mình, thường mang tính chuyên gia.",
    "example_en": "I highly recommend that we use a cloud-based server.",
    "example_vi": "Tôi đánh giá cao việc chúng ta nên sử dụng máy chủ đám mây.",
    "tags": [
      "strong_advice",
      "recommendation",
      "formal"
    ]
  },
  {
    "id": 27,
    "category": "Suggestions & Advice",
    "topic": "Giving Advice",
    "subcategory": "Polite",
    "pattern": "You might want to...",
    "structure": "You might want to + Base Verb",
    "level": "B1",
    "meaning_vi": "Bạn có thể muốn...",
    "usage_vi": "Một cách đưa ra lời khuyên rất lịch sự, gián tiếp và không mang tính ép buộc.",
    "example_en": "You might want to double-check these figures before the presentation.",
    "example_vi": "Bạn có thể muốn kiểm tra lại những con số này trước buổi thuyết trình.",
    "tags": [
      "soft_advice",
      "polite",
      "feedback"
    ]
  },
  {
    "id": 28,
    "category": "Requests & Offers",
    "topic": "Making Requests",
    "subcategory": "Polite",
    "pattern": "Could you please...",
    "structure": "Could you please + Base Verb",
    "level": "A2",
    "meaning_vi": "Bạn có thể vui lòng...",
    "usage_vi": "Mẫu câu yêu cầu cơ bản, lịch sự và được sử dụng rộng rãi nhất.",
    "example_en": "Could you please send me the file by 5 PM?",
    "example_vi": "Bạn có thể vui lòng gửi cho tôi tập tin trước 5 giờ chiều không?",
    "tags": [
      "request",
      "polite",
      "daily_work"
    ]
  },
  {
    "id": 29,
    "category": "Requests & Offers",
    "topic": "Making Requests",
    "subcategory": "Polite",
    "pattern": "Would you mind + V-ing?",
    "structure": "Would you mind + Verb-ing?",
    "level": "B1",
    "meaning_vi": "Bạn có phiền nếu...",
    "usage_vi": "Cách yêu cầu rất lịch sự, đề cao sự tôn trọng người nghe.",
    "example_en": "Would you mind closing the door?",
    "example_vi": "Bạn có phiền đóng cửa lại giúp tôi không?",
    "tags": [
      "request",
      "courteous",
      "workplace"
    ]
  },
  {
    "id": 30,
    "category": "Requests & Offers",
    "topic": "Making Requests",
    "subcategory": "Formal",
    "pattern": "I would appreciate it if you could...",
    "structure": "I would appreciate it if you could + Base Verb",
    "level": "B2",
    "meaning_vi": "Tôi sẽ rất cảm kích nếu bạn có thể...",
    "usage_vi": "Mẫu câu nhờ vả cực kỳ trang trọng, thích hợp cho email công việc với cấp trên hoặc đối tác.",
    "example_en": "I would appreciate it if you could review this document.",
    "example_vi": "Tôi sẽ rất cảm kích nếu bạn có thể xem lại tài liệu này.",
    "tags": [
      "formal_request",
      "email",
      "professional"
    ]
  },
  {
    "id": 31,
    "category": "Requests & Offers",
    "topic": "Offering Help",
    "subcategory": "Basic",
    "pattern": "Would you like me to...",
    "structure": "Would you like me to + Base Verb",
    "level": "A2",
    "meaning_vi": "Bạn có muốn tôi...",
    "usage_vi": "Cách lịch sự để đề nghị giúp đỡ hoặc làm gì đó cho ai.",
    "example_en": "Would you like me to book the flight for you?",
    "example_vi": "Bạn có muốn tôi đặt chuyến bay cho bạn không?",
    "tags": [
      "offer",
      "assistance",
      "polite"
    ]
  },
  {
    "id": 32,
    "category": "Requests & Offers",
    "topic": "Offering Help",
    "subcategory": "Neutral",
    "pattern": "Let me know if you need help with...",
    "structure": "Let me know if you need help with + Noun / Verb-ing",
    "level": "B1",
    "meaning_vi": "Hãy cho tôi biết nếu bạn cần giúp đỡ về...",
    "usage_vi": "Một lời đề nghị giúp đỡ mở, thân thiện và tạo cảm giác sẵn sàng hỗ trợ.",
    "example_en": "Let me know if you need help with the presentation preparation.",
    "example_vi": "Hãy cho tôi biết nếu bạn cần giúp đỡ với việc chuẩn bị bài thuyết trình.",
    "tags": [
      "support",
      "teamwork",
      "offer"
    ]
  },
  {
    "id": 33,
    "category": "Cause & Effect",
    "topic": "Explaining Causes",
    "subcategory": "Basic",
    "pattern": "The reason is that...",
    "structure": "The reason (why...) is that + Clause",
    "level": "A2",
    "meaning_vi": "Lý do là vì...",
    "usage_vi": "Dùng để giải thích nguyên nhân của một vấn đề một cách rõ ràng.",
    "example_en": "The reason is that we ran out of materials.",
    "example_vi": "Lý do là vì chúng ta đã hết nguyên liệu.",
    "tags": [
      "cause",
      "explanation",
      "reporting"
    ]
  },
  {
    "id": 34,
    "category": "Cause & Effect",
    "topic": "Explaining Causes",
    "subcategory": "Professional",
    "pattern": "This is due to...",
    "structure": "This is due to + Noun phrase",
    "level": "B1",
    "meaning_vi": "Điều này là do...",
    "usage_vi": "Thường dùng trong báo cáo công việc hoặc phân tích để chỉ ra nguyên nhân trực tiếp.",
    "example_en": "The delay is due to technical difficulties.",
    "example_vi": "Sự chậm trễ này là do khó khăn về mặt kỹ thuật.",
    "tags": [
      "cause",
      "formal",
      "business_reports"
    ]
  },
  {
    "id": 35,
    "category": "Cause & Effect",
    "topic": "Explaining Results",
    "subcategory": "Neutral",
    "pattern": "As a result, ...",
    "structure": "As a result, + Clause",
    "level": "B1",
    "meaning_vi": "Kết quả là,...",
    "usage_vi": "Dùng như một từ nối để trình bày hậu quả hoặc kết quả của sự việc trước đó.",
    "example_en": "We didn't test the update. As a result, the system crashed.",
    "example_vi": "Chúng tôi đã không kiểm thử bản cập nhật. Kết quả là, hệ thống đã bị sập.",
    "tags": [
      "effect",
      "consequence",
      "connector"
    ]
  },
  {
    "id": 36,
    "category": "Problem Solving",
    "topic": "Identifying Problems",
    "subcategory": "Basic",
    "pattern": "The main issue is...",
    "structure": "The main issue is + Noun phrase / that + Clause",
    "level": "B1",
    "meaning_vi": "Vấn đề chính là...",
    "usage_vi": "Dùng để thu hút sự chú ý vào điểm mấu chốt của khó khăn hiện tại.",
    "example_en": "The main issue is that our software isn't compatible.",
    "example_vi": "Vấn đề chính là phần mềm của chúng ta không tương thích.",
    "tags": [
      "problem",
      "focus",
      "troubleshooting"
    ]
  },
  {
    "id": 37,
    "category": "Problem Solving",
    "topic": "Proposing Solutions",
    "subcategory": "Neutral",
    "pattern": "One possible solution is to...",
    "structure": "One possible solution is to + Base Verb",
    "level": "B1",
    "meaning_vi": "Một giải pháp khả thi là...",
    "usage_vi": "Đưa ra một gợi ý giải quyết vấn đề một cách khách quan.",
    "example_en": "One possible solution is to hire a freelancer.",
    "example_vi": "Một giải pháp khả thi là thuê một người làm tự do.",
    "tags": [
      "solution",
      "proposal",
      "options"
    ]
  },
  {
    "id": 38,
    "category": "Problem Solving",
    "topic": "Proposing Solutions",
    "subcategory": "Discussion",
    "pattern": "What if we...",
    "structure": "What if we + Past Simple / Present Simple",
    "level": "A2",
    "meaning_vi": "Sẽ ra sao nếu chúng ta...",
    "usage_vi": "Mẫu câu tuyệt vời để cùng nhau động não (brainstorming) và tìm giải pháp thay thế.",
    "example_en": "What if we offer them a discount?",
    "example_vi": "Sẽ ra sao nếu chúng ta đề nghị giảm giá cho họ?",
    "tags": [
      "brainstorming",
      "hypothetical",
      "solution"
    ]
  },
  {
    "id": 39,
    "category": "Meetings & Work Communication",
    "topic": "Discussing Issues",
    "subcategory": "Workplace",
    "pattern": "Let's move on to...",
    "structure": "Let's move on to + Noun phrase",
    "level": "A2",
    "meaning_vi": "Hãy chuyển sang phần...",
    "usage_vi": "Dùng để điều hướng và chuyển chủ đề trong một cuộc họp.",
    "example_en": "Let's move on to the next item on the agenda.",
    "example_vi": "Hãy chuyển sang mục tiếp theo trong chương trình nghị sự.",
    "tags": [
      "meeting_management",
      "transition",
      "agenda"
    ]
  },
  {
    "id": 40,
    "category": "Meetings & Work Communication",
    "topic": "Explaining Progress",
    "subcategory": "Reporting",
    "pattern": "We are currently on track to...",
    "structure": "We are currently on track to + Base Verb",
    "level": "B2",
    "meaning_vi": "Chúng ta hiện đang đi đúng tiến độ để...",
    "usage_vi": "Báo cáo tiến độ tích cực, xác nhận mọi thứ đang diễn ra theo kế hoạch.",
    "example_en": "We are currently on track to launch the app by May.",
    "example_vi": "Chúng ta hiện đang đi đúng tiến độ để ra mắt ứng dụng vào tháng Năm.",
    "tags": [
      "progress",
      "positive_news",
      "status_update"
    ]
  },
  {
    "id": 41,
    "category": "Meetings & Work Communication",
    "topic": "Explaining Progress",
    "subcategory": "Reporting",
    "pattern": "We have hit a snag with...",
    "structure": "We have hit a snag with + Noun phrase",
    "level": "B2",
    "meaning_vi": "Chúng tôi gặp một chút trục trặc với...",
    "usage_vi": "Thông báo về một vấn đề nhỏ bất ngờ cản trở tiến độ.",
    "example_en": "We have hit a snag with the supplier contract.",
    "example_vi": "Chúng tôi gặp một chút trục trặc với hợp đồng của nhà cung cấp.",
    "tags": [
      "issues",
      "updates",
      "idiomatic"
    ]
  },
  {
    "id": 42,
    "category": "Meetings & Work Communication",
    "topic": "Talking about Plans",
    "subcategory": "Professional",
    "pattern": "Our next step is to...",
    "structure": "Our next step is to + Base Verb",
    "level": "B1",
    "meaning_vi": "Bước tiếp theo của chúng ta là...",
    "usage_vi": "Làm rõ hành động kế tiếp cần thực hiện để mọi người nắm rõ kế hoạch.",
    "example_en": "Our next step is to review the feedback from users.",
    "example_vi": "Bước tiếp theo của chúng ta là xem xét phản hồi từ người dùng.",
    "tags": [
      "action_plan",
      "next_steps",
      "clarity"
    ]
  },
  {
    "id": 43,
    "category": "Connectors",
    "topic": "Adding Information",
    "subcategory": "Formal",
    "pattern": "In addition, ...",
    "structure": "In addition, + Clause",
    "level": "B1",
    "meaning_vi": "Thêm vào đó,...",
    "usage_vi": "Dùng để bổ sung thêm một ý hoặc thông tin liên quan.",
    "example_en": "In addition, we will provide training for all staff.",
    "example_vi": "Thêm vào đó, chúng tôi sẽ cung cấp khóa đào tạo cho tất cả nhân viên.",
    "tags": [
      "addition",
      "linking",
      "presentations"
    ]
  },
  {
    "id": 44,
    "category": "Connectors",
    "topic": "Contrasting Ideas",
    "subcategory": "Neutral",
    "pattern": "On the other hand, ...",
    "structure": "On the other hand, + Clause",
    "level": "B1",
    "meaning_vi": "Mặt khác,...",
    "usage_vi": "Đưa ra một quan điểm trái chiều hoặc khía cạnh khác của vấn đề đang xét.",
    "example_en": "It's expensive. On the other hand, the quality is excellent.",
    "example_vi": "Nó đắt tiền. Nhưng mặt khác, chất lượng lại cực kỳ tốt.",
    "tags": [
      "contrast",
      "evaluation",
      "balanced_view"
    ]
  },
  {
    "id": 45,
    "category": "Sentence Frames",
    "topic": "Clarifying",
    "subcategory": "Basic",
    "pattern": "What I mean is...",
    "structure": "What I mean is + (that) + Clause",
    "level": "A2",
    "meaning_vi": "Ý tôi là...",
    "usage_vi": "Dùng để diễn đạt lại ý của mình cho rõ ràng hơn khi người khác chưa hiểu.",
    "example_en": "What I mean is that we should be more careful.",
    "example_vi": "Ý tôi là chúng ta nên cẩn thận hơn.",
    "tags": [
      "clarification",
      "explanation",
      "communication"
    ]
  },
  {
    "id": 46,
    "category": "Sentence Frames",
    "topic": "Checking Understanding",
    "subcategory": "Polite",
    "pattern": "Does that make sense?",
    "structure": "Does that make sense?",
    "level": "A2",
    "meaning_vi": "Như vậy có hợp lý không? / Bạn có hiểu ý tôi không?",
    "usage_vi": "Cách rất tự nhiên để hỏi xem người nghe có hiểu và đồng tình với những gì mình vừa nói không.",
    "example_en": "We will shift the timeline to next week. Does that make sense?",
    "example_vi": "Chúng ta sẽ dời lịch sang tuần sau. Như vậy có hợp lý không?",
    "tags": [
      "checking",
      "interactive",
      "feedback"
    ]
  },
  {
    "id": 47,
    "category": "Sentence Frames",
    "topic": "Interrupting",
    "subcategory": "Polite",
    "pattern": "Sorry to interrupt, but...",
    "structure": "Sorry to interrupt, but + Clause",
    "level": "B1",
    "meaning_vi": "Xin lỗi vì đã ngắt lời, nhưng...",
    "usage_vi": "Cách lịch sự để chen vào câu chuyện hoặc đóng góp ý kiến khi người khác đang nói.",
    "example_en": "Sorry to interrupt, but I have a question about the budget.",
    "example_vi": "Xin lỗi vì đã ngắt lời, nhưng tôi có một câu hỏi về ngân sách.",
    "tags": [
      "interruption",
      "polite",
      "meetings"
    ]
  },
  {
    "id": 48,
    "category": "Meetings & Work Communication",
    "topic": "Closing a Meeting",
    "subcategory": "Professional",
    "pattern": "To sum up, ...",
    "structure": "To sum up, + Clause",
    "level": "B1",
    "meaning_vi": "Tóm lại,...",
    "usage_vi": "Dùng để tóm tắt lại các ý chính trước khi kết thúc một cuộc họp hoặc bài thuyết trình.",
    "example_en": "To sum up, we will launch the campaign in October.",
    "example_vi": "Tóm lại, chúng ta sẽ ra mắt chiến dịch vào tháng Mười.",
    "tags": [
      "summary",
      "conclusion",
      "presentations"
    ]
  },
  {
    "id": 49,
    "category": "Requests & Offers",
    "topic": "Asking for Permission",
    "subcategory": "Formal",
    "pattern": "Would it be possible to...",
    "structure": "Would it be possible to + Base Verb",
    "level": "B2",
    "meaning_vi": "Liệu có thể... không?",
    "usage_vi": "Một cách yêu cầu hoặc xin phép rất tế nhị, lịch sự và khiêm tốn.",
    "example_en": "Would it be possible to extend the deadline?",
    "example_vi": "Liệu có thể gia hạn hạn chót không?",
    "tags": [
      "permission",
      "polite_request",
      "negotiation"
    ]
  },
  {
    "id": 50,
    "category": "Suggestions & Advice",
    "topic": "Giving Advice",
    "subcategory": "Basic",
    "pattern": "If I were you, I would...",
    "structure": "If I were you, I would + Base Verb",
    "level": "B1",
    "meaning_vi": "Nếu tôi là bạn, tôi sẽ...",
    "usage_vi": "Dùng điều kiện loại 2 để đặt mình vào vị trí của người khác và đưa ra lời khuyên.",
    "example_en": "If I were you, I would talk to the manager directly.",
    "example_vi": "Nếu tôi là bạn, tôi sẽ nói chuyện trực tiếp với quản lý.",
    "tags": [
      "advice",
      "hypothetical",
      "empathy"
    ]
  },
  {
    "id": 51,
    "category": "Core Grammar",
    "topic": "Comparatives",
    "subcategory": "Basic",
    "pattern": "S + be + adj-er/more adj + than...",
    "structure": "Subject + to be + Comparative Adjective + than + Noun/Pronoun",
    "level": "A2",
    "meaning_vi": "Cái này ... hơn cái kia.",
    "usage_vi": "Dùng để so sánh hai đối tượng, phổ biến khi đánh giá các lựa chọn hoặc giải pháp.",
    "example_en": "This new software is much faster than the old one.",
    "example_vi": "Phần mềm mới này nhanh hơn nhiều so với phần mềm cũ.",
    "tags": [
      "comparison",
      "evaluation",
      "choices"
    ]
  },
  {
    "id": 52,
    "category": "Core Grammar",
    "topic": "Comparatives",
    "subcategory": "Professional",
    "pattern": "The + adj-er/more adj, the + adj-er/more adj",
    "structure": "The + Comparative, the + Comparative",
    "level": "B2",
    "meaning_vi": "Càng... thì càng...",
    "usage_vi": "Sử dụng để chỉ mối quan hệ nhân quả kép, sự tương quan giữa hai yếu tố trong phân tích.",
    "example_en": "The sooner we launch, the better our chances of success.",
    "example_vi": "Chúng ta ra mắt càng sớm, cơ hội thành công của chúng ta càng cao.",
    "tags": [
      "correlation",
      "analysis",
      "strategy"
    ]
  },
  {
    "id": 53,
    "category": "Core Grammar",
    "topic": "Quantifiers",
    "subcategory": "Basic",
    "pattern": "A lot of / Lots of + Noun",
    "structure": "A lot of / Lots of + Countable/Uncountable Noun",
    "level": "A2",
    "meaning_vi": "Nhiều...",
    "usage_vi": "Sử dụng rộng rãi trong giao tiếp hàng ngày để chỉ số lượng hoặc khối lượng lớn.",
    "example_en": "We have a lot of work to finish before Friday.",
    "example_vi": "Chúng ta có rất nhiều việc phải hoàn thành trước thứ Sáu.",
    "tags": [
      "quantity",
      "workload",
      "casual"
    ]
  },
  {
    "id": 54,
    "category": "Core Grammar",
    "topic": "Quantifiers",
    "subcategory": "Formal",
    "pattern": "A significant number/amount of + Noun",
    "structure": "A significant number of + Countable Noun / amount of + Uncountable Noun",
    "level": "B2",
    "meaning_vi": "Một số lượng/lượng đáng kể...",
    "usage_vi": "Dùng trong báo cáo, bài thuyết trình trang trọng để mô tả dữ liệu hoặc số lượng lớn.",
    "example_en": "A significant amount of time was spent on this research.",
    "example_vi": "Một lượng thời gian đáng kể đã được dành cho nghiên cứu này.",
    "tags": [
      "formal_reporting",
      "data",
      "quantity"
    ]
  },
  {
    "id": 55,
    "category": "Core Grammar",
    "topic": "Relative Clauses",
    "subcategory": "Basic",
    "pattern": "Noun + who/which/that + Verb",
    "structure": "Noun + Relative Pronoun + Clause",
    "level": "B1",
    "meaning_vi": "Người/vật mà...",
    "usage_vi": "Cung cấp thêm thông tin cần thiết về một người, sự vật hoặc khái niệm.",
    "example_en": "The client who called this morning wants an update.",
    "example_vi": "Vị khách hàng người mà đã gọi sáng nay muốn cập nhật tình hình.",
    "tags": [
      "clarification",
      "details",
      "description"
    ]
  },
  {
    "id": 56,
    "category": "Core Grammar",
    "topic": "Modal Verbs",
    "subcategory": "Probability",
    "pattern": "S + might/may/could + V",
    "structure": "Subject + might/may/could + Base Verb",
    "level": "A2",
    "meaning_vi": "Có thể sẽ làm gì đó / Điều gì đó có thể xảy ra.",
    "usage_vi": "Thể hiện khả năng một sự việc có thể xảy ra trong tương lai nhưng không chắc chắn 100%.",
    "example_en": "We might need to hire an extra designer for this project.",
    "example_vi": "Chúng ta có thể cần thuê thêm một nhà thiết kế cho dự án này.",
    "tags": [
      "possibility",
      "planning",
      "uncertainty"
    ]
  },
  {
    "id": 57,
    "category": "Core Grammar",
    "topic": "Modal Verbs",
    "subcategory": "Deduction",
    "pattern": "S + must be / must have + V3/ed",
    "structure": "Subject + must + be / have + Past Participle",
    "level": "B2",
    "meaning_vi": "Chắc hẳn là / Chắc hẳn đã...",
    "usage_vi": "Dùng để suy luận một cách logic hoặc đưa ra kết luận chắc chắn dựa trên bằng chứng.",
    "example_en": "They haven't replied yet; they must be very busy.",
    "example_vi": "Họ vẫn chưa trả lời; họ chắc hẳn đang rất bận.",
    "tags": [
      "deduction",
      "conclusion",
      "logical_thinking"
    ]
  },
  {
    "id": 58,
    "category": "Sentence Frames",
    "topic": "Asking for Clarification",
    "subcategory": "Basic",
    "pattern": "What do you mean by...?",
    "structure": "What do you mean by + Noun phrase / Verb-ing?",
    "level": "A2",
    "meaning_vi": "Ý bạn là gì khi nói...?",
    "usage_vi": "Câu hỏi trực tiếp và tự nhiên nhất để yêu cầu ai đó giải thích rõ hơn từ hoặc cụm từ họ vừa dùng.",
    "example_en": "What do you mean by 'restructuring' the team?",
    "example_vi": "Ý bạn là gì khi nói 'tái cấu trúc' nhóm?",
    "tags": [
      "clarification",
      "questions",
      "understanding"
    ]
  },
  {
    "id": 59,
    "category": "Sentence Frames",
    "topic": "Asking for Clarification",
    "subcategory": "Polite",
    "pattern": "Could you elaborate on...?",
    "structure": "Could you elaborate on + Noun phrase?",
    "level": "B2",
    "meaning_vi": "Bạn có thể nói rõ hơn/chi tiết hơn về... không?",
    "usage_vi": "Cách trang trọng và chuyên nghiệp để yêu cầu thêm chi tiết về một ý tưởng hay kế hoạch.",
    "example_en": "Could you elaborate on the marketing strategy you just mentioned?",
    "example_vi": "Bạn có thể nói rõ hơn về chiến lược tiếp thị mà bạn vừa đề cập không?",
    "tags": [
      "elaboration",
      "details",
      "meetings"
    ]
  },
  {
    "id": 60,
    "category": "Opinions & Discussion",
    "topic": "Giving Perspectives",
    "subcategory": "Neutral",
    "pattern": "As I see it, ...",
    "structure": "As I see it, + Clause",
    "level": "B1",
    "meaning_vi": "Theo cách tôi thấy thì...",
    "usage_vi": "Một cách lịch sự và khá cá nhân để đưa ra đánh giá, nhìn nhận về một tình huống.",
    "example_en": "As I see it, this is a great opportunity for our company.",
    "example_vi": "Theo như tôi thấy, đây là một cơ hội tuyệt vời cho công ty chúng ta.",
    "tags": [
      "perspective",
      "evaluation",
      "discussion"
    ]
  },
  {
    "id": 61,
    "category": "Opinions & Discussion",
    "topic": "Expressing Opinions",
    "subcategory": "Soft",
    "pattern": "I tend to think that...",
    "structure": "I tend to think that + Clause",
    "level": "B2",
    "meaning_vi": "Tôi có xu hướng nghĩ rằng...",
    "usage_vi": "Thể hiện quan điểm một cách nhẹ nhàng, tránh sự võ đoán, mở đường cho những ý kiến khác.",
    "example_en": "I tend to think that working from home increases productivity.",
    "example_vi": "Tôi có xu hướng nghĩ rằng làm việc tại nhà làm tăng năng suất.",
    "tags": [
      "soft_opinion",
      "diplomatic",
      "brainstorming"
    ]
  },
  {
    "id": 62,
    "category": "Agreement & Disagreement",
    "topic": "Agreeing",
    "subcategory": "Partial",
    "pattern": "I agree up to a point, but...",
    "structure": "I agree up to a point, but + Clause",
    "level": "B2",
    "meaning_vi": "Tôi đồng ý một phần, nhưng...",
    "usage_vi": "Sử dụng khi bạn đồng ý với một số phần của ý kiến nhưng vẫn có điểm bảo lưu hoặc phản đối.",
    "example_en": "I agree up to a point, but we still need to consider the costs.",
    "example_vi": "Tôi đồng ý một phần, nhưng chúng ta vẫn cần phải xem xét đến chi phí.",
    "tags": [
      "partial_agreement",
      "nuance",
      "debate"
    ]
  },
  {
    "id": 63,
    "category": "Agreement & Disagreement",
    "topic": "Agreeing",
    "subcategory": "Professional",
    "pattern": "We are on the same page regarding...",
    "structure": "We are on the same page regarding + Noun phrase",
    "level": "B1",
    "meaning_vi": "Chúng ta có cùng suy nghĩ/hiểu biết về...",
    "usage_vi": "Thành ngữ phổ biến trong môi trường làm việc để xác nhận sự đồng thuận hoặc cùng chung hướng đi.",
    "example_en": "I'm glad we are on the same page regarding the project goals.",
    "example_vi": "Tôi rất vui vì chúng ta có cùng tiếng nói về các mục tiêu của dự án.",
    "tags": [
      "idiom",
      "consensus",
      "alignment"
    ]
  },
  {
    "id": 64,
    "category": "Agreement & Disagreement",
    "topic": "Disagreeing",
    "subcategory": "Strong",
    "pattern": "I completely disagree.",
    "structure": "I completely disagree (with + Noun phrase)",
    "level": "B1",
    "meaning_vi": "Tôi hoàn toàn không đồng ý.",
    "usage_vi": "Dùng để phản đối mạnh mẽ và trực tiếp. Cần thận trọng khi dùng để tránh gây mất lòng.",
    "example_en": "I completely disagree with the decision to cut the marketing budget.",
    "example_vi": "Tôi hoàn toàn không đồng ý với quyết định cắt giảm ngân sách tiếp thị.",
    "tags": [
      "strong_disagreement",
      "direct",
      "conflict"
    ]
  },
  {
    "id": 65,
    "category": "Suggestions & Advice",
    "topic": "Offering Solutions",
    "subcategory": "Discussion",
    "pattern": "Have you considered + V-ing?",
    "structure": "Have you considered + Verb-ing?",
    "level": "B1",
    "meaning_vi": "Bạn đã cân nhắc việc... chưa?",
    "usage_vi": "Gợi ý một giải pháp dưới dạng câu hỏi để đối phương suy nghĩ, không mang tính áp đặt.",
    "example_en": "Have you considered reaching out to them directly?",
    "example_vi": "Bạn đã cân nhắc việc liên hệ trực tiếp với họ chưa?",
    "tags": [
      "suggestion",
      "problem_solving",
      "inquiry"
    ]
  },
  {
    "id": 66,
    "category": "Suggestions & Advice",
    "topic": "Offering Solutions",
    "subcategory": "Formal",
    "pattern": "I propose that we...",
    "structure": "I propose that we + Base Verb",
    "level": "B2",
    "meaning_vi": "Tôi đề xuất rằng chúng ta...",
    "usage_vi": "Cách đưa ra kiến nghị chính thức trong các cuộc họp trang trọng hoặc văn bản.",
    "example_en": "I propose that we delay the launch until next month.",
    "example_vi": "Tôi đề xuất rằng chúng ta lùi ngày ra mắt cho đến tháng sau.",
    "tags": [
      "formal_proposal",
      "meetings",
      "decision_making"
    ]
  },
  {
    "id": 67,
    "category": "Requests & Offers",
    "topic": "Asking for Action",
    "subcategory": "Professional",
    "pattern": "Please ensure that...",
    "structure": "Please ensure that + Clause",
    "level": "B1",
    "meaning_vi": "Vui lòng đảm bảo rằng...",
    "usage_vi": "Giao việc hoặc dặn dò nhân viên, đồng nghiệp một cách lịch sự nhưng kiên quyết trong công việc.",
    "example_en": "Please ensure that all doors are locked before leaving.",
    "example_vi": "Vui lòng đảm bảo rằng tất cả các cửa đều được khóa trước khi rời đi.",
    "tags": [
      "instructions",
      "management",
      "requests"
    ]
  },
  {
    "id": 68,
    "category": "Requests & Offers",
    "topic": "Delegating",
    "subcategory": "Workplace",
    "pattern": "Could you take charge of...?",
    "structure": "Could you take charge of + Noun phrase / Verb-ing?",
    "level": "B2",
    "meaning_vi": "Bạn có thể phụ trách... được không?",
    "usage_vi": "Dùng để phân công nhiệm vụ hoặc giao trách nhiệm quản lý một mảng công việc cho ai đó.",
    "example_en": "Could you take charge of the social media campaign?",
    "example_vi": "Bạn có thể phụ trách chiến dịch truyền thông xã hội được không?",
    "tags": [
      "delegation",
      "leadership",
      "task_assignment"
    ]
  },
  {
    "id": 69,
    "category": "Cause & Effect",
    "topic": "Explaining Causes",
    "subcategory": "Formal",
    "pattern": "This stems from...",
    "structure": "This stems from + Noun phrase",
    "level": "B2",
    "meaning_vi": "Điều này bắt nguồn từ...",
    "usage_vi": "Sử dụng để giải thích cội rễ, nguồn gốc sâu xa của một vấn đề.",
    "example_en": "The high turnover rate stems from poor management.",
    "example_vi": "Tỷ lệ nghỉ việc cao bắt nguồn từ khả năng quản lý kém.",
    "tags": [
      "root_cause",
      "analysis",
      "formal"
    ]
  },
  {
    "id": 70,
    "category": "Cause & Effect",
    "topic": "Explaining Results",
    "subcategory": "Professional",
    "pattern": "Consequently, ...",
    "structure": "Consequently, + Clause",
    "level": "B2",
    "meaning_vi": "Hậu quả là / Do đó,...",
    "usage_vi": "Từ nối trang trọng dùng để nêu kết quả trực tiếp của một hành động trước đó.",
    "example_en": "Sales dropped by 20%. Consequently, we have to cut expenses.",
    "example_vi": "Doanh số giảm 20%. Do đó, chúng ta phải cắt giảm chi phí.",
    "tags": [
      "result",
      "consequence",
      "connectors"
    ]
  },
  {
    "id": 71,
    "category": "Cause & Effect",
    "topic": "Explaining Results",
    "subcategory": "Basic",
    "pattern": "That's why...",
    "structure": "That is why + Clause",
    "level": "A2",
    "meaning_vi": "Đó là lý do tại sao...",
    "usage_vi": "Cách rất tự nhiên trong văn nói để đúc kết lý do hoặc kết quả của những gì vừa trình bày.",
    "example_en": "Our budget is limited. That's why we can't hire more staff.",
    "example_vi": "Ngân sách của chúng ta có hạn. Đó là lý do tại sao chúng ta không thể thuê thêm nhân viên.",
    "tags": [
      "explanation",
      "conclusion",
      "casual"
    ]
  },
  {
    "id": 72,
    "category": "Problem Solving",
    "topic": "Identifying Problems",
    "subcategory": "Professional",
    "pattern": "The core issue is...",
    "structure": "The core issue is + (that) + Clause",
    "level": "B1",
    "meaning_vi": "Vấn đề cốt lõi là...",
    "usage_vi": "Dùng để nhấn mạnh vào trung tâm của rắc rối, bỏ qua những chi tiết râu ria.",
    "example_en": "The core issue is a lack of communication between departments.",
    "example_vi": "Vấn đề cốt lõi là sự thiếu giao tiếp giữa các phòng ban.",
    "tags": [
      "core_problem",
      "focus",
      "troubleshooting"
    ]
  },
  {
    "id": 73,
    "category": "Problem Solving",
    "topic": "Explaining Causes",
    "subcategory": "Discussion",
    "pattern": "It all comes down to...",
    "structure": "It all comes down to + Noun phrase",
    "level": "B2",
    "meaning_vi": "Tất cả đều quy về/chung quy lại là...",
    "usage_vi": "Dùng để tóm lược hoặc kết luận yếu tố quan trọng nhất mang tính quyết định đến một vấn đề.",
    "example_en": "We can try different strategies, but it all comes down to budget.",
    "example_vi": "Chúng ta có thể thử các chiến lược khác nhau, nhưng chung quy lại vẫn là do ngân sách.",
    "tags": [
      "summary",
      "crucial_factor",
      "idiom"
    ]
  },
  {
    "id": 74,
    "category": "Meetings & Work Communication",
    "topic": "Starting a Meeting",
    "subcategory": "Basic",
    "pattern": "Let's get started.",
    "structure": "Let's get started.",
    "level": "A2",
    "meaning_vi": "Chúng ta hãy bắt đầu nào.",
    "usage_vi": "Cách nhanh gọn, thân thiện và rất phổ biến để mở đầu một cuộc họp hoặc thảo luận.",
    "example_en": "Everyone is here, so let's get started.",
    "example_vi": "Mọi người đã đến đủ, vậy chúng ta hãy bắt đầu nào.",
    "tags": [
      "opening",
      "initiation",
      "casual_meetings"
    ]
  },
  {
    "id": 75,
    "category": "Meetings & Work Communication",
    "topic": "Starting a Meeting",
    "subcategory": "Formal",
    "pattern": "I'd like to welcome everyone...",
    "structure": "I would like to welcome everyone to + Noun phrase",
    "level": "B1",
    "meaning_vi": "Tôi muốn chào mừng mọi người...",
    "usage_vi": "Câu mở đầu trang trọng, phù hợp cho các cuộc họp lớn, thuyết trình hoặc tiếp đón đối tác.",
    "example_en": "I'd like to welcome everyone to our annual general meeting.",
    "example_vi": "Tôi xin chào mừng mọi người đến với cuộc họp đại hội đồng thường niên của chúng ta.",
    "tags": [
      "welcome",
      "formal_opening",
      "presentations"
    ]
  },
  {
    "id": 76,
    "category": "Meetings & Work Communication",
    "topic": "Giving the Floor",
    "subcategory": "Professional",
    "pattern": "I'll hand it over to...",
    "structure": "I will hand it over to + Person",
    "level": "B1",
    "meaning_vi": "Tôi sẽ nhường lời lại cho...",
    "usage_vi": "Dùng để chuyển quyền phát biểu hoặc thuyết trình cho người tiếp theo trong nhóm.",
    "example_en": "Now, I'll hand it over to Sarah for the financial report.",
    "example_vi": "Bây giờ, tôi sẽ nhường lời lại cho Sarah về phần báo cáo tài chính.",
    "tags": [
      "transition",
      "turn_taking",
      "presentations"
    ]
  },
  {
    "id": 77,
    "category": "Meetings & Work Communication",
    "topic": "Reporting Results",
    "subcategory": "Neutral",
    "pattern": "As you can see from...",
    "structure": "As you can see from + Noun phrase (chart, graph, report), + Clause",
    "level": "B1",
    "meaning_vi": "Như bạn có thể thấy từ...",
    "usage_vi": "Sử dụng để hướng sự chú ý của người nghe vào tài liệu hoặc số liệu trực quan.",
    "example_en": "As you can see from the chart, our sales have doubled.",
    "example_vi": "Như các bạn có thể thấy từ biểu đồ, doanh số của chúng ta đã tăng gấp đôi.",
    "tags": [
      "visual_aids",
      "reporting",
      "evidence"
    ]
  },
  {
    "id": 78,
    "category": "Connectors",
    "topic": "Sequencing",
    "subcategory": "Basic",
    "pattern": "First of all, ...",
    "structure": "First of all, + Clause",
    "level": "A2",
    "meaning_vi": "Trước hết / Đầu tiên là,...",
    "usage_vi": "Từ nối phổ biến để liệt kê điểm đầu tiên trong một danh sách các luận điểm hoặc chuỗi hành động.",
    "example_en": "First of all, I want to thank you for coming today.",
    "example_vi": "Trước hết, tôi muốn cảm ơn các bạn vì đã đến hôm nay.",
    "tags": [
      "ordering",
      "starting",
      "speech"
    ]
  },
  {
    "id": 79,
    "category": "Connectors",
    "topic": "Giving Examples",
    "subcategory": "Basic",
    "pattern": "For instance, ...",
    "structure": "For instance, + Clause",
    "level": "B1",
    "meaning_vi": "Ví dụ như,...",
    "usage_vi": "Cách nói đồng nghĩa với 'For example', dùng để cung cấp minh họa cụ thể cho một luận điểm.",
    "example_en": "We can reduce costs in several ways. For instance, we can switch suppliers.",
    "example_vi": "Chúng ta có thể giảm chi phí bằng nhiều cách. Ví dụ như, chúng ta có thể đổi nhà cung cấp.",
    "tags": [
      "examples",
      "illustration",
      "clarification"
    ]
  },
  {
    "id": 80,
    "category": "Connectors",
    "topic": "Emphasizing",
    "subcategory": "Professional",
    "pattern": "Specifically, ...",
    "structure": "Specifically, + Clause",
    "level": "B2",
    "meaning_vi": "Cụ thể là,...",
    "usage_vi": "Dùng để chuyển từ một ý chung chung sang một chi tiết nhỏ xác định nhằm nhấn mạnh.",
    "example_en": "We need to improve our customer service. Specifically, response times must be shorter.",
    "example_vi": "Chúng ta cần cải thiện dịch vụ khách hàng. Cụ thể là, thời gian phản hồi phải ngắn hơn.",
    "tags": [
      "emphasis",
      "precision",
      "details"
    ]
  },
  {
    "id": 81,
    "category": "Core Grammar",
    "topic": "Present Perfect",
    "subcategory": "Experience",
    "pattern": "Have you ever + V3/ed?",
    "structure": "Have you ever + Past Participle?",
    "level": "A2",
    "meaning_vi": "Bạn đã từng... chưa?",
    "usage_vi": "Câu hỏi phổ biến để hỏi về trải nghiệm sống hoặc kinh nghiệm làm việc từ trước đến nay.",
    "example_en": "Have you ever managed a remote team before?",
    "example_vi": "Bạn đã từng quản lý một nhóm làm việc từ xa trước đây chưa?",
    "tags": [
      "experience",
      "interview",
      "questions"
    ]
  },
  {
    "id": 82,
    "category": "Core Grammar",
    "topic": "Past Continuous",
    "subcategory": "Interruption",
    "pattern": "S + was/were V-ing when S + V2/ed",
    "structure": "Subject + was/were + Verb-ing when Subject + Past Simple",
    "level": "B1",
    "meaning_vi": "Đang làm gì đó thì một việc khác xen vào.",
    "usage_vi": "Mô tả một bối cảnh đang diễn ra trong quá khứ bị ngắt quãng bởi một sự kiện khác.",
    "example_en": "We were discussing the budget when the fire alarm rang.",
    "example_vi": "Chúng tôi đang thảo luận về ngân sách thì chuông báo cháy reo.",
    "tags": [
      "storytelling",
      "interruption",
      "past_events"
    ]
  },
  {
    "id": 83,
    "category": "Sentence Frames",
    "topic": "Transitioning",
    "subcategory": "Neutral",
    "pattern": "Moving on to...",
    "structure": "Moving on to + Noun phrase",
    "level": "A2",
    "meaning_vi": "Chuyển sang phần...",
    "usage_vi": "Dùng như một cầu nối trơn tru để chuyển từ chủ đề này sang chủ đề khác trong lúc nói.",
    "example_en": "That covers the timeline. Moving on to the budget, ...",
    "example_vi": "Phần đó đã bao quát được tiến độ. Chuyển sang phần ngân sách, ...",
    "tags": [
      "transition",
      "agenda",
      "flow"
    ]
  },
  {
    "id": 84,
    "category": "Sentence Frames",
    "topic": "Checking Consensus",
    "subcategory": "Discussion",
    "pattern": "Are we all in agreement?",
    "structure": "Are we all in agreement (on this)?",
    "level": "B1",
    "meaning_vi": "Tất cả chúng ta đều đồng ý chứ?",
    "usage_vi": "Hỏi xem mọi người trong nhóm có thống nhất trước khi chốt lại quyết định.",
    "example_en": "So, we will launch on the 15th. Are we all in agreement?",
    "example_vi": "Vậy chúng ta sẽ ra mắt vào ngày 15. Tất cả chúng ta đều đồng ý chứ?",
    "tags": [
      "consensus",
      "decision_making",
      "meetings"
    ]
  },
  {
    "id": 85,
    "category": "Opinions & Discussion",
    "topic": "Generalizing",
    "subcategory": "Neutral",
    "pattern": "Generally speaking, ...",
    "structure": "Generally speaking, + Clause",
    "level": "B1",
    "meaning_vi": "Nói chung thì,...",
    "usage_vi": "Đưa ra một quan điểm mang tính tổng quát, áp dụng cho đa số trường hợp.",
    "example_en": "Generally speaking, clients prefer a simple interface.",
    "example_vi": "Nói chung thì, khách hàng thích một giao diện đơn giản.",
    "tags": [
      "generalization",
      "trends",
      "overview"
    ]
  },
  {
    "id": 86,
    "category": "Agreement & Disagreement",
    "topic": "Conceding",
    "subcategory": "Polite",
    "pattern": "You make a valid point.",
    "structure": "You make a valid point.",
    "level": "B2",
    "meaning_vi": "Bạn đưa ra một quan điểm hợp lý.",
    "usage_vi": "Ghi nhận ý kiến của người khác là đúng đắn, thường dùng trước khi phản biện hoặc thay đổi suy nghĩ.",
    "example_en": "You make a valid point about the security risks involved.",
    "example_vi": "Bạn đưa ra một quan điểm hợp lý về những rủi ro bảo mật liên quan.",
    "tags": [
      "concession",
      "respect",
      "debate"
    ]
  },
  {
    "id": 87,
    "category": "Suggestions & Advice",
    "topic": "Making Suggestions",
    "subcategory": "Soft",
    "pattern": "We could always...",
    "structure": "We could always + Base Verb",
    "level": "B1",
    "meaning_vi": "Chúng ta luôn có thể... (như một phương án dự phòng).",
    "usage_vi": "Đưa ra một gợi ý giải pháp linh hoạt, không gò bó, như một lựa chọn thay thế an toàn.",
    "example_en": "If this doesn't work, we could always revert to the old system.",
    "example_vi": "Nếu cách này không hiệu quả, chúng ta luôn có thể quay lại hệ thống cũ.",
    "tags": [
      "alternatives",
      "options",
      "soft_suggestion"
    ]
  },
  {
    "id": 88,
    "category": "Cause & Effect",
    "topic": "Explaining Causes",
    "subcategory": "Professional",
    "pattern": "The primary driver behind...",
    "structure": "The primary driver behind + Noun phrase + is...",
    "level": "B2",
    "meaning_vi": "Động lực/nguyên nhân chính đằng sau... là...",
    "usage_vi": "Sử dụng nhiều trong phân tích kinh doanh để chỉ ra nguyên nhân chủ chốt tạo nên một xu hướng hay kết quả.",
    "example_en": "The primary driver behind this growth is our new marketing strategy.",
    "example_vi": "Động lực chính đằng sau sự tăng trưởng này là chiến lược tiếp thị mới của chúng ta.",
    "tags": [
      "analysis",
      "business_trends",
      "root_cause"
    ]
  },
  {
    "id": 89,
    "category": "Problem Solving",
    "topic": "Evaluating Solutions",
    "subcategory": "Discussion",
    "pattern": "Let's weigh the pros and cons.",
    "structure": "Let's weigh the pros and cons (of + Noun/Verb-ing).",
    "level": "B2",
    "meaning_vi": "Hãy cùng cân nhắc những điểm lợi và hại.",
    "usage_vi": "Kêu gọi việc đánh giá ưu và nhược điểm của một quyết định trước khi thực hiện.",
    "example_en": "Before signing the contract, let's weigh the pros and cons.",
    "example_vi": "Trước khi ký hợp đồng, hãy cùng cân nhắc những điểm lợi và hại.",
    "tags": [
      "evaluation",
      "decision_making",
      "analysis"
    ]
  },
  {
    "id": 90,
    "category": "Meetings & Work Communication",
    "topic": "Discussing Issues",
    "subcategory": "Neutral",
    "pattern": "We need to address...",
    "structure": "We need to address + Noun phrase",
    "level": "B1",
    "meaning_vi": "Chúng ta cần giải quyết/đề cập đến...",
    "usage_vi": "Đưa một vấn đề quan trọng ra để thảo luận và tìm cách xử lý.",
    "example_en": "We need to address the customer complaints immediately.",
    "example_vi": "Chúng ta cần giải quyết các khiếu nại của khách hàng ngay lập tức.",
    "tags": [
      "problem_solving",
      "urgency",
      "focus"
    ]
  },
  {
    "id": 91,
    "category": "Meetings & Work Communication",
    "topic": "Clarifying Roles",
    "subcategory": "Workplace",
    "pattern": "Who is responsible for...?",
    "structure": "Who is responsible for + Noun phrase / Verb-ing?",
    "level": "A2",
    "meaning_vi": "Ai là người chịu trách nhiệm cho...?",
    "usage_vi": "Dùng để hỏi hoặc phân định rõ vai trò và trách nhiệm trong một dự án.",
    "example_en": "Who is responsible for updating the client on this issue?",
    "example_vi": "Ai là người chịu trách nhiệm cập nhật tình hình vấn đề này cho khách hàng?",
    "tags": [
      "accountability",
      "roles",
      "management"
    ]
  },
  {
    "id": 92,
    "category": "Connectors",
    "topic": "Contrasting Ideas",
    "subcategory": "Formal",
    "pattern": "Nevertheless, ...",
    "structure": "Nevertheless, + Clause",
    "level": "B2",
    "meaning_vi": "Tuy nhiên / Mặc dù vậy,...",
    "usage_vi": "Từ nối trang trọng mang nghĩa tương tự 'However', dùng để đưa ra một kết quả hoặc ý tưởng trái ngược với điều vừa nói.",
    "example_en": "The project was difficult. Nevertheless, we finished it on time.",
    "example_vi": "Dự án rất khó khăn. Mặc dù vậy, chúng tôi đã hoàn thành nó đúng hạn.",
    "tags": [
      "contrast",
      "formal_writing",
      "persistence"
    ]
  },
  {
    "id": 93,
    "category": "Sentence Frames",
    "topic": "Expressing Urgency",
    "subcategory": "Workplace",
    "pattern": "This is a time-sensitive matter.",
    "structure": "This is a time-sensitive matter.",
    "level": "B2",
    "meaning_vi": "Đây là một vấn đề khẩn cấp về thời gian.",
    "usage_vi": "Nhấn mạnh rằng công việc cần được xử lý nhanh chóng và ưu tiên do giới hạn thời gian.",
    "example_en": "Please review the document today; this is a time-sensitive matter.",
    "example_vi": "Vui lòng xem xét tài liệu này trong hôm nay; đây là một vấn đề khẩn cấp về thời gian.",
    "tags": [
      "urgency",
      "priorities",
      "deadlines"
    ]
  },
  {
    "id": 94,
    "category": "Core Grammar",
    "topic": "Passive Voice",
    "subcategory": "Reporting",
    "pattern": "It is believed/expected that...",
    "structure": "It + is + Past Participle (believed, expected, reported) + that + Clause",
    "level": "B2",
    "meaning_vi": "Người ta tin rằng / Người ta kỳ vọng rằng...",
    "usage_vi": "Cấu trúc bị động khách quan, thường dùng trong tin tức hoặc báo cáo chính thức để tránh nêu đích danh người nói.",
    "example_en": "It is expected that profits will rise next year.",
    "example_vi": "Người ta kỳ vọng rằng lợi nhuận sẽ tăng vào năm tới.",
    "tags": [
      "impersonal_passive",
      "formal_reports",
      "expectations"
    ]
  },
  {
    "id": 95,
    "category": "Opinions & Discussion",
    "topic": "Hedging",
    "subcategory": "Professional",
    "pattern": "It is highly likely that...",
    "structure": "It is highly likely that + Clause",
    "level": "B2",
    "meaning_vi": "Rất có khả năng là...",
    "usage_vi": "Cách dự đoán hoặc đưa ra nhận định mang tính chắc chắn cao nhưng vẫn chừa lại đường lùi.",
    "example_en": "It is highly likely that the merger will be approved.",
    "example_vi": "Rất có khả năng vụ sáp nhập sẽ được thông qua.",
    "tags": [
      "probability",
      "prediction",
      "hedging"
    ]
  },
  {
    "id": 96,
    "category": "Sentence Frames",
    "topic": "Asking for Updates",
    "subcategory": "Workplace",
    "pattern": "Could you give me an update on...?",
    "structure": "Could you give me an update on + Noun phrase?",
    "level": "B1",
    "meaning_vi": "Bạn có thể cập nhật cho tôi về... không?",
    "usage_vi": "Cách lịch sự và chuyên nghiệp để hỏi xem tiến độ của một công việc đang đến đâu.",
    "example_en": "Could you give me an update on the hiring process?",
    "example_vi": "Bạn có thể cập nhật cho tôi về quá trình tuyển dụng không?",
    "tags": [
      "status_check",
      "progress",
      "management"
    ]
  },
  {
    "id": 97,
    "category": "Sentence Frames",
    "topic": "Declining politely",
    "subcategory": "Professional",
    "pattern": "Unfortunately, I won't be able to...",
    "structure": "Unfortunately, I won't be able to + Base Verb",
    "level": "B1",
    "meaning_vi": "Thật không may, tôi sẽ không thể...",
    "usage_vi": "Cách rất lịch sự và nhã nhặn để từ chối một lời mời, đề nghị hoặc công việc.",
    "example_en": "Unfortunately, I won't be able to attend the meeting tomorrow.",
    "example_vi": "Thật không may, tôi sẽ không thể tham dự cuộc họp vào ngày mai.",
    "tags": [
      "declining",
      "polite_refusal",
      "scheduling"
    ]
  },
  {
    "id": 98,
    "category": "Core Grammar",
    "topic": "Future Continuous",
    "subcategory": "Plans",
    "pattern": "S + will be V-ing",
    "structure": "Subject + will be + Verb-ing",
    "level": "B1",
    "meaning_vi": "Sẽ đang làm gì đó.",
    "usage_vi": "Dùng để nói về một hành động sẽ đang diễn ra tại một thời điểm cụ thể trong tương lai, hoặc dự định chắc chắn.",
    "example_en": "I will be flying to Tokyo at this time tomorrow.",
    "example_vi": "Tôi sẽ đang bay đến Tokyo vào giờ này ngày mai.",
    "tags": [
      "future_plans",
      "schedules",
      "ongoing"
    ]
  },
  {
    "id": 99,
    "category": "Connectors",
    "topic": "Summarizing",
    "subcategory": "Formal",
    "pattern": "In conclusion, ...",
    "structure": "In conclusion, + Clause",
    "level": "B1",
    "meaning_vi": "Tóm lại / Kết luận lại,...",
    "usage_vi": "Dùng ở phần cuối của một bài nói, email hoặc tài liệu để chốt lại những điểm chính.",
    "example_en": "In conclusion, this software is the best fit for our needs.",
    "example_vi": "Tóm lại, phần mềm này là sự lựa chọn phù hợp nhất cho nhu cầu của chúng ta.",
    "tags": [
      "conclusion",
      "summary",
      "formal_writing"
    ]
  },
  {
    "id": 100,
    "category": "Requests & Offers",
    "topic": "Asking for a Favor",
    "subcategory": "Casual",
    "pattern": "Can you do me a favor?",
    "structure": "Can you do me a favor (and + Base Verb)?",
    "level": "A2",
    "meaning_vi": "Bạn có thể giúp tôi một việc được không?",
    "usage_vi": "Cách mở lời tự nhiên trước khi nhờ vả bạn bè hoặc đồng nghiệp thân thiết.",
    "example_en": "Can you do me a favor and print these documents?",
    "example_vi": "Bạn có thể giúp tôi một việc và in những tài liệu này ra được không?",
    "tags": [
      "favors",
      "help",
      "casual_request"
    ]
  },
  {
    "id": 101,
    "category": "Core Grammar",
    "topic": "Past Perfect",
    "subcategory": "Basic",
    "pattern": "S + had + V3/ed",
    "structure": "Subject + had + Past Participle",
    "level": "B1",
    "meaning_vi": "Đã làm gì đó trước một thời điểm/hành động khác trong quá khứ.",
    "usage_vi": "Dùng để nhấn mạnh thứ tự trước sau của hai sự kiện trong quá khứ.",
    "example_en": "By the time I arrived, the meeting had already started.",
    "example_vi": "Vào lúc tôi đến, cuộc họp đã bắt đầu rồi.",
    "tags": [
      "past_events",
      "sequencing",
      "narrative"
    ]
  },
  {
    "id": 102,
    "category": "Core Grammar",
    "topic": "Future Perfect",
    "subcategory": "Professional",
    "pattern": "S + will have + V3/ed",
    "structure": "Subject + will have + Past Participle",
    "level": "B2",
    "meaning_vi": "Sẽ đã hoàn thành việc gì đó trước một thời điểm trong tương lai.",
    "usage_vi": "Rất hữu ích khi nói về thời hạn (deadlines) và cam kết tiến độ.",
    "example_en": "We will have finished the report by next Monday.",
    "example_vi": "Chúng tôi sẽ hoàn thành báo cáo trước thứ Hai tới.",
    "tags": [
      "deadlines",
      "future_goals",
      "commitments"
    ]
  },
  {
    "id": 103,
    "category": "Core Grammar",
    "topic": "Habits",
    "subcategory": "Past",
    "pattern": "S + used to + V",
    "structure": "Subject + used to + Base Verb",
    "level": "A2",
    "meaning_vi": "Đã từng làm gì đó (bây giờ không còn nữa).",
    "usage_vi": "Dùng để nói về thói quen hoặc tình trạng trong quá khứ đã thay đổi.",
    "example_en": "We used to outsource our marketing, but now we do it in-house.",
    "example_vi": "Chúng tôi đã từng thuê ngoài việc tiếp thị, nhưng bây giờ chúng tôi tự làm nội bộ.",
    "tags": [
      "past_habit",
      "changes",
      "company_history"
    ]
  },
  {
    "id": 104,
    "category": "Core Grammar",
    "topic": "Habits",
    "subcategory": "Present",
    "pattern": "S + be used to + V-ing/Noun",
    "structure": "Subject + to be + used to + Verb-ing / Noun",
    "level": "B1",
    "meaning_vi": "Quen với việc gì đó.",
    "usage_vi": "Diễn tả sự quen thuộc với một môi trường hoặc thói quen hiện tại.",
    "example_en": "Our team is used to working under pressure.",
    "example_vi": "Nhóm của chúng tôi đã quen với việc làm việc dưới áp lực.",
    "tags": [
      "familiarity",
      "adaptation",
      "work_environment"
    ]
  },
  {
    "id": 105,
    "category": "Core Grammar",
    "topic": "Tag Questions",
    "subcategory": "Basic",
    "pattern": "Clause, auxiliary + pronoun?",
    "structure": "Statement, + matching auxiliary verb + pronoun?",
    "level": "A2",
    "meaning_vi": "Phải không?",
    "usage_vi": "Dùng để xác nhận thông tin hoặc tìm kiếm sự đồng tình.",
    "example_en": "You sent the email to the client, didn't you?",
    "example_vi": "Bạn đã gửi email cho khách hàng rồi, phải không?",
    "tags": [
      "confirmation",
      "checking",
      "casual"
    ]
  },
  {
    "id": 106,
    "category": "Core Grammar",
    "topic": "Causative Verbs",
    "subcategory": "Professional",
    "pattern": "S + have/get + O + V3/ed",
    "structure": "Subject + have/get + Object + Past Participle",
    "level": "B2",
    "meaning_vi": "Nhờ/thuê ai đó làm gì cho mình.",
    "usage_vi": "Dùng khi bạn không tự làm việc đó mà giao hoặc thuê người khác thực hiện.",
    "example_en": "We need to get this document translated by tomorrow.",
    "example_vi": "Chúng ta cần nhờ người dịch tài liệu này trước ngày mai.",
    "tags": [
      "delegation",
      "services",
      "management"
    ]
  },
  {
    "id": 107,
    "category": "Opinions & Discussion",
    "topic": "Asking for Opinions",
    "subcategory": "Neutral",
    "pattern": "What are your thoughts on...?",
    "structure": "What are your thoughts on + Noun phrase / Verb-ing?",
    "level": "B1",
    "meaning_vi": "Suy nghĩ của bạn về... là gì?",
    "usage_vi": "Một cách lịch sự và phổ biến để hỏi ý kiến đồng nghiệp hoặc đối tác.",
    "example_en": "What are your thoughts on the new remote work policy?",
    "example_vi": "Suy nghĩ của bạn về chính sách làm việc từ xa mới là gì?",
    "tags": [
      "questions",
      "opinions",
      "feedback"
    ]
  },
  {
    "id": 108,
    "category": "Opinions & Discussion",
    "topic": "Asking for Opinions",
    "subcategory": "Basic",
    "pattern": "How do you feel about...?",
    "structure": "How do you feel about + Noun phrase / Verb-ing?",
    "level": "A2",
    "meaning_vi": "Bạn cảm thấy thế nào về...?",
    "usage_vi": "Cách hỏi ý kiến thân thiện, thường thiên về cảm nhận cá nhân.",
    "example_en": "How do you feel about changing the design slightly?",
    "example_vi": "Bạn cảm thấy thế nào về việc thay đổi thiết kế một chút?",
    "tags": [
      "feelings",
      "casual_opinion",
      "discussion"
    ]
  },
  {
    "id": 109,
    "category": "Meetings & Work Communication",
    "topic": "Giving Feedback",
    "subcategory": "Constructive",
    "pattern": "One area for improvement is...",
    "structure": "One area for improvement is + Noun phrase",
    "level": "B2",
    "meaning_vi": "Một điểm cần cải thiện là...",
    "usage_vi": "Cách nói khéo léo, mang tính xây dựng khi nhận xét về điểm yếu của dự án hoặc nhân viên.",
    "example_en": "The presentation was good, but one area for improvement is the pacing.",
    "example_vi": "Bài thuyết trình rất tốt, nhưng một điểm cần cải thiện là nhịp độ.",
    "tags": [
      "feedback",
      "performance_review",
      "constructive"
    ]
  },
  {
    "id": 110,
    "category": "Meetings & Work Communication",
    "topic": "Apologizing",
    "subcategory": "Formal",
    "pattern": "I sincerely apologize for...",
    "structure": "I sincerely apologize for + Noun phrase / Verb-ing",
    "level": "B2",
    "meaning_vi": "Tôi chân thành xin lỗi vì...",
    "usage_vi": "Lời xin lỗi trang trọng, thường dùng trong email với khách hàng hoặc đối tác khi có sai sót lớn.",
    "example_en": "I sincerely apologize for the inconvenience this has caused.",
    "example_vi": "Tôi chân thành xin lỗi vì sự bất tiện mà việc này đã gây ra.",
    "tags": [
      "apology",
      "formal",
      "customer_service"
    ]
  },
  {
    "id": 111,
    "category": "Meetings & Work Communication",
    "topic": "Apologizing",
    "subcategory": "Basic",
    "pattern": "I'm sorry, but...",
    "structure": "I am sorry, but + Clause",
    "level": "A2",
    "meaning_vi": "Tôi xin lỗi, nhưng...",
    "usage_vi": "Dùng để xin lỗi nhẹ nhàng trước khi báo một tin không vui hoặc từ chối.",
    "example_en": "I'm sorry, but I won't be able to make it to the meeting.",
    "example_vi": "Tôi xin lỗi, nhưng tôi sẽ không thể tham dự cuộc họp.",
    "tags": [
      "apology",
      "declining",
      "bad_news"
    ]
  },
  {
    "id": 112,
    "category": "Meetings & Work Communication",
    "topic": "Making Arrangements",
    "subcategory": "Neutral",
    "pattern": "Are you available on...?",
    "structure": "Are you available on + Day/Date?",
    "level": "A2",
    "meaning_vi": "Bạn có rảnh vào... không?",
    "usage_vi": "Dùng để hỏi về lịch trình của ai đó khi muốn thiết lập cuộc họp hoặc cuộc gọi.",
    "example_en": "Are you available on Tuesday afternoon for a quick chat?",
    "example_vi": "Bạn có rảnh vào chiều thứ Ba để trò chuyện nhanh không?",
    "tags": [
      "scheduling",
      "availability",
      "meetings"
    ]
  },
  {
    "id": 113,
    "category": "Meetings & Work Communication",
    "topic": "Making Arrangements",
    "subcategory": "Professional",
    "pattern": "Let's schedule a meeting for...",
    "structure": "Let's schedule a meeting for + Time/Date",
    "level": "B1",
    "meaning_vi": "Hãy lên lịch một cuộc họp vào...",
    "usage_vi": "Chủ động đề xuất thời gian cụ thể cho một cuộc họp.",
    "example_en": "Let's schedule a meeting for next Wednesday to discuss this further.",
    "example_vi": "Hãy lên lịch một cuộc họp vào thứ Tư tới để thảo luận thêm về việc này.",
    "tags": [
      "scheduling",
      "planning",
      "action"
    ]
  },
  {
    "id": 114,
    "category": "Opinions & Discussion",
    "topic": "Expressing Preferences",
    "subcategory": "Basic",
    "pattern": "I would prefer to...",
    "structure": "I would prefer to + Base Verb",
    "level": "B1",
    "meaning_vi": "Tôi muốn/thích làm... hơn.",
    "usage_vi": "Dùng để bày tỏ sự lựa chọn ưu tiên của bản thân một cách lịch sự.",
    "example_en": "I would prefer to communicate via email rather than phone.",
    "example_vi": "Tôi muốn trao đổi qua email hơn là gọi điện thoại.",
    "tags": [
      "preferences",
      "choices",
      "polite"
    ]
  },
  {
    "id": 115,
    "category": "Opinions & Discussion",
    "topic": "Expressing Preferences",
    "subcategory": "Basic",
    "pattern": "I'd rather...",
    "structure": "I would rather + Base Verb",
    "level": "B1",
    "meaning_vi": "Tôi thà/thích... hơn.",
    "usage_vi": "Cách nói tự nhiên tương đương 'would prefer' nhưng không có 'to'.",
    "example_en": "I'd rather wait for the final results before making a decision.",
    "example_vi": "Tôi thà chờ kết quả cuối cùng trước khi đưa ra quyết định.",
    "tags": [
      "preferences",
      "alternatives",
      "decision_making"
    ]
  },
  {
    "id": 116,
    "category": "Problem Solving",
    "topic": "Dealing with Complaints",
    "subcategory": "Empathetic",
    "pattern": "I understand why you are upset.",
    "structure": "I understand why you are upset.",
    "level": "B1",
    "meaning_vi": "Tôi hiểu tại sao bạn lại bực mình.",
    "usage_vi": "Sử dụng sự thấu cảm để làm dịu tình hình khi khách hàng hoặc đồng nghiệp phàn nàn.",
    "example_en": "I understand why you are upset about the delay. We are fixing it.",
    "example_vi": "Tôi hiểu tại sao bạn lại bực mình về sự chậm trễ. Chúng tôi đang khắc phục nó.",
    "tags": [
      "empathy",
      "complaints",
      "customer_service"
    ]
  },
  {
    "id": 117,
    "category": "Problem Solving",
    "topic": "Dealing with Complaints",
    "subcategory": "Action-oriented",
    "pattern": "Let me look into this for you.",
    "structure": "Let me look into this for you.",
    "level": "B1",
    "meaning_vi": "Để tôi xem xét/điều tra việc này cho bạn.",
    "usage_vi": "Hứa hẹn sẽ hành động để giải quyết vấn đề mà người khác đang gặp phải.",
    "example_en": "I'm not sure why the error occurred, but let me look into this for you.",
    "example_vi": "Tôi không chắc tại sao lỗi lại xảy ra, nhưng để tôi xem xét việc này cho bạn.",
    "tags": [
      "investigation",
      "support",
      "commitment"
    ]
  },
  {
    "id": 118,
    "category": "Sentence Frames",
    "topic": "Softening Statements",
    "subcategory": "Polite",
    "pattern": "It might be a bit...",
    "structure": "It might be a bit + Adjective",
    "level": "B2",
    "meaning_vi": "Nó có thể hơi...",
    "usage_vi": "Làm giảm mức độ tiêu cực của một lời nhận xét để tránh gây mất lòng.",
    "example_en": "It might be a bit too expensive for our current budget.",
    "example_vi": "Nó có thể hơi quá đắt so với ngân sách hiện tại của chúng ta.",
    "tags": [
      "hedging",
      "diplomacy",
      "softening"
    ]
  },
  {
    "id": 119,
    "category": "Sentence Frames",
    "topic": "Making Requests",
    "subcategory": "Indirect",
    "pattern": "I was wondering if you could...",
    "structure": "I was wondering if you could + Base Verb",
    "level": "B2",
    "meaning_vi": "Tôi tự hỏi liệu bạn có thể... không?",
    "usage_vi": "Một cách nhờ vả vô cùng lịch sự và gián tiếp, mang lại cảm giác nhẹ nhàng, không áp đặt.",
    "example_en": "I was wondering if you could send me the file again.",
    "example_vi": "Tôi tự hỏi liệu bạn có thể gửi lại tập tin cho tôi được không.",
    "tags": [
      "indirect_request",
      "polite",
      "favor"
    ]
  },
  {
    "id": 120,
    "category": "Sentence Frames",
    "topic": "Clarifying",
    "subcategory": "Basic",
    "pattern": "Just to be clear, ...",
    "structure": "Just to be clear, + Clause",
    "level": "B1",
    "meaning_vi": "Chỉ để làm rõ một chút,...",
    "usage_vi": "Dùng trước khi xác nhận lại một thông tin quan trọng để tránh hiểu lầm.",
    "example_en": "Just to be clear, the deadline is Friday, not Thursday, right?",
    "example_vi": "Chỉ để làm rõ, hạn chót là thứ Sáu, không phải thứ Năm, đúng không?",
    "tags": [
      "clarification",
      "confirmation",
      "accuracy"
    ]
  },
  {
    "id": 121,
    "category": "Sentence Frames",
    "topic": "Clarifying",
    "subcategory": "Professional",
    "pattern": "Let me rephrase that.",
    "structure": "Let me rephrase that.",
    "level": "B2",
    "meaning_vi": "Để tôi diễn đạt lại điều đó.",
    "usage_vi": "Dùng khi bạn nhận ra người nghe chưa hiểu ý mình và muốn nói lại bằng cách khác dễ hiểu hơn.",
    "example_en": "Let me rephrase that. What we need is a more stable system.",
    "example_vi": "Để tôi diễn đạt lại điều đó. Những gì chúng ta cần là một hệ thống ổn định hơn.",
    "tags": [
      "rephrasing",
      "communication",
      "correction"
    ]
  },
  {
    "id": 122,
    "category": "Agreement & Disagreement",
    "topic": "Agreeing",
    "subcategory": "Idiomatic",
    "pattern": "You hit the nail on the head.",
    "structure": "You hit the nail on the head.",
    "level": "B2",
    "meaning_vi": "Bạn nói đúng phóc / trúng phóc.",
    "usage_vi": "Thành ngữ thể hiện sự đồng ý hoàn toàn khi ai đó chỉ ra chính xác nguyên nhân của vấn đề.",
    "example_en": "When you said our marketing is outdated, you hit the nail on the head.",
    "example_vi": "Khi bạn nói rằng hoạt động tiếp thị của chúng ta đã lỗi thời, bạn nói đúng phóc.",
    "tags": [
      "idiom",
      "strong_agreement",
      "praise"
    ]
  },
  {
    "id": 123,
    "category": "Agreement & Disagreement",
    "topic": "Disagreeing",
    "subcategory": "Formal",
    "pattern": "With all due respect, ...",
    "structure": "With all due respect, + Clause",
    "level": "B2",
    "meaning_vi": "Với tất cả sự tôn trọng,...",
    "usage_vi": "Cụm từ rào trước để thể hiện sự lịch sự tối đa trước khi đưa ra ý kiến phản bác gay gắt với cấp trên hoặc đối tác.",
    "example_en": "With all due respect, I think that strategy will backfire.",
    "example_vi": "Với tất cả sự tôn trọng, tôi nghĩ chiến lược đó sẽ phản tác dụng.",
    "tags": [
      "polite_disagreement",
      "formal",
      "conflict"
    ]
  },
  {
    "id": 124,
    "category": "Cause & Effect",
    "topic": "Explaining Causes",
    "subcategory": "Formal",
    "pattern": "Due to the fact that...",
    "structure": "Due to the fact that + Clause",
    "level": "B2",
    "meaning_vi": "Bởi vì thực tế là...",
    "usage_vi": "Một cách nói trang trọng hơn của 'because', thường dùng trong văn bản hoặc báo cáo chính thức.",
    "example_en": "The event was canceled due to the fact that ticket sales were low.",
    "example_vi": "Sự kiện đã bị hủy bởi vì thực tế là doanh số bán vé quá thấp.",
    "tags": [
      "cause",
      "formal_writing",
      "reason"
    ]
  },
  {
    "id": 125,
    "category": "Cause & Effect",
    "topic": "Explaining Results",
    "subcategory": "Professional",
    "pattern": "This will lead to...",
    "structure": "This will lead to + Noun phrase",
    "level": "B1",
    "meaning_vi": "Điều này sẽ dẫn đến...",
    "usage_vi": "Dự báo hậu quả hoặc kết quả của một hành động hay chính sách.",
    "example_en": "Ignoring this warning will lead to system failure.",
    "example_vi": "Việc bỏ qua cảnh báo này sẽ dẫn đến lỗi hệ thống.",
    "tags": [
      "prediction",
      "consequence",
      "effect"
    ]
  },
  {
    "id": 126,
    "category": "Problem Solving",
    "topic": "Proposing Solutions",
    "subcategory": "Basic",
    "pattern": "We need to figure out...",
    "structure": "We need to figure out + Wh- word + Clause / Noun phrase",
    "level": "B1",
    "meaning_vi": "Chúng ta cần tìm ra (cách giải quyết/nguyên nhân)...",
    "usage_vi": "Khuyến khích nhóm cùng suy nghĩ và giải quyết một vấn đề chưa rõ ràng.",
    "example_en": "We need to figure out how to increase user engagement.",
    "example_vi": "Chúng ta cần tìm ra cách để tăng tương tác của người dùng.",
    "tags": [
      "problem_solving",
      "collaboration",
      "investigation"
    ]
  },
  {
    "id": 127,
    "category": "Problem Solving",
    "topic": "Proposing Solutions",
    "subcategory": "Technical/Workplace",
    "pattern": "A workaround would be to...",
    "structure": "A workaround would be to + Base Verb",
    "level": "B2",
    "meaning_vi": "Một giải pháp tạm thời sẽ là...",
    "usage_vi": "Đề xuất một cách khắc phục tạm thời khi chưa có giải pháp triệt để (thường dùng trong IT, dự án).",
    "example_en": "The server is down. A workaround would be to use the backup drive.",
    "example_vi": "Máy chủ đang bị lỗi. Một giải pháp tạm thời là sử dụng ổ đĩa dự phòng.",
    "tags": [
      "workaround",
      "technical",
      "quick_fix"
    ]
  },
  {
    "id": 128,
    "category": "Connectors",
    "topic": "Contrasting Ideas",
    "subcategory": "Formal",
    "pattern": "On the contrary, ...",
    "structure": "On the contrary, + Clause",
    "level": "B2",
    "meaning_vi": "Trái lại,...",
    "usage_vi": "Dùng để bác bỏ thẳng thừng một ý kiến trước đó và đưa ra ý kiến ngược lại hoàn toàn.",
    "example_en": "It wasn't a failure. On the contrary, we learned a lot from it.",
    "example_vi": "Đó không phải là một thất bại. Trái lại, chúng ta đã học được rất nhiều từ nó.",
    "tags": [
      "contrast",
      "rebuttal",
      "emphasis"
    ]
  },
  {
    "id": 129,
    "category": "Connectors",
    "topic": "Adding Information",
    "subcategory": "Formal",
    "pattern": "Furthermore, ...",
    "structure": "Furthermore, + Clause",
    "level": "B2",
    "meaning_vi": "Hơn nữa,...",
    "usage_vi": "Từ nối trang trọng để bổ sung thêm một luận điểm hỗ trợ mạnh mẽ cho ý trước đó.",
    "example_en": "The product is highly efficient. Furthermore, it is eco-friendly.",
    "example_vi": "Sản phẩm này mang lại hiệu quả cao. Hơn nữa, nó còn thân thiện với môi trường.",
    "tags": [
      "addition",
      "formal_writing",
      "persuasion"
    ]
  },
  {
    "id": 130,
    "category": "Connectors",
    "topic": "Sequencing",
    "subcategory": "Neutral",
    "pattern": "Meanwhile, ...",
    "structure": "Meanwhile, + Clause",
    "level": "B1",
    "meaning_vi": "Trong khi đó,...",
    "usage_vi": "Dùng để chỉ một hành động hoặc sự việc diễn ra song song cùng lúc với một sự việc khác.",
    "example_en": "The dev team is fixing bugs. Meanwhile, marketing is preparing the launch.",
    "example_vi": "Nhóm phát triển đang sửa lỗi. Trong khi đó, nhóm tiếp thị đang chuẩn bị cho đợt ra mắt.",
    "tags": [
      "simultaneous",
      "time",
      "parallel"
    ]
  },
  {
    "id": 131,
    "category": "Connectors",
    "topic": "Clarifying",
    "subcategory": "Neutral",
    "pattern": "To put it simply, ...",
    "structure": "To put it simply, + Clause",
    "level": "B1",
    "meaning_vi": "Nói một cách đơn giản thì,...",
    "usage_vi": "Dùng để giải thích một vấn đề phức tạp bằng ngôn từ dễ hiểu hơn.",
    "example_en": "To put it simply, we are spending more than we earn.",
    "example_vi": "Nói một cách đơn giản thì, chúng ta đang chi tiêu nhiều hơn số tiền kiếm được.",
    "tags": [
      "simplification",
      "clarity",
      "summary"
    ]
  },
  {
    "id": 132,
    "category": "Connectors",
    "topic": "Clarifying",
    "subcategory": "Neutral",
    "pattern": "In other words, ...",
    "structure": "In other words, + Clause",
    "level": "B1",
    "meaning_vi": "Nói cách khác,...",
    "usage_vi": "Diễn đạt lại điều vừa nói bằng những từ ngữ khác để làm rõ nghĩa hơn.",
    "example_en": "We lack funding. In other words, the project is paused.",
    "example_vi": "Chúng ta đang thiếu vốn. Nói cách khác, dự án bị tạm dừng.",
    "tags": [
      "rephrasing",
      "conclusion",
      "clarification"
    ]
  },
  {
    "id": 133,
    "category": "Meetings & Work Communication",
    "topic": "Managing the Meeting",
    "subcategory": "Professional",
    "pattern": "Let's stick to the agenda.",
    "structure": "Let's stick to the agenda.",
    "level": "B1",
    "meaning_vi": "Hãy bám sát vào chương trình nghị sự.",
    "usage_vi": "Nhắc nhở mọi người quay lại chủ đề chính khi cuộc họp bắt đầu đi lan man.",
    "example_en": "We are getting off track. Let's stick to the agenda, please.",
    "example_vi": "Chúng ta đang lạc đề rồi. Vui lòng hãy bám sát vào chương trình nghị sự.",
    "tags": [
      "focus",
      "time_management",
      "meetings"
    ]
  },
  {
    "id": 134,
    "category": "Meetings & Work Communication",
    "topic": "Time Management",
    "subcategory": "Workplace",
    "pattern": "We are running out of time.",
    "structure": "We are running out of time.",
    "level": "A2",
    "meaning_vi": "Chúng ta đang sắp hết thời gian rồi.",
    "usage_vi": "Thúc giục mọi người ra quyết định hoặc chuyển qua ý cuối cùng khi thời gian không còn nhiều.",
    "example_en": "We are running out of time, so let's make a quick decision.",
    "example_vi": "Chúng ta sắp hết thời gian rồi, vì vậy hãy đưa ra quyết định nhanh chóng.",
    "tags": [
      "time_pressure",
      "urgency",
      "meetings"
    ]
  },
  {
    "id": 135,
    "category": "Meetings & Work Communication",
    "topic": "Managing the Meeting",
    "subcategory": "Basic",
    "pattern": "Can we take a quick break?",
    "structure": "Can we take a quick break?",
    "level": "A2",
    "meaning_vi": "Chúng ta có thể nghỉ giải lao một lát không?",
    "usage_vi": "Đề nghị tạm nghỉ ngắn trong một cuộc họp hoặc buổi làm việc kéo dài.",
    "example_en": "It's been two hours. Can we take a quick break?",
    "example_vi": "Đã hai tiếng rồi. Chúng ta có thể nghỉ giải lao một lát không?",
    "tags": [
      "breaks",
      "energy",
      "casual_request"
    ]
  },
  {
    "id": 136,
    "category": "Meetings & Work Communication",
    "topic": "Discussing Issues",
    "subcategory": "Professional",
    "pattern": "I'd like to bring up...",
    "structure": "I would like to bring up + Noun phrase",
    "level": "B2",
    "meaning_vi": "Tôi muốn đề cập/đưa ra vấn đề...",
    "usage_vi": "Chủ động giới thiệu một chủ đề mới hoặc một vấn đề cần thảo luận vào cuộc họp.",
    "example_en": "Before we finish, I'd like to bring up the holiday schedule.",
    "example_vi": "Trước khi kết thúc, tôi muốn đề cập đến lịch nghỉ lễ.",
    "tags": [
      "initiation",
      "new_topic",
      "meetings"
    ]
  },
  {
    "id": 137,
    "category": "Suggestions & Advice",
    "topic": "Making Suggestions",
    "subcategory": "Soft",
    "pattern": "It might be worth + V-ing",
    "structure": "It might be worth + Verb-ing",
    "level": "B2",
    "meaning_vi": "Việc... có thể rất đáng để thử.",
    "usage_vi": "Gợi ý một giải pháp mà bạn tin là có giá trị nhưng không muốn gây áp lực cho người nghe.",
    "example_en": "It might be worth contacting the supplier directly.",
    "example_vi": "Việc liên hệ trực tiếp với nhà cung cấp có thể rất đáng thử.",
    "tags": [
      "soft_suggestion",
      "value",
      "options"
    ]
  },
  {
    "id": 138,
    "category": "Suggestions & Advice",
    "topic": "Giving Advice",
    "subcategory": "Strong",
    "pattern": "You had better...",
    "structure": "Subject + had better + Base Verb",
    "level": "B1",
    "meaning_vi": "Tốt hơn hết là bạn nên...",
    "usage_vi": "Đưa ra lời khuyên mạnh mẽ, thường mang hàm ý cảnh báo nếu không làm sẽ có hậu quả.",
    "example_en": "You'd better double-check the contract before signing.",
    "example_vi": "Tốt hơn hết là bạn nên kiểm tra kỹ hợp đồng trước khi ký.",
    "tags": [
      "strong_advice",
      "warning",
      "imperative"
    ]
  },
  {
    "id": 139,
    "category": "Requests & Offers",
    "topic": "Making Requests",
    "subcategory": "Polite",
    "pattern": "Is there any chance you could...?",
    "structure": "Is there any chance you could + Base Verb?",
    "level": "B2",
    "meaning_vi": "Liệu có khả năng nào bạn có thể... không?",
    "usage_vi": "Cách nhờ vả khi bạn biết việc đó có thể gây khó khăn hoặc bất tiện cho đối phương.",
    "example_en": "Is there any chance you could finish this by tomorrow?",
    "example_vi": "Liệu có khả năng nào bạn có thể hoàn thành việc này trước ngày mai không?",
    "tags": [
      "polite_request",
      "unlikely_favor",
      "diplomatic"
    ]
  },
  {
    "id": 140,
    "category": "Requests & Offers",
    "topic": "Offering Help",
    "subcategory": "Casual",
    "pattern": "Can I give you a hand with...?",
    "structure": "Can I give you a hand with + Noun / Verb-ing?",
    "level": "A2",
    "meaning_vi": "Tôi có thể giúp bạn một tay với... không?",
    "usage_vi": "Lời đề nghị giúp đỡ thân thiện, thường dùng với đồng nghiệp trong công việc hàng ngày.",
    "example_en": "Can I give you a hand with those boxes?",
    "example_vi": "Tôi có thể giúp bạn một tay khiêng những chiếc hộp đó không?",
    "tags": [
      "offer",
      "help",
      "teamwork"
    ]
  },
  {
    "id": 141,
    "category": "Opinions & Discussion",
    "topic": "Expressing Opinions",
    "subcategory": "Formal",
    "pattern": "To my mind, ...",
    "structure": "To my mind, + Clause",
    "level": "B2",
    "meaning_vi": "Theo tâm trí/suy nghĩ của tôi,...",
    "usage_vi": "Một cách nói khá trang trọng để đưa ra ý kiến cá nhân vững chắc.",
    "example_en": "To my mind, this is the most logical approach.",
    "example_vi": "Theo suy nghĩ của tôi, đây là cách tiếp cận hợp lý nhất.",
    "tags": [
      "opinion",
      "formal",
      "logic"
    ]
  },
  {
    "id": 142,
    "category": "Opinions & Discussion",
    "topic": "Strong Opinions",
    "subcategory": "Professional",
    "pattern": "There is no doubt that...",
    "structure": "There is no doubt that + Clause",
    "level": "B2",
    "meaning_vi": "Không còn nghi ngờ gì nữa...",
    "usage_vi": "Diễn đạt sự chắc chắn tuyệt đối về một vấn đề hoặc nhận định.",
    "example_en": "There is no doubt that AI will change our industry.",
    "example_vi": "Không còn nghi ngờ gì nữa, trí tuệ nhân tạo sẽ thay đổi ngành công nghiệp của chúng ta.",
    "tags": [
      "certainty",
      "conviction",
      "trends"
    ]
  },
  {
    "id": 143,
    "category": "Meetings & Work Communication",
    "topic": "Closing a Meeting",
    "subcategory": "Casual",
    "pattern": "Let's wrap this up.",
    "structure": "Let's wrap this up.",
    "level": "B1",
    "meaning_vi": "Hãy kết thúc việc này thôi.",
    "usage_vi": "Câu nói phổ biến mang tính thân mật để báo hiệu đã đến lúc dừng cuộc họp hoặc công việc.",
    "example_en": "It's getting late, so let's wrap this up.",
    "example_vi": "Trời cũng muộn rồi, vì vậy hãy kết thúc việc này thôi.",
    "tags": [
      "closing",
      "wrap_up",
      "informal"
    ]
  },
  {
    "id": 144,
    "category": "Core Grammar",
    "topic": "Conditionals",
    "subcategory": "Professional",
    "pattern": "Unless + S + V, S + will + V",
    "structure": "Unless + Present Simple, Subject + will + Base Verb",
    "level": "B1",
    "meaning_vi": "Trừ khi... nếu không thì...",
    "usage_vi": "Tương đương với 'If... not', dùng để nhấn mạnh điều kiện bắt buộc để tránh hậu quả.",
    "example_en": "Unless we get more funding, we will have to stop the project.",
    "example_vi": "Trừ khi chúng ta nhận được nhiều vốn hơn, nếu không chúng ta sẽ phải dừng dự án.",
    "tags": [
      "conditions",
      "warnings",
      "dependencies"
    ]
  },
  {
    "id": 145,
    "category": "Core Grammar",
    "topic": "Infinitive of Purpose",
    "subcategory": "Basic",
    "pattern": "In order to + V",
    "structure": "In order to + Base Verb, + Clause",
    "level": "A2",
    "meaning_vi": "Để (làm gì đó)...",
    "usage_vi": "Dùng để giải thích mục đích hoặc lý do đằng sau một hành động (trang trọng hơn 'to + V').",
    "example_en": "In order to meet the deadline, we must work overtime.",
    "example_vi": "Để kịp hạn chót, chúng ta phải làm thêm giờ.",
    "tags": [
      "purpose",
      "goals",
      "formal"
    ]
  },
  {
    "id": 146,
    "category": "Core Grammar",
    "topic": "So / Such",
    "subcategory": "Basic",
    "pattern": "So + adj/adv + that...",
    "structure": "Subject + Verb + so + Adjective/Adverb + that + Clause",
    "level": "B1",
    "meaning_vi": "Quá... đến nỗi mà...",
    "usage_vi": "Diễn tả nguyên nhân và mức độ gây ra một kết quả cụ thể.",
    "example_en": "The meeting was so long that everyone felt exhausted.",
    "example_vi": "Cuộc họp quá dài đến nỗi mọi người đều cảm thấy kiệt sức.",
    "tags": [
      "cause_effect",
      "extremes",
      "description"
    ]
  },
  {
    "id": 147,
    "category": "Sentence Frames",
    "topic": "Showing Empathy",
    "subcategory": "Workplace",
    "pattern": "That sounds challenging.",
    "structure": "That sounds challenging.",
    "level": "B1",
    "meaning_vi": "Nghe có vẻ thử thách / khó khăn đấy.",
    "usage_vi": "Thể hiện sự lắng nghe và thấu hiểu khi đồng nghiệp chia sẻ về khó khăn trong công việc.",
    "example_en": "You have to manage three projects at once? That sounds challenging.",
    "example_vi": "Bạn phải quản lý ba dự án cùng lúc sao? Nghe có vẻ khó khăn đấy.",
    "tags": [
      "empathy",
      "active_listening",
      "support"
    ]
  },
  {
    "id": 148,
    "category": "Meetings & Work Communication",
    "topic": "Following Up",
    "subcategory": "Professional",
    "pattern": "I'm following up on...",
    "structure": "I am following up on + Noun phrase",
    "level": "B2",
    "meaning_vi": "Tôi đang theo dõi/hỏi thăm về...",
    "usage_vi": "Dùng rất thường xuyên trong email hoặc điện thoại để nhắc nhở hoặc kiểm tra tình trạng công việc đã trao đổi trước đó.",
    "example_en": "I'm following up on the email I sent last week.",
    "example_vi": "Tôi gọi để hỏi thăm về email tôi đã gửi tuần trước.",
    "tags": [
      "follow_up",
      "emailing",
      "reminders"
    ]
  },
  {
    "id": 149,
    "category": "Core Grammar",
    "topic": "Relative Clauses",
    "subcategory": "Reduced",
    "pattern": "Noun + V-ing/V3",
    "structure": "Noun + Verb-ing (active) / Past Participle (passive)",
    "level": "B2",
    "meaning_vi": "Mệnh đề quan hệ rút gọn.",
    "usage_vi": "Làm cho câu văn ngắn gọn, súc tích hơn, đặc biệt phổ biến trong văn viết chuyên nghiệp.",
    "example_en": "The report attached below contains all the details.",
    "example_vi": "Báo cáo được đính kèm bên dưới chứa tất cả các chi tiết.",
    "tags": [
      "conciseness",
      "formal_writing",
      "grammar_advanced"
    ]
  },
  {
    "id": 150,
    "category": "Connectors",
    "topic": "Concluding",
    "subcategory": "Professional",
    "pattern": "All things considered, ...",
    "structure": "All things considered, + Clause",
    "level": "B2",
    "meaning_vi": "Sau khi cân nhắc mọi thứ,...",
    "usage_vi": "Cụm từ đúc kết hoàn hảo trước khi đưa ra quyết định cuối cùng dựa trên nhiều khía cạnh khác nhau.",
    "example_en": "All things considered, this is the best investment we can make.",
    "example_vi": "Sau khi cân nhắc mọi thứ, đây là khoản đầu tư tốt nhất mà chúng ta có thể thực hiện.",
    "tags": [
      "decision_making",
      "conclusion",
      "final_thoughts"
    ]
  }
];

export function getGrammarStructureById(id: number): GrammarStructure | undefined {
  return GRAMMAR_STRUCTURES.find(g => g.id === id);
}

export function getRandomGrammarStructure(level?: string): GrammarStructure {
  const filtered = level ? GRAMMAR_STRUCTURES.filter(g => g.level === level) : GRAMMAR_STRUCTURES;
  if (filtered.length === 0) return GRAMMAR_STRUCTURES[0];
  return filtered[Math.floor(Math.random() * filtered.length)];
}
