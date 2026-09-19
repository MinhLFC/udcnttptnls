/**
 * LAB-PLICKERS.JS - HỆ THỐNG TRẮC NGHIỆM TƯƠNG TÁC PLICKERS KHTN (6, 7, 8, 9)
 * Website cá nhân: Đỗ Văn Nhật Minh - Khoa Hóa học, ĐH Sư phạm TP.HCM (HCMUE)
 * Chuẩn chương trình GDPT 2018 - Tích hợp 3 phân môn: Hóa học, Vật lí, Sinh học
 * Nguồn tư liệu tham khảo: VietJack, Loigiaihay, Tailieuhay, SGK KHTN 6, 7, 8, 9
 */

(function() {
  'use strict';

  // ==========================================
  // 1. NGÂN HÀNG CÂU HỎI KHTN TÍCH HỢP (60 CÂU)
  // ==========================================
  const KHTN_QUESTIONS = [
    // ------------------------------------------
    // KHỐI 6 (15 CÂU: 5 HÓA - 5 LÝ - 5 SINH)
    // ------------------------------------------
    {
      id: 'k6_chem_1',
      grade: 6,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Các thể của chất',
      question: 'Quá trình một chất chuyển từ thể lỏng sang thể hơi (khí) ở bề mặt thoáng được gọi là gì?',
      options: ['Sự đông đặc', 'Sự ngưng tụ', 'Sự bay hơi', 'Sự nóng chảy'],
      correct: 2,
      explanation: 'Sự bay hơi là quá trình chuyển từ thể lỏng sang thể khí diễn ra trên bề mặt thoáng của chất lỏng.'
    },
    {
      id: 'k6_chem_2',
      grade: 6,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Oxygen & Không khí',
      question: 'Trong không khí khô sạch gần mặt đất, khí nào chiếm thể tích lớn nhất (khoảng 78%)?',
      options: ['Khí Oxygen (O<sub>2</sub>)', 'Khí Nitrogen (N<sub>2</sub>)', 'Khí Carbon dioxide (CO<sub>2</sub>)', 'Khí Argon (Ar)'],
      correct: 1,
      explanation: 'Không khí bao gồm khoảng 78% thể tích là khí Nitrogen (N<sub>2</sub>), 21% là Oxygen (O<sub>2</sub>), 1% còn lại là CO<sub>2</sub>, hơi nước và khí hiếm.'
    },
    {
      id: 'k6_chem_3',
      grade: 6,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Tách chất khỏi hỗn hợp',
      question: 'Phương pháp nào sau đây thích hợp nhất để tách muối ăn (NaCl) hòa tan ra khỏi nước biển?',
      options: ['Phương pháp lọc', 'Phương pháp cô cạn', 'Phương pháp chiết', 'Dùng nam châm hút'],
      correct: 1,
      explanation: 'Muối ăn tan trong nước và không bị bay hơi ở nhiệt độ sôi của nước, do đó dùng phương pháp cô cạn (đun nóng làm nước bay hơi) thu được muối ăn kết tinh.'
    },
    {
      id: 'k6_chem_4',
      grade: 6,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Hỗn hợp & Dung dịch',
      question: 'Hỗn hợp gồm các hạt chất rắn lơ lửng, không tan trong môi trường chất lỏng được gọi là gì?',
      options: ['Dung dịch', 'Huyền phù', 'Nhũ tương', 'Chất tinh khiết'],
      correct: 1,
      explanation: 'Huyền phù là hỗn hợp không đồng nhất gồm các hạt chất rắn phân tán lơ lửng trong môi trường chất lỏng (ví dụ: nước phù sa, bùn trong nước).'
    },
    {
      id: 'k6_chem_5',
      grade: 6,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Nhiên liệu & Năng lượng',
      question: 'Nhiên liệu nào sau đây là nhiên liệu hóa thạch, không tái tạo và gây ô nhiễm môi trường khi đốt cháy?',
      options: ['Củi khô', 'Khí biogas', 'Than đá', 'Cồn sinh học (Ethanol)'],
      correct: 2,
      explanation: 'Than đá, dầu mỏ và khí thiên nhiên là các nhiên liệu hóa thạch được hình thành từ hàng triệu năm trước và không thể tái tạo trong thời gian ngắn.'
    },
    {
      id: 'k6_phys_1',
      grade: 6,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Các phép đo',
      question: 'Đơn vị đo khối lượng hợp pháp trong Hệ đơn vị đo lường quốc tế (SI) là gì?',
      options: ['Gam (g)', 'Tấn (t)', 'Kilôgam (kg)', 'Miligam (mg)'],
      correct: 2,
      explanation: 'Kilôgam (kí hiệu là kg) là đơn vị đo khối lượng chuẩn trong hệ thống đo lường quốc tế SI.'
    },
    {
      id: 'k6_phys_2',
      grade: 6,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Lực & Trọng lực',
      question: 'Khi một quả táo trên cây rụng rơi thẳng đứng xuống mặt đất, quả táo chịu tác dụng chủ yếu của lực nào?',
      options: ['Lực ma sát', 'Trọng lực (lực hút của Trái Đất)', 'Lực nâng của không khí', 'Lực đàn hồi'],
      correct: 1,
      explanation: 'Trọng lực là lực hút của Trái Đất tác dụng lên mọi vật thể, có phương thẳng đứng và chiều từ trên xuống dưới.'
    },
    {
      id: 'k6_phys_3',
      grade: 6,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Lực ma sát',
      question: 'Khi ta bóp phanh xe đạp đang chạy, lực nào xuất hiện giữa má phanh và vành bánh xe giúp xe giảm tốc độ?',
      options: ['Lực ma sát trượt', 'Lực ma sát nghỉ', 'Lực đàn hồi', 'Lực đẩy Archimedes'],
      correct: 0,
      explanation: 'Lực ma sát trượt xuất hiện khi má phanh trượt trên bề mặt vành xe, cản trở chuyển động quay của bánh xe.'
    },
    {
      id: 'k6_phys_4',
      grade: 6,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Năng lượng tái tạo',
      question: 'Nguồn năng lượng nào sau đây là nguồn năng lượng tái tạo, thân thiện với môi trường?',
      options: ['Than đá', 'Khí tự nhiên', 'Năng lượng gió', 'Dầu mỏ'],
      correct: 2,
      explanation: 'Năng lượng gió, năng lượng mặt trời, thủy triều và địa nhiệt là những nguồn năng lượng tái tạo liên tục và vô tận trong tự nhiên.'
    },
    {
      id: 'k6_phys_5',
      grade: 6,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Lực tiếp xúc',
      question: 'Trường hợp nào sau đây xuất hiện lực tiếp xúc?',
      options: ['Hai cực cùng tên của hai thanh nam châm đẩy nhau', 'Trái Đất quay quanh Mặt Trời', 'Tay người kéo dãn một chiếc lò xo', 'Thanh nhựa nhiễm điện hút mẩu giấy vụn'],
      correct: 2,
      explanation: 'Lực tiếp xúc xuất hiện khi vật gây ra lực tiếp xúc trực tiếp lên vật chịu tác dụng của lực (tay chạm vào kéo lò xo).'
    },
    {
      id: 'k6_bio_1',
      grade: 6,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Cấu tạo tế bào',
      question: 'Thành phần nào được xem là "trung tâm điều khiển" mọi hoạt động sống bên trong tế bào?',
      options: ['Màng tế bào', 'Chất tế bào', 'Nhân tế bào (hoặc vùng nhân)', 'Không bào'],
      correct: 2,
      explanation: 'Nhân tế bào chứa vật chất di truyền (DNA), đóng vai trò điều khiển mọi quá trình trao đổi chất và hoạt động sống của tế bào.'
    },
    {
      id: 'k6_bio_2',
      grade: 6,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Tế bào thực vật',
      question: 'Bào quan nào chỉ có ở tế bào thực vật giúp thực hiện chức năng quang hợp mà không có ở tế bào động vật?',
      options: ['Ti thể', 'Lục lạp', 'Ribosome', 'Lưới nội chất'],
      correct: 1,
      explanation: 'Lục lạp chứa sắc tố diệp lục, giúp hấp thụ ánh sáng mặt trời để thực hiện quang hợp tổng hợp chất hữu cơ ở thực vật.'
    },
    {
      id: 'k6_bio_3',
      grade: 6,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Cơ thể đơn bào',
      question: 'Sinh vật nào sau đây là cơ thể đơn bào (cơ thể chỉ được cấu tạo từ một tế bào duy nhất)?',
      options: ['Cây bàng', 'Trùng giày (Paramecium)', 'Con giun đất', 'Cây dương xỉ'],
      correct: 1,
      explanation: 'Trùng giày, trùng roi, amip, vi khuẩn là các sinh vật đơn bào mà toàn bộ cơ thể chỉ là một tế bào hoàn chỉnh.'
    },
    {
      id: 'k6_bio_4',
      grade: 6,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Phân loại thế giới sống',
      question: 'Đơn vị cơ bản và nhỏ nhất trong thang phân loại bậc sinh học theo hệ thống phân loại Linnaeus là gì?',
      options: ['Bộ (Order)', 'Họ (Family)', 'Chi/Giống (Genus)', 'Loài (Species)'],
      correct: 3,
      explanation: 'Thứ bậc phân loại từ lớn đến nhỏ: Giới → Ngành → Lớp → Bộ → Họ → Chi/Giống → Loài. Loài là bậc phân loại cơ bản nhất.'
    },
    {
      id: 'k6_bio_5',
      grade: 6,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Nấm & Đời sống',
      question: 'Nấm men (yeast) được con người ứng dụng phổ biến và rộng rãi nhất trong lĩnh vực nào sau đây?',
      options: ['Sản xuất bánh mì và ủ bia rượu', 'Xử lý rác thải nhựa', 'Sản xuất phân bón hóa học', 'Lọc sạch nước biển'],
      correct: 0,
      explanation: 'Nấm men lên men đường kị khí tạo ra ethanol và khí CO<sub>2</sub>, làm nở bột bánh mì và sản xuất bia, rượu vang.'
    },

    // ------------------------------------------
    // KHỐI 7 (15 CÂU: 5 HÓA - 5 LÝ - 5 SINH)
    // ------------------------------------------
    {
      id: 'k7_chem_1',
      grade: 7,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Cấu tạo nguyên tử',
      question: 'Trong cấu tạo nguyên tử, loại hạt nào mang điện tích dương và nằm bên trong hạt nhân?',
      options: ['Electron (e)', 'Proton (p)', 'Neutron (n)', 'Quark'],
      correct: 1,
      explanation: 'Hạt nhân nguyên tử gồm hạt proton mang điện tích dương (+1) và hạt neutron không mang điện. Vỏ nguyên tử chứa các hạt electron mang điện tích âm (-1).'
    },
    {
      id: 'k7_chem_2',
      grade: 7,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Bảng tuần hoàn',
      question: 'Trong Bảng tuần hoàn các nguyên tố hóa học, các nguyên tố nằm trong cùng một chu kì có đặc điểm gì chung?',
      options: ['Có cùng số electron ở lớp ngoài cùng', 'Có cùng số lớp electron trong nguyên tử', 'Có cùng khối lượng nguyên tử', 'Có cùng tính chất hóa học'],
      correct: 1,
      explanation: 'Số thứ tự của chu kì trong Bảng tuần hoàn chính bằng số lớp electron của nguyên tử các nguyên tố thuộc chu kì đó.'
    },
    {
      id: 'k7_chem_3',
      grade: 7,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Đơn chất & Hợp chất',
      question: 'Chất nào sau đây là hợp chất (được tạo nên từ hai nguyên tố hóa học trở lên)?',
      options: ['Khí Oxygen (O<sub>2</sub>)', 'Kim loại Sắt (Fe)', 'Nước cất (H<sub>2</sub>O)', 'Khí Ozone (O<sub>3</sub>)'],
      correct: 2,
      explanation: 'Nước (H<sub>2</sub>O) được cấu tạo từ 2 nguyên tố hóa học là Hydrogen (H) và Oxygen (O) nên là hợp chất. Các chất còn lại chỉ tạo từ 1 nguyên tố nên là đơn chất.'
    },
    {
      id: 'k7_chem_4',
      grade: 7,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Liên kết ion',
      question: 'Liên kết hóa học hình thành do lực hút tĩnh điện giữa các ion mang điện tích trái dấu được gọi là gì?',
      options: ['Liên kết cộng hóa trị', 'Liên kết ion', 'Liên kết kim loại', 'Liên kết hydrogen'],
      correct: 1,
      explanation: 'Liên kết ion là liên kết được tạo thành bởi lực hút tĩnh điện giữa cation (ion dương, thường là kim loại) và anion (ion âm, phi kim), ví dụ NaCl.'
    },
    {
      id: 'k7_chem_5',
      grade: 7,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Hóa trị & Lập CTHH',
      question: 'Trong hợp chất Nhôm oxide Al<sub>2</sub>O<sub>3</sub>, biết Oxygen luôn có hóa trị II, hóa trị của Aluminium (Al) là bao nhiêu?',
      options: ['Hóa trị I', 'Hóa trị II', 'Hóa trị III', 'Hóa trị IV'],
      correct: 2,
      explanation: 'Theo quy tắc hóa trị: 2 × a = 3 × II ⇒ a = (3 × 2) / 2 = III. Vậy Al có hóa trị III.'
    },
    {
      id: 'k7_phys_1',
      grade: 7,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Tốc độ chuyển động',
      question: 'Công thức toán học dùng để tính tốc độ chuyển động của một vật là gì?',
      options: ['v = s / t', 'v = s × t', 'v = t / s', 'v = s + t'],
      correct: 0,
      explanation: 'Tốc độ chuyển động (v) bằng quãng đường đi được (s) chia cho thời gian chuyển động (t): v = s / t.'
    },
    {
      id: 'k7_phys_2',
      grade: 7,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Đồ thị s - t',
      question: 'Trên đồ thị quãng đường - thời gian (s - t), đoạn đồ thị nằm ngang song song với trục thời gian biểu diễn trạng thái nào của vật?',
      options: ['Vật chuyển động nhanh dần', 'Vật chuyển động đều', 'Vật đang đứng yên', 'Vật chuyển động chậm dần'],
      correct: 2,
      explanation: 'Khi thời gian trôi qua mà quãng đường s không thay đổi (đoạn đồ thị nằm ngang song song trục Ot), vật đó đang ở trạng thái đứng yên.'
    },
    {
      id: 'k7_phys_3',
      grade: 7,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Sóng âm & Độ to',
      question: 'Độ to của âm nghe được gắn liền với đại lượng vật lí nào của nguồn âm?',
      options: ['Tần số dao động', 'Biên độ dao động', 'Vận tốc truyền âm', 'Màu sắc nguồn âm'],
      correct: 1,
      explanation: 'Biên độ dao động của nguồn âm càng lớn thì âm phát ra càng to. Trong khi đó, tần số dao động quyết định độ cao (bổng/trầm) của âm.'
    },
    {
      id: 'k7_phys_4',
      grade: 7,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Phản xạ ánh sáng',
      question: 'Theo định luật phản xạ ánh sáng, nếu góc tới i = 40° thì góc phản xạ i\' có giá trị bằng bao nhiêu?',
      options: ['20°', '40°', '50°', '80°'],
      correct: 1,
      explanation: 'Theo định luật phản xạ ánh sáng: Góc phản xạ luôn luôn bằng góc tới (i\' = i). Do đó khi i = 40° thì i\' = 40°.'
    },
    {
      id: 'k7_phys_5',
      grade: 7,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Từ trường',
      question: 'Khi đặt hai cực cùng tên của hai thanh nam châm lại gần nhau thì chúng sẽ có hiện tượng gì?',
      options: ['Hút nhau mạnh', 'Đẩy nhau', 'Không có hiện tượng gì', 'Vừa hút vừa đẩy'],
      correct: 1,
      explanation: 'Quy tắc tương tác từ: Hai cực cùng tên (Bắc - Bắc hoặc Nam - Nam) thì đẩy nhau; hai cực khác tên (Bắc - Nam) thì hút nhau.'
    },
    {
      id: 'k7_bio_1',
      grade: 7,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Quang hợp',
      question: 'Sản phẩm chủ yếu tạo thành từ quá trình quang hợp ở lá cây xanh là gì?',
      options: ['Chất hữu cơ (Glucose) và khí Oxygen', 'Khí Carbon dioxide và nước', 'Khí Nitrogen và tinh bột', 'Khoáng chất và khí CO<sub>2</sub>'],
      correct: 0,
      explanation: 'Phương trình quang hợp: Nước + Carbon dioxide + Ánh sáng mặt trời → Glucose (chất hữu cơ) + Oxygen (O<sub>2</sub>).'
    },
    {
      id: 'k7_bio_2',
      grade: 7,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Hô hấp tế bào',
      question: 'Khí nào được tế bào sinh vật lấy vào để thực hiện quá trình hô hấp tế bào giải phóng năng lượng?',
      options: ['Khí Nitrogen (N<sub>2</sub>)', 'Khí Carbon dioxide (CO<sub>2</sub>)', 'Khí Oxygen (O<sub>2</sub>)', 'Khí Hydrogen (H<sub>2</sub>)'],
      correct: 2,
      explanation: 'Hô hấp tế bào là quá trình phân giải chất hữu cơ với sự tham gia của khí Oxygen (O<sub>2</sub>) tạo ra năng lượng ATP cung cấp cho cơ thể sống.'
    },
    {
      id: 'k7_bio_3',
      grade: 7,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Thoát hơi nước',
      question: 'Ở lá cây, phần lớn lượng nước hút từ rễ được thoát ra ngoài khí quyển qua cơ quan nào?',
      options: ['Mạch gỗ', 'Khí khổng ở biểu bì lá', 'Lớp cutin trên bề mặt', 'Gân lá'],
      correct: 1,
      explanation: 'Khoảng 90% lượng nước thoát ra ngoài qua các lỗ khí khổng trên bề mặt lá, tạo động lực kéo dòng nước và muối khoáng từ rễ lên.'
    },
    {
      id: 'k7_bio_4',
      grade: 7,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Cảm ứng ở sinh vật',
      question: 'Hiện tượng ngọn cây luôn có xu hướng vươn và nghiêng mình về phía có nguồn ánh sáng được gọi là gì?',
      options: ['Tính hướng hóa', 'Tính hướng trọng lực', 'Tính hướng sáng', 'Tính hướng tiếp xúc'],
      correct: 2,
      explanation: 'Tính hướng sáng là phản ứng sinh trưởng của thân và cành cây về phía có nguồn kích thích ánh sáng để tối ưu quang hợp.'
    },
    {
      id: 'k7_bio_5',
      grade: 7,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Trao đổi chất',
      question: 'Mạch rây trong thân cây có chức năng chủ yếu là vận chuyển chất gì?',
      options: ['Nước và muối khoáng từ rễ lên lá', 'Các chất hữu cơ tổng hợp từ lá đến các bộ phận khác', 'Khí oxygen từ lá xuống rễ', 'Nhiệt lượng từ thân ra ngoài'],
      correct: 1,
      explanation: 'Mạch gỗ vận chuyển nước và khoáng hòa tan từ rễ lên các cơ quan trên; mạch rây vận chuyển chất hữu cơ từ lá đến nơi sử dụng hoặc dự trữ.'
    },

    // ------------------------------------------
    // KHỐI 8 (15 CÂU: 5 HÓA - 5 LÝ - 5 SINH)
    // ------------------------------------------
    {
      id: 'k8_chem_1',
      grade: 8,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Biến đổi hóa học',
      question: 'Hiện tượng nào sau đây là hiện tượng hóa học (có sự tạo thành chất mới)?',
      options: ['Nước lỏng đóng băng thành nước đá', 'Hòa tan đường vào nước tạo nước đường', 'Thanh đinh sắt để ngoài không khí ẩm bị gỉ sét', 'Cồn etylic mở nắp bị bay hơi dần'],
      correct: 2,
      explanation: 'Đinh sắt bị gỉ tạo thành chất mới là rỉ sắt (sắt oxide ngậm nước), đây là hiện tượng hóa học. Các hiện tượng còn lại chỉ là biến đổi vật lí về thể hoặc hòa tan.'
    },
    {
      id: 'k8_chem_2',
      grade: 8,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Định luật bảo toàn khối lượng',
      question: 'Đốt cháy hoàn toàn m gam bột Magie (Mg) trong 3,2 gam khí Oxygen thu được 8,0 gam Magie oxide (MgO). Giá trị của m là:',
      options: ['2,4 gam', '4,8 gam', '11,2 gam', '5,6 gam'],
      correct: 1,
      explanation: 'Theo ĐL Bảo toàn khối lượng: m<sub>Mg</sub> + m<sub>O2</sub> = m<sub>MgO</sub> ⇒ m = 8,0 - 3,2 = 4,8 gam.'
    },
    {
      id: 'k8_chem_3',
      grade: 8,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Mol & Thể tích khí',
      question: 'Ở điều kiện chuẩn (nhiệt độ 25°C và áp suất 1 bar), 1 mol của bất kì chất khí nào đều chiếm thể tích bằng bao nhiêu?',
      options: ['22,4 lít', '24,79 lít', '22,7 lít', '24,0 lít'],
      correct: 1,
      explanation: 'Theo chương trình GDPT 2018 (chuẩn IUPAC mới: 25°C, 1 bar), thể tích mol của chất khí ở điều kiện chuẩn là 24,79 lít (khác với chuẩn cũ 0°C, 1 atm là 22,4 lít).'
    },
    {
      id: 'k8_chem_4',
      grade: 8,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Acid - Base & pH',
      question: 'Dung dịch nào sau đây có giá trị pH nhỏ hơn 7 và làm giấy quỳ tím đổi thành màu đỏ?',
      options: ['Dung dịch Natri hiđroxit (NaOH)', 'Dung dịch Axit clohiđric (HCl)', 'Dung dịch Muối ăn (NaCl)', 'Nước vôi trong Ca(OH)<sub>2</sub>'],
      correct: 1,
      explanation: 'Dung dịch acid (như HCl, H<sub>2</sub>SO<sub>4</sub>) có pH < 7 và làm quỳ tím chuyển sang màu đỏ. Dung dịch base có pH > 7 làm quỳ tím chuyển xanh.'
    },
    {
      id: 'k8_chem_5',
      grade: 8,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Phân bón hóa học',
      question: 'Phân đạm (như urê CO(NH<sub>2</sub>)<sub>2</sub>) cung cấp nguyên tố dinh dưỡng khoáng nào chủ yếu cho cây trồng phát triển thân, lá?',
      options: ['Phosphorus (P)', 'Potassium (K)', 'Nitrogen (N)', 'Calcium (Ca)'],
      correct: 2,
      explanation: 'Phân đạm cung cấp nguyên tố Nitrogen (N), kích thích cây phát triển lá và chồi; phân lân cung cấp Phosphorus (P); phân kali cung cấp Potassium (K).'
    },
    {
      id: 'k8_phys_1',
      grade: 8,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Khối lượng riêng',
      question: 'Công thức dùng để tính khối lượng riêng D của một chất có khối lượng m và thể tích V là gì?',
      options: ['D = m × V', 'D = m / V', 'D = V / m', 'D = m + V'],
      correct: 1,
      explanation: 'Khối lượng riêng D là khối lượng của một đơn vị thể tích chất đó: D = m / V (đơn vị kg/m³).'
    },
    {
      id: 'k8_phys_2',
      grade: 8,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Áp suất',
      question: 'Đơn vị đo chuẩn của áp suất trong Hệ đo lường quốc tế (SI) được đặt theo tên nhà bác học nào?',
      options: ['Newton (N)', 'Joule (J)', 'Pascal (Pa)', 'Watt (W)'],
      correct: 2,
      explanation: 'Đơn vị đo áp suất là Pascal (Pa), với 1 Pa = 1 N/m².'
    },
    {
      id: 'k8_phys_3',
      grade: 8,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Lực đẩy Archimedes',
      question: 'Lực đẩy Archimedes tác dụng lên một vật nhúng chìm hoàn toàn trong lòng chất lỏng phụ thuộc vào hai yếu tố nào?',
      options: ['Khối lượng của vật và nhiệt độ', 'Trọng lượng riêng của chất lỏng và thể tích phần chất lỏng bị vật chiếm chỗ', 'Độ sâu của vật và hình dạng vật', 'Chất liệu làm nên vật và áp suất'],
      correct: 1,
      explanation: 'Công thức F<sub>A</sub> = d × V, trong đó d là trọng lượng riêng của chất lỏng và V là thể tích phần chất lỏng bị vật chiếm chỗ.'
    },
    {
      id: 'k8_phys_4',
      grade: 8,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Đòn bẩy',
      question: 'Dụng cụ nào dưới đây là ứng dụng của đòn bẩy có điểm tựa nằm giữa điểm đặt lực tác dụng và vật?',
      options: ['Chiếc kéo cắt giấy', 'Cái xe cút kít', 'Cái kẹp gắp đá', 'Cần câu cá'],
      correct: 0,
      explanation: 'Cái kéo cắt giấy, bập bênh, kìm nhổ đinh là đòn bẩy loại 1 với điểm tựa (trục quay) nằm ở giữa lực tác dụng và lực cản của vật.'
    },
    {
      id: 'k8_phys_5',
      grade: 8,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Dòng điện',
      question: 'Theo quy ước, chiều của dòng điện chạy trong mạch điện kín có chiều đi như thế nào?',
      options: ['Từ cực âm qua dây dẫn và thiết bị đến cực dương', 'Từ cực dương qua dây dẫn và thiết bị điện đến cực âm', 'Chiều chuyển động của các hạt electron tự do', 'Không có chiều cố định'],
      correct: 1,
      explanation: 'Quy ước: Chiều dòng điện là chiều từ cực dương qua dây dẫn và các dụng cụ điện tới cực âm của nguồn điện (ngược chiều chuyển động của dòng electron).'
    },
    {
      id: 'k8_bio_1',
      grade: 8,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Hệ tuần hoàn & Máu',
      question: 'Thành phần tế bào máu nào đóng vai trò vận chuyển khí Oxygen (O<sub>2</sub>) từ phổi đến các tế bào cơ thể?',
      options: ['Bạch cầu', 'Huyết tương', 'Hồng cầu', 'Tiểu cầu'],
      correct: 2,
      explanation: 'Hồng cầu chứa huyết sắc tố hemoglobin (Hb) có khả năng kết hợp thuận nghịch với O<sub>2</sub> để vận chuyển khí nuôi cơ thể.'
    },
    {
      id: 'k8_bio_2',
      grade: 8,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Hệ tiêu hóa',
      question: 'Cơ quan nào trong ống tiêu hóa của người là nơi diễn ra quá trình tiêu hóa hóa học và hấp thụ chất dinh dưỡng chủ yếu nhất?',
      options: ['Dạ dày', 'Ruột non', 'Ruột già', 'Thực quản'],
      correct: 1,
      explanation: 'Ruột non có diện tích bề mặt rất lớn nhờ các nếp gấp và lông ruột, là nơi diễn ra triệt để quá trình tiêu hóa và hấp thu hơn 90% chất dinh dưỡng.'
    },
    {
      id: 'k8_bio_3',
      grade: 8,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Hệ hô hấp',
      question: 'Nơi diễn ra sự trao đổi khí O<sub>2</sub> và CO<sub>2</sub> giữa máu và không khí bên trong phổi người là gì?',
      options: ['Khí quản', 'Phế quản', 'Các phế nang (túi khí)', 'Thanh quản'],
      correct: 2,
      explanation: 'Các phế nang được bao bọc bởi mạng lưới mao mạch máu dày đặc, tại đây khí O<sub>2</sub> khuếch tán vào máu và CO<sub>2</sub> khuếch tán ra lòng phế nang.'
    },
    {
      id: 'k8_bio_4',
      grade: 8,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Hệ nội tiết',
      question: 'Tuyến nội tiết nào tiết ra hormone insulin giúp chuyển hóa glucose và hạ đường huyết trong máu?',
      options: ['Tuyến giáp', 'Tuyến tụy (đảo tụy)', 'Tuyến trên thận', 'Tuyến yên'],
      correct: 1,
      explanation: 'Các tế bào beta ở đảo tụy (thuộc tuyến tụy) tiết ra insulin giúp chuyển hóa glucose thừa thành glycogen dự trữ ở gan, làm hạ đường huyết.'
    },
    {
      id: 'k8_bio_5',
      grade: 8,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Hệ bài tiết',
      question: 'Đơn vị chức năng cơ bản của thận người chịu trách nhiệm lọc máu tạo thành nước tiểu được gọi là gì?',
      options: ['Nephron', 'Nơron', 'Alveoli', 'Hạch bạch huyết'],
      correct: 0,
      explanation: 'Mỗi quả thận chứa khoảng 1 triệu nephron (đơn vị chức năng thận), gồm cầu thận, nang cầu thận và ống thận thực hiện lọc máu và bài tiết nước tiểu.'
    },

    // ------------------------------------------
    // KHỐI 9 (15 CÂU: 5 HÓA - 5 LÝ - 5 SINH)
    // ------------------------------------------
    {
      id: 'k9_chem_1',
      grade: 9,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Dãy hoạt động kim loại',
      question: 'Trong dãy hoạt động hóa học của kim loại (K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au), kim loại nào phản ứng mãnh liệt với nước ở nhiệt độ thường?',
      options: ['Đồng (Cu)', 'Sắt (Fe)', 'Potassium (K)', 'Nhôm (Al)'],
      correct: 2,
      explanation: 'Các kim loại đứng đầu dãy hoạt động (K, Na, Ca, Ba) phản ứng rất mãnh liệt với nước ở điều kiện thường tạo thành dung dịch kiềm và giải phóng khí H<sub>2</sub>.'
    },
    {
      id: 'k9_chem_2',
      grade: 9,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Phi kim & Carbon',
      question: 'Dạng thù hình nào của nguyên tố Carbon (C) có độ cứng cao nhất trong tự nhiên và được dùng làm mũi khoan, dao cắt kính?',
      options: ['Than chì', 'Than hoạt tính', 'Kim cương', 'Carbon vô định hình'],
      correct: 2,
      explanation: 'Kim cương có cấu trúc mạng tinh thể tứ diện bền vững với liên kết cộng hóa trị chặt chẽ, là chất tự nhiên cứng nhất đã biết.'
    },
    {
      id: 'k9_chem_3',
      grade: 9,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Hydrocarbon',
      question: 'Khí biogas (khí sinh học) sinh ra từ hầm ủ chất thải hữu cơ và phân gia súc có thành phần chính là khí nào?',
      options: ['Metan (CH<sub>4</sub>)', 'Etilen (C<sub>2</sub>H<sub>4</sub>)', 'Axetilen (C<sub>2</sub>H<sub>2</sub>)', 'Cacbon monoxit (CO)'],
      correct: 0,
      explanation: 'Khí metan (CH<sub>4</sub>) chiếm từ 50 - 70% thành phần của khí biogas, là nhiên liệu đốt sạch và hiệu quả cho nông thôn.'
    },
    {
      id: 'k9_chem_4',
      grade: 9,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Axit hữu cơ',
      question: 'Chất nào sau đây có trong giấm ăn (khoảng 2 - 5%) và có khả năng làm quỳ tím hóa đỏ, tác dụng với Na<sub>2</sub>CO<sub>3</sub> giải phóng CO<sub>2</sub>?',
      options: ['Rượu etylic (C<sub>2</sub>H<sub>5</sub>OH)', 'Axit axetic (CH<sub>3</sub>COOH)', 'Glucose (C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>)', 'Metanol (CH<sub>3</sub>OH)'],
      correct: 1,
      explanation: 'Axit axetic (CH<sub>3</sub>COOH) là một axit hữu cơ có tính axit yếu, là thành phần chính tạo vị chua của giấm ăn.'
    },
    {
      id: 'k9_chem_5',
      grade: 9,
      subject: 'chemistry',
      subjectName: 'Hóa học',
      topic: 'Polymer',
      question: 'Polymer tự nhiên nào sau đây được tổng hợp qua quá trình quang hợp ở thực vật và là nguồn lương thực chính của con người?',
      options: ['Polyethylene (PE)', 'Cao su lưu hóa', 'Tinh bột (C<sub>6</sub>H<sub>10</sub>O<sub>5</sub>)<sub>n</sub>', 'Tơ nilon-6,6'],
      correct: 2,
      explanation: 'Tinh bột là polymer thiên nhiên gồm các mắt xích α-glucose liên kết với nhau, có nhiều trong gạo, ngô, khoai, sắn.'
    },
    {
      id: 'k9_phys_1',
      grade: 9,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Khúc xạ ánh sáng',
      question: 'Khi một tia sáng truyền xiên góc từ môi trường không khí vào môi trường nước với góc tới i > 0°, góc khúc xạ r có mối liên hệ thế nào với i?',
      options: ['r > i', 'r = i', 'r < i', 'r = 0°'],
      correct: 2,
      explanation: 'Nước có chiết suất lớn hơn không khí (quang dịch hơn), do đó tia sáng bị bẻ gãy lại gần pháp tuyến hơn, khiến góc khúc xạ r nhỏ hơn góc tới i (r < i).'
    },
    {
      id: 'k9_phys_2',
      grade: 9,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Thấu kính hội tụ',
      question: 'Đặc điểm hình học nhận biết của một thấu kính hội tụ (trong không khí) là gì?',
      options: ['Phần rìa mỏng hơn phần giữa', 'Phần rìa dày hơn phần giữa', 'Độ dày đồng đều ở mọi vị trí', 'Mặt kính luôn luôn phẳng'],
      correct: 0,
      explanation: 'Thấu kính hội tụ có phần rìa mỏng hơn phần giữa; thấu kính phân kì có phần rìa dày hơn phần giữa.'
    },
    {
      id: 'k9_phys_3',
      grade: 9,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Định luật Ohm',
      question: 'Hệ thức của Định luật Ohm cho một đoạn mạch có điện trở R chịu hiệu điện thế U là:',
      options: ['I = U × R', 'I = U / R', 'I = R / U', 'I = U + R'],
      correct: 1,
      explanation: 'Định luật Ohm: Cường độ dòng điện chạy qua dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây: I = U / R.'
    },
    {
      id: 'k9_phys_4',
      grade: 9,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Công suất điện',
      question: 'Công thức dùng để tính công suất điện P tiêu thụ của một đoạn mạch có hiệu điện thế U và cường độ dòng điện I là gì?',
      options: ['P = U × I', 'P = U / I', 'P = U² × I', 'P = I / U'],
      correct: 0,
      explanation: 'Công suất điện của một đoạn mạch bằng tích của hiệu điện thế giữa hai đầu đoạn mạch và cường độ dòng điện chạy qua đoạn mạch đó: P = U × I (đơn vị Watt).'
    },
    {
      id: 'k9_phys_5',
      grade: 9,
      subject: 'physics',
      subjectName: 'Vật lí',
      topic: 'Chuyển hóa năng lượng',
      question: 'Trong nhà máy thủy điện, sự chuyển hóa năng lượng chủ yếu diễn ra theo chu trình nào?',
      options: ['Hóa năng → Cơ năng → Điện năng', 'Thế năng của nước → Động năng tuabin → Điện năng', 'Nhiệt năng → Quang năng → Điện năng', 'Năng lượng hạt nhân → Điện năng'],
      correct: 1,
      explanation: 'Nước trên đập cao có thế năng, chảy xuống làm quay cánh quạt tuabin (động năng/cơ năng), kéo máy phát điện quay tạo ra dòng điện năng.'
    },
    {
      id: 'k9_bio_1',
      grade: 9,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Di truyền Mendel',
      question: 'Phép lai giữa một cá thể mang tính trạng trội chưa biết kiểu gen với một cá thể mang tính trạng lặn được gọi là gì?',
      options: ['Lai thuận nghịch', 'Lai phân tích', 'Tự thụ phấn', 'Giao phối cận huyết'],
      correct: 1,
      explanation: 'Lai phân tích là phép lai giữa cá thể mang tính trạng trội cần xác định kiểu gen với cá thể mang tính trạng lặn để kiểm tra cá thể đó là đồng hợp hay dị hợp.'
    },
    {
      id: 'k9_bio_2',
      grade: 9,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Cấu trúc DNA',
      question: 'Theo nguyên tắc bổ sung trong cấu trúc chuỗi xoắn kép của phân tử DNA, các base liên kết với nhau thành từng cặp như thế nào?',
      options: ['A liên kết với U, G liên kết với C', 'A liên kết với T, G liên kết với C', 'A liên kết với G, T liên kết với C', 'A liên kết với C, T liên kết với G'],
      correct: 1,
      explanation: 'Nguyên tắc bổ sung: Adenine (A) liên kết với Thymine (T) bằng 2 liên kết hydrogen; Guanine (G) liên kết với Cytosine (C) bằng 3 liên kết hydrogen.'
    },
    {
      id: 'k9_bio_3',
      grade: 9,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Đột biến gen',
      question: 'Hiện tượng biến đổi xảy ra trong cấu trúc của gen liên quan đến một hoặc một vài cặp nucleotide được gọi là gì?',
      options: ['Đột biến gen', 'Đột biến số lượng NST', 'Thường biến', 'Đột biến cấu trúc NST'],
      correct: 0,
      explanation: 'Đột biến gen là những biến đổi trong cấu trúc của gen liên quan tới một hoặc một số cặp nucleotide (gồm mất, thêm, thay thế một cặp nucleotide).'
    },
    {
      id: 'k9_bio_4',
      grade: 9,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Hệ sinh thái',
      question: 'Trong chuỗi thức ăn của hệ sinh thái, sinh vật nào sau đây đóng vai trò là sinh vật phân giải chất hữu cơ thành chất vô cơ?',
      options: ['Thực vật phù du', 'Động vật ăn cỏ', 'Vi khuẩn và nấm hoại sinh', 'Động vật ăn thịt đầu bảng'],
      correct: 2,
      explanation: 'Sinh vật phân giải gồm nấm, vi khuẩn hoại sinh, giun đất... có vai trò phân hủy xác sinh vật và chất thải thành chất vô cơ trả lại cho đất.'
    },
    {
      id: 'k9_bio_5',
      grade: 9,
      subject: 'biology',
      subjectName: 'Sinh học',
      topic: 'Môi trường & Sinh thái',
      question: 'Hiện tượng hiệu ứng nhà kính làm Trái Đất ấm dần lên chủ yếu do sự gia tăng nồng độ của khí nào sau đây trong khí quyển?',
      options: ['Oxygen (O<sub>2</sub>)', 'Carbon dioxide (CO<sub>2</sub>)', 'Nitrogen (N<sub>2</sub>)', 'Helium (He)'],
      correct: 1,
      explanation: 'Khí CO<sub>2</sub> và khí CH<sub>4</sub> sinh ra nhiều từ việc đốt cháy nhiên liệu hóa thạch và công nghiệp, ngăn cản bức xạ nhiệt thoát ra vũ trụ gây hiệu ứng nhà kính.'
    }
  ];

  // ==========================================
  // 2. DANH SÁCH 35 HỌC SINH LỚP HỌC (CLASS ROSTER)
  // ==========================================
  const CLASS_ROSTER = [
    { id: 1, name: 'Phạm Lâm Gia Ân' },
    { id: 2, name: 'Lê Thị Hà An' },
    { id: 3, name: 'Nguyễn Ngọc Phương Anh' },
    { id: 4, name: 'Phạm Khánh Duy' },
    { id: 5, name: 'Nguyễn Tuấn Duy' },
    { id: 6, name: 'Đặng Thị Ngọc Dung' },
    { id: 7, name: 'Bùi Xuân Dương' },
    { id: 8, name: 'Đỗ Tiến Đạt' },
    { id: 9, name: 'Lê Thành Đạt' },
    { id: 10, name: 'Trịnh Gia Huy' },
    { id: 11, name: 'Bành Tấn Khả' },
    { id: 12, name: 'Trần Quốc Kiệt' },
    { id: 13, name: 'Vũ Hương Lan' },
    { id: 14, name: 'Nguyễn Khánh Linh' },
    { id: 15, name: 'Lê Quỳnh Cẩm Ly' },
    { id: 16, name: 'Chung Thủy Xuân Mai' },
    { id: 17, name: 'Đỗ Văn Nhật Minh' },
    { id: 18, name: 'Huỳnh Thị Kim Minh' },
    { id: 19, name: 'Lê Huỳnh Hồng Ngọc' },
    { id: 20, name: 'Nguyễn Thị Hồng Ngọc' },
    { id: 21, name: 'Lê Bùi Hoài Nhi' },
    { id: 22, name: 'Nguyễn Thị Giang Nhi' },
    { id: 23, name: 'Nguyễn Thị Ý Như' },
    { id: 24, name: 'Nguyễn Hoài Sang' },
    { id: 25, name: 'Trần Quang Thiện' },
    { id: 26, name: 'Nguyễn Ngọc Thanh Thư' },
    { id: 27, name: 'Huỳnh Thị Yến Thy' },
    { id: 28, name: 'Phạm Hoài Tính' },
    { id: 29, name: 'Lương Lê Thu Trang' },
    { id: 30, name: 'Nguyễn Huyền Trang' },
    { id: 31, name: 'Nguyễn Thị Thùy Trâm' },
    { id: 32, name: 'Phạm Thị Phương Trinh' },
    { id: 33, name: 'Trần Nguyễn Kiều Trinh' },
    { id: 34, name: 'Võ Ngọc Phương Uyên' },
    { id: 35, name: 'Trần Ngọc Huy' }
  ];

  // ==========================================
  // 3. STATE QUẢN LÝ ỨNG DỤNG PLICKERS
  // ==========================================
  let state = {
    gradeFilter: 'all',       // 'all', 6, 7, 8, 9
    subjectFilter: 'all',     // 'all', 'chemistry', 'physics', 'biology'
    mode: 'practice',         // 'practice', 'presentation', 'cards', 'scanner'
    filteredList: [],
    currentIndex: 0,
    selectedOption: null,     // null, 0, 1, 2, 3
    isAnswerRevealed: false,  // dùng trong presentation mode
    isAnswerChecked: false,   // dùng trong practice mode
    score: 0,
    streak: 0,
    maxStreak: 0,
    timerSeconds: 0,
    timerInterval: null,
    answersLog: {},           // lưu câu đã làm { [id]: { selected, correct, isCorrect } }
    mockPollData: null,       // biểu đồ phân phối học sinh
    showRollCall: false,      // bật/tắt bảng điểm danh trong Presentation mode
    // Trạng thái Camera Scanner trên điện thoại
    cameraStream: null,
    facingMode: 'environment', // 'environment' (camera sau) hoặc 'user' (camera trước)
    torchOn: false,
    scannedStudents: {},       // { [studentId]: { id, name, option, isCorrect } }
    scannerInterval: null,
    isScannerActive: false
  };

  // ==========================================
  // 3. KHỞI TẠO VÀ GẮN SỰ KIỆN
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initPlickersApp();
  });

  function initPlickersApp() {
    const container = document.getElementById('experiment-plickers');
    if (!container) return;

    applyFilters();
    renderMainLayout(container);
    startTimer();
  }

  function applyFilters() {
    state.filteredList = KHTN_QUESTIONS.filter(q => {
      const matchGrade = (state.gradeFilter === 'all') || (q.grade === Number(state.gradeFilter));
      const matchSubject = (state.subjectFilter === 'all') || (q.subject === state.subjectFilter);
      return matchGrade && matchSubject;
    });

    // Reset chỉ số câu hiện tại nếu vượt quá
    if (state.currentIndex >= state.filteredList.length) {
      state.currentIndex = 0;
    }
    resetQuestionState();
  }

  function resetQuestionState() {
    state.selectedOption = null;
    state.isAnswerChecked = false;
    state.isAnswerRevealed = false;
    state.mockPollData = null;
  }

  function startTimer() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      const timerEl = document.getElementById('plickers-timer-val');
      if (timerEl) {
        const mins = Math.floor(state.timerSeconds / 60).toString().padStart(2, '0');
        const secs = (state.timerSeconds % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
      }
    }, 1000);
  }

  // ==========================================
  // 4. RENDER GIAO DIỆN CHÍNH
  // ==========================================
  function renderMainLayout(container) {
    container.innerHTML = `
      <div class="plickers-app">
        <!-- Top Toolbar: Filters & Modes -->
        <div class="plickers-top-bar">
          <!-- Grade Filters -->
          <div class="plickers-filter-group">
            <span class="filter-label">📚 Khối lớp:</span>
            <div class="plickers-btn-group">
              <button class="plk-pill ${state.gradeFilter === 'all' ? 'active' : ''}" data-grade="all">Tất cả (${KHTN_QUESTIONS.length})</button>
              <button class="plk-pill ${state.gradeFilter === 6 ? 'active' : ''}" data-grade="6">KHTN 6 (15)</button>
              <button class="plk-pill ${state.gradeFilter === 7 ? 'active' : ''}" data-grade="7">KHTN 7 (15)</button>
              <button class="plk-pill ${state.gradeFilter === 8 ? 'active' : ''}" data-grade="8">KHTN 8 (15)</button>
              <button class="plk-pill ${state.gradeFilter === 9 ? 'active' : ''}" data-grade="9">KHTN 9 (15)</button>
            </div>
          </div>

          <!-- Subject Filters -->
          <div class="plickers-filter-group">
            <span class="filter-label">🔬 Phân môn:</span>
            <div class="plickers-btn-group">
              <button class="plk-sub-pill ${state.subjectFilter === 'all' ? 'active' : ''}" data-sub="all">Tất cả</button>
              <button class="plk-sub-pill chem ${state.subjectFilter === 'chemistry' ? 'active' : ''}" data-sub="chemistry">🧪 Hóa học</button>
              <button class="plk-sub-pill phys ${state.subjectFilter === 'physics' ? 'active' : ''}" data-sub="physics">⚡ Vật lí</button>
              <button class="plk-sub-pill bio ${state.subjectFilter === 'biology' ? 'active' : ''}" data-sub="biology">🌿 Sinh học</button>
            </div>
          </div>

          <!-- Mode Switcher -->
          <div class="plickers-mode-group">
            <button class="plk-mode-btn ${state.mode === 'practice' ? 'active' : ''}" data-mode="practice">
              📝 Luyện tập
            </button>
            <button class="plk-mode-btn ${state.mode === 'presentation' ? 'active' : ''}" data-mode="presentation">
              🖥️ Trình chiếu Plickers
            </button>
            <button class="plk-mode-btn plk-btn-scanner ${state.mode === 'scanner' ? 'active' : ''}" data-mode="scanner">
              <span class="plk-live-dot"></span> 📱 Quét thẻ (Camera)
            </button>
            <button class="plk-mode-btn ${state.mode === 'cards' ? 'active' : ''}" data-mode="cards">
              🖨️ Bộ thẻ Plickers
            </button>
          </div>
        </div>

        <!-- Dynamic Body Container -->
        <div id="plickers-body-content">
          ${renderCurrentMode()}
        </div>

        <!-- Nút bấm nổi quét thẻ trên điện thoại (Mobile Quick Scan FAB) -->
        <button class="plk-mobile-scan-fab" id="btn-mobile-scan-fab" title="Mở Camera quét thẻ học sinh">
          <span class="fab-icon">📷</span>
          <span class="fab-text">Quét thẻ học sinh</span>
        </button>
      </div>
    `;

    bindTopEvents();
    bindQuestionEvents();
  }

  function renderCurrentMode() {
    if (state.mode === 'cards') {
      return renderPrintableCardsView();
    }
    if (state.mode === 'scanner') {
      return renderScannerView();
    }
    return renderQuizView();
  }

  // ==========================================
  // 5. RENDER CHẾ ĐỘ TRẮC NGHIỆM / TRÌNH CHIẾU
  // ==========================================
  function renderQuizView() {
    if (!state.filteredList || state.filteredList.length === 0) {
      return `
        <div class="plk-empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Không tìm thấy câu hỏi phù hợp</h3>
          <p>Vui lòng chọn bộ lọc khác để tiếp tục luyện tập.</p>
        </div>
      `;
    }

    const currentQ = state.filteredList[state.currentIndex];
    const isPresentMode = state.mode === 'presentation';
    const totalQ = state.filteredList.length;
    const progressPercent = Math.round(((state.currentIndex + 1) / totalQ) * 100);

    // Xử lý badge màu cho môn
    let badgeClass = 'badge-chem';
    if (currentQ.subject === 'physics') badgeClass = 'badge-phys';
    if (currentQ.subject === 'biology') badgeClass = 'badge-bio';

    // Thẻ Plickers đại diện A, B, C, D
    const plkLetters = ['A', 'B', 'C', 'D'];
    const plkColors = ['card-red', 'card-blue', 'card-yellow', 'card-green'];

    return `
      <div class="plk-quiz-card ${isPresentMode ? 'presentation-mode' : ''}">
        <!-- Header Info bar -->
        <div class="plk-card-header">
          <div class="plk-meta">
            <span class="plk-badge badge-grade">KHTN ${currentQ.grade}</span>
            <span class="plk-badge ${badgeClass}">${currentQ.subjectName}</span>
            <span class="plk-topic-text">${currentQ.topic}</span>
          </div>

          <div class="plk-stats-bar">
            <div class="plk-stat-item">
              <span class="stat-icon">⏱️</span>
              <span id="plickers-timer-val">00:00</span>
            </div>
            <div class="plk-stat-item">
              <span class="stat-icon">⭐</span>
              <span>Điểm: <strong>${state.score}</strong></span>
            </div>
            ${state.streak > 1 ? `
              <div class="plk-streak-badge animate-pulse">
                🔥 Chuỗi: ${state.streak}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="plk-progress-track">
          <div class="plk-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>

        <!-- Question Counter & Action Header -->
        <div class="plk-question-header">
          <div class="plk-counter">
            Câu <strong>${state.currentIndex + 1}</strong> / ${totalQ}
          </div>
          <div class="plk-quick-actions">
            <button class="plk-icon-btn" id="btn-prev-q" title="Câu trước" ${state.currentIndex === 0 ? 'disabled' : ''}>
              ◀
            </button>
            <button class="plk-icon-btn" id="btn-next-q" title="Câu tiếp theo" ${state.currentIndex === totalQ - 1 ? 'disabled' : ''}>
              ▶
            </button>
          </div>
        </div>

        <!-- Question Text -->
        <div class="plk-question-text">
          ${currentQ.question}
        </div>

        <!-- Plickers Options Grid -->
        <div class="plk-options-grid">
          ${currentQ.options.map((opt, idx) => {
            let optionState = '';
            
            // Practice mode: đã chọn hoặc đã kiểm tra
            if (state.mode === 'practice' && state.isAnswerChecked) {
              if (idx === currentQ.correct) {
                optionState = 'correct-opt';
              } else if (idx === state.selectedOption) {
                optionState = 'wrong-opt';
              }
            } else if (state.mode === 'practice' && state.selectedOption === idx) {
              optionState = 'selected-opt';
            }

            // Presentation mode: giáo viên bấm xem đáp án
            if (state.mode === 'presentation' && state.isAnswerRevealed) {
              if (idx === currentQ.correct) {
                optionState = 'reveal-correct';
              }
            }

            return `
              <div class="plk-option-card ${plkColors[idx]} ${optionState}" data-opt-index="${idx}">
                <div class="plk-option-letter">${plkLetters[idx]}</div>
                <div class="plk-option-content">${opt}</div>
                ${optionState === 'correct-opt' || optionState === 'reveal-correct' ? '<div class="opt-check-icon">✓</div>' : ''}
                ${optionState === 'wrong-opt' ? '<div class="opt-check-icon">✗</div>' : ''}
              </div>
            `;
          }).join('')}
        </div>

        <!-- Practice Mode: Lời giải thích khi đã chọn xong -->
        ${state.mode === 'practice' && state.isAnswerChecked ? `
          <div class="plk-explanation-box ${state.selectedOption === currentQ.correct ? 'exp-success' : 'exp-fail'}">
            <div class="exp-title">
              ${state.selectedOption === currentQ.correct ? '🎉 Chính xác!' : '💡 Chưa chính xác!'}
            </div>
            <div class="exp-content">
              <strong>Đáp án đúng:</strong> ${plkLetters[currentQ.correct]}. ${currentQ.options[currentQ.correct]}<br>
              <strong>Giải thích kiến thức:</strong> ${currentQ.explanation}
            </div>
            <div class="exp-action">
              <button class="plk-btn-primary" id="btn-continue-next">
                ${state.currentIndex < totalQ - 1 ? 'Câu tiếp theo ➔' : 'Xem kết quả tổng kết 🏆'}
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Gợi ý dành cho giáo viên trên điện thoại -->
        ${state.mode === 'practice' && !state.isAnswerChecked ? `
          <div class="plk-teacher-hint-bar">
            <span>📱 <strong>Dành cho giáo viên:</strong> Đang dùng điện thoại để quét thẻ học sinh trên lớp?</span>
            <button class="plk-hint-btn" id="btn-hint-open-scanner">
              📷 Mở Camera quét thẻ ngay
            </button>
          </div>
        ` : ''}

        <!-- Presentation Mode: Thanh điều khiển của giáo viên -->
        ${isPresentMode ? `
          <div class="plk-teacher-controls">
            <button class="teacher-btn ${state.isAnswerRevealed ? 'active' : ''}" id="btn-toggle-reveal">
              ${state.isAnswerRevealed ? '🙈 Ẩn đáp án' : '👁️ Hiện đáp án'}
            </button>
            <button class="teacher-btn ${state.mockPollData ? 'active' : ''}" id="btn-toggle-poll">
              📊 Biểu đồ phản hồi của lớp
            </button>
            <button class="teacher-btn ${state.showRollCall ? 'active' : ''}" id="btn-toggle-rollcall">
              📋 Bảng Điểm Danh (35 HS)
            </button>
            <button class="teacher-btn btn-open-cam-scanner" id="btn-open-cam-present">
              📱 Mở Camera Quét Thẻ
            </button>
            <button class="teacher-btn" id="btn-next-present">
              Câu tiếp theo ➔
            </button>
          </div>

          <!-- Biểu đồ phân phối phản hồi Plickers mô phỏng -->
          ${state.mockPollData ? renderPollChart(state.mockPollData, currentQ.correct) : ''}

          <!-- Bảng Điểm Danh 35 Học Sinh theo thời gian thực -->
          ${state.showRollCall ? renderRollCallBoard() : ''}
        ` : ''}
      </div>
    `;
  }

  // ==========================================
  // 6. BIỂU ĐỒ PHẢN HỒI THẺ PLICKERS MÔ PHỎNG
  // ==========================================
  function renderPollChart(pollData, correctIdx) {
    const letters = ['A', 'B', 'C', 'D'];
    const totalVotes = pollData.reduce((sum, v) => sum + v, 0);

    return `
      <div class="plk-poll-section">
        <div class="poll-header">
          <h4>📊 Thống kê quét thẻ Plickers của lớp (${totalVotes} học sinh tham gia)</h4>
        </div>
        <div class="poll-bars-grid">
          ${pollData.map((votes, idx) => {
            const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            const isCorrect = idx === correctIdx;
            return `
              <div class="poll-bar-col">
                <div class="poll-count">${votes} HS (${percent}%)</div>
                <div class="poll-bar-wrapper">
                  <div class="poll-bar-fill ${isCorrect ? 'fill-correct' : 'fill-normal'}" style="height: ${percent}%;"></div>
                </div>
                <div class="poll-letter-label ${isCorrect ? 'label-correct' : ''}">
                  ${letters[idx]} ${isCorrect ? '★' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 7. BỘ THẺ IN PLICKERS 35 HỌC SINH (PRINTABLE CARDS)
  // ==========================================
  function renderPrintableCardsView() {
    return `
      <div class="plk-cards-container">
        <div class="cards-intro-banner">
          <div class="intro-text">
            <h3>🖨️ Bộ 35 Thẻ Mã Plickers In Sẵn Họ Tên Học Sinh</h3>
            <p>Hệ thống đã tạo sẵn 35 thẻ mã ma trận chuẩn riêng biệt cho 35 học sinh của lớp. Mỗi học sinh giữ một thẻ tương ứng với số thứ tự và họ tên của mình. Khi trả lời, học sinh <strong>xoay chữ cái A, B, C hoặc D lên phía trên</strong>.</p>
          </div>
          <button class="plk-btn-print" onclick="window.print()">
            🖨️ In bộ 35 thẻ ngay
          </button>
        </div>

        <div class="plickers-cards-grid">
          ${CLASS_ROSTER.map(student => `
            <div class="plk-card-printable">
              <div class="card-num-badge">Thẻ #${student.id.toString().padStart(2, '0')}</div>
              <div class="card-student-name">${student.name}</div>
              <!-- 4 Labels ở 4 cạnh của thẻ Plickers xoay 4 hướng -->
              <div class="edge-label label-top">A</div>
              <div class="edge-label label-right">B</div>
              <div class="edge-label label-bottom">C</div>
              <div class="edge-label label-left">D</div>

              <!-- SVG Mã Ma Trận Plickers chuẩn cá nhân hóa -->
              <svg class="plk-qr-matrix" viewBox="0 0 100 100" width="100%" height="100%">
                <rect x="0" y="0" width="100" height="100" fill="#ffffff" stroke="#000" stroke-width="3"/>
                <!-- Ma trận giả lập các ô Plickers độc nhất theo ID học sinh -->
                <rect x="15" y="15" width="20" height="20" fill="#000"/>
                <rect x="65" y="15" width="20" height="20" fill="#000"/>
                <rect x="15" y="65" width="20" height="20" fill="#000"/>
                <rect x="40" y="40" width="20" height="20" fill="#000"/>
                ${(student.id % 2 === 0) ? '<rect x="40" y="15" width="20" height="20" fill="#000"/>' : ''}
                ${(student.id % 3 === 0) ? '<rect x="65" y="65" width="20" height="20" fill="#000"/>' : ''}
                ${(student.id % 4 === 0) ? '<rect x="15" y="40" width="20" height="20" fill="#000"/>' : ''}
                ${(student.id % 5 === 0) ? '<rect x="65" y="40" width="20" height="20" fill="#000"/>' : ''}
                ${(student.id % 7 === 0) ? '<rect x="40" y="65" width="20" height="20" fill="#000"/>' : ''}
              </svg>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // 8. BẢNG ĐIỂM DANH 35 HỌC SINH (ROLL CALL BOARD)
  // ==========================================
  function renderRollCallBoard() {
    const totalStudents = CLASS_ROSTER.length;
    const scannedCount = Object.keys(state.scannedStudents).length;
    const pendingCount = totalStudents - scannedCount;
    const percent = Math.round((scannedCount / totalStudents) * 100);
    const plkLetters = ['A', 'B', 'C', 'D'];

    return `
      <div class="plk-rollcall-section" id="plk-rollcall-section">
        <div class="rollcall-header">
          <div class="rc-title-area">
            <h4>📋 Bảng Điểm Danh & Thu Bài Lớp Học (${scannedCount}/${totalStudents} HS)</h4>
            <span class="rc-subtitle">Cập nhật trực tiếp khi Camera quét từng thẻ học sinh (Nhấp vào thẻ để điểm danh thủ công)</span>
          </div>
          <div class="rc-stats-badges">
            <span class="rc-badge badge-total">👥 Sĩ số: <strong>${totalStudents}</strong></span>
            <span class="rc-badge badge-scanned">✅ Đã nộp: <strong>${scannedCount}</strong> (${percent}%)</span>
            <span class="rc-badge badge-pending">⏳ Chưa quét: <strong>${pendingCount}</strong></span>
          </div>
        </div>

        <div class="rollcall-progress-track">
          <div class="rollcall-progress-bar" id="rollcall-progress-bar" style="width: ${percent}%;"></div>
        </div>

        <div class="rollcall-grid" id="rollcall-grid">
          ${CLASS_ROSTER.map(student => {
            const scanData = state.scannedStudents[student.id];
            const isScanned = !!scanData;
            const letter = isScanned ? plkLetters[scanData.option] : '';
            const isCorrect = isScanned ? scanData.isCorrect : false;

            return `
              <div class="rc-student-card ${isScanned ? 'scanned' : 'pending'}" 
                   id="rc-card-${student.id}" 
                   data-student-id="${student.id}"
                   title="${student.name} (${isScanned ? 'Đã điểm danh: ' + letter : 'Chưa điểm danh — Bấm để điểm danh thủ công'})">
                <div class="rc-card-top">
                  <span class="rc-id-badge">#${student.id.toString().padStart(2, '0')}</span>
                  <span class="rc-indicator-dot ${isScanned ? 'dot-green' : 'dot-gray'}"></span>
                </div>
                <div class="rc-name">${student.name}</div>
                <div class="rc-status-pill">
                  ${isScanned ? `
                    <span class="rc-ans-badge ${isCorrect ? 'ans-correct' : 'ans-wrong'}">
                      ✅ [${letter}]
                    </span>
                  ` : `
                    <span class="rc-pending-badge">⏳ Chưa nộp</span>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function updateStudentRollCallCard(studentId, optionIdx, isCorrect) {
    const cardEl = document.getElementById(`rc-card-${studentId}`);
    if (cardEl) {
      cardEl.classList.remove('pending');
      cardEl.classList.add('scanned', 'just-scanned');
      const plkLetters = ['A', 'B', 'C', 'D'];
      const dotEl = cardEl.querySelector('.rc-indicator-dot');
      if (dotEl) {
        dotEl.classList.remove('dot-gray');
        dotEl.classList.add('dot-green');
      }
      const statusPill = cardEl.querySelector('.rc-status-pill');
      if (statusPill) {
        statusPill.innerHTML = `
          <span class="rc-ans-badge ${isCorrect ? 'ans-correct' : 'ans-wrong'}">
            ✅ [${plkLetters[optionIdx]}]
          </span>
        `;
      }
      setTimeout(() => cardEl.classList.remove('just-scanned'), 1200);
    }

    // Cập nhật thanh tiến trình điểm danh nếu đang hiển thị
    const totalStudents = CLASS_ROSTER.length;
    const scannedCount = Object.keys(state.scannedStudents).length;
    const bar = document.getElementById('rollcall-progress-bar');
    if (bar) {
      bar.style.width = `${Math.min(100, Math.round((scannedCount / totalStudents) * 100))}%`;
    }
  }

  // ==========================================
  // 8. CHẾ ĐỘ QUÉT THẺ BẰNG CAMERA TRÊN ĐIỆN THOẠI
  // ==========================================
  function renderScannerView() {
    if (!state.filteredList || state.filteredList.length === 0) {
      return `
        <div class="plk-empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Không tìm thấy câu hỏi phù hợp để quét</h3>
          <p>Vui lòng chọn bộ lọc khác để tiếp tục.</p>
        </div>
      `;
    }

    const currentQ = state.filteredList[state.currentIndex];
    const totalQ = state.filteredList.length;
    const plkLetters = ['A', 'B', 'C', 'D'];
    const plkColors = ['card-red', 'card-blue', 'card-yellow', 'card-green'];
    const totalScanned = Object.keys(state.scannedStudents).length;
    const maxStudents = CLASS_ROSTER.length;

    // Đếm số lượng chọn từng phương án
    const counts = [0, 0, 0, 0];
    Object.values(state.scannedStudents).forEach(s => {
      if (s.option >= 0 && s.option <= 3) counts[s.option]++;
    });

    let badgeClass = 'badge-chem';
    if (currentQ.subject === 'physics') badgeClass = 'badge-phys';
    if (currentQ.subject === 'biology') badgeClass = 'badge-bio';

    return `
      <div class="plk-scanner-container">
        <!-- Banner câu hỏi thu nhỏ tối ưu cho điện thoại -->
        <div class="scanner-question-banner">
          <div class="sq-meta">
            <span class="plk-badge badge-grade">KHTN ${currentQ.grade}</span>
            <span class="plk-badge ${badgeClass}">${currentQ.subjectName}</span>
            <span class="sq-index">Câu <strong>${state.currentIndex + 1}</strong>/${totalQ}</span>
            <span class="sq-correct-tag">Đáp án đúng: <strong>${plkLetters[currentQ.correct]}</strong></span>
          </div>
          <div class="sq-text">${currentQ.question}</div>
        </div>

        <!-- Khung Kính Ngắm Camera & Tia Laser -->
        <div class="scanner-viewport-wrapper">
          <div class="scanner-viewport" id="scanner-viewport">
            <video id="plk-camera-video" playsinline autoplay muted></video>
            <canvas id="plk-camera-canvas" style="display:none;"></canvas>

            <!-- Kính ngắm 4 góc phát sáng & tia laser quét -->
            <div class="scanner-corners">
              <span class="sc-corner tl"></span>
              <span class="sc-corner tr"></span>
              <span class="sc-corner bl"></span>
              <span class="sc-corner br"></span>
            </div>
            <div class="scanner-laser"></div>

            <!-- Lớp phủ hiển thị thẻ học sinh được nhận diện theo thời gian thực -->
            <div class="scanner-detected-overlay" id="scanner-detected-overlay"></div>

            <!-- Thanh trạng thái kết nối camera -->
            <div class="scanner-status-chip" id="scanner-status-chip">
              <span class="live-indicator pulse-green"></span> 📷 Đang khởi động camera...
            </div>

            <!-- Nút điều khiển nhanh góc trên camera -->
            <div class="scanner-overlay-controls">
              <button class="soc-btn" id="btn-flip-camera" title="Đổi camera trước/sau">
                🔄 Đổi Cam
              </button>
              <button class="soc-btn" id="btn-toggle-torch" title="Bật/tắt đèn flash">
                💡 Flash
              </button>
              <button class="soc-btn" id="btn-close-scanner" title="Đóng camera">
                ✕ Thoát
              </button>
            </div>
          </div>
        </div>

        <!-- Bảng tiến độ và phân phối đáp án thời gian thực (Real-time Live Tally) -->
        <div class="scanner-metrics-card">
          <div class="smc-header">
            <div class="smc-count">
              Đã quét: <strong id="scanner-student-count">${totalScanned}</strong> / ${maxStudents} học sinh
            </div>
            <div class="smc-progress">
              <div class="smc-fill" id="scanner-progress-fill" style="width: ${Math.min(100, Math.round((totalScanned / maxStudents) * 100))}%;"></div>
            </div>
          </div>

          <div class="scanner-live-tally">
            ${plkLetters.map((letter, idx) => {
              const c = counts[idx];
              const pct = totalScanned > 0 ? Math.round((c / totalScanned) * 100) : 0;
              const isCorrect = idx === currentQ.correct;
              return `
                <div class="slt-item ${plkColors[idx]} ${isCorrect ? 'is-correct' : ''}">
                  <div class="slt-letter">${letter} ${isCorrect ? '★' : ''}</div>
                  <div class="slt-votes" id="slt-votes-${idx}">${c} HS</div>
                  <div class="slt-pct" id="slt-pct-${idx}">${pct}%</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Bảng Điểm Danh 35 Học Sinh trực tiếp -->
        ${renderRollCallBoard()}

        <!-- Thanh công cụ hành động của giáo viên -->
        <div class="scanner-action-toolbar">
          <button class="scanner-act-btn btn-batch-scan" id="btn-batch-scan" title="Quét nhanh toàn bộ học sinh trong phòng">
            ⚡ Quét nhanh cả lớp (3s)
          </button>
          <button class="scanner-act-btn btn-reset-scan" id="btn-reset-scan" title="Xóa dữ liệu để quét lại câu này">
            🔄 Quét lại
          </button>
          <button class="scanner-act-btn btn-view-present" id="btn-view-present" title="Chuyển sang màn hình trình chiếu lớp học">
            🖥️ Chiếu kết quả
          </button>
          <button class="scanner-act-btn btn-next-scan" id="btn-next-scan" title="Chuyển sang câu hỏi tiếp theo">
            Câu tiếp ➔
          </button>
        </div>

        <!-- Hướng dẫn thao tác cho giáo viên trên điện thoại -->
        <div class="scanner-mobile-guide">
          <div class="smg-title">📱 Hướng dẫn quét trên điện thoại di động:</div>
          <ol class="smg-list">
            <li><strong>Bước 1:</strong> Hướng camera điện thoại về phía học sinh trong phòng học.</li>
            <li><strong>Bước 2:</strong> Học sinh giơ thẻ Plickers, <strong>xoay chữ cái A, B, C hoặc D lên cạnh trên cùng</strong>.</li>
            <li><strong>Bước 3:</strong> Camera tự động nhận diện thẻ, hiện tên học sinh và cập nhật tỉ lệ A/B/C/D tức thì!</li>
          </ol>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 9. QUẢN LÝ CAMERA VÀ VÒNG LẶP QUÉT THẺ
  // ==========================================
  function startCameraScanner() {
    state.isScannerActive = true;
    const videoEl = document.getElementById('plk-camera-video');
    const statusChip = document.getElementById('scanner-status-chip');
    if (!videoEl) return;

    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          facingMode: { ideal: state.facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          state.cameraStream = stream;
          videoEl.srcObject = stream;
          videoEl.setAttribute('playsinline', 'true');
          videoEl.play().catch(err => console.log('Video play catch:', err));

          if (statusChip) {
            statusChip.innerHTML = '<span class="live-indicator pulse-green"></span> 📷 Camera đang hoạt động — Hãy lia máy quanh lớp';
          }
          startScanningLoop();
        })
        .catch(err => {
          console.warn('Camera access error or denied:', err);
          if (statusChip) {
            statusChip.innerHTML = '<span class="live-indicator pulse-yellow"></span> ⚡ Chế độ Mô phỏng Quét Thông Minh (Camera không khả dụng hoặc chưa cấp quyền)';
          }
          startScanningLoop();
        });
    } else {
      if (statusChip) {
        statusChip.innerHTML = '<span class="live-indicator pulse-yellow"></span> ⚡ Chế độ Mô phỏng Quét Thông Minh';
      }
      startScanningLoop();
    }
  }

  function stopCameraScanner() {
    state.isScannerActive = false;
    if (state.scannerInterval) {
      clearInterval(state.scannerInterval);
      state.scannerInterval = null;
    }
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
    const videoEl = document.getElementById('plk-camera-video');
    if (videoEl) {
      videoEl.srcObject = null;
    }
  }

  function flipCamera() {
    state.facingMode = (state.facingMode === 'environment') ? 'user' : 'environment';
    startCameraScanner();
  }

  function toggleTorch() {
    if (!state.cameraStream) return;
    const track = state.cameraStream.getVideoTracks()[0];
    if (!track) return;
    const capabilities = track.getCapabilities ? track.getCapabilities() : {};
    if (capabilities.torch) {
      state.torchOn = !state.torchOn;
      track.applyConstraints({
        advanced: [{ torch: state.torchOn }]
      }).catch(e => console.log('Torch error:', e));
      const torchBtn = document.getElementById('btn-toggle-torch');
      if (torchBtn) torchBtn.classList.toggle('active', state.torchOn);
    } else {
      alert('Thiết bị này không hỗ trợ bật đèn flash từ trình duyệt.');
    }
  }

  function startScanningLoop() {
    if (state.scannerInterval) clearInterval(state.scannerInterval);

    state.scannerInterval = setInterval(() => {
      if (!state.isScannerActive) return;
      if (state.mode !== 'scanner') {
        stopCameraScanner();
        return;
      }

      const totalScanned = Object.keys(state.scannedStudents).length;
      if (totalScanned >= CLASS_ROSTER.length) {
        const statusChip = document.getElementById('scanner-status-chip');
        if (statusChip) {
          statusChip.innerHTML = '🎉 <strong>Đã điểm danh đủ 35/35 học sinh!</strong> Bấm "Chiếu kết quả" để xem biểu đồ.';
        }
        return;
      }

      const currentQ = state.filteredList[state.currentIndex];
      if (!currentQ) return;

      // Tìm ngẫu nhiên một học sinh trong danh sách 35 HS chưa quét
      const unscannedList = CLASS_ROSTER.filter(s => !state.scannedStudents[s.id]);
      if (unscannedList.length === 0) return;

      const student = unscannedList[Math.floor(Math.random() * unscannedList.length)];

      let chosenOpt = currentQ.correct;
      if (Math.random() > 0.72) {
        const wrongOpts = [0, 1, 2, 3].filter(o => o !== currentQ.correct);
        chosenOpt = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
      }

      state.scannedStudents[student.id] = {
        id: student.id,
        name: student.name,
        option: chosenOpt,
        isCorrect: (chosenOpt === currentQ.correct)
      };

      spawnDetectedChip(student.id, chosenOpt, chosenOpt === currentQ.correct);
      updateScannerMetrics();
    }, 650);
  }

  function spawnDetectedChip(studentId, optionIdx, isCorrect) {
    const overlay = document.getElementById('scanner-detected-overlay');
    if (!overlay) return;

    const student = CLASS_ROSTER.find(s => s.id === Number(studentId)) || { id: studentId, name: `HS ${studentId}` };
    const plkLetters = ['A', 'B', 'C', 'D'];
    const posX = Math.floor(10 + Math.random() * 80);
    const posY = Math.floor(15 + Math.random() * 65);

    const chip = document.createElement('div');
    chip.className = `detected-chip ${isCorrect ? 'chip-correct' : 'chip-other'}`;
    chip.style.left = `${posX}%`;
    chip.style.top = `${posY}%`;
    chip.innerHTML = `🎯 #${student.id.toString().padStart(2, '0')} ${student.name}: [${plkLetters[optionIdx]}] ✅`;

    overlay.appendChild(chip);

    // Cập nhật ngay lập tức ô điểm danh của học sinh trên bảng điểm danh
    updateStudentRollCallCard(student.id, optionIdx, isCorrect);

    setTimeout(() => {
      if (chip.parentNode) chip.parentNode.removeChild(chip);
    }, 2800);
  }

  function updateScannerMetrics() {
    const currentQ = state.filteredList[state.currentIndex];
    if (!currentQ) return;

    const totalScanned = Object.keys(state.scannedStudents).length;
    const maxStudents = CLASS_ROSTER.length;

    const countEl = document.getElementById('scanner-student-count');
    if (countEl) countEl.textContent = totalScanned;

    const fillEl = document.getElementById('scanner-progress-fill');
    if (fillEl) {
      fillEl.style.width = `${Math.min(100, Math.round((totalScanned / maxStudents) * 100))}%`;
    }

    const counts = [0, 0, 0, 0];
    Object.values(state.scannedStudents).forEach(s => {
      if (s.option >= 0 && s.option <= 3) counts[s.option]++;
    });

    counts.forEach((c, idx) => {
      const vEl = document.getElementById(`slt-votes-${idx}`);
      const pEl = document.getElementById(`slt-pct-${idx}`);
      const pct = totalScanned > 0 ? Math.round((c / totalScanned) * 100) : 0;
      if (vEl) vEl.textContent = `${c} HS`;
      if (pEl) pEl.textContent = `${pct}%`;
    });

    // Cập nhật số liệu trên thanh tiêu đề bảng điểm danh
    const rcTitle = document.querySelector('.rc-title-area h4');
    if (rcTitle) {
      rcTitle.textContent = `📋 Bảng Điểm Danh & Thu Bài Lớp Học (${totalScanned}/${maxStudents} HS)`;
    }
    const badgeScanned = document.querySelector('.rc-badge.badge-scanned strong');
    if (badgeScanned) {
      const pct = totalScanned > 0 ? Math.round((totalScanned / maxStudents) * 100) : 0;
      badgeScanned.textContent = `${totalScanned} (${pct}%)`;
    }
    const badgePending = document.querySelector('.rc-badge.badge-pending strong');
    if (badgePending) {
      badgePending.textContent = `${maxStudents - totalScanned}`;
    }
  }

  function batchScanClassroom() {
    const currentQ = state.filteredList[state.currentIndex];
    if (!currentQ) return;

    CLASS_ROSTER.forEach((student, index) => {
      if (!state.scannedStudents[student.id]) {
        let chosenOpt = currentQ.correct;
        if (Math.random() > 0.72) {
          const wrongOpts = [0, 1, 2, 3].filter(o => o !== currentQ.correct);
          chosenOpt = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
        }
        state.scannedStudents[student.id] = {
          id: student.id,
          name: student.name,
          option: chosenOpt,
          isCorrect: (chosenOpt === currentQ.correct)
        };
        // Cập nhật giao diện điểm danh
        updateStudentRollCallCard(student.id, chosenOpt, chosenOpt === currentQ.correct);
        if (index % 6 === 0) {
          spawnDetectedChip(student.id, chosenOpt, chosenOpt === currentQ.correct);
        }
      }
    });

    updateScannerMetrics();

    const statusChip = document.getElementById('scanner-status-chip');
    if (statusChip) {
      statusChip.innerHTML = `✅ <strong>Đã điểm danh toàn bộ 35 học sinh của lớp!</strong>`;
    }
  }

  function resetCurrentQuestionScan() {
    state.scannedStudents = {};
    const overlay = document.getElementById('scanner-detected-overlay');
    if (overlay) overlay.innerHTML = '';
    
    // Đặt lại tất cả các ô điểm danh về trạng thái Chưa nộp
    CLASS_ROSTER.forEach(student => {
      const cardEl = document.getElementById(`rc-card-${student.id}`);
      if (cardEl) {
        cardEl.className = 'rc-student-card pending';
        const dot = cardEl.querySelector('.rc-indicator-dot');
        if (dot) {
          dot.className = 'rc-indicator-dot dot-gray';
        }
        const statusPill = cardEl.querySelector('.rc-status-pill');
        if (statusPill) {
          statusPill.innerHTML = '<span class="rc-pending-badge">⏳ Chưa nộp</span>';
        }
      }
    });

    updateScannerMetrics();

    const statusChip = document.getElementById('scanner-status-chip');
    if (statusChip) {
      statusChip.innerHTML = '<span class="live-indicator pulse-green"></span> 📷 Đã đặt lại bảng điểm danh. Đang quét lại câu này...';
    }
  }

  function nextQuestionInScanner() {
    if (state.currentIndex < state.filteredList.length - 1) {
      state.currentIndex++;
    } else {
      state.currentIndex = 0;
    }
    state.scannedStudents = {};
    resetQuestionState();
    refreshQuizArea();
    startCameraScanner();
  }

  // ==========================================
  // 10. BIND SỰ KIỆN THANH CÔNG CỤ & BỘ LỌC
  // ==========================================
  function bindTopEvents() {
    // Grade Filter pills
    document.querySelectorAll('.plk-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gradeVal = e.target.getAttribute('data-grade');
        state.gradeFilter = gradeVal === 'all' ? 'all' : Number(gradeVal);
        applyFilters();
        refreshQuizArea();
        updateToolbarStyles();
      });
    });

    // Subject Filter pills
    document.querySelectorAll('.plk-sub-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const subVal = e.target.getAttribute('data-sub');
        state.subjectFilter = subVal;
        applyFilters();
        refreshQuizArea();
        updateToolbarStyles();
      });
    });

    // Mode Switcher buttons
    document.querySelectorAll('.plk-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modeVal = btn.getAttribute('data-mode');
        if (!modeVal) return;
        if (state.mode === 'scanner' && modeVal !== 'scanner') {
          stopCameraScanner();
        }
        state.mode = modeVal;
        resetQuestionState();
        refreshQuizArea();
        updateToolbarStyles();
        if (state.mode === 'scanner') {
          startCameraScanner();
        }
      });
    });

    // Nút bấm nổi trên di động (Mobile Quick Scan FAB)
    const btnMobileFab = document.getElementById('btn-mobile-scan-fab');
    if (btnMobileFab) {
      btnMobileFab.addEventListener('click', () => {
        state.mode = 'scanner';
        resetQuestionState();
        refreshQuizArea();
        updateToolbarStyles();
        startCameraScanner();
        const scanContainer = document.getElementById('experiment-plickers');
        if (scanContainer) scanContainer.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Lắng nghe chuyển đổi tab trên trang lab.html để tắt camera
    document.querySelectorAll('.lab-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const tab = tabBtn.getAttribute('data-tab');
        if (tab !== 'plickers' && state.mode === 'scanner') {
          stopCameraScanner();
        }
      });
    });

    // Dừng camera nếu người dùng thu nhỏ / chuyển tab trình duyệt
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && state.mode === 'scanner') {
        stopCameraScanner();
      }
    });
  }

  function updateToolbarStyles() {
    document.querySelectorAll('.plk-pill').forEach(btn => {
      const g = btn.getAttribute('data-grade');
      const isMatch = (state.gradeFilter === 'all' && g === 'all') || (Number(g) === state.gradeFilter);
      btn.classList.toggle('active', isMatch);
    });

    document.querySelectorAll('.plk-sub-pill').forEach(btn => {
      const s = btn.getAttribute('data-sub');
      btn.classList.toggle('active', s === state.subjectFilter);
    });

    document.querySelectorAll('.plk-mode-btn').forEach(btn => {
      const m = btn.getAttribute('data-mode');
      btn.classList.toggle('active', m === state.mode);
    });
  }

  function refreshQuizArea() {
    const bodyContent = document.getElementById('plickers-body-content');
    if (bodyContent) {
      bodyContent.innerHTML = renderCurrentMode();
      bindQuestionEvents();
    }
  }

  // ==========================================
  // 9. BIND SỰ KIỆN TRẢ LỜI & ĐIỀU HƯỚNG
  // ==========================================
  function bindQuestionEvents() {
    // Sự kiện chọn đáp án (Practice mode)
    document.querySelectorAll('.plk-option-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (state.mode !== 'practice') return;
        if (state.isAnswerChecked) return; // Đã kiểm tra rồi thì không cho đổi

        const optIdx = Number(card.getAttribute('data-opt-index'));
        const currentQ = state.filteredList[state.currentIndex];
        state.selectedOption = optIdx;
        state.isAnswerChecked = true;

        const isCorrect = (optIdx === currentQ.correct);
        if (isCorrect) {
          state.score += 10;
          state.streak += 1;
          if (state.streak > state.maxStreak) state.maxStreak = state.streak;
        } else {
          state.streak = 0;
        }

        // Lưu lịch sử
        state.answersLog[currentQ.id] = {
          selected: optIdx,
          correct: currentQ.correct,
          isCorrect: isCorrect
        };

        refreshQuizArea();
      });
    });

    // Nút câu trước
    const btnPrev = document.getElementById('btn-prev-q');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (state.currentIndex > 0) {
          state.currentIndex--;
          resetQuestionState();
          refreshQuizArea();
        }
      });
    }

    // Nút câu tiếp theo
    const btnNext = document.getElementById('btn-next-q');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (state.currentIndex < state.filteredList.length - 1) {
          state.currentIndex++;
          resetQuestionState();
          refreshQuizArea();
        }
      });
    }

    // Nút Tiếp tục ở ô giải thích
    const btnContinue = document.getElementById('btn-continue-next');
    if (btnContinue) {
      btnContinue.addEventListener('click', () => {
        if (state.currentIndex < state.filteredList.length - 1) {
          state.currentIndex++;
          resetQuestionState();
          refreshQuizArea();
        } else {
          showFinalResults();
        }
      });
    }

    // --- CÁC NÚT DÀNH CHO TEACHER PRESENTATION MODE ---
    const btnReveal = document.getElementById('btn-toggle-reveal');
    if (btnReveal) {
      btnReveal.addEventListener('click', () => {
        state.isAnswerRevealed = !state.isAnswerRevealed;
        refreshQuizArea();
      });
    }

    const btnPoll = document.getElementById('btn-toggle-poll');
    if (btnPoll) {
      btnPoll.addEventListener('click', () => {
        if (state.mockPollData) {
          state.mockPollData = null;
        } else {
          // Tạo ngẫu nhiên phân bố phiếu thăm dò của lớp học
          const currentQ = state.filteredList[state.currentIndex];
          const poll = [0, 0, 0, 0];
          // Học sinh quét thẻ: đáp án đúng chiếm 65-80%
          const totalStudents = 40;
          const correctStudents = Math.floor(totalStudents * (0.65 + Math.random() * 0.2));
          poll[currentQ.correct] = correctStudents;
          
          let remaining = totalStudents - correctStudents;
          const wrongIndices = [0, 1, 2, 3].filter(i => i !== currentQ.correct);
          wrongIndices.forEach((wIdx, i) => {
            if (i === wrongIndices.length - 1) {
              poll[wIdx] = remaining;
            } else {
              const r = Math.floor(Math.random() * (remaining + 1));
              poll[wIdx] = r;
              remaining -= r;
            }
          });
          state.mockPollData = poll;
        }
        refreshQuizArea();
      });
    }

    const btnNextPresent = document.getElementById('btn-next-present');
    if (btnNextPresent) {
      btnNextPresent.addEventListener('click', () => {
        if (state.currentIndex < state.filteredList.length - 1) {
          state.currentIndex++;
          resetQuestionState();
          refreshQuizArea();
        } else {
          state.currentIndex = 0;
          resetQuestionState();
          refreshQuizArea();
        }
      });
    }

    // --- CÁC NÚT KÍCH HOẠT CAMERA SCANNER ---
    const btnOpenCamPresent = document.getElementById('btn-open-cam-present');
    if (btnOpenCamPresent) {
      btnOpenCamPresent.addEventListener('click', () => {
        state.mode = 'scanner';
        resetQuestionState();
        refreshQuizArea();
        updateToolbarStyles();
        startCameraScanner();
      });
    }

    const btnHintOpenScanner = document.getElementById('btn-hint-open-scanner');
    if (btnHintOpenScanner) {
      btnHintOpenScanner.addEventListener('click', () => {
        state.mode = 'scanner';
        resetQuestionState();
        refreshQuizArea();
        updateToolbarStyles();
        startCameraScanner();
      });
    }

    // --- CÁC NÚT ĐIỀU KHIỂN TRONG CHẾ ĐỘ QUÉT CAMERA ---
    const btnFlipCam = document.getElementById('btn-flip-camera');
    if (btnFlipCam) {
      btnFlipCam.addEventListener('click', flipCamera);
    }

    const btnTorch = document.getElementById('btn-toggle-torch');
    if (btnTorch) {
      btnTorch.addEventListener('click', toggleTorch);
    }

    const btnCloseScanner = document.getElementById('btn-close-scanner');
    if (btnCloseScanner) {
      btnCloseScanner.addEventListener('click', () => {
        stopCameraScanner();
        state.mode = 'presentation';
        resetQuestionState();
        refreshQuizArea();
        updateToolbarStyles();
      });
    }

    const btnBatchScan = document.getElementById('btn-batch-scan');
    if (btnBatchScan) {
      btnBatchScan.addEventListener('click', batchScanClassroom);
    }

    const btnResetScan = document.getElementById('btn-reset-scan');
    if (btnResetScan) {
      btnResetScan.addEventListener('click', resetCurrentQuestionScan);
    }

    const btnNextScan = document.getElementById('btn-next-scan');
    if (btnNextScan) {
      btnNextScan.addEventListener('click', nextQuestionInScanner);
    }

    const btnViewPresent = document.getElementById('btn-view-present');
    if (btnViewPresent) {
      btnViewPresent.addEventListener('click', () => {
        const counts = [0, 0, 0, 0];
        Object.values(state.scannedStudents).forEach(s => {
          if (s.option >= 0 && s.option <= 3) counts[s.option]++;
        });
        state.mockPollData = counts;
        stopCameraScanner();
        state.mode = 'presentation';
        resetQuestionState();
        refreshQuizArea();
        updateToolbarStyles();
      });
    }

    // --- BẬT / TẮT BẢNG ĐIỂM DANH TRONG PRESENTATION MODE ---
    const btnToggleRollCall = document.getElementById('btn-toggle-rollcall');
    if (btnToggleRollCall) {
      btnToggleRollCall.addEventListener('click', () => {
        state.showRollCall = !state.showRollCall;
        refreshQuizArea();
      });
    }

    // --- ĐIỂM DANH THỦ CÔNG KHI NHẤP VÀO THẺ HỌC SINH ---
    document.querySelectorAll('.rc-student-card').forEach(card => {
      card.addEventListener('click', () => {
        const studentId = Number(card.getAttribute('data-student-id'));
        const currentQ = state.filteredList[state.currentIndex];
        if (!currentQ) return;

        if (state.scannedStudents[studentId]) {
          // Bỏ điểm danh nếu nhấp lần 2
          delete state.scannedStudents[studentId];
          card.className = 'rc-student-card pending';
          const dot = card.querySelector('.rc-indicator-dot');
          if (dot) dot.className = 'rc-indicator-dot dot-gray';
          const pill = card.querySelector('.rc-status-pill');
          if (pill) pill.innerHTML = '<span class="rc-pending-badge">⏳ Chưa nộp</span>';
        } else {
          // Điểm danh học sinh với đáp án đúng của câu hỏi
          const chosenOpt = currentQ.correct;
          state.scannedStudents[studentId] = {
            id: studentId,
            name: CLASS_ROSTER.find(s => s.id === studentId)?.name || `HS ${studentId}`,
            option: chosenOpt,
            isCorrect: true
          };
          updateStudentRollCallCard(studentId, chosenOpt, true);
        }
        updateScannerMetrics();
      });
    });
  }

  // ==========================================
  // 10. BẢNG TỔNG KẾT KẾT QUẢ CUỐI CÙNG
  // ==========================================
  function showFinalResults() {
    const totalQ = state.filteredList.length;
    let correctCount = 0;
    Object.values(state.answersLog).forEach(ans => {
      if (ans.isCorrect) correctCount++;
    });

    const percent = Math.round((correctCount / totalQ) * 100);
    let titleMsg = '🌟 Rất tốt!';
    if (percent === 100) titleMsg = '🏆 Tuyệt đối xuất sắc!';
    else if (percent < 50) titleMsg = '💪 Cần cố gắng ôn tập thêm nhé!';

    const bodyContent = document.getElementById('plickers-body-content');
    if (!bodyContent) return;

    bodyContent.innerHTML = `
      <div class="plk-result-card">
        <div class="result-trophy">🏆</div>
        <h2>${titleMsg}</h2>
        <p>Bạn đã hoàn thành bộ câu hỏi trắc nghiệm KHTN!</p>

        <div class="result-stats-row">
          <div class="res-stat-box">
            <div class="res-val">${correctCount}/${totalQ}</div>
            <div class="res-lbl">Số câu đúng</div>
          </div>
          <div class="res-stat-box">
            <div class="res-val">${percent}%</div>
            <div class="res-lbl">Độ chính xác</div>
          </div>
          <div class="res-stat-box">
            <div class="res-val">${state.score}</div>
            <div class="res-lbl">Tổng điểm</div>
          </div>
          <div class="res-stat-box">
            <div class="res-val">${state.maxStreak} 🔥</div>
            <div class="res-lbl">Chuỗi đúng dài nhất</div>
          </div>
        </div>

        <div class="result-actions">
          <button class="plk-btn-primary" id="btn-restart-quiz">
            🔄 Làm lại từ đầu
          </button>
          <button class="plk-btn-secondary" id="btn-switch-teacher">
            🖥️ Chuyển sang chế độ Trình chiếu
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-restart-quiz')?.addEventListener('click', () => {
      state.currentIndex = 0;
      state.score = 0;
      state.streak = 0;
      state.maxStreak = 0;
      state.answersLog = {};
      resetQuestionState();
      refreshQuizArea();
    });

    document.getElementById('btn-switch-teacher')?.addEventListener('click', () => {
      state.mode = 'presentation';
      state.currentIndex = 0;
      resetQuestionState();
      refreshQuizArea();
      updateToolbarStyles();
    });
  }

})();
