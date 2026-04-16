// src/data/essay-data.ts

export const ESSAY_TEMPLATES = [
  {
    type: "Discussion (Thảo luận 2 mặt)",
    usage:
      "Discuss (disadvantages / advantages / positive effects / negative effects)",
    description: "Yêu cầu thảo luận 2 mặt đối lập của một vấn đề (Khen & Chê).",
    structure: [
      {
        section: "Mở bài (Intro)",
        points: [
          "Giới thiệu chủ đề: It is a fact that [Topic lớn] plays an important role in our lives. Nowadays, an increasing number of people are concerned about [Topic bé].",
          "Nêu quan điểm (2 mặt): Some people subscribe to the view that [Viewpoint 1], while others support the argument that [Viewpoint 2].",
          "Nêu mục đích bài viết: This essay will discuss both sides of this issue.",
        ],
      },
      {
        section: "Thân bài 1 (Khen / Lợi ích)",
        points: [
          "Topic Sentence: On the one hand, there are several reasons why [Topic bé] brings people a wide range of benefits.",
          "Ý 1: The first advantage is that... / This is because... / For example,...",
          "Ý 2: The second merit would be that... / This is due to the fact that... / To be more specific,...",
          "Concluding Sentence: Therefore, [Topic bé] has positive effects on people.",
        ],
      },
      {
        section: "Thân bài 2 (Chê / Bất lợi)",
        points: [
          "Topic Sentence: On the other hand, despite the aforementioned benefits, there are several drawbacks of [Topic bé] that should be taken into consideration.",
          "Ý 1: The first disadvantage is that... / This is due to the fact that...",
          "Ý 2: The second demerit would be that... / because / since / as... / For instance,... / This leads to...",
          "Concluding Sentence: Hence, [Topic bé] has detrimental impacts on people.",
        ],
      },
      {
        section: "Kết bài (Conclusion)",
        points: [
          "Tóm tắt: To sum up, [Topic bé] has both pros and cons.",
          "Tạo kết mở / Đưa giải pháp: However, as far as I am concerned, [People / the government] should choose the most effective and suitable way for themselves / balance between A and B / consume a moderate amount of N on V-ing.",
          "Chốt: Only by doing so can we ensure that people will have better, healthier and more prosperous lives.",
        ],
      },
    ],
  },
  {
    type: "Opinion (Đưa ra quan điểm)",
    usage:
      "To what extent do you agree or disagree...? / Discuss your view / What do you think?",
    description:
      "Cần đưa ra quan điểm cá nhân rõ ràng và bảo vệ bằng 2 thân bài cùng hướng (Cùng Khen hoặc Cùng Chê).",
    structure: [
      {
        section: "Mở bài (Intro)",
        points: [
          "Giới thiệu chủ đề: It is a fact that [Topic lớn] plays an important role in our lives. Nowadays, an increasing number of people are concerned about [Topic bé].",
          "Nêu các luồng ý kiến (nếu có): Some people subscribe to the view that [Viewpoint 1], while others support the argument that [Viewpoint 2].",
          "Nêu quan điểm & Mục đích: I am one of those who strongly agree/disagree with this idea / the first idea / the second idea because of the following reasons.",
        ],
      },
      {
        section: "Thân bài 1 (Bảo vệ luận điểm - Ý 1)",
        points: [
          "Topic Sentence: Firstly, it is obvious that...",
          "Supporting Sentences: This is because... / For example,... / Besides / Furthermore / To be more specific,...",
          "Concluding Sentence: Therefore, [Topic bé] is beneficial to / harmful to people.",
        ],
      },
      {
        section: "Thân bài 2 (Bảo vệ luận điểm - Ý 2)",
        points: [
          "Topic Sentence: Moreover, we cannot deny that...",
          "Supporting Sentences: This is due to the fact that... / For instance,... / In addition / More specifically,...",
          "Concluding Sentence: Hence, [Topic bé] has positive / detrimental effects / impacts on people.",
        ],
      },
      {
        section: "Kết bài (Conclusion)",
        points: [
          "Nhắc lại quan điểm: To sum up, I am strongly convinced that [S + V - Nhắc lại quan điểm].",
          "Kết mở (Giải pháp): However, as far as I am concerned, [đối tượng] should choose the most effective way / balance between A and B.",
          "Chốt: Only by doing so can we ensure that people will have better, healthier and more prosperous lives.",
        ],
      },
    ],
  },
  {
    type: "Discussion Đặc Biệt (Causes, Effects, Solutions)",
    usage:
      "What are the effects/causes/solutions...? / Identify problems and suggest ways to tackle...",
    description:
      "Tập trung giải quyết 1-2 yêu cầu cụ thể (Nguyên nhân / Hệ quả / Giải pháp) của đề bài đưa ra.",
    structure: [
      {
        section: "Mở bài (Intro)",
        points: [
          "Giới thiệu: At the present time, an increasing number of people are concerned about [Topic].",
          "It is said that [Topic statement].",
          "Mục đích: This essay will discuss [causes / effects / solutions] regarding this issue.",
        ],
      },
      {
        section: "Thân bài: Causes (Nguyên nhân)",
        points: [
          "TS: It is obvious that there are several causes which lead to / result in / cause [Topic].",
          "Ý 1: The first root cause of this phenomenon is that...",
          "Ý 2: Secondly, another important factor contributing to this phenomenon is that...",
        ],
      },
      {
        section: "Thân bài: Effects (Hệ quả)",
        points: [
          "TS: There are several effects that this problem leads to / results in / causes.",
          "Ý 1: Firstly, this problem results in the fact that S + V / N.",
          "Ý 2: Another effect is that... / Last but not least, this issue could lead to the fact that S + V.",
        ],
      },
      {
        section: "Thân bài: Solutions (Giải pháp)",
        points: [
          "TS: There are several actions that should be taken in order to deal with / address this problem.",
          "Ý 1: Firstly, [đối tượng] should + V_inf.",
          "Ý 2: Another possible method is that... / Last but not least, this issue could be solved if S + V.",
        ],
      },
      {
        section: "Kết bài (Conclusion)",
        points: [
          "Tóm tắt: To sum up, there are some obvious problems/causes/effects/solutions related to [Topic].",
          "Lời khuyên: We should take effective steps to improve these modern-day issues.",
        ],
      },
    ],
  },
];

