import { useState } from "react";

function EditForm({todo, editTodo}) {

  const [content, setContent] = useState(todo.content); /*useState會回傳一個陣列，直接用解構賦值取出來*/ 
  const handleSubmit = (e) => {
    e.preventDefault()
    editTodo(todo.id, content)
  }


  return (
    /*(e):取得用戶輸入資訊, e.target.value:取出*/
    <form className="create-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="輸入待辦事項" 
      value={content} 
      onChange={(e) => {setContent(e.target.value)}}/>
      <button type="submit">完成</button>
    </form>
  );
}

export default EditForm