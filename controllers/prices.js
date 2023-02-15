import axios from "axios";
import fetch from "node-fetch";
import Bist from "./../models/Bist.js";
// export const bistPrices = async (req, res) => {
//   const priceData = {};
//   const bist30 = [
//     "TCELL",
//     "KOZAL",
//     "AKSEN",
//     "PETKMM",
//     "SISE",
//     "TUPRS",
//     "KRDMR",
//   ];

//   for (const symbol of bist30) {
//     try {
//       const response = await axios.get(
//         `https://bigpara.hurriyet.com.tr/api/v1/borsa/hisseyuzeysel/${symbol}`
//       );
//       if (response.status === 200) {
//         priceData[symbol] = response.data.data.hisseYuzeysel.alis;
//       } else {
//         priceData[symbol] = "N/A";
//       }
//     } catch (error) {
//       priceData[symbol] = "N/A";
//     }
//   }

//   res.json(priceData);
// };

export const bistPrices = async (req, res) => {
  try {
    const bist = await Bist.find().sort("hisse");
    res.status(200).json(bist);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const updatePrices = async (req, res) => {
  var stocksArr = [
    "AEFES",
    "AGHOL",
    "AKBNK",
    "AKFGY",
    "AKSA",
    "AKSEN",
    "ALARK",
    "ALBRK",
    "ALGYO",
    "ALKIM",
    "ARCLK",
    "ASELS",
    "ASUZU",
    "AYDEM",
    "BAGFS",
    "BASGZ",
    "BERA",
    "BIMAS",
    "BIOEN",
    "BRYAT",
    "BUCIM",
    "CCOLA",
    "CEMTS",
    "CIMSA",
    "DOAS",
    "DOHOL",
    "ECILC",
    "EGEEN",
    "EKGYO",
    "ENJSA",
    "ENKAI",
    "ERBOS",
    "EREGL",
    "EUREN",
    "FENER",
    "FROTO",
    "GARAN",
    "GESAN",
    "GLYHO",
    "GSDHO",
    "GUBRF",
    "GWIND",
    "HALKB",
    "HEKTS",
    "IPEKE",
    "ISCTR",
    "ISDMR",
    "ISFIN",
    "ISGYO",
    "JANTS",
    "KARSN",
    "KCAER",
    "KCHOL",
    "KERVT",
    "KLRHO",
    "KMPUR",
    "KONTR",
    "KRDMD",
    "KRDOG",
    "KRONT",
    "KUTPO",
    "MGROS",
    "NETAS",
    "NIBAS",
    "OEZYO",
    "OLMIP",
    "OTKAR",
    "PAZAR",
    "PEGYO",
    "PETKM",
    "PGSUS",
    "SAHOL",
    "SAVKL",
    "SEKFK",
    "SELGD",
    "SEMAZ",
    "SISE",
    "SKBNK",
    "TATGD",
    "TAVHL",
    "TKNSA",
    "TRKCM",
    "TSKB",
    "TTKOM",
    "TTRAK",
    "ULKER",
    "VAKBN",
    "YATAS",
    "YKBNK",
  ];

  stocksArr.map(async (symbol, index) => {
    try {
      const response = await axios.get(
        `https://bigpara.hurriyet.com.tr/api/v1/borsa/hisseyuzeysel/${symbol}`
      );
      if (response.status === 200) {
        const { alis, satis, yuzdedegisim, sembol, aciklama } =
          response.data.data.hisseYuzeysel;
        console.log(satis, yuzdedegisim, aciklama);
        await Bist.findOneAndReplace(
          { hisse: symbol },
          {
            hisse: sembol,
            fiyat: Number(satis) > 0 ? Number(satis) : Number(alis),
            change: Number(yuzdedegisim),
            isim: aciklama,
          }
        );

        console.log(await Bist.find({ hisse: symbol }));
      }
    } catch (error) {
      console.log(error);
    }
  });
  res.send(await Bist.find({ hisse: "AKBNK" }));
};
