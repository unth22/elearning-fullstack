-- ============================================================
-- Nội dung "Kỹ thuật" (cơ khí, điện, hóa học, xây dựng)
-- Nạp vào khóa "Sản xuất" (id=7) đã có sẵn trong danh mục nhưng chưa có nội dung.
-- Nguồn: giáo trình "KỸ THUẬT.pdf" do người dùng cung cấp.
-- Cách chạy: psql -U <user> -d elearning -f 004_ky_thuat_content.sql   (idempotent)
-- ============================================================

UPDATE courses
SET description = 'Dụng cụ cơ khí, thiết bị điện, hóa học, xây dựng',
    level = 'HSK 4–6'
WHERE id = 7;

-- ---- Từ vựng: chia theo 5 chủ đề qua cột tags ----
INSERT INTO vocabulary (course_id, zh, pinyin, vi, en, tags, order_index)
SELECT 7, t.zh, t.pinyin, t.vi, t.en, t.tags, t.ord
FROM (VALUES
  -- Chủ đề: cơ khí (dụng cụ, đồ nghề)
  ('组立',        'zǔlì',              'lắp ráp',                  'assembly',                 ARRAY['cơ khí'],  1),
  ('技术员',      'jìshùyuán',         'kỹ thuật viên',            'technician',               ARRAY['cơ khí'],  2),
  ('大力钳',      'dàlì qián',         'kìm bấm',                  'lever pliers',             ARRAY['cơ khí'],  3),
  ('老虎钳',      'lǎohǔ qián',        'kìm con hổ',               'vise-grip pliers',         ARRAY['cơ khí'],  4),
  ('尖嘴钳',      'jiānzuǐ qián',      'kìm miệng nhọn',           'needle-nose pliers',       ARRAY['cơ khí'],  5),
  ('卡簧钳',      'kǎhuáng qián',      'kìm cắt phe',              'circlip pliers',           ARRAY['cơ khí'],  6),
  ('钢丝钳',      'gāngsī qián',       'kìm răng',                 'wire pliers',              ARRAY['cơ khí'],  7),
  ('螺丝',        'luósī',             'ốc vít',                   'screw',                    ARRAY['cơ khí'],  8),
  ('卡簧',        'kǎhuáng',           'phe cài, khuyên hãm chốt', 'circlip',                  ARRAY['cơ khí'],  9),
  ('钉木枪',      'dīngmùqiāng',       'súng bấm đinh gỗ',         'nail gun',                 ARRAY['cơ khí'], 10),
  ('活动扳手',    'huódòng bānshǒu',   'mỏ lết hoạt động',         'adjustable wrench',       ARRAY['cơ khí'], 11),
  ('管钳',        'guǎnqián',          'mỏ lết răng',              'pipe wrench',              ARRAY['cơ khí'], 12),
  ('套筒',        'tàotǒng',           'măng xông, đầu tuýp',      'socket',                   ARRAY['cơ khí'], 13),
  ('两用扳手',    'liǎngyòng bānshǒu', 'mỏ lết lưỡng dụng',        'combination wrench',       ARRAY['cơ khí'], 14),
  ('锉刀',        'cuòdāo',            'dũa dẹp',                  'flat file',                ARRAY['cơ khí'], 15),
  ('螺丝刀',      'luósīdāo',          'tua vít',                  'screwdriver',              ARRAY['cơ khí'], 16),
  ('三角锉刀',    'sānjiǎo cuòdāo',    'dũa 3 cạnh',               'triangular file',          ARRAY['cơ khí'], 17),
  ('麻花钻头',    'máhuā zuàntóu',     'mũi khoan bê tông',        'twist drill bit',          ARRAY['cơ khí'], 18),
  ('电锤',        'diànchuí',          'búa điện',                 'electric hammer',          ARRAY['cơ khí'], 19),
  ('剪刀',        'jiǎndāo',           'kéo',                      'scissors',                 ARRAY['cơ khí'], 20),
  ('美工刀',      'měigōngdāo',        'dao thủ công',             'utility knife',            ARRAY['cơ khí'], 21),
  ('螺栓',        'luóshuān',          'bu lông',                  'bolt',                     ARRAY['cơ khí'], 22),
  ('内六角螺丝',  'nèi liùjiǎo luósī', 'ốc lục giác',              'hex socket screw',         ARRAY['cơ khí'], 23),
  ('内六角扳手',  'nèi liùjiǎo bānshǒu','chìa lục giác',           'allen key',                ARRAY['cơ khí'], 24),
  ('内六角螺杆',  'nèi liùjiǎo luógǎn','bu lông lục giác',         'hex bolt',                 ARRAY['cơ khí'], 25),
  ('电焊条',      'diànhàntiáo',       'que hàn',                  'welding rod',              ARRAY['cơ khí'], 26),
  ('开口扳手',    'kāikǒu bānshǒu',    'chìa khóa vòng miệng',     'open-end wrench',          ARRAY['cơ khí'], 27),
  ('平面砂布轮',  'píngmiàn shābùlún', 'giấy nhám xếp tròn',       'flap disc',                ARRAY['cơ khí'], 28),
  ('不锈钢电焊条','bùxiùgāng diànhàntiáo','que hàn inox',          'stainless welding rod',    ARRAY['cơ khí'], 29),
  ('手磨机',      'shǒumójī',          'máy mài cầm tay',          'hand grinder',             ARRAY['cơ khí'], 30),
  ('电动砂光机',  'diàndòng shāguāngjī','máy chà nhám điện',       'electric sander',          ARRAY['cơ khí'], 31),
  ('黄油',        'huángyóu',          'mỡ bò thường',             'grease',                   ARRAY['cơ khí'], 32),
  ('地板蜡',      'dìbǎnlà',           'sáp đánh bóng gạch',       'floor wax',                ARRAY['cơ khí'], 33),
  ('铁皮扣',      'tiěpíkòu',          'bo sắt',                   'metal buckle',             ARRAY['cơ khí'], 34),
  ('打包铁皮',    'dǎbāo tiěpí',       'đai sắt',                  'steel strapping',          ARRAY['cơ khí'], 35),
  ('拉钉',        'lādīng',            'đinh rive',                'rivet',                    ARRAY['cơ khí'], 36),
  ('铁钉',        'tiědīng',           'đinh sắt',                 'steel nail',               ARRAY['cơ khí'], 37),
  ('镇流器',      'zhènliúqì',         'tăng phô',                 'ballast',                  ARRAY['cơ khí'], 38),
  ('铁丝',        'tiěsī',             'kẽm chì',                  'wire',                     ARRAY['cơ khí'], 39),
  ('电胶布',      'diàn jiāobù',       'băng keo điện',            'electrical tape',          ARRAY['cơ khí'], 40),
  ('切割片',      'qiēgēpiàn',         'đá cắt',                   'cutting disc',             ARRAY['cơ khí'], 41),
  ('万能胶',      'wànnéngjiāo',       'keo vạn năng',             'universal glue',           ARRAY['cơ khí'], 42),
  ('生料带',      'shēngliàodài',      'băng keo lụa',             'teflon tape',              ARRAY['cơ khí'], 43),
  ('电容器',      'diànróngqì',        'tụ điện',                  'capacitor',                ARRAY['cơ khí'], 44),
  ('高压油管',    'gāoyā yóuguǎn',     'ống dầu cao áp',           'high-pressure oil hose',   ARRAY['cơ khí'], 45),
  ('丝锥',        'sīzhuī',            'ta rô',                    'tap (threading tool)',     ARRAY['cơ khí'], 46),
  ('电笔',        'diànbǐ',            'bút thử điện',             'voltage tester',           ARRAY['cơ khí'], 47),
  ('割草刀',      'gēcǎodāo',          'lưỡi dao cắt cỏ',          'grass blade',              ARRAY['cơ khí'], 48),
  ('割草机',      'gēcǎojī',           'máy cắt cỏ',               'lawn mower',               ARRAY['cơ khí'], 49),
  ('气枪',        'qìqiāng',           'súng xịt bụi',             'air blow gun',             ARRAY['cơ khí'], 50),
  ('铁皮打包机',  'tiěpí dǎbāojī',     'máy bấm đai sắt',          'strapping machine',        ARRAY['cơ khí'], 51),
  ('快速接头',    'kuàisù jiētóu',     'đầu nối nhanh',            'quick connector',          ARRAY['cơ khí'], 52),
  ('胶带封口机',  'jiāodài fēngkǒujī', 'máy ép túi PE',            'tape sealer',              ARRAY['cơ khí'], 53),
  ('风管',        'fēngguǎn',          'ống gió',                  'air duct',                 ARRAY['cơ khí'], 54),
  ('气管',        'qìguǎn',            'ống hơi',                  'air hose',                 ARRAY['cơ khí'], 55),
  ('气管外牙弯头','qìguǎn wài yá wāntóu','co hơi răng ngoài',      'male thread elbow',        ARRAY['cơ khí'], 56),
  ('管束',        'guǎnshù',           'cổ dê',                    'hose clamp',               ARRAY['cơ khí'], 57),
  ('轴承',        'zhóuchéng',         'bạc đạn',                  'bearing',                  ARRAY['cơ khí'], 58),
  ('气管直通外插','qìguǎn zhítōng wàichā','nối hơi nhựa',          'straight air connector',   ARRAY['cơ khí'], 59),

  -- Chủ đề: kỹ thuật chung (bộ phận, quản lý)
  ('技术部分',    'jìshù bùfèn',       'bộ phận kỹ thuật',         'technical department',     ARRAY['kỹ thuật chung'], 60),
  ('技术革命',    'jìshù gémìng',      'cách mạng kỹ thuật',       'technical revolution',     ARRAY['kỹ thuật chung'], 61),
  ('技术装备',    'jìshù zhuāngbèi',   'trang bị kỹ thuật',        'technical equipment',      ARRAY['kỹ thuật chung'], 62),
  ('仪器',        'yíqì',              'máy móc',                  'instrument',               ARRAY['kỹ thuật chung'], 63),
  ('仪器设备',    'yíqì shèbèi',       'máy móc thiết bị',         'equipment',                ARRAY['kỹ thuật chung'], 64),
  ('质量检验员',  'zhìliàng jiǎnyànyuán','nhân viên kiểm tra chất lượng','QC staff',            ARRAY['kỹ thuật chung'], 65),
  ('咨询',        'zīxún',             'tư vấn',                   'consulting',               ARRAY['kỹ thuật chung'], 66),
  ('铝',          'lǚ',                'nhôm',                     'aluminum',                 ARRAY['kỹ thuật chung'], 67),
  ('绘图员',      'huìtúyuán',         'nhân viên vẽ kỹ thuật',    'drafter',                  ARRAY['kỹ thuật chung'], 68),
  ('管理',        'guǎnlǐ',            'quản lý',                  'management',               ARRAY['kỹ thuật chung'], 69),
  ('挂锁',        'guàsuǒ',            'ổ khóa cửa',               'padlock',                  ARRAY['kỹ thuật chung'], 70),
  ('生产管理',    'shēngchǎn guǎnlǐ',  'quản lý sản xuất',         'production management',    ARRAY['kỹ thuật chung'], 71),
  ('技术管理',    'jìshù guǎnlǐ',      'quản lý kỹ thuật',         'technical management',     ARRAY['kỹ thuật chung'], 72),
  ('仪器设备运行管理','yíqì shèbèi yùnxíng guǎnlǐ','vận hành quản lý máy móc thiết bị','equipment operation management',ARRAY['kỹ thuật chung'], 73),
  ('运行',        'yùnxíng',           'vận hành',                 'operation',                ARRAY['kỹ thuật chung'], 74),
  ('生产制度',    'shēngchǎn zhìdù',   'chế độ sản xuất',          'production system',        ARRAY['kỹ thuật chung'], 75),
  ('技术研究所',  'jìshù yánjiūsuǒ',   'viện nghiên cứu kỹ thuật', 'technical research institute',ARRAY['kỹ thuật chung'], 76),
  ('生产安全',    'shēngchǎn ānquán',  'an toàn sản xuất',         'production safety',        ARRAY['kỹ thuật chung'], 77),
  ('劳动安全',    'láodòng ānquán',    'an toàn lao động',         'labor safety',             ARRAY['kỹ thuật chung'], 78),
  ('维护',        'wéihù',             'bảo trì, bảo vệ',          'maintenance',              ARRAY['kỹ thuật chung'], 79),
  ('工程师',      'gōngchéngshī',      'kỹ sư',                    'engineer',                 ARRAY['kỹ thuật chung'], 80),
  ('刀片',        'dāopiàn',           'lưỡi dao',                 'blade',                    ARRAY['kỹ thuật chung'], 81),
  ('类型',        'lèixíng',           'loại hình',                'type',                     ARRAY['kỹ thuật chung'], 82),
  ('日光灯管',    'rìguāngdēngguǎn',   'bóng đèn neon',            'fluorescent tube',         ARRAY['kỹ thuật chung'], 83),
  ('平面',        'píngmiàn',          'mặt bằng',                 'plane',                    ARRAY['kỹ thuật chung'], 84),
  ('房门锁扣',    'fángmén suǒkòu',    'chốt khóa cửa',            'door latch',               ARRAY['kỹ thuật chung'], 85),
  ('节能灯',      'jiénéngdēng',       'bóng đèn compact',         'energy-saving lamp',       ARRAY['kỹ thuật chung'], 86),
  ('合同工',      'hétónggōng',        'công nhân hợp đồng',       'contract worker',          ARRAY['kỹ thuật chung'], 87),
  ('起辉器',      'qǐhuīqì',           'chuột đèn',                'starter',                  ARRAY['kỹ thuật chung'], 88),
  ('技工',        'jìgōng',            'công nhân kỹ thuật',       'skilled worker',           ARRAY['kỹ thuật chung'], 89),
  ('技术服务',    'jìshù fúwù',        'dịch vụ kỹ thuật',         'technical service',        ARRAY['kỹ thuật chung'], 90),
  ('流水线',      'liúshuǐxiàn',       'dây chuyền sản xuất',      'production line',          ARRAY['kỹ thuật chung'], 91),
  ('效率',        'xiàolǜ',            'hiệu suất',                'efficiency',               ARRAY['kỹ thuật chung'], 92),
  ('玻璃锁扣',    'bōlí suǒkòu',       'khóa cửa kính',            'glass door lock',          ARRAY['kỹ thuật chung'], 93),
  ('白铁',        'báitiě',            'tôn tráng kẽm',            'galvanized iron',          ARRAY['kỹ thuật chung'], 94),

  -- Chủ đề: điện (thiết bị công nghiệp, kỹ thuật điện)
  ('冷却器',      'lěngquèqì',         'bộ làm mát',               'cooler',                   ARRAY['điện'], 95),
  ('保险丝',      'bǎoxiǎnsī',         'cầu chì',                  'fuse',                     ARRAY['điện'], 96),
  ('铁锤',        'tiěchuí',           'búa sắt',                  'hammer',                   ARRAY['điện'], 97),
  ('机修',        'jīxiū',             'cơ khí (sửa chữa)',        'mechanical repair',        ARRAY['điện'], 98),
  ('机电',        'jīdiàn',            'cơ điện',                  'electromechanical',        ARRAY['điện'], 99),
  ('多功能测试表','duō gōngnéng cèshìbiǎo','đồng hồ đa năng',      'multimeter',               ARRAY['điện'], 100),
  ('机械工业',    'jīxiè gōngyè',      'công nghiệp cơ khí',       'mechanical industry',      ARRAY['điện'], 101),
  ('装修',        'zhuāngxiū',         'lắp đặt máy móc',          'installation',             ARRAY['điện'], 102),
  ('电子用具',    'diànzǐ yòngjù',     'dụng cụ sửa điện',         'electronic tools',         ARRAY['điện'], 103),
  ('气压缩机',    'qì yāsuōjī',        'máy nén khí',              'air compressor',           ARRAY['điện'], 104),
  ('电焊机',      'diànhànjī',         'máy hàn',                  'welding machine',          ARRAY['điện'], 105),
  ('安全帽',      'ānquánmào',         'mũ an toàn',               'safety helmet',            ARRAY['điện'], 106),
  ('点烙铁',      'diǎn làotiě',       'mỏ hàn điện',              'soldering iron',           ARRAY['điện'], 107),
  ('机修工',      'jīxiūgōng',         'nhân viên cơ khí',         'mechanic',                 ARRAY['điện'], 108),
  ('电焊工',      'diànhàngōng',       'thợ hàn điện',             'welder',                   ARRAY['điện'], 109),
  ('电路图',      'diànlùtú',          'bảng mạch điện',           'circuit diagram',          ARRAY['điện'], 110),
  ('供电',        'gōngdiàn',          'cung cấp điện',            'power supply',             ARRAY['điện'], 111),
  ('电气工业',    'diànqì gōngyè',     'công nghiệp điện khí',     'electrical industry',      ARRAY['điện'], 112),
  ('电气化',      'diànqìhuà',         'điện khí hóa',             'electrification',          ARRAY['điện'], 113),
  ('电气',        'diànqì',            'điện khí',                 'electrical',               ARRAY['điện'], 114),
  ('接地插座',    'jiēdì chāzuò',      'phích cắm có tiếp đất',    'grounded outlet',          ARRAY['điện'], 115),
  ('三相插座',    'sānxiàng chāzuò',   'phích cắm ba pha',         '3-phase outlet',           ARRAY['điện'], 116),
  ('交流电',      'jiāoliúdiàn',       'điện xoay chiều',          'AC',                       ARRAY['điện'], 117),
  ('直流电',      'zhíliúdiàn',        'điện một chiều',           'DC',                       ARRAY['điện'], 118),
  ('感应电流',    'gǎnyìng diànliú',   'dòng điện cảm ứng',        'induced current',          ARRAY['điện'], 119),
  ('配电系统',    'pèidiàn xìtǒng',    'hệ thống phân phối điện',  'distribution system',      ARRAY['điện'], 120),
  ('电力系统',    'diànlì xìtǒng',     'hệ thống điện',            'power system',             ARRAY['điện'], 121),
  ('用电',        'yòngdiàn',          'sử dụng điện',             'power usage',              ARRAY['điện'], 122),
  ('电力技术',    'diànlì jìshù',      'kỹ thuật điện',            'electrical engineering',   ARRAY['điện'], 123),
  ('电器',        'diànqì',            'thiết bị điện',            'electrical device',        ARRAY['điện'], 124),
  ('修电器',      'xiū diànqì',        'sửa chữa thiết bị điện',   'repair electrical device', ARRAY['điện'], 125),
  ('自动化',      'zìdònghuà',         'tự động hóa',              'automation',               ARRAY['điện'], 126),
  ('电工',        'diàngōng',          'thợ điện',                 'electrician',              ARRAY['điện'], 127),

  -- Chủ đề: hóa học
  ('产品研制',    'chǎnpǐn yánzhì',    'chế tạo sản phẩm',         'product development',      ARRAY['hóa học'], 128),
  ('化学动力',    'huàxué dònglì',     'động học hóa học',         'chemical kinetics',        ARRAY['hóa học'], 129),
  ('油化工艺',    'yóuhuà gōngyì',     'công nghệ hóa dầu',        'petrochemical technology', ARRAY['hóa học'], 130),
  ('质量检验',    'zhìliàng jiǎnyàn',  'kiểm tra chất lượng',      'quality inspection',       ARRAY['hóa học'], 131),
  ('化工',        'huàgōng',           'hóa chất',                 'chemical',                 ARRAY['hóa học'], 132),
  ('化工厂',      'huàgōngchǎng',      'nhà máy hóa chất',         'chemical plant',           ARRAY['hóa học'], 133),
  ('化学工程',    'huàxué gōngchéng',  'kỹ thuật hóa học',         'chemical engineering',     ARRAY['hóa học'], 134),
  ('化学反应',    'huàxué fǎnyìng',    'phản ứng hóa học',         'chemical reaction',        ARRAY['hóa học'], 135),
  ('化学肥料',    'huàxué féiliào',    'phân bón hóa học',         'chemical fertilizer',      ARRAY['hóa học'], 136),
  ('化工制造',    'huàgōng zhìzào',    'sản xuất hóa chất',        'chemical manufacturing',   ARRAY['hóa học'], 137),
  ('催化',        'cuīhuà',            'xúc tác',                  'catalyst',                 ARRAY['hóa học'], 138),
  ('制造肥料',    'zhìzào féiliào',    'sản xuất phân bón',        'fertilizer production',    ARRAY['hóa học'], 139),

  -- Chủ đề: xây dựng
  ('施工图',      'shīgōngtú',         'bản vẽ thi công',          'construction drawing',     ARRAY['xây dựng'], 140),
  ('工地管理费',  'gōngdì guǎnlǐfèi',  'chi phí quản lý công trường','site management fee',    ARRAY['xây dựng'], 141),
  ('质量',        'zhìliàng',          'chất lượng',               'quality',                  ARRAY['xây dựng'], 142),
  ('建造成本',    'jiànzào chéngběn',  'chi phí xây dựng',         'construction cost',        ARRAY['xây dựng'], 143),
  ('材料成本',    'cáiliào chéngběn',  'chi phí vật tư',           'material cost',            ARRAY['xây dựng'], 144),
  ('建设工程',    'jiànshè gōngchéng', 'công trình xây dựng',      'construction project',     ARRAY['xây dựng'], 145),
  ('工程',        'gōngchéng',         'công trình',               'project',                  ARRAY['xây dựng'], 146),
  ('建设项目',    'jiànshè xiàngmù',   'dự án xây dựng',           'construction project',     ARRAY['xây dựng'], 147),
  ('项目',        'xiàngmù',           'dự án',                    'project',                  ARRAY['xây dựng'], 148),
  ('检查材料',    'jiǎnchá cáiliào',   'kiểm tra vật liệu',        'material inspection',      ARRAY['xây dựng'], 149),
  ('监督',        'jiāndū',            'giám sát',                 'supervision',              ARRAY['xây dựng'], 150),
  ('建设工程师',  'jiànshè gōngchéngshī','kỹ sư xây dựng',         'construction engineer',    ARRAY['xây dựng'], 151),
  ('施工',        'shīgōng',           'thi công',                 'construction work',        ARRAY['xây dựng'], 152),
  ('除锈剂',      'chúxiùjì',          'chất tẩy gỉ',              'rust remover',             ARRAY['xây dựng'], 153),
  ('材料',        'cáiliào',           'vật liệu',                 'material',                 ARRAY['xây dựng'], 154),
  ('项目进度',    'xiàngmù jìndù',     'tiến độ dự án',            'project progress',         ARRAY['xây dựng'], 155),
  ('建设',        'jiànshè',           'xây dựng',                 'construction',             ARRAY['xây dựng'], 156),
  ('建材',        'jiàncái',           'vật liệu xây dựng',        'building materials',       ARRAY['xây dựng'], 157)
) AS t(zh, pinyin, vi, en, tags, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM vocabulary v WHERE v.course_id = 7 AND v.zh = t.zh
);

