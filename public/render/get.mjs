// data fetching
const inputTextDOM = document.getElementById("inputTitle");
const inputContentDOM = document.getElementById("inputContent");
//formDomを追加する。
const formDOM = document.querySelector(".form-section");
const threadSectionDOM = document.querySelector(".thread-section");


//最初はThreadを全て読み込む
const getAllThreads = async () => {
  try {
    console.log("Show all data");
    let allThreads = await axios.get("/api/v1/threads");
    //console.log(allThreads);
    let { data } = allThreads;
    //出力
    allThreads = data.map((thread) => {
      const { title, content } = thread;
      //console.log(title);
      return `
      <div class="single-thread">
          <h3>${title}</h3>
          <p>${content}</p>
        </div>
      `;
    });
    //.join("");
    //挿入
    threadSectionDOM.innerHTML = allThreads;
  } catch (err) {
    console.log(err);
  }
};

getAllThreads();

//タイトルと内容を打ち込んだらpostメソッドを実装してデータ追加。
if (inputTextDOM) {
  inputTextDOM.addEventListener("change", (e) => {
    inputText = e.target.value;
  });
}
if (inputContentDOM) {
  inputContentDOM.addEventListener("change", (e) => {
    contentText = e.target.value;
  });
}