import hsk1 from './hsk1.json';
import hsk2 from './hsk2.json';
import hsk3 from './hsk3.json';
import hsk4 from './hsk4.json';
import hsk5 from './hsk5.json';
import hsk6 from './hsk6.json';
import hskAll from './hsk_all.json';

export const HSK_LEVELS = {
  1: hsk1,
  2: hsk2,
  3: hsk3,
  4: hsk4,
  5: hsk5,
  6: hsk6,
};

export const allVocab = hskAll;

export const getAllVocab = () => hskAll;

export const getVocabByLevel = (level: number) => {
  return HSK_LEVELS[level as keyof typeof HSK_LEVELS] || [];
};

