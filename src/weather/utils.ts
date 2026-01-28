// 全国の天気を検索できるするように当たって
// 検索欄の日本語マッチングを47都道府県に完全対応
// バグ：石川県だけメキシコが参照されるので英名を金沢に変更して取得
export const cityNameJp: { [key: string]: string } = {
  "北海道": "Hokkaido",
  "青森": "Aomori", "岩手": "Iwate", "宮城": "Miyagi", "秋田": "Akita", "山形": "Yamagata", "福島": "Fukushima",
  "茨城": "Ibaraki", "栃木": "Tochigi", "群馬": "Gunma", "埼玉": "Saitama", "さいたま": "Saitama",
  "千葉": "Chiba", "東京": "Tokyo", "とうきょう": "Tokyo", "神奈川": "Kanagawa", "横浜": "Yokohama",
  "新潟": "Niigata", "富山": "Toyama", "石川": "Kanazawa", "福井": "Fukui",
  "山梨": "Yamanashi", "長野": "Nagano", "岐阜": "Gifu", "静岡": "Shizuoka", "愛知": "Aichi",
  "三重": "Mie", "滋賀": "Shiga", "京都": "Kyoto", "大阪": "Osaka", "おおさか": "Osaka",
  "兵庫": "Hyogo", "奈良": "Nara", "和歌山": "Wakayama",
  "鳥取": "Tottori", "島根": "Shimane", "岡山": "Okayama", "広島": "Hiroshima", "山口": "Yamaguchi",
  "徳島": "Tokushima", "香川": "Kagawa", "愛媛": "Ehime", "高知": "Kochi",
  "福岡": "Fukuoka", "佐賀": "Saga", "長崎": "Nagasaki", "熊本": "Kumamoto", "大分": "Oita", "宮崎": "Miyazaki", "鹿児島": "Kagoshima", "沖縄": "Okinawa"
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