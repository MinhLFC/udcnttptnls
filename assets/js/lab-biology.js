/* ==========================================================================
   THÍ NGHIỆM SINH HỌC — GIẢI PHẪU 3D CHUYÊN SÂU (PHONG CÁCH FA QUIZ / FA COURSE)
   Interactive Medical 3D Anatomy Simulation — High-Fidelity 3D WebGL Embed Engine
   Đặc tính nổi bật: Chú thích trực tiếp lên hình ảnh 3D (Interactive 3D Pins & Labels)
   Tham khảo tiêu chuẩn: FA Course (facourse.com/giai-phau-3d/ho-hap-voi-tim-dang-dap)
   Tác giả: Đỗ Văn Nhật Minh — HCMUE
   ========================================================================== */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
     1. CƠ SỞ DỮ LIỆU GIẢI PHẪU Y KHOA CHUẨN XÁC VÀ CHI TIẾT NHẤT
     (Bao gồm tọa độ top/left % chính xác để ghim chú thích lên mô hình)
  ───────────────────────────────────────────────────────────── */
  const ANATOMY_SYSTEMS = {
    'heart-lungs': {
      id: 'heart-lungs',
      name: 'Hô Hấp Với Tim Đang Đập',
      latinName: 'Systema Respiratorium cum Corde Pulsante',
      icon: '🫁❤️',
      badge: 'Mô hình trọng tâm — Chuẩn FA Course',
      modelId: '9b0b079953b840bc9a13f524b60041e4',
      author: 'AVRcontent',
      bpm: 75,
      respRate: 16,
      bp: '120/80 mmHg',
      spo2: '99%',
      desc: 'Mô hình giải phẫu 3D chân thực phối hợp giữa Hệ Hô hấp và Hệ Tuần hoàn — tâm điểm của trang FA Quiz (facourse.com). Mô phỏng quả tim đang đập liên tục trong trung thất giữa hai lá phổi phồng xẹp theo chu kỳ hô hấp, đi kèm hệ mạch máu lớn (ĐM chủ, ĐM phổi) và cây khí - phế quản phân nhánh.',
      landmarks: [
        { name: 'Khí quản', latin: 'Trachea', top: 22, left: 50, desc: 'Ống dẫn khí gồm 16–20 vòng sụn chữ C, nối từ thanh quản xuống ngã ba phế quản (Carina) ngang đốt ngực T4–T5.' },
        { name: 'Phế quản chính', latin: 'Bronchus principalis', top: 34, left: 47, desc: 'Phế quản chính phải to hơn, ngắn hơn và dốc hơn phế quản trái, dẫn khí vào 2 rốn phổi.' },
        { name: 'Phổi phải (3 thùy)', latin: 'Pulmo dexter', top: 48, left: 28, desc: 'Gồm thùy trên, thùy giữa và thùy dưới, ngăn cách bởi khe chếch và khe ngang, dung tích lớn hơn phổi trái.' },
        { name: 'Phổi trái (2 thùy)', latin: 'Pulmo sinister', top: 52, left: 72, desc: 'Gồm thùy trên và thùy dưới, có khuyết tim ở bờ trước để ôm lấy mỏm tim hướng sang trái.' },
        { name: 'Quai động mạch chủ', latin: 'Arcus aortae', top: 42, left: 53, desc: 'Ống mạch lớn hình chữ U ngược, đưa máu giàu oxy từ tâm thất trái đi phân phối nuôi toàn bộ cơ thể.' },
        { name: 'Thân động mạch phổi', latin: 'Truncus pulmonalis', top: 46, left: 43, desc: 'Xuất phát từ tâm thất phải, chia đôi thành ĐM phổi phải và trái đưa máu giàu CO₂ lên phổi trao đổi khí.' },
        { name: 'Quả tim (Tâm thất & Mỏm tim)', latin: 'Cor humanum in mediastino', top: 62, left: 53, desc: 'Khối cơ rỗng 4 buồng co bóp tống máu tuần hoàn liên tục theo chu kỳ tim 0.8 giây.' },
        { name: 'Cơ hoành', latin: 'Diaphragma', top: 76, left: 50, desc: 'Cơ vân hình vòm ngăn cách khoang ngực và khoang bụng, là cơ hô hấp chính (chiếm 75% thông khí).' }
      ],
      quiz: [
        {
          q: 'Khí quản phân nhánh thành hai phế quản chính ở ngang đốt sống ngực nào?',
          options: ['Đốt sống cổ C6', 'Đốt sống ngực T4–T5', 'Đốt sống ngực T9', 'Đốt sống thắt lưng L1'],
          correct: 1,
          explain: 'Khí quản bắt đầu từ sụn nhẫn (ngang mức C6) và chạy xuống chẽ đôi thành 2 phế quản chính tại cựa khí quản (Carina) ở ngang mức đốt sống ngực T4–T5.'
        },
        {
          q: 'Tại sao phổi phải thường dễ bị dị vật rơi vào hơn phổi trái khi bị hóc đường thở?',
          options: ['Phổi phải nhỏ hơn phổi trái', 'Phế quản chính phải to hơn, ngắn hơn và dốc hơn', 'Phổi phải có ít thùy hơn', 'Phế quản trái nằm thẳng đứng hơn'],
          correct: 1,
          explain: 'Phế quản chính phải có đường kính lớn hơn, chiều dài ngắn hơn (~2.5cm so với ~5cm) và chạy dốc thẳng theo trục khí quản hơn, nên dị vật đường thở thường rơi vào bên phải.'
        },
        {
          q: 'Vòng tuần hoàn nhỏ (tuần hoàn phổi) bắt đầu từ đâu và kết thúc ở đâu?',
          options: ['Tâm thất trái → Tâm nhĩ phải', 'Tâm thất phải → Tâm nhĩ trái', 'Tâm nhĩ phải → Tâm thất trái', 'Tâm thất trái → Tâm nhĩ trái'],
          correct: 1,
          explain: 'Tuần hoàn nhỏ bắt đầu từ tâm thất phải → động mạch phổi → mao mạch phổi (trao đổi oxy) → 4 tĩnh mạch phổi mang máu giàu O₂ về tâm nhĩ trái.'
        }
      ],
      clinical: [
        {
          title: '🚨 Dị vật đường thở (Hóc dị vật)',
          content: 'Do đặc điểm giải phẫu phế quản chính phải to, ngắn và dốc hơn phế quản trái, trên 70% trường hợp dị vật đường hô hấp lọt vào phế quản phải. Cần thực hiện ngay nghiệm pháp Heimlich để tống dị vật ra ngoài.'
        },
        {
          title: '🩺 Tràn khí màng phổi áp lực',
          content: 'Khoang màng phổi bình thường là khoang ảo có áp suất âm (-4 đến -7 mmHg). Khi bị thủng màng phổi, không khí tràn vào làm mất áp suất âm, nhu mô phổi xẹp lại gây suy hô hấp cấp tính cần dẫn lưu khẩn cấp.'
        },
        {
          title: '⚡ Ngừng hô hấp - tuần hoàn',
          content: 'Hô hấp và tuần hoàn gắn kết mật thiết: Tim ngừng đập sau 10 giây não mất tri giác, sau 4–6 phút tế bào não bắt đầu hoại tử không phục hồi. Ép tim ngoài lồng ngực (CPR) kết hợp hà hơi thổi ngạt là kỹ năng cứu sống tối thượng.'
        }
      ]
    },

    'cardiac': {
      id: 'cardiac',
      name: 'Tim Người Đang Đập Chi Tiết',
      latinName: 'Cor Humanum Pulsans',
      icon: '❤️',
      badge: 'Chu kỳ tâm thu & tâm trương',
      modelId: '775d6629622740de8a5ed61a959c7506',
      author: 'Michel Paschalis',
      bpm: 72,
      respRate: 15,
      bp: '118/76 mmHg',
      spo2: '99%',
      desc: 'Mô phỏng 3D hoạt họa chuyển động của quả tim người đang co bóp theo chu kỳ: tâm nhĩ co (0.1s), tâm thất co (0.3s) và giãn chung (0.4s). Thể hiện rõ hệ thống van tim, quai động mạch chủ áp lực cao, tĩnh mạch chủ trên/dưới và mạng lưới động mạch vành nuôi tim.',
      landmarks: [
        { name: 'Quai động mạch chủ', latin: 'Arcus aortae', top: 25, left: 54, desc: 'Chia 3 nhánh lớn: Thân cánh tay đầu, ĐM cảnh chung trái và ĐM dưới đòn trái nuôi phần trên cơ thể.' },
        { name: 'Thân động mạch phổi', latin: 'Truncus pulmonalis', top: 36, left: 42, desc: 'Đưa dòng máu giàu CO₂ từ tâm thất phải lên 2 lá phổi để nhả khí thải và lấy oxy.' },
        { name: 'Tâm nhĩ phải', latin: 'Atrium dextrum', top: 46, left: 32, desc: 'Nhận máu giàu CO₂ từ tĩnh mạch chủ trên (từ đầu, chi trên) và tĩnh mạch chủ dưới (từ bụng, chi dưới).' },
        { name: 'Tâm nhĩ trái', latin: 'Atrium sinistrum', top: 44, left: 68, desc: 'Nhận máu giàu oxy từ 4 tĩnh mạch phổi trở về trước khi tống qua van 2 lá xuống thất trái.' },
        { name: 'Động mạch vành tim', latin: 'Arteriae coronariae', top: 56, left: 45, desc: 'Gồm ĐM vành phải và ĐM vành trái phân nhánh nuôi dưỡng trực tiếp cho khối cơ tim đang hoạt động.' },
        { name: 'Tâm thất trái', latin: 'Ventriculus sinister', top: 66, left: 58, desc: 'Thành cơ dày nhất (12–15 mm), áp lực bơm máu đỉnh điểm 120 mmHg để tống máu vào động mạch chủ nuôi toàn thân.' },
        { name: 'Tâm thất phải', latin: 'Ventriculus dexter', top: 64, left: 38, desc: 'Thành cơ mỏng hơn (3–5 mm), bơm máu nghèo oxy lên phổi với áp lực thấp hơn (khoảng 25 mmHg).' }
      ],
      quiz: [
        {
          q: 'Mỗi chu kỳ co bóp của tim ở người trưởng thành bình thường kéo dài khoảng bao lâu?',
          options: ['0.4 giây', '0.8 giây', '1.2 giây', '0.1 giây'],
          correct: 1,
          explain: 'Chu kỳ tim bình thường kéo dài khoảng 0.8 giây: Pha nhĩ thu (0.1s), pha thất thu (0.3s) và pha giãn chung (0.4s).'
        },
        {
          q: 'Thành cơ của buồng tim nào dày nhất trong 4 buồng tim?',
          options: ['Tâm nhĩ phải', 'Tâm thất phải', 'Tâm thất trái', 'Tâm nhĩ trái'],
          correct: 2,
          explain: 'Tâm thất trái có thành cơ dày nhất (12–15 mm) vì phải tạo áp lực cực lớn tống máu vào hệ đại tuần hoàn đi nuôi toàn thân.'
        },
        {
          q: 'Mạch máu nào trực tiếp cung cấp oxy và dưỡng chất nuôi dưỡng tế bào cơ tim?',
          options: ['Động mạch phổi', 'Tĩnh mạch chủ', 'Động mạch vành', 'Động mạch cảnh'],
          correct: 2,
          explain: 'Hệ thống động mạch vành (ĐM vành trái và ĐM vành phải) xuất phát ngay từ gốc động mạch chủ có nhiệm vụ nuôi cơ tim.'
        }
      ],
      clinical: [
        {
          title: '💔 Nhồi máu cơ tim cấp (Heart Attack)',
          content: 'Xảy ra khi một nhánh động mạch vành bị mảng xơ vữa bứt rách tạo cục máu đông làm tắc nghẽn hoàn toàn dòng máu. Vùng cơ tim tương ứng bị thiếu máu hoại tử. Cần can thiệp nong mạch đặt Stent trong "khung giờ vàng" < 2 giờ.'
        },
        {
          title: '🩺 Hở van hai lá (Mitral Regurgitation)',
          content: 'Van 2 lá nằm giữa nhĩ trái và thất trái. Khi van đóng không kín trong thì tâm thu, một phần máu từ thất trái phụt ngược về nhĩ trái, lâu ngày dẫn đến giãn buồng tim và suy tim.'
        },
        {
          title: '💓 Loạn nhịp tim & Máy tạo nhịp',
          content: 'Nút xoang (SA node) là "nhạc trưởng" phát xung điện tự nhiên cho tim (60–100 xung/phút). Khi nút xoang suy yếu hoặc nghẽn nhĩ thất (AV block), người bệnh có thể cần cấy máy tạo nhịp tim nhân tạo (Pacemaker).'
        }
      ]
    },

    'respiratory': {
      id: 'respiratory',
      name: 'Hệ Hô Hấp & Cây Phế Quản',
      latinName: 'Systema Respiratorium & Arbor Bronchialis',
      icon: '🫁',
      badge: 'Cây phế quản 23 bậc & Nhu mô phổi',
      modelId: 'a7ac43a140644662a9b896b8a8a10f57',
      author: 'Vikrama Raghuraman',
      bpm: 70,
      respRate: 16,
      bp: '120/80 mmHg',
      spo2: '98%',
      desc: 'Mô hình giải phẫu 3D toàn diện đường dẫn khí: Khí quản hình ống với 16–20 vòng sụn chữ C, chia đôi tại Carina thành 2 phế quản chính, phân nhánh 23 bậc hình cành cây dẫn sâu vào các phân thùy và 300–500 triệu túi phế nang trao đổi oxy.',
      landmarks: [
        { name: 'Thanh quản & Sụn giáp', latin: 'Larynx & Cartilago thyroidea', top: 18, left: 50, desc: 'Cơ quan phát âm chứa dây thanh âm, được nâng đỡ bởi sụn giáp (lồi táo Adam) và sụn nắp thanh môn đậy kín khi nuốt.' },
        { name: 'Khí quản', latin: 'Trachea', top: 30, left: 48, desc: 'Ống dẫn khí sụn hình chữ C dài 11–13 cm, phía sau là cơ trơn giúp thực quản dễ giãn nở khi nuốt thức ăn.' },
        { name: 'Ngã ba phế quản (Carina)', latin: 'Bifurcatio tracheae', top: 42, left: 50, desc: 'Điểm chia đôi khí quản thành 2 phế quản chính ở ngang mức đốt sống ngực T4–T5.' },
        { name: 'Cây phế quản', latin: 'Arbor bronchialis', top: 52, left: 62, desc: 'Hệ thống ống dẫn khí phân nhánh 23 thế hệ từ phế quản chính → phế quản thùy → tiểu phế quản → tiểu phế quản tận.' },
        { name: 'Phổi phải (3 thùy)', latin: 'Pulmo dexter', top: 56, left: 30, desc: 'Gồm thùy trên, giữa và dưới; rãnh gian thùy chia các thùy hoạt động độc lập.' },
        { name: 'Màng phổi & Phế nang', latin: 'Pleura & Alveoli', top: 72, left: 68, desc: 'Có khoảng 300–500 triệu phế nang, tổng diện tích bề mặt trao đổi khí lên đến 70–80 m².' }
      ],
      quiz: [
        {
          q: 'Đơn vị cấu tạo và chức năng cơ bản thực hiện nhiệm vụ trao đổi khí của phổi là gì?',
          options: ['Phế quản thùy', 'Tiểu phế quản tận', 'Túi phế nang', 'Khí quản'],
          correct: 2,
          explain: 'Phế nang là những túi khí nhỏ li ti có màng phế nang - mao mạch mỏng chỉ 0.5 µm, nơi diễn ra sự khuếch tán O₂ và CO₂.'
        },
        {
          q: 'Bộ phận nào đóng vai trò như chiếc nắp đậy đường thở khi ta nuốt thức ăn để tránh sặc?',
          options: ['Dây thanh âm', 'Sụn nhẫn', 'Sụn nắp thanh môn (Thanh thiệt)', 'Lưỡi gà'],
          correct: 2,
          explain: 'Sụn nắp thanh môn (Epiglottis) gập xuống đậy kín lối vào thanh quản khi nuốt, hướng thức ăn trượt an toàn vào thực quản.'
        },
        {
          q: 'Cơ nào đóng vai trò quan trọng nhất trong động tác hít vào bình thường lúc nghỉ ngơi?',
          options: ['Cơ liên sườn trong', 'Cơ hoành', 'Cơ ức đòn chũm', 'Cơ thẳng bụng'],
          correct: 1,
          explain: 'Cơ hoành là cơ hô hấp chính, đảm nhiệm khoảng 75% lưu lượng thông khí trong thì hít vào êm dịu bình thường.'
        }
      ],
      clinical: [
        {
          title: '🌬️ Hen phế quản (Asthma)',
          content: 'Tình trạng viêm mạn tính đường thở khiến cơ trơn phế quản co thắt dữ dội, niêm mạc phù nề và tăng tiết đờm đặc làm tắc hẹp đường thở. Thuốc cắt cơn Salbutamol tác dụng làm giãn cơ trơn phế quản nhanh chóng.'
        },
        {
          title: '🦠 Viêm phổi & Phù phổi cấp',
          content: 'Khi phế nang bị ngập đầy dịch rỉ viêm hoặc mủ (viêm phổi) hay dịch huyết tương (phù phổi), màng trao đổi khí bị phá hủy khiến oxy không thể khuếch tán vào máu, bệnh nhân tím tái và thiếu oxy trầm trọng.'
        },
        {
          title: '🚭 Tác hại khói thuốc lá & COPD',
          content: 'Khói thuốc phá hủy các sợi đàn hồi của thành phế nang gây bệnh phổi tắc nghẽn mạn tính (COPD) và khí phế thũng, làm tê liệt hệ thống lông chuyển dẫn lưu chất nhầy của đường hô hấp.'
        }
      ]
    },

    'brain': {
      id: 'brain',
      name: 'Hệ Thần Kinh & Não Bộ Y Khoa',
      latinName: 'Systema Nervosum & Encephalon',
      icon: '🧠',
      badge: 'Dữ liệu MRI bệnh nhân thật — SGU Medical',
      modelId: '172506246af44eb29fab763fa76ec447',
      author: 'SGU BioMedical Visualization',
      bpm: 0,
      respRate: 0,
      bp: '120/80 mmHg',
      spo2: '99%',
      desc: 'Mô hình 3D não bộ chuẩn y khoa được Đại học Y khoa SGU tái tạo trực tiếp từ ảnh chụp cộng hưởng từ (MRI) của bệnh nhân thực tế và quét 3D tiêu bản não plastinate. Thấy rõ từng rãnh vỏ não, các thùy não (trán, đỉnh, thái dương, chẩm), tiểu não và cuống thân não.',
      landmarks: [
        { name: 'Thùy trán', latin: 'Lobus frontalis', top: 32, left: 34, desc: 'Trung tâm tư duy cấp cao, lập kế hoạch, ra quyết định, nhân cách và điều khiển vận động chủ động (vùng vận động sơ cấp).' },
        { name: 'Thùy đỉnh', latin: 'Lobus parietalis', top: 24, left: 56, desc: 'Tiếp nhận và xử lý các cảm giác thân thể: xúc giác, cảm giác nhiệt độ, đau đớn và định hướng không gian.' },
        { name: 'Thùy chẩm', latin: 'Lobus occipitalis', top: 48, left: 74, desc: 'Trung khu thị giác sơ cấp, phân tích tín hiệu hình ảnh, màu sắc và chuyển động từ mắt truyền về.' },
        { name: 'Thùy thái dương', latin: 'Lobus temporalis', top: 56, left: 40, desc: 'Trung khu thính giác, tiếp nhận ngôn ngữ (vùng Wernicke) và hình thành trí nhớ dài hạn (thể hải mã).' },
        { name: 'Tiểu não', latin: 'Cerebellum', top: 68, left: 68, desc: 'Nằm phía sau dưới, phụ trách giữ thăng bằng cơ thể, điều hòa trương lực cơ và phối hợp nhịp nhàng các động tác khéo léo.' },
        { name: 'Thân não & Hành não', latin: 'Truncus encephali & Medulla oblongata', top: 78, left: 52, desc: 'Cầu nối não với tủy sống, chứa các trung khu sinh mạng sống còn: điều hòa nhịp tim, huyết áp và phản xạ hô hấp.' }
      ],
      quiz: [
        {
          q: 'Bộ phận nào của não bộ chứa trung khu thần kinh điều hòa tim mạch và hô hấp sinh mạng?',
          options: ['Vỏ bán cầu đại não', 'Tiểu não', 'Hành não (thuộc thân não)', 'Thể chai'],
          correct: 2,
          explain: 'Hành não chứa trung tâm tim mạch và trung tâm hô hấp sinh mạng. Tổn thương hành não gây ngừng thở, ngừng tim ngay lập tức.'
        },
        {
          q: 'Nếu một người bị tổn thương tiểu não, triệu chứng lâm sàng rõ rệt nhất sẽ là gì?',
          options: ['Mất trí nhớ hoàn toàn', 'Mất khả năng nhìn', 'Đi đứng lảo đảo, mất thăng bằng, run khi cử động', 'Mất khả năng ngửi mùi'],
          correct: 2,
          explain: 'Tiểu não điều phối thăng bằng và trương lực cơ. Tổn thương tiểu não dẫn đến hội chứng tiểu não: thất điều dáng đi (đi như người say), run khi chú ý.'
        },
        {
          q: 'Vùng Broca trên vỏ não (thường ở bán cầu ưu thế bên trái) đảm nhận chức năng gì?',
          options: ['Phát âm và diễn đạt ngôn ngữ', 'Thấu hiểu ngôn ngữ nghe được', 'Cảm giác đau', 'Nhận diện khuôn mặt'],
          correct: 0,
          explain: 'Vùng Broca nằm ở hồi trán dưới của bán cầu ưu thế, chịu trách nhiệm lập trình cơ vận động thanh quản môi lưỡi để phát âm lời nói.'
        }
      ],
      clinical: [
        {
          title: '🧠 Tai biến mạch máu não (Đột quỵ - Stroke)',
          content: 'Chiếm tỷ lệ tử vong và tàn phế hàng đầu. Gồm nhồi máu não (80-85% do huyết khối làm tắc mạch) và xuất huyết não (vỡ mạch máu do tăng huyết áp). Ghi nhớ dấu hiệu FAST: Face (méo miệng), Arm (yếu tay), Speech (nói đớ), Time (gọi cấp cứu ngay).'
        },
        {
          title: '🤕 Chấn thương sọ não & Tụ máu ngoài màng cứng',
          content: 'Chấn thương va đập vào vùng thái dương dễ làm rách động mạch màng não giữa, máu chảy tạo ổ tụ máu ngoài màng cứng chèn ép nhu mô não gây tụt não đe dọa tính mạng nếu không mổ kịp.'
        },
        {
          title: '🧩 Sa sút trí tuệ Alzheimer',
          content: 'Bệnh lý thoái hóa thần kinh tiến triển với sự tích tụ các mảng protein Beta-Amyloid và đám rối sợi Tau trong não, bắt đầu từ vùng hồi hải mã gây mất dần trí nhớ ngắn hạn và ngôn ngữ.'
        }
      ]
    },

    'skeleton': {
      id: 'skeleton',
      name: 'Hệ Xương Toàn Thân 3D',
      latinName: 'Systema Skeletale Humanum',
      icon: '🦴',
      badge: 'Khung xương 206 xương chuẩn xác',
      modelId: '911b9df7e7834175b69b4840ea15e054',
      author: 'Terrie Simmons-Ehrhardt',
      bpm: 0,
      respRate: 0,
      bp: 'N/A',
      spo2: 'N/A',
      desc: 'Mô hình khung xương 3D người trưởng thành hoàn chỉnh gồm 206 xương: Sọ não và sọ mặt, trục cột sống cong hình chữ S với các đĩa đệm, lồng ngực bảo vệ trung thất, đai vai, đai chậu và hệ xương chi chịu lực nâng đỡ cơ thể.',
      landmarks: [
        { name: 'Hộp sọ', latin: 'Cranium', top: 14, left: 50, desc: 'Gồm 8 xương sọ não bảo vệ não bộ và 14 xương sọ mặt, liên kết với nhau bằng các đường khớp bất động vững chắc.' },
        { name: 'Đốt sống cổ & Đai vai', latin: 'Vertebrae cervicales & Cingulum pectorale', top: 24, left: 42, desc: 'Gồm 7 đốt sống cổ nâng đỡ đầu và xương đòn, xương bả vai kết nối cánh tay.' },
        { name: 'Lồng ngực & Xương ức', latin: 'Thorax & Sternum', top: 36, left: 54, desc: 'Gồm xương ức ở phía trước, 12 đôi xương sườn (7 đôi sườn thật, 3 đôi sườn giả, 2 đôi sườn cụt) và 12 đốt sống ngực.' },
        { name: 'Cột sống thắt lưng', latin: 'Columna vertebralis lumbalis', top: 48, left: 47, desc: '5 đốt sống thắt lưng chịu tải trọng lớn nhất của toàn bộ thân mình.' },
        { name: 'Đai chậu (Xương chậu)', latin: 'Pelvis', top: 58, left: 54, desc: 'Gồm 2 xương chậu khớp với xương cùng phía sau và khớp mu phía trước, nâng đỡ các tạng trong chậu hông.' },
        { name: 'Xương đùi', latin: 'Femur', top: 72, left: 44, desc: 'Xương dài nhất, to nhất và có khả năng chịu lực nén lớn nhất trong toàn bộ cơ thể người.' },
        { name: 'Khớp gối & Cẳng chân', latin: 'Articulatio genus & Tibia', top: 86, left: 53, desc: 'Khớp bản lề phức tạp nhất cơ thể gồm xương bánh chè, xương chày và xương mác.' }
      ],
      quiz: [
        {
          q: 'Bộ xương người trưởng thành bình thường gồm có bao nhiêu chiếc xương?',
          options: ['180 xương', '206 xương', '270 xương', '300 xương'],
          correct: 1,
          explain: 'Trẻ sơ sinh có khoảng 270–300 mầm xương, sau đó các xương sụn hợp nhất dần lại, ở người trưởng thành hoàn thiện còn đúng 206 chiếc xương.'
        },
        {
          q: 'Xương nào dài nhất và chịu lực nặng nhất trong cơ thể người?',
          options: ['Xương chày', 'Xương cánh tay', 'Xương đùi', 'Xương cột sống'],
          correct: 2,
          explain: 'Xương đùi (Femur) là xương đơn dài nhất, chiếm khoảng 26% chiều cao cơ thể và có thể chịu tải trọng lực nén hàng trăm kilogram.'
        },
        {
          q: 'Trong 12 đôi xương sườn ở lồng ngực người, có bao nhiêu đôi được gọi là "xương sườn cụt"?',
          options: ['1 đôi', '2 đôi (đôi 11 và 12)', '3 đôi', '5 đôi'],
          correct: 1,
          explain: 'Đôi xương sườn số 11 và số 12 không có sụn sườn bám vào xương ức mà đầu trước tự do trong cơ thành bụng nên gọi là xương sườn cụt (floating ribs).'
        }
      ],
      clinical: [
        {
          title: '🦴 Loãng xương (Osteoporosis)',
          content: 'Bệnh lý tiến triển âm thầm do mất cân bằng giữa quá trình tạo xương và hủy xương, làm mật độ khoáng chất xương suy giảm, xương trở nên giòn xốp và rất dễ gãy dù chỉ ngã nhẹ.'
        },
        {
          title: '⚡ Thoát vị đĩa đệm cột sống (Herniated Disc)',
          content: 'Khi bao xơ đĩa đệm bị rách, nhân nhầy bên trong lồi ra ngoài chèn ép vào tủy sống hoặc các rễ thần kinh tọa, gây đau buốt dọc lưng xuống hông và chân.'
        },
        {
          title: '🦵 Gãy cổ xương đùi ở người cao tuổi',
          content: 'Cổ xương đùi là vị trí giải phẫu chịu lực uốn gập lớn nhất nhưng mạch máu nuôi dưỡng nghèo nàn. Gãy cổ xương đùi ở người già thường phải phẫu thuật thay khớp háng nhân tạo để hồi phục vận động.'
        }
      ]
    },

    'digestive': {
      id: 'digestive',
      name: 'Hệ Tiêu Hóa Toàn Diện 3D',
      latinName: 'Systema Digestorium',
      icon: '🫃',
      badge: 'Ống & Tuyến tiêu hóa y khoa',
      modelId: '0e45d8761e384ca8953c1b6b4294d443',
      author: 'mr_izal',
      bpm: 0,
      respRate: 0,
      bp: 'N/A',
      spo2: 'N/A',
      desc: 'Mô hình 3D chi tiết hệ tiêu hóa: Thực quản dẫn thức ăn, dạ dày co bóp tiết dịch vị, gan sản xuất mật dự trữ trong túi mật, tuyến tụy tiết dịch tụy và insulin, ruột non dài 6m hấp thu chất dinh dưỡng và khung đại tràng tạo phân.',
      landmarks: [
        { name: 'Thực quản', latin: 'Esophagus', top: 22, left: 50, desc: 'Ống cơ dài 25 cm dẫn thức ăn từ họng xuống dạ dày nhờ các làn sóng nhu động nhịp nhàng.' },
        { name: 'Gan & Túi mật', latin: 'Hepar & Vesica biliaris', top: 40, left: 38, desc: 'Gan là cơ quan nội tạng lớn nhất (~1.5 kg), đảm nhiệm hơn 500 chức năng chuyển hóa, khử độc và sản xuất dịch mật.' },
        { name: 'Dạ dày', latin: 'Gaster / Ventriculus', top: 42, left: 58, desc: 'Túi cơ hình chữ J dung tích 1–1.5 lít, co bóp nhào trộn vị trấp và tiết acid HCl cùng enzyme Pepsin tiêu hóa protein.' },
        { name: 'Tuyến tụy', latin: 'Pancreas', top: 50, left: 52, desc: 'Tuyến pha vừa ngoại tiết (men Amylase, Lipase, Trypsin) vừa nội tiết (Islets of Langerhans tiết Insulin và Glucagon điều hòa đường huyết).' },
        { name: 'Khung đại tràng', latin: 'Colon', top: 60, left: 32, desc: 'Khung ruột già dài 1.5 m gồm đại tràng lên, ngang, xuống và xích ma hấp thu nước tạo phân.' },
        { name: 'Ruột non uốn lượn', latin: 'Intestinum tenue', top: 66, left: 50, desc: 'Dài khoảng 5–6 m gồm tá tràng, hỗng tràng và hồi tràng, nơi hấp thu 90% nước và toàn bộ dưỡng chất qua nhung mao.' },
        { name: 'Ruột thừa (Hố chậu phải)', latin: 'Appendix vermiformis', top: 75, left: 38, desc: 'Túi cùng hình giun nằm ở đáy manh tràng, vị trí tương ứng điểm đau McBurney trong viêm ruột thừa cấp.' }
      ],
      quiz: [
        {
          q: 'Quá trình tiêu hóa hóa học và hấp thu chất dinh dưỡng vào máu diễn ra chủ yếu ở bộ phận nào?',
          options: ['Khoang miệng', 'Dạ dày', 'Ruột non', 'Đại tràng'],
          correct: 2,
          explain: 'Ruột non có diện tích hấp thu khổng lồ (~250–300 m²) nhờ hệ thống nếp gấp niêm mạc, nhung mao và vi nhung mao, là nơi hấp thu đại đa số dưỡng chất.'
        },
        {
          q: 'Cơ quan nào trong cơ thể vừa thực hiện chức năng tiêu hóa ngoại tiết vừa là tuyến nội tiết tiết insulin?',
          options: ['Gan', 'Tuyến tụy', 'Dạ dày', 'Túi mật'],
          correct: 1,
          explain: 'Tuyến tụy là tuyến pha: tụy ngoại tiết tiết dịch tụy chứa enzym tiêu hóa đổ vào tá tràng; tụy nội tiết tiết Insulin và Glucagon trực tiếp vào máu.'
        },
        {
          q: 'Vị trí điểm đau ruột thừa điển hình trên thành bụng thường được xác định là điểm nào?',
          options: ['Điểm sườn lưng', 'Điểm McBurney', 'Điểm túi mật Murphy', 'Điểm thượng vị'],
          correct: 1,
          explain: 'Điểm McBurney nằm ở 1/3 ngoài trên đường nối từ rốn đến gai chậu trước trên bên phải, là vị trí đáy ruột thừa thường áp sát thành bụng nhất.'
        }
      ],
      clinical: [
        {
          title: '🚨 Viêm ruột thừa cấp (Appendicitis)',
          content: 'Cấp cứu ngoại khoa thường gặp nhất: Lòng ruột thừa bị tắc nghẽn do sỏi phân hoặc phì đại nang lympho gây viêm ứ mủ. Triệu chứng điển hình là đau âm ỉ quanh rốn sau đó chuyển khu trú về hố chậu phải (điểm McBurney).'
        },
        {
          title: '🔥 Viêm loét dạ dày tá tràng & Vi khuẩn HP',
          content: 'Mất cân bằng giữa yếu tố bảo vệ niêm mạc (chất nhầy, HCO₃⁻) và yếu tố hủy hoại (Acid HCl, Pepsin, vi khuẩn Helicobacter pylori, thuốc giảm đau NSAID). Cần phác đồ kháng sinh tiệt trừ HP và thuốc ức chế bơm proton (PPI).'
        },
        {
          title: '🍺 Xơ gan & Giãn tĩnh mạch thực quản',
          content: 'Hậu quả của viêm gan virus B/C hoặc lạm dụng rượu mạn tính khiến nhu mô gan bị xơ hóa tạo sẹo, cản trở tuần hoàn tĩnh mạch cửa dẫn đến tăng áp lực cửa, lách to, cổ trướng và nguy cơ vỡ búi giãn tĩnh mạch thực quản xuất huyết ồ ạt.'
        }
      ]
    }
  };

  /* ─────────────────────────────────────────────────────────────
     2. BIẾN TOÀN CỤC & TRẠNG THÁI HIỂN THỊ
  ───────────────────────────────────────────────────────────── */
  let currentKey = 'heart-lungs';
  let activePinIdx = null;
  let showPins = true;
  let showFullTags = true;
  let isTouring = false;
  let tourInterval = null;

  let ecgAnimId = null;
  let ecgPoints = [];

  /* ─────────────────────────────────────────────────────────────
     3. KHỞI TẠO VÀ XÂY DỰNG GIAO DIỆN CHUẨN FA QUIZ
  ───────────────────────────────────────────────────────────── */
  function buildBioUI() {
    const container = document.getElementById('experiment-biology');
    if (!container) return;

    const cur = ANATOMY_SYSTEMS[currentKey];

    container.innerHTML = `
      <div class="fa-biology-wrapper">
        <!-- Top Banner Header phong cách FA Course -->
        <div class="fa-bio-header">
          <div class="fa-bio-title-group">
            <span class="fa-badge-pill">🩺 GIẢI PHẪU Y KHOA 3D — PHONG CÁCH FA QUIZ (FA COURSE)</span>
            <h2>Mô Hình 3D Các Hệ Cơ Quan Cơ Thể Người Chuẩn Y Khoa</h2>
            <p>Mô phỏng 3D WebGL tương tác trực tiếp: Quan sát hệ hô hấp với quả tim đang đập theo chu kỳ sinh học, bóc tách cấu trúc 360°, chú thích trực tiếp lên mô hình, theo dõi điện tâm đồ ECG và làm bài trắc nghiệm FA Quiz.</p>
          </div>

          <!-- Quick Navigation Selector Pills -->
          <div class="fa-model-nav">
            ${Object.keys(ANATOMY_SYSTEMS).map(key => {
              const m = ANATOMY_SYSTEMS[key];
              return `
                <button class="fa-model-btn ${key === currentKey ? 'active' : ''}" 
                        id="fa-nav-btn-${key}"
                        onclick="bioSelectModel('${key}')">
                  <span class="fa-btn-icon">${m.icon}</span>
                  <span class="fa-btn-text">${m.name}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Main Layout: 3D Viewport (Trái) + Info & Quiz Panel (Phải) -->
        <div class="fa-bio-content-grid">
          <!-- Cột Trái: Trình Xem 3D Chân Thực WebGL -->
          <div class="fa-viewport-column">
            <div class="fa-viewport-box" id="fa-3d-viewport-box">
              <!-- Toolbar bên trên khung 3D -->
              <div class="fa-viewport-topbar">
                <div class="fa-active-model-info">
                  <span class="fa-model-tag" id="fa-active-icon">${cur.icon}</span>
                  <div>
                    <h3 id="fa-active-name">${cur.name}</h3>
                    <small id="fa-active-latin">${cur.latinName}</small>
                  </div>
                </div>

                <div class="fa-viewport-actions">
                  <button class="fa-action-btn ${showPins ? 'active' : ''}" id="btn-toggle-pins-top" onclick="bioTogglePins()" title="Bật/Tắt điểm ghim trên mô hình">
                    🏷️ Điểm Ghim: ${showPins ? 'Bật' : 'Tắt'}
                  </button>
                  <button class="fa-action-btn" id="btn-tour-guide" onclick="bioToggleTour()" title="Tự động duyệt qua từng cơ quan">
                    ▶️ Chỉ Điểm
                  </button>
                  <button class="fa-action-btn" onclick="bioReloadModel()" title="Tải lại mô hình 3D">
                    ⚡ Tải Lại
                  </button>
                  <button class="fa-action-btn" onclick="bioToggleFullscreen()" title="Chế độ toàn màn hình">
                    ⛶ Toàn Màn Hình
                  </button>
                </div>
              </div>

              <!-- 3D WebGL Embed Container với Lớp Chú Thích Pins -->
              <div class="fa-3d-iframe-wrap" id="fa-3d-iframe-wrap">
                <!-- Loading Spinner Overlay -->
                <div class="fa-iframe-loader" id="fa-iframe-loader">
                  <div class="fa-spinner"></div>
                  <div class="fa-loader-text" id="fa-loader-text">Đang tải mô hình giải phẫu 3D WebGL...</div>
                </div>

                <!-- 3D WebGL Model Iframe -->
                <iframe id="fa-3d-iframe"
                        title="${cur.name}"
                        src="https://sketchfab.com/models/${cur.modelId}/embed?autostart=1&ui_theme=dark&dnt=1&preload=1"
                        frameborder="0"
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        allowfullscreen
                        mozallowfullscreen="true"
                        webkitallowfullscreen="true"
                        onload="bioOnIframeLoaded()">
                </iframe>

                <!-- LỚP CHÚ THÍCH TRỰC TIẾP LÊN HÌNH ẢNH MÔ HÌNH (CHUẨN FA QUIZ) -->
                <div class="fa-pins-overlay ${showPins ? '' : 'hidden'}" id="fa-pins-overlay">
                  <!-- Render động các điểm ghim chú thích -->
                </div>

                <!-- Floating overlay toggle bar góc dưới mô hình -->
                <div class="fa-overlay-toggle-bar">
                  <button class="fa-toggle-btn ${showPins ? 'active' : ''}" id="btn-toggle-pins-overlay" onclick="bioTogglePins()">
                    📍 ${showPins ? 'Ẩn Điểm Ghim' : 'Hiện Điểm Ghim'}
                  </button>
                  <span style="font-size: 0.74rem; color: #e2e8f0; background: rgba(15,23,42,0.85); padding: 0.35rem 0.75rem; border-radius: var(--radius-full); backdrop-filter: blur(8px); border: 1px solid rgba(141,126,247,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.4);">
                    💡 Rê chuột / chạm vào số để xem tên
                  </span>
                </div>
              </div>

              <!-- Thanh HUD nhịp sinh học thời gian thực (ECG & Breathing Monitor) -->
              <div class="fa-bio-hud">
                <div class="fa-hud-metric">
                  <span class="fa-metric-label">❤️ NHỊP TIM (HR)</span>
                  <span class="fa-metric-val" id="fa-hud-bpm">${cur.bpm > 0 ? cur.bpm + ' BPM' : '68 BPM'}</span>
                </div>
                <div class="fa-hud-ecg-wrap" title="Điện tâm đồ ECG thời gian thực (P-QRS-T)">
                  <canvas id="fa-ecg-canvas" width="220" height="38"></canvas>
                </div>
                <div class="fa-hud-metric">
                  <span class="fa-metric-label">🫁 NHỊP THỞ (RR)</span>
                  <span class="fa-metric-val" id="fa-hud-rr">${cur.respRate > 0 ? cur.respRate + ' L/phút' : '16 L/phút'}</span>
                </div>
                <div class="fa-hud-metric">
                  <span class="fa-metric-label">🩺 HUYẾT ÁP (BP)</span>
                  <span class="fa-metric-val" id="fa-hud-bp">${cur.bp}</span>
                </div>
                <div class="fa-hud-metric">
                  <span class="fa-metric-label">🩸 SpO₂</span>
                  <span class="fa-metric-val" id="fa-hud-spo2">${cur.spo2}</span>
                </div>
              </div>

              <!-- Hướng dẫn tương tác -->
              <div class="fa-interaction-hint">
                <span>📍 <strong>Rê chuột hoặc chạm vào các điểm số</strong> để xem tên cơ quan | 🖱️ <strong>Kéo chuột:</strong> Xoay mô hình 3D</span>
              </div>
            </div>
          </div>

          <!-- Cột Phải: Chú Thích Giải Phẫu + Trắc Nghiệm FA Quiz + Lâm Sàng -->
          <div class="fa-info-column">
            <!-- Tab chuyển đổi giữa 'Chi Tiết Giải Phẫu', 'FA Quiz', và 'Lâm Sàng' -->
            <div class="fa-sidebar-tabs">
              <button class="fa-s-tab active" id="tab-btn-landmarks" onclick="bioSwitchSidebarTab('landmarks')">
                📖 Chú Thích
              </button>
              <button class="fa-s-tab" id="tab-btn-quiz" onclick="bioSwitchSidebarTab('quiz')">
                ✍️ FA Quiz
              </button>
              <button class="fa-s-tab" id="tab-btn-clinical" onclick="bioSwitchSidebarTab('clinical')">
                🔬 Lâm Sàng
              </button>
            </div>

            <!-- Panel 1: Chú thích các cấu tạo (Landmarks) -->
            <div class="fa-sidebar-panel active" id="panel-landmarks">
              <div class="fa-desc-card">
                <h4>🔬 Giới Thiệu Chức Năng</h4>
                <p id="fa-system-desc">${cur.desc}</p>
              </div>

              <div class="fa-landmarks-list" id="fa-landmarks-list">
                <!-- Render động danh sách cơ quan -->
              </div>
            </div>

            <!-- Panel 2: Trắc nghiệm FA Quiz -->
            <div class="fa-sidebar-panel" id="panel-quiz">
              <div class="fa-quiz-card">
                <div class="fa-quiz-header">
                  <h4>💡 Câu Hỏi Trắc Nghiệm Y Khoa</h4>
                  <span class="fa-quiz-badge">FA Quiz Mode</span>
                </div>
                <div id="fa-quiz-container">
                  <!-- Render câu hỏi trắc nghiệm -->
                </div>
              </div>
            </div>

            <!-- Panel 3: Ứng Dụng Lâm Sàng -->
            <div class="fa-sidebar-panel" id="panel-clinical">
              <div class="fa-desc-card">
                <h4>🩺 Ứng Dụng Y Học & Bệnh Học</h4>
                <p>Khám phá mối tương quan giữa giải phẫu học và các bệnh lý thực tế trong y khoa lâm sàng.</p>
              </div>
              <div class="fa-landmarks-list" id="fa-clinical-list">
                <!-- Render động các case lâm sàng -->
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    renderPinsOverlay();
    renderLandmarks();
    renderQuiz();
    renderClinical();
    startECGMonitor();
  }

  /* ─────────────────────────────────────────────────────────────
     4. RENDER VÀ ĐIỀU KHIỂN CHÚ THÍCH TRỰC TIẾP TRÊN HÌNH ẢNH 3D
  ───────────────────────────────────────────────────────────── */
  function renderPinsOverlay() {
    const overlay = document.getElementById('fa-pins-overlay');
    if (!overlay) return;

    const cur = ANATOMY_SYSTEMS[currentKey];
    overlay.innerHTML = cur.landmarks.map((lm, idx) => `
      <div class="fa-pin-item ${idx === activePinIdx ? 'active show-popover' : ''}" 
           id="fa-pin-${idx}"
           style="top: ${lm.top}%; left: ${lm.left}%;"
           onclick="bioClickPin(${idx}, event)">
        
        <!-- Điểm ghim số nhỏ gọn phát sáng -->
        <div class="fa-pin-beacon" title="${lm.name} (${lm.latin})">
          ${idx + 1}
        </div>

        <!-- Thẻ tên chú thích: MẶC ĐỊNH ẨN, CHỈ HIỆN KHI CHẠM / HOVER -->
        <div class="fa-pin-tag" id="fa-pin-tag-${idx}">
          <span class="fa-pin-title">${lm.name}</span>
          <span class="fa-pin-latin">${lm.latin}</span>
        </div>

        <!-- Hộp thông tin chi tiết nổi (Popover khi click) -->
        <div class="fa-pin-popover" id="fa-pin-popover-${idx}" onclick="event.stopPropagation()">
          <div class="fa-pop-header">
            <span class="fa-pop-badge">Vị Trí Giải Phẫu #${idx + 1}</span>
            <button class="fa-pop-close" onclick="bioClosePopover(${idx}, event)" title="Đóng">✕</button>
          </div>
          <h4 class="fa-pop-title">${lm.name}</h4>
          <span class="fa-pop-latin">${lm.latin}</span>
          <p class="fa-pop-desc">${lm.desc}</p>
        </div>
      </div>
    `).join('');
  }

  window.bioClickPin = function (idx, event) {
    if (event) event.stopPropagation();

    if (activePinIdx === idx) {
      bioClosePopover(idx, event);
      return;
    }

    activePinIdx = idx;

    // Cập nhật trạng thái các pin trên mô hình
    document.querySelectorAll('.fa-pin-item').forEach((pin, i) => {
      if (i === idx) {
        pin.classList.add('active', 'show-popover');
      } else {
        pin.classList.remove('active', 'show-popover');
      }
    });

    // Đồng bộ highlight mục tương ứng trong Sidebar danh sách bên phải
    document.querySelectorAll('.fa-landmark-item').forEach((item, i) => {
      if (i === idx) {
        item.style.borderColor = '#8D7EF7';
        item.style.background = 'rgba(141, 126, 247, 0.12)';
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        item.style.borderColor = '';
        item.style.background = '';
      }
    });
  };

  window.bioClosePopover = function (idx, event) {
    if (event) event.stopPropagation();
    activePinIdx = null;

    const pin = document.getElementById(`fa-pin-${idx}`);
    if (pin) pin.classList.remove('show-popover', 'active');

    document.querySelectorAll('.fa-landmark-item').forEach(item => {
      item.style.borderColor = '';
      item.style.background = '';
    });
  };

  window.bioHighlightFromSidebar = function (idx) {
    // Nếu đang ẩn chú thích, tự động bật lên để người dùng quan sát được
    if (!showPins) {
      bioTogglePins();
    }
    bioClickPin(idx, null);
  };

  window.bioPreviewPin = function (idx) {
    const pin = document.getElementById(`fa-pin-${idx}`);
    if (pin && activePinIdx !== idx) {
      pin.classList.add('hover-preview');
    }
  };

  window.bioUnpreviewPin = function (idx) {
    const pin = document.getElementById(`fa-pin-${idx}`);
    if (pin && activePinIdx !== idx) {
      pin.classList.remove('hover-preview');
    }
  };

  window.bioTogglePins = function () {
    showPins = !showPins;
    const overlay = document.getElementById('fa-pins-overlay');
    if (overlay) {
      if (showPins) {
        overlay.classList.remove('hidden');
      } else {
        overlay.classList.add('hidden');
      }
    }

    // Cập nhật nút bấm
    const topBtn = document.getElementById('btn-toggle-pins-top');
    const overlayBtn = document.getElementById('btn-toggle-pins-overlay');

    if (topBtn) {
      topBtn.textContent = `🏷️ Điểm Ghim: ${showPins ? 'Bật' : 'Tắt'}`;
      topBtn.classList.toggle('active', showPins);
    }
    if (overlayBtn) {
      overlayBtn.textContent = showPins ? '📍 Ẩn Điểm Ghim' : '📍 Hiện Điểm Ghim';
      overlayBtn.classList.toggle('active', showPins);
    }
  };

  window.bioToggleTour = function () {
    const btn = document.getElementById('btn-tour-guide');
    if (isTouring) {
      // Dừng tour
      clearInterval(tourInterval);
      isTouring = false;
      if (btn) {
        btn.textContent = '▶️ Chỉ Điểm';
        btn.classList.remove('active');
      }
      activePinIdx = null;
      document.querySelectorAll('.fa-pin-item').forEach(p => p.classList.remove('active', 'show-popover'));
    } else {
      // Bắt đầu tour tự động
      isTouring = true;
      if (btn) {
        btn.textContent = '⏹️ Dừng Chỉ Điểm';
        btn.classList.add('active');
      }

      if (!showPins) bioTogglePins();

      const cur = ANATOMY_SYSTEMS[currentKey];
      let tourIdx = 0;
      bioClickPin(tourIdx, null);

      tourInterval = setInterval(() => {
        tourIdx = (tourIdx + 1) % cur.landmarks.length;
        bioClickPin(tourIdx, null);
      }, 3500);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     5. XỬ LÝ CHUYỂN ĐỔI MÔ HÌNH VÀ IFRAME 3D
  ───────────────────────────────────────────────────────────── */
  window.bioSelectModel = function (key) {
    if (!ANATOMY_SYSTEMS[key]) return;

    if (isTouring) {
      bioToggleTour(); // dừng tour đang chạy
    }

    currentKey = key;
    activePinIdx = null;
    const cur = ANATOMY_SYSTEMS[key];

    // Cập nhật navigation pills
    document.querySelectorAll('.fa-model-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`fa-nav-btn-${key}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Cập nhật thông tin Header Box
    const iconEl = document.getElementById('fa-active-icon');
    const nameEl = document.getElementById('fa-active-name');
    const latinEl = document.getElementById('fa-active-latin');
    const descEl = document.getElementById('fa-system-desc');

    if (iconEl) iconEl.textContent = cur.icon;
    if (nameEl) nameEl.textContent = cur.name;
    if (latinEl) latinEl.textContent = cur.latinName;
    if (descEl) descEl.textContent = cur.desc;

    // Cập nhật HUD Metrics
    const bpmEl = document.getElementById('fa-hud-bpm');
    const rrEl = document.getElementById('fa-hud-rr');
    const bpEl = document.getElementById('fa-hud-bp');
    const spo2El = document.getElementById('fa-hud-spo2');

    if (bpmEl) bpmEl.textContent = cur.bpm > 0 ? cur.bpm + ' BPM' : '68 BPM';
    if (rrEl) rrEl.textContent = cur.respRate > 0 ? cur.respRate + ' L/phút' : '16 L/phút';
    if (bpEl) bpEl.textContent = cur.bp;
    if (spo2El) spo2El.textContent = cur.spo2;

    // Hiển thị loader và nạp iframe 3D mới
    const loader = document.getElementById('fa-iframe-loader');
    const loaderText = document.getElementById('fa-loader-text');
    const iframe = document.getElementById('fa-3d-iframe');

    if (loader) {
      loader.classList.remove('hidden');
      if (loaderText) loaderText.textContent = `Đang tải mô hình: ${cur.name}...`;
    }

    if (iframe) {
      iframe.src = `https://sketchfab.com/models/${cur.modelId}/embed?autostart=1&ui_theme=dark&dnt=1&preload=1`;
      iframe.title = cur.name;
    }

    // Render lại lớp pins trực tiếp lên mô hình, danh mục và trắc nghiệm
    renderPinsOverlay();
    renderLandmarks();
    renderQuiz();
    renderClinical();
  };

  window.bioOnIframeLoaded = function () {
    const loader = document.getElementById('fa-iframe-loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 600);
    }
  };

  window.bioReloadModel = function () {
    const cur = ANATOMY_SYSTEMS[currentKey];
    const iframe = document.getElementById('fa-3d-iframe');
    const loader = document.getElementById('fa-iframe-loader');
    if (loader) loader.classList.remove('hidden');
    if (iframe && cur) {
      iframe.src = `https://sketchfab.com/models/${cur.modelId}/embed?autostart=1&ui_theme=dark&dnt=1&preload=1`;
    }
  };

  window.bioToggleFullscreen = function () {
    const viewportBox = document.getElementById('fa-3d-viewport-box');
    if (!viewportBox) return;

    if (!document.fullscreenElement) {
      if (viewportBox.requestFullscreen) {
        viewportBox.requestFullscreen();
      } else if (viewportBox.webkitRequestFullscreen) {
        viewportBox.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  /* ─────────────────────────────────────────────────────────────
     6. RENDER CHÚ THÍCH GIẢI PHẪU & TRẮC NGHIỆM FA QUIZ
  ───────────────────────────────────────────────────────────── */
  function renderLandmarks() {
    const list = document.getElementById('fa-landmarks-list');
    if (!list) return;

    const cur = ANATOMY_SYSTEMS[currentKey];
    list.innerHTML = cur.landmarks.map((lm, idx) => `
      <div class="fa-landmark-item" 
           id="fa-lm-item-${idx}" 
           onclick="bioHighlightFromSidebar(${idx})"
           onmouseenter="bioPreviewPin(${idx})"
           onmouseleave="bioUnpreviewPin(${idx})"
           style="cursor: pointer;">
        <div class="fa-landmark-head">
          <span class="fa-landmark-idx">${idx + 1}</span>
          <div class="fa-landmark-names">
            <strong>${lm.name}</strong>
            <span class="fa-latin-sub">${lm.latin}</span>
          </div>
          <span style="margin-left: auto; font-size: 0.72rem; color: #8D7EF7; font-weight: 700;">📍 Chỉ điểm</span>
        </div>
        <p class="fa-landmark-desc">${lm.desc}</p>
      </div>
    `).join('');
  }

  function renderClinical() {
    const list = document.getElementById('fa-clinical-list');
    if (!list) return;

    const cur = ANATOMY_SYSTEMS[currentKey];
    if (!cur.clinical || cur.clinical.length === 0) {
      list.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">Chưa có dữ liệu lâm sàng cho mô hình này.</p>';
      return;
    }

    list.innerHTML = cur.clinical.map(c => `
      <div class="fa-clinical-card">
        <h5>${c.title}</h5>
        <p>${c.content}</p>
      </div>
    `).join('');
  }

  function renderQuiz() {
    const container = document.getElementById('fa-quiz-container');
    if (!container) return;

    const cur = ANATOMY_SYSTEMS[currentKey];
    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = cur.quiz.map((qItem, qIdx) => `
      <div class="fa-quiz-item" id="fa-q-item-${qIdx}">
        <p class="fa-quiz-question"><strong>Câu ${qIdx + 1}:</strong> ${qItem.q}</p>
        <div class="fa-quiz-options">
          ${qItem.options.map((opt, optIdx) => `
            <button class="fa-quiz-opt" 
                    id="fa-opt-${qIdx}-${optIdx}"
                    onclick="bioAnswerQuiz(${qIdx}, ${optIdx})">
              <span class="fa-opt-letter">${letters[optIdx]}</span>
              <span class="fa-opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>
        <div class="fa-quiz-explain" id="fa-explain-${qIdx}" style="display: none;"></div>
      </div>
    `).join('');
  }

  window.bioAnswerQuiz = function (qIdx, optIdx) {
    const cur = ANATOMY_SYSTEMS[currentKey];
    const qItem = cur.quiz[qIdx];
    if (!qItem) return;

    // Vô hiệu hóa các nút trong câu này
    const opts = document.querySelectorAll(`[id^="fa-opt-${qIdx}-"]`);
    opts.forEach(btn => btn.disabled = true);

    const isCorrect = (optIdx === qItem.correct);
    const selectedBtn = document.getElementById(`fa-opt-${qIdx}-${optIdx}`);
    const correctBtn = document.getElementById(`fa-opt-${qIdx}-${qItem.correct}`);

    if (selectedBtn) {
      selectedBtn.classList.add(isCorrect ? 'correct' : 'wrong');
    }
    if (!isCorrect && correctBtn) {
      correctBtn.classList.add('correct');
    }

    // Hiển thị giải thích y lý
    const expBox = document.getElementById(`fa-explain-${qIdx}`);
    if (expBox) {
      expBox.style.display = 'block';
      expBox.className = `fa-quiz-explain ${isCorrect ? 'exp-correct' : 'exp-wrong'}`;
      expBox.innerHTML = `
        <strong>${isCorrect ? '✅ Chính xác!' : '❌ Chưa chính xác!'}</strong>
        <p>${qItem.explain}</p>
      `;
    }
  };

  window.bioSwitchSidebarTab = function (tabName) {
    document.querySelectorAll('.fa-s-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.fa-sidebar-panel').forEach(p => p.classList.remove('active'));

    const tabBtn = document.getElementById(`tab-btn-${tabName}`);
    const panel = document.getElementById(`panel-${tabName}`);

    if (tabBtn) tabBtn.classList.add('active');
    if (panel) panel.classList.add('active');
  };

  /* ─────────────────────────────────────────────────────────────
     7. MÔ PHỎNG ĐIỆN TÂM ĐỒ ECG THỜI GIAN THỰC (60 FPS MONITOR)
  ───────────────────────────────────────────────────────────── */
  function startECGMonitor() {
    const ecgCanvas = document.getElementById('fa-ecg-canvas');
    if (!ecgCanvas) return;
    const ctx = ecgCanvas.getContext('2d');
    const width = ecgCanvas.width;
    const height = ecgCanvas.height;
    const midY = height / 2;

    if (ecgAnimId) cancelAnimationFrame(ecgAnimId);

    function getECGVoltage(t) {
      const cycle = t % 1.0;
      if (cycle < 0.1) return 0;
      if (cycle >= 0.12 && cycle <= 0.22) {
        return 4 * Math.sin(((cycle - 0.12) / 0.10) * Math.PI);
      }
      if (cycle < 0.3) return 0;
      if (cycle >= 0.30 && cycle < 0.33) {
        return -3 * Math.sin(((cycle - 0.30) / 0.03) * Math.PI);
      }
      if (cycle >= 0.33 && cycle <= 0.38) {
        return 14 * Math.sin(((cycle - 0.33) / 0.05) * Math.PI);
      }
      if (cycle > 0.38 && cycle <= 0.42) {
        return -5 * Math.sin(((cycle - 0.38) / 0.04) * Math.PI);
      }
      if (cycle < 0.5) return 0;
      if (cycle >= 0.52 && cycle <= 0.70) {
        return 6 * Math.sin(((cycle - 0.52) / 0.18) * Math.PI);
      }
      return 0;
    }

    const maxPoints = Math.floor(width / 2);
    ecgPoints = [];
    for (let i = 0; i < maxPoints; i++) {
      ecgPoints.push(midY);
    }

    let t = 0;
    const speed = 0.022;

    function renderECG() {
      t += speed;
      const v = getECGVoltage(t);
      ecgPoints.push(midY - v);
      if (ecgPoints.length > maxPoints) {
        ecgPoints.shift();
      }

      ctx.clearRect(0, 0, width, height);

      // Lưới monitor y tế
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.12)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 15) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Đường sóng ECG xanh neon
      ctx.beginPath();
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 6;

      for (let i = 0; i < ecgPoints.length; i++) {
        const x = i * 2;
        const y = ecgPoints[i];
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Điểm quét đầu sóng
      const lastX = (ecgPoints.length - 1) * 2;
      const lastY = ecgPoints[ecgPoints.length - 1];
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ecgAnimId = requestAnimationFrame(renderECG);
    }

    renderECG();
  }

  /* ─────────────────────────────────────────────────────────────
     8. KHỞI TẠO KHI TẢI TRANG
  ───────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildBioUI();

    // Hỗ trợ resize & chuyển tab thí nghiệm
    window.addEventListener('resize', () => {
      const ecgCanvas = document.getElementById('fa-ecg-canvas');
      if (ecgCanvas && ecgCanvas.offsetParent !== null) {
        startECGMonitor();
      }
    });
  });

})();
