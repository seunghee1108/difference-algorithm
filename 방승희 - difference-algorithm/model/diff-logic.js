  /**
   * ? Q. JSON 파일을 아래의 5, 6번에 해당하는 로직 작성 후 JSON으로 저장
   * ? Q. 저장이 완료되면 초기화된 result에 객체를 리턴
   * 
   * * 1. inputJSONdata, outputJSONdata를 읽어서 JSON 객체로 변환
   * * 2. inputJSONdata, outputJSONdata의 value를 비교
   * * 3. outputJSONpath 매개변수의 key에 해당하는 정보를 저장
   * * 4. dirrences.json 파일에 필요한 상태값
   * * 5. 같은 단어가 무엇인지 저장
   * * 6. 다른 단어가 무엇인지 저장
   * * 7. 리턴을 통해 결과값을 전달
   */

  // fs 모듈 가져오기
  import fs from 'fs';

  /**
   * * 함수의 매개변수를 설명
   * * inputJSONdata 매개변수가 JSON 형식의 데이터 또는 파일 경로
   * @param {JSON, Path} inputJSONdata 
   * @param {JSON, Path} outputJSONdata 
   * * 함수의 반환값에 대한 설명
   * @returns Object
   */
  
  export default function(inputJSONPath, outputJSONPath) {
    // .json으로 끝나지 않으면 true (!확인)
    if (!inputJSONPath.endsWith('.json') || !outputJSONPath.endsWith('.json')) {
      // .json 파일이 아니라면, throw new Error
      throw new Error(`매개변수 ${inputJSONPath}, ${outputJSONPath}는 json 파일이 아닙니다.`);
    }
  
    let result = {};
  
    // inputJSONdata, outputJSONdata를 읽어서 JSON 객체로 변환
    const readAndParseJSON = (filePath) => {
      try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (error) {
        console.error(`Error reading or parsing JSON file: ${error.message}`);
        return null;
      }
    };
  
    // app.js 파일을 보면 json files path 변수 처리 되어있음
    // JSON 파일을 읽어와서 파싱
    const inputJSONData = readAndParseJSON(inputJSONPath);
    const outputJSONData = readAndParseJSON(outputJSONPath);
  
    // 문자열 정규화, 특수 기호를 제거, 소문자로 변환, 공백을 기준으로 토큰화하여 Set으로 반환하는 함수
    const normalize = (str) => new Set(str.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/));
  
    // fromDB-data.json 파일의 키, 값 가져오기
    for (const key in inputJSONData) {
      if (key === "operator" || key === "operand") {
        // 키에 해당하는 값을 normalize 함수에 전달하여 처리
        const words1 = normalize(inputJSONData.operator);
        const words2 = normalize(inputJSONData.operand);
  
        // filter : 조건을 만족하는 요소들을 필터링
        // has : Set 객체에 특정 값이 존재하는지 여부를 확인
        const sameWords = [...words1].filter(word => words2.has(word));
        // differentWords1 : operator의 문장에서만 등장하는 단어들 
        const differentWords1 = [...words1].filter(word => !words2.has(word));
        // differentWords2 : operand의 문장에서만 등장하는 단어들
        const differentWords2 = [...words2].filter(word => !words1.has(word));
        // ** 따로 쓰는 이유 :  각각의 배열이 두 문장 간에 서로 다른 단어들을 나타내기 때문에
  
        // sameWords 배열의 중복 제거
        // Set 객체를 사용해서 배열의 중복을 제거하고 그 결과를 result 객체에 저장
        result.sameWords = [...new Set(sameWords)];
        // differentWords1와 differentWords2 배열의 중복 제거 및 합치기
        result.differentWords = [...new Set([...differentWords1, ...differentWords2])];
      }
    }
  
    // 출력값 differences.json 파일에 저장 
    const differencesFilePath = 'data/differences.json';
    // JSON 형식의 데이터를 파일에 쓰는 작업
    // stringify : result 객체를 JSON 문자열로 변환
    fs.writeFileSync(differencesFilePath, JSON.stringify(result, null, 2), 'utf8');
  
    return result;
  }
