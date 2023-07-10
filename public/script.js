// data fetching
const inputTextDOM = document.getElementById("inputTitle");
const inputContentDOM = document.getElementById("inputContent");
//formDomを追加する。
const formDOM = document.querySelector(".form-section");
const threadSectionDOM = document.querySelector(".thread-section");
let inputText = "";
let contentText = "";

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
inputTextDOM.addEventListener("change", (e) => {
  //   console.log(e.target.value);
  inputText = e.target.value;
});
inputContentDOM.addEventListener("change", (e) => {
  contentText = e.target.value;
});

formDOM.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!inputText || !contentText) {
    window.alert("text と Content の両方を記述してください！");
    inputTextDOM.style.backgroundColor = "pink";
    inputContentDOM.style.backgroundColor = "pink";
    return; // エラーが発生した場合に関数を終了し、48行目に戻る
  }
  try {
    await axios.post("/ap1/v1/thread", {
      title: inputText,
      content: contentText,
    });
    getAllThreads();

    //投稿したらinputのvalueを削除
    inputText = "";
    contentText = "";
    inputTextDOM.value = "";
    inputContentDOM.value = "";
  } catch (err) {
    console.log(err.message);
    return; // エラーが発生した場合に関数を終了し、48行目に戻る
  }
});
