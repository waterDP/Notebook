import { Machine, assign, interpret, useService } from "./index.js";

const todoMechine = Machine({
  id: "todo",
  initial: "ready",
  context: {
    text: "",
    todoList: [],
  },
  states: {
    ready: {
      on: {
        CHANGE: {
          actions: [
            assign({
              text: (_, event) => event.value,
            }),
          ],
        },
        ADD_TODO: {
          actions: [
            assign({
              text: "",
              todoList: (context) => [...context.todoList, context.text],
            }),
          ],
        },
      },
    },
  },
});

const todosService = interpret(todoMechine).onTransition((state) => {
  console.log(state.context);
});

todosService.start();

function TodoApp() {
  const [state, send] = useService(todosService);
  const {
    context: { text, todoList },
  } = state;
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(event) =>
          send({ type: "CHANGE", value: event.target.value })
        }
      />
      <button onClick={() => send({ type: "ADD_TODO" })}>增加</button>
      <ul>
        {todoList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
