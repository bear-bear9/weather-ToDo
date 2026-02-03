// 全国の天気を検索できるするように当たって
// 検索欄の日本語マッチングを47都道府県に完全対応
// バグ：石川県だけメキシコが参照されるので英名を金沢に変更して取得
export const cityNameJp: { [key: string]: string } = {
  // 北海道・東北
  "北海道": "Hokkaido",
  "札幌": "Sapporo",
  "青森": "Aomori", "岩手": "Iwate", "宮城": "Miyagi", "仙台": "Sendai",
  "秋田": "Akita", "山形": "Yamagata", "福島": "Fukushima",

  // --- 茨城  ---
  "茨城": "Ibaraki", "水戸": "Mito", "ひたちなか": "Hitachinaka", "日立": "Hitachi",
  "土浦": "Tsuchiura", "古河": "Koga", "つくば": "Tsukuba", "鹿嶋": "Kashima",
  "守谷": "Moriya", "筑西": "Chikusei", "坂東": "Bando", "神栖": "Kamisu",

  // --- 埼玉  ---
  "埼玉": "Saitama", "さいたま": "Saitama", "所沢": "Tokorozawa", "川越": "Kawagoe",
  "川口": "Kawaguchi", "熊谷": "Kumagaya", "行田": "Gyoda", "秩父": "Chichibu",
  "飯能": "Hanno", "加須": "Kazo", "本庄": "Honjo", "東松山": "Higashimatsuyama",
  "春日部": "Kasukabe", "狭山": "Sayama", "羽生": "Hanyu", "鴻巣": "Konosu",
  "深谷": "Fukaya", "上尾": "Ageo", "草加": "Soka", "越谷": "Koshigaya",
  "蕨": "Warabi", "戸田": "Toda", "入間": "Iruma", "朝霞": "Asaka", "志木": "Shiki",
  "和光": "Wako", "新座": "Niiza", "久喜": "Kuki", "北本": "Kitamoto", "八潮": "Yashio",
  "富士見": "Fujimi", "三郷": "Misato", "蓮田": "Hasuda", "坂戸": "Sakado",
  "幸手": "Satte", "鶴ヶ島": "Tsurugashima", "日高": "Hidaka", "吉川": "Yoshikawa",
  "ふじみ野": "Fujimino", "白岡": "Shiraoka",

  // --- 東京（23区追加版） ---
  "東京": "Tokyo", "とうきょう": "Tokyo",
  "千代田": "Chiyoda", "中央": "Chuo", "港": "Minato", "新宿": "Shinjuku",
  "文京": "Bunkyo", "台東": "Taito", "墨田": "Sumida", "江東": "Koto",
  "品川": "Shinagawa", "目黒": "Meguro", "大田": "Ota", "世田谷": "Setagaya",
  "渋谷": "Shibuya", "中野": "Nakano", "杉並": "Suginami", "豊島": "Toshima",
  "北": "Kita", "荒川": "Arakawa", "板橋": "Itabashi", "練馬": "Nerima",
  "足立": "Adachi", "葛飾": "Katsushika", "江戸川": "Edogawa",
  // --- 東京（多摩・武蔵野） ---
  "八王子": "Hachioji", "立川": "Tachikawa", "武蔵野": "Musashino", "三鷹": "Mitaka",
  "青梅": "Ome", "府中": "Fuchu", "昭島": "Akishima", "調布": "Chofu",
  "町田": "Machida", "小金井": "Koganei", "小平": "Kodaira", "日野": "Hino",
  "東村山": "Higashimurayama", "国分寺": "Kokubunji", "国立": "Kunitachi",
  "福生": "Fussa", "狛江": "Komae", "東大和": "Higashiyamato", "清瀬": "Kiyose",
  "東久留米": "Higashikurume", "武蔵村山": "Musashimurayama", "多摩": "Tama",
  "稲城": "Inagi", "羽村": "Hamura", "あきる野": "Akiruno", "西東京": "Nishitokyo",

  // --- 神奈川 ---
  "神奈川": "Kanagawa", "横浜": "Yokohama", "川崎": "Kawasaki", "相模原": "Sagamihara",
  "横須賀": "Yokosuka", "平塚": "Hiratsuka", "鎌倉": "Kamakura", "藤沢": "Fujisawa",
  "小田原": "Odawara", "茅ヶ崎": "Chigasaki", "逗子": "Zushi", "三浦": "Miura",
  "秦野": "Hadano", "厚木": "Atsugi", "大和": "Yamato", "伊勢原": "Isehara",
  "海老名": "Ebina", "座間": "Zama", "南足柄": "Minamiashigara", "綾瀬": "Ayase",

  // --- 千葉 ---
  "千葉": "Chiba", "市川": "Ichikawa", "船橋": "Funabashi", "松戸": "Matsudo",
  "野田": "Noda", "茂原": "Mobara", "成田": "Narita", "佐倉": "Sakura", "東金": "Togane",
  "習志野": "Narashino", "柏": "Kashiwa", "勝浦": "Katsuura", "市原": "Ichihara",
  "流山": "Nagareyama", "八千代": "Yachiyo", "我孫子": "Abiko", "鴨川": "Kamogawa",
  "鎌ケ谷": "Kamagaya", "君津": "Kimitsu", "浦安": "Urayasu", "四街道": "Yotsukaido",

  // 栃木・群馬
  "栃木": "Tochigi", "宇都宮": "Utsunomiya",
  "群馬": "Gunma", "前橋": "Maebashi", "高崎": "Takasaki",

  // 中部・北陸
  "新潟": "Niigata", "富山": "Toyama", "石川": "Kanazawa", "福井": "Fukui",
  "山梨": "Yamanashi", "長野": "Nagano", "岐阜": "Gifu",
  "静岡": "Shizuoka", "浜松": "Hamamatsu", "愛知": "Aichi", "名古屋": "Nagoya",

  // 近畿
  "三重": "Mie", "滋賀": "Shiga", "京都": "Kyoto",
  "大阪": "Osaka", "おおさか": "Osaka", "堺": "Sakai",
  "兵庫": "Hyogo", "神戸": "Kobe", "奈良": "Nara", "和歌山": "Wakayama",

  // 中国・四国
  "鳥取": "Tottori", "島根": "Shimane", "岡山": "Okayama", "広島": "Hiroshima", "山口": "Yamaguchi",
  "徳島": "Tokushima", "香川": "Kagawa", "愛媛": "Ehime", "高知": "Kochi",

  // 九州・沖縄
  "福岡": "Fukuoka", "北九州": "Kitakyushu", "佐賀": "Saga", "長崎": "Nagasaki",
  "熊本": "Kumamoto", "大分": "Oita", "宮崎": "Miyazaki", "鹿児島": "Kagoshima", "沖縄": "Okinawa"
};

// 検索用に地域別での検索を追加
export const regionData: { [key: string]: string[] } = {
  "北海道": ["北海道"],
  "東北": ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  "関東": ["茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県"],
  "中部": ["新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県"],
  "近畿": ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  "中国": ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  "四国": ["徳島県", "香川県", "愛媛県", "高知県"],
  "九州": ["福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"]
};

export const allPrefectures = Object.values(regionData).flat();