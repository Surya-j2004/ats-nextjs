// utils/tfidf.js
export class TFIDF {
  constructor() {
    this.documents = [];
    this.vocabulary = new Set();
  }

  addDocument(doc) {
    const tokens = doc.split(" ");
    this.documents.push(tokens);
    tokens.forEach(token => this.vocabulary.add(token));
  }

  tf(term, document) {
    return document.filter(t => t === term).length / document.length;
  }

  idf(term) {
    const docsWithTerm = this.documents.filter(doc => doc.includes(term)).length;
    return Math.log(this.documents.length / (1 + docsWithTerm));
  }

  vectorize(document) {
    return Array.from(this.vocabulary).map(term => 
      this.tf(term, document) * this.idf(term)
    );
  }
}