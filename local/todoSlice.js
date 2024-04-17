import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTodo = createAsyncThunk(
    'todos/fetchTodo',
    async function (_, { rejectWithValue }) {
        try {
            const response = await fetch('https://661e178898427bbbef03578c.mockapi.io/report');
            if (!response.ok) {
                throw new Error('Server Error.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }

    }
)

export const addTodo = createAsyncThunk(
    'todos/addTodo',
    async function (text, { rejectWithValue, dispatch }) {

        try {
            const todo = {
               title:text,
               userId:1,
               completed:false,
            };
            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(todo),

            })
            if (!response.ok) {
                throw new Error('Cant\'t add new todo.Server Error.');
            }
           const data=await response.json();
           dispatch(addItem(data));
        } catch (error) {
            rejectWithValue(error.message)
        }
    }
)

export const toggleTodo = createAsyncThunk(
    'todos/toggleTodo',
    async function (id, { dispatch, getState, rejectWithValue }) {
        const todo = getState().todos.todos.find(todo => todo.id === id);
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: !todo.completed,
                })
            })
            if (!response.ok) {
                throw new Error('Can\'t update completed task!Server Error.')
            }
            dispatch(toggleCompleteTodo({ id }));
        } catch (error) {
            rejectWithValue(error.message)
        }
    }
)

export const deleteTodo = createAsyncThunk(
    'todos/deleteTodo',
    async function (id, { rejectWithValue, dispatch }) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Can\'t delete task.Server Error.');

            }
            dispatch(removeItem({ id }));
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }

)

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        status: null,
        error: null
    },
    reducers: {
        addItem(state, action) {
            console.log(state, 'state');
            console.log(action, 'action');
            state.todos.push(action.payload)

        },
        toggleCompleteTodo(state, action) {
            const toggleTodo = state.todos.find(todo => todo.id === action.payload.id);
            toggleTodo.completed = !toggleTodo.completed;
        },
        removeItem(state, action) {
            state.todos = state.todos.filter(todo => todo.id !== action.payload.id);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodo.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchTodo.fulfilled, (state, action) => {
                state.todos = action.payload;
                state.status = "resolved";
                state.error = null;
            })
            .addCase(fetchTodo.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            .addCase(toggleTodo.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })
            .addCase(addTodo.rejected, (state, action) => {
                state.status = 'rejected';
                state.error = action.payload;
            })

    }
})

export const { addItem, removeItem, toggleCompleteTodo } = todoSlice.actions;
export default todoSlice.reducer;