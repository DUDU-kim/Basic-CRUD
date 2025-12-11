import { useState } from "react";

function CreateForm({addTodo}) {

  const [content, setContent] = useState(''); /*useState會回傳一個陣列，直接用解構賦值取出來*/ 
  const handleSubmit = (e) => {
    e.preventDefault()
    addTodo(content)
    setContent('')
  }


  return (
    /*(e):取得用戶輸入資訊, e.target.value:取出*/
    <form className="create-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="輸入待辦事項" 
      value={content} 
      onChange={(e) => {setContent(e.target.value)}}/>
      <button type="submit">加入</button>
    </form>
  );
}

export default CreateForm
