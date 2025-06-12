// utils/textPreprocess.js
import natural from "natural";
const stemmer = natural.PorterStemmer;

export function preprocess(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove punctuation
    .split(" ")
    .map(word => stemmer.stem(word)) // Stemming
    .join(" ");
}