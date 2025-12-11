import { useState } from "react";
import CreateForm from "./CreateForm";
import Todo from "./Todo";

function TodoWrapper() { /*<Todo/>因為在form元件外面，todowrapper裡面，所以寫在這*/
  
    const [todos, setTodos] = useState([
        {content: '打掃廁所', id: Math.random(), 
        isCompleted: false, isEditing: false},
        {content: '寫作業', id: Math.random(), 
        isCompleted: false, isEditing: false},
    ]);
    const addTodo = (content) => {
        setTodos([...todos, {content: content, id: Math.random(), isCompleted: false, isEditing: false}])
    }
    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => { /*filter((todo))裡的todo名字隨便改，再透過(.xxx)的取方式取出物件的內容(todo.id)*/
            return todo.id !== id /*return所有不相等的，即保留所有相等的物件*/
        }))
    }
    const toggleCompleted = (id) => {
        setTodos(todos.map((todo) => {
            return todo.id === id ? 
            {...todo, isCompleted: !todo.isCompleted}
            : todo
        }))
    }
    const toggleIsEditing = (id) => {
        setTodos(todos.map((todo) => {
            return todo.id === id ? 
            {...todo, isEditing: !todo.isEditing}
            : todo
        }))
    }
    const editTodo = (id, newContent) => {
        setTodos(todos.map((todo) => {
            return todo.id === id 
              ? {...todo, content: newContent, isEditing: false}
              : todo
        }))
    }


    return (
    <div className="wrapper">
      <h1>待辦事項</h1>
      <CreateForm addTodo={addTodo}/>
      {todos.map((todo) => {
        return <Todo toggleCompleted={toggleCompleted}
        toggleIsEditing={toggleIsEditing} editTodo={editTodo}
        todo={todo} key={todo.id} deleteTodo={deleteTodo}/>
      })}
    </div>
  );
}

export default TodoWrapper;