-- ---- Ngữ pháp: 2 mẫu câu rút ra từ ví dụ thực tế trong giáo trình ----
INSERT INTO grammar_patterns (course_id, pattern, example_zh, example_vi, order_index)
SELECT 7, t.pattern, t.zh, t.vi, t.ord
FROM (VALUES
  ('由…来…',       '这个项目由我来监督。',                           'Dự án này do tôi giám sát.',                              1),
  ('…不怎样',      '这几天电力系统不怎样，早上总是停电。',           'Hệ thống điện mấy ngày nay không tốt, sáng nào cũng cúp điện.', 2)
) AS t(pattern, zh, vi, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM grammar_patterns g WHERE g.course_id = 7 AND g.pattern = t.pattern
);

-- ---- Câu ví dụ thực tiễn (7 câu, từ giáo trình) ----
INSERT INTO example_sentences (course_id, zh, pinyin, vi, order_index)
SELECT 7, t.zh, t.pinyin, t.vi, t.ord
FROM (VALUES
  ('他是建设工程师。',                 'Tā shì jiànshè gōngchéngshī.',                              'Anh ấy là một kỹ sư xây dựng.', 1),
  ('这个车间主要制造一些仪器设备。',   'Zhège chējiān zhǔyào zhìzào yīxiē yíqì shèbèi.',            'Phân xưởng này chủ yếu sản xuất một số dụng cụ và thiết bị.', 2),
  ('这几天电力系统不怎样，早上总是停电。','Zhè jǐ tiān diànlì xìtǒng bù zěnyàng, zǎoshang zǒng shì tíngdiàn.', 'Hệ thống điện mấy ngày nay không tốt, sáng nào cũng cúp điện.', 3),
  ('这个项目由我来监督。',             'Zhège xiàngmù yóu wǒ lái jiāndū.',                          'Dự án này do tôi giám sát.', 4),
  ('我们家电子用具你放哪儿了？',       'Wǒmen jiā diànzǐ yòngjù nǐ fàng nǎ''er le?',                'Bạn đã đặt các thiết bị điện tử của chúng tôi ở đâu?', 5),
  ('我想买一条电胶布。',               'Wǒ xiǎng mǎi yī tiáo diàn jiāobù.',                         'Tôi muốn mua một cuộn băng dính điện.', 6),
  ('你家有三角锉刀吗，给我借一会儿。', 'Nǐ jiā yǒu sānjiǎo cuòdāo ma, gěi wǒ jiè yīhuǐ''er.',       'Nhà bạn có dũa 3 cạnh không, cho mình mượn một lúc nhé.', 7)
) AS t(zh, pinyin, vi, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM example_sentences s WHERE s.course_id = 7 AND s.zh = t.zh
);

-- ---- Bài học (để "Lộ trình của bạn" có nội dung) ----
INSERT INTO lessons (course_id, title, order_index)
SELECT 7, t.title, t.ord
FROM (VALUES
  ('Bài 1: Dụng cụ cơ khí thông dụng', 1),
  ('Bài 2: Thiết bị điện & công nghiệp', 2),
  ('Bài 3: Hóa học & xây dựng', 3)
) AS t(title, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM lessons l WHERE l.course_id = 7 AND l.order_index = t.ord
);
