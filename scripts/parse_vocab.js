const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const workbook = XLSX.readFile('hsk_vocab.xlsx');
const sheetNames = workbook.SheetNames;

console.log('Sheets found:', sheetNames);

const levelMap = {
  'HSK1': 1,
  'HSK2': 2,
  'HSK3': 3,
  'HSK4': 4,
  'HSK5': 5,
  'HSK6': 6
};

const allVocab = [];

sheetNames.forEach(sheetName => {
  // Try to match HSK level from sheet name (e.g. "HSK 1", "HSK1", "1")
  let level = 0;
  const normalizedName = sheetName.toUpperCase().replace(/\s/g, '');
  
  if (normalizedName.includes('HSK1')) level = 1;
  else if (normalizedName.includes('HSK2')) level = 2;
  else if (normalizedName.includes('HSK3')) level = 3;
  else if (normalizedName.includes('HSK4')) level = 4;
  else if (normalizedName.includes('HSK5')) level = 5;
  else if (normalizedName.includes('HSK6')) level = 6;
  
  if (level === 0) {
    console.log(`Skipping sheet: ${sheetName} (Unknown level)`);
    return;
  }

  console.log(`Processing ${sheetName} as Level ${level}`);
  
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  // Map columns based on the CSV structure we saw earlier
  // STT, Từ mới, Phiên âm, Giải thích, Ví dụ (chữ hán), Phiên âm, Dịch
  // Note: keys in JSON will be the header names
  
  const vocabList = data.map((row, index) => {
    // Flexible key matching in case of slight variations
    const getVal = (keys) => {
      for (const k of keys) {
        if (row[k] !== undefined) return row[k];
      }
      return '';
    };

    const hanzi = getVal(['Từ mới', 'Chữ Hán', 'Hanzi']);
    const pinyin = getVal(['Phiên âm', 'Pinyin']); // This might pick the first 'Phiên âm' column
    // Note: XLSX parsing might rename duplicate columns like 'Phiên âm_1'
    
    // Let's inspect a row to be sure about keys if needed, but for now try standard
    const meaning = getVal(['Giải thích', 'Nghĩa', 'Meaning']);
    
    if (!hanzi) return null;

    return {
      id: `${level}-${index + 1}`,
      hanzi: String(hanzi).trim(),
      pinyin: String(pinyin).trim(),
      translations: [String(meaning).trim()],
      level: level
    };
  }).filter(item => item !== null);

  // Write individual level file
  fs.writeFileSync(
    path.join(__dirname, `../src/data/hsk${level}.json`), 
    JSON.stringify(vocabList, null, 2)
  );
  
  allVocab.push(...vocabList);
});

// Write combined file
fs.writeFileSync(
  path.join(__dirname, '../src/data/hsk_all.json'), 
  JSON.stringify(allVocab, null, 2)
);

console.log(`Total words processed: ${allVocab.length}`);