export const ESSAY_VOCABULARY = {
  general_linkers: [
    {
      type: "Mặt Tốt (Pros) Nouns",
      words: "advantages, positive effects, benefits, merits, plus points",
    },
    {
      type: "Mặt Xấu (Cons) Nouns",
      words:
        "disadvantages, negative effects, drawbacks, demerits, minus points",
    },
    {
      type: "Diễn đạt Tác động Tốt (+)",
      words:
        "X is good for Y, X is beneficial to/for Y, X has positive effects/impacts on Y, X brings a wide range of benefits to Y, X helps/enables/allows people to + V",
    },
    {
      type: "Diễn đạt Tác động Xấu (-)",
      words:
        "X is not good for Y, X is harmful to Y, X has detrimental impacts on Y, X has several drawbacks",
    },
    {
      type: "Động từ Xây dựng (+)",
      words:
        "develop (phát triển), improve (cải thiện), enhance (nâng cao), increase (tăng)",
    },
    {
      type: "Động từ Phá hủy (-)",
      words: "degrade (làm suy thoái), destroy (phá hủy), decrease (giảm)",
    },
  ],
  topics: [
    {
      topic: "Technology (Công nghệ)",
      pros: [
        "Study/learn more effectively",
        "Take online courses from prestigious universities universally",
        "Increase/gain knowledge / get information rapidly via search engines",
        "Unwind / feel relaxed and comfortable (Giải trí)",
        "Let my hair down after a day of hard work",
        "Make friends on the internet / Expand social circles globally",
        "Keep in touch with family and friends via video calls effortlessly",
        "Automate repetitive tasks / boost overall productivity"
      ],
      cons: [
        "Lack physical activities / lead a sedentary lifestyle",
        "Stare at the screen for a long time -> weaken eyesight / become shortsighted",
        "Sit in front of the screen -> have back pain / neck pain",
        "Become isolated from the real world / Lack face-to-face conversations",
        "Spend too much time -> become lazy to study/work (procrastination)",
        "Get access to questionable/non-educational/violent information",
        "Personal information can be stolen/hacked (cybersecurity threats)"
      ],
    },
    {
      topic: "Online Shopping (Mua sắm trực tuyến)",
      pros: [
        "Convenient and time-saving (do not have to go out or wait in line)",
        "Can stay at home or office to buy things with just a few clicks",
        "Save a lot of money / compare prices easily / hunt for the best deals",
        "Offers a wider variety of products (buy from all over the world without geographical borders)",
        "Read reviews from previous buyers to make informed decisions"
      ],
      cons: [
        "Personal information can be hacked / exposed to online scammers",
        "Late delivery (giao hàng muộn) or lost packages",
        "Quality of products can be lower than expected (mismatch between photos and reality)",
        "Cannot try on items physically before purchasing (especially clothes and shoes)"
      ],
    },
    {
      topic: "Education (Giáo dục)",
      pros: [
        "Increase knowledge / Improve both soft and hard skills",
        "Broaden horizons about the world and diverse cultures",
        "Get a well-paid job / Have a high salary in the future",
        "Earn/make money / Gain wealth to support oneself and family",
        "Keep fit and stay healthy (Physical health programs in schools)",
        "Broaden social network / meet like-minded peers (Mental/Social health)",
        "Teachers impart/deliver knowledge creatively and support students emotionally"
      ],
      cons: [
        "Academic pressure can cause stress and anxiety to students",
        "Tuition fees can be a heavy financial burden for some families",
        "Theoretical knowledge sometimes fails to match practical workplace demands"
      ],
    },
    {
       topic: "Environment (Môi trường)",
       pros: [
         "Planting trees helps purify the air and combat climate change",
         "Using public transport reduces carbon footprint significantly",
         "Recycling waste prevents landfills from overflowing",
         "Adopting renewable energy sources (solar, wind) ensures sustainable development"
       ],
       cons: [
         "Overpopulation leads to deforestation and natural habitat destruction",
         "Industrial emissions pollute the air, causing respiratory diseases",
         "Plastic waste contaminates oceans and endangers marine life",
         "Global warming triggers extreme weather events like floods and droughts"
       ]
    }
  ],
};
