// import { SentenceTransformer } from 'some-sentence-transformer-library'; // 실제 라이브러리로 교체

// const model = new SentenceTransformer('bert-base-nli-mean-tokens');

// const computeSimilarity = async (text1: string, text2: string) => {
//   const [embedding1, embedding2] = await Promise.all([
//     model.encode(text1),
//     model.encode(text2)
//   ]);

//   // 코사인 유사도 계산
//   const cosineSimilarity = embedding1.dot(embedding2) / (embedding1.norm() * embedding2.norm());

//   return cosineSimilarity;
// };

// // 사용 예
// const similarity = await computeSimilarity("hello", "안녕하세요");
// console.log("유사도:", similarity);
