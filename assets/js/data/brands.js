export const brands = [
  {
    id: "samsung", name: "Samsung", nameAr: "سامسونج", initial: "S", country: "كوريا الجنوبية",
    official: "https://www.samsung.com/levant/", support: "https://www.samsung.com/levant/support/",
    series: ["Galaxy S", "Galaxy A", "Galaxy M", "Galaxy Z", "Galaxy Note"]
  },
  {
    id: "xiaomi", name: "Xiaomi", nameAr: "شاومي", initial: "X", country: "الصين",
    official: "https://www.mi.com/global/", support: "https://www.mi.com/global/support/",
    series: ["Xiaomi Series", "Mi Series", "HyperOS"]
  },
  {
    id: "redmi", name: "Redmi", nameAr: "ريد مي", initial: "R", country: "الصين",
    official: "https://www.mi.com/global/redmi/", support: "https://www.mi.com/global/support/",
    series: ["Redmi Note", "Redmi Number", "Redmi A"]
  },
  {
    id: "poco", name: "POCO", nameAr: "بوكو", initial: "P", country: "الصين",
    official: "https://www.po.co/global/", support: "https://www.po.co/global/support/",
    series: ["POCO F", "POCO X", "POCO M", "POCO C"]
  },
  {
    id: "huawei", name: "Huawei", nameAr: "هواوي", initial: "H", country: "الصين",
    official: "https://consumer.huawei.com/en/", support: "https://consumer.huawei.com/en/support/",
    series: ["P Series", "Mate Series", "Nova Series"]
  },
  {
    id: "honor", name: "Honor", nameAr: "هونر", initial: "H", country: "الصين",
    official: "https://www.honor.com/global/", support: "https://www.honor.com/global/support/",
    series: ["Magic Series", "Number Series", "X Series"]
  },
  {
    id: "oppo", name: "OPPO", nameAr: "أوبو", initial: "O", country: "الصين",
    official: "https://www.oppo.com/en/", support: "https://www.oppo.com/en/support/",
    series: ["Find X", "Reno", "A Series"]
  },
  {
    id: "vivo", name: "vivo", nameAr: "فيفو", initial: "V", country: "الصين",
    official: "https://www.vivo.com/en/", support: "https://www.vivo.com/en/support/",
    series: ["X Series", "V Series", "Y Series"]
  },
  {
    id: "realme", name: "realme", nameAr: "ريلمي", initial: "r", country: "الصين",
    official: "https://www.realme.com/global/", support: "https://www.realme.com/global/support/",
    series: ["GT Series", "Number Series", "C Series", "Narzo"]
  },
  {
    id: "oneplus", name: "OnePlus", nameAr: "ون بلس", initial: "1", country: "الصين",
    official: "https://www.oneplus.com/global", support: "https://www.oneplus.com/global/support",
    series: ["OnePlus Flagship", "Nord", "Nord CE"]
  },
  {
    id: "apple", name: "Apple iPhone", nameAr: "آبل آيفون", initial: "A", country: "الولايات المتحدة",
    official: "https://www.apple.com/iphone/", support: "https://support.apple.com/",
    series: ["iPhone Pro Max", "iPhone Pro", "iPhone", "iPhone SE"]
  },
  {
    id: "tecno", name: "TECNO", nameAr: "تكنو", initial: "T", country: "الصين",
    official: "https://www.tecno-mobile.com/", support: "https://www.tecno-mobile.com/support/",
    series: ["Camon", "Pova", "Spark", "Phantom"]
  },
  {
    id: "infinix", name: "Infinix", nameAr: "إنفينكس", initial: "I", country: "هونغ كونغ",
    official: "https://www.infinixmobility.com/", support: "https://www.infinixmobility.com/support/",
    series: ["Zero", "Note", "Hot", "Smart"]
  },
  {
    id: "itel", name: "itel", nameAr: "آيتل", initial: "i", country: "الصين",
    official: "https://www.itel-mobile.com/", support: "https://www.itel-mobile.com/support/",
    series: ["P Series", "S Series", "A Series"]
  },
  {
    id: "zte", name: "ZTE", nameAr: "زد تي إي", initial: "Z", country: "الصين",
    official: "https://www.ztedevices.com/en/", support: "https://www.ztedevices.com/en/support/",
    series: ["Axon", "Blade", "Nubia"]
  },
  {
    id: "nubia", name: "Nubia", nameAr: "نوبيا", initial: "N", country: "الصين",
    official: "https://www.nubia.com/en/", support: "https://www.nubia.com/en/support/",
    series: ["Z Series", "Red Magic", "Neo"]
  },
  {
    id: "motorola", name: "Motorola", nameAr: "موتورولا", initial: "M", country: "الولايات المتحدة",
    official: "https://www.motorola.com/", support: "https://www.motorola.com/global/en/support",
    series: ["Edge", "Moto G", "Razr"]
  },
  {
    id: "nokia", name: "Nokia", nameAr: "نوكيا", initial: "N", country: "فنلندا",
    official: "https://www.nokia.com/phones/", support: "https://www.nokia.com/phones/en_int/support",
    series: ["X Series", "G Series", "C Series"]
  },
  {
    id: "lg", name: "LG", nameAr: "إل جي", initial: "L", country: "كوريا الجنوبية",
    official: "https://www.lg.com/global", support: "https://www.lg.com/global/support",
    series: ["Velvet", "Wing", "V Series", "G Series"]
  },
  {
    id: "google", name: "Google Pixel", nameAr: "جوجل بكسل", initial: "G", country: "الولايات المتحدة",
    official: "https://store.google.com/category/phones", support: "https://support.google.com/pixelphone/",
    series: ["Pixel Pro", "Pixel", "Pixel A"]
  }
];

export const brandById = Object.fromEntries(brands.map((brand) => [brand.id, brand]));
