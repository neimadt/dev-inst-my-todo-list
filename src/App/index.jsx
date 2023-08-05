import '../tailwind.css';
import '../index.css';
import { useCallback, useState, useEffect } from 'react';

export const App = () => {

    const [gettingTodos, gettingTodosSet] = useState(false);
    const [submitting, submittingSet] = useState(false);
    const [settingToDone, settingToDoneSet] = useState(null);
    const [todos, todosSet] = useState([]);

    const getTodos = useCallback(async () => {

        try {

            if (gettingTodos) return;


            gettingTodosSet(true);

            const resp = await fetch('/api/todos');

            if (!resp.ok) {

                let error = await resp.text();

                try {
                    error = JSON.parse(error);
                } catch { }


                throw { status: resp.status, statusText: resp.statusText, error };
            }

            const todos = await resp.json();

            todosSet(todos);
        }
        catch (err) {

            console.error(err);
        }
        finally {

            gettingTodosSet(false);
        }
    }, [gettingTodos]);

    const onSubmit = useCallback(async e => {

        e.preventDefault();

        try {

            if (submitting) return;


            submittingSet(true);

            const formData = new FormData(e.currentTarget);
            const body = Object.fromEntries(formData);

            const resp = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!resp.ok) {

                let error = await resp.text();

                try {
                    error = JSON.parse(error);
                } catch { }


                throw { status: resp.status, statusText: resp.statusText, error };
            }

            const data = await resp.json();

            todosSet(todos => {

                return [
                    ...todos,
                    data
                ];
            });
        }
        catch (err) {

            console.error(err);
        }
        finally {

            submittingSet(false);
        }
    }, [submitting]);

    const setToDone = useCallback(async id => {

        try {

            if (settingToDone) return;


            settingToDoneSet(id);

            const resp = await fetch(`/api/todo/${id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!resp.ok) {

                let error = await resp.text();

                try {
                    error = JSON.parse(error);
                } catch { }


                throw { status: resp.status, statusText: resp.statusText, error };
            }

            const data = await resp.json();

            todosSet(todos => {

                return todos.map(td => td.id === data.id ? data : td);
            });
        }
        catch (err) {

            console.error(err);
        }
        finally {

            settingToDoneSet(null);
        }
    }, [settingToDone]);

    const setToUndone = useCallback(async id => {

        try {

            if (settingToDone) return;


            settingToDoneSet(id);

            const resp = await fetch(`/api/todo/${id}/incomplete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!resp.ok) {

                let error = await resp.text();

                try {
                    error = JSON.parse(error);
                } catch { }


                throw { status: resp.status, statusText: resp.statusText, error };
            }

            const data = await resp.json();

            todosSet(todos => {

                return todos.map(td => td.id === data.id ? data : td);
            });
        }
        catch (err) {

            console.error(err);
        }
        finally {

            settingToDoneSet(null);
        }
    }, [settingToDone]);

    useEffect(() => {

        getTodos();
    }, []);

    return (
        <main className="w-full h-full pt-8 pb-5 px-5">
            <h1 className="text-5xl text-slate-700 text-center">My Todo List</h1>
            {
                gettingTodos ?
                    <h2 className="text-3xl text-slate-700 text-center">Patience...</h2>
                    :
                    <div className="flex flex-col items-center">
                        <form onSubmit={onSubmit} className="mb-8 mt-5 flex flex-col items-center">
                            <div className="pb-3">
                                <input className="h-9 border border-solid px-1 border-gray-400 rounded-md" name="name" />
                            </div>
                            <div className="flex">
                                <button type="submit" className="bg-green-400 border border-green-950 py-2 px-3 rounded-3xl min-w-[10rem]">
                                    Add
                                </button>
                                <button
                                    onClick={getTodos}
                                    type="button" className="bg-green-400 border border-green-950 w-12 h-12 rounded-full p-2 text-green-950 ml-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            </div>
                            {
                                submitting ?
                                    <div className="text-center text-blue-700">
                                        Please wait...
                                    </div>
                                    : null
                            }
                        </form>
                        <h3 className="text-2xl font-bold text-slate-700">
                            Tasks
                        </h3>
                        {
                            todos.length > 0 ?
                                <ul className="border border-slate-600 rounded-lg p-4 w-96 max-w-[calc(100%-1rem)]">
                                    {
                                        todos.map(todo => (
                                            <li key={todo.id} className="flex items-center px-2 py-1 border border-gray-400 rounded mb-4 last-of-type:mb-0">
                                                <span className={`flex-1${todo.done ? ' line-through' : ''}`}>{todo.name}</span>

                                                {
                                                    settingToDone === todo.id ?
                                                        <span className="text-green-600 w-10 h-10 flex items-center justify-center">...</span>
                                                        :
                                                        <>
                                                            {
                                                                todo.done ?
                                                                    <button
                                                                        onClick={() => setToUndone(todo.id)}
                                                                        className="w-10 h-10 rounded-full bg-slate-500 text-white shadow-md p-2">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                                                                        </svg>

                                                                    </button>
                                                                    :
                                                                    <button
                                                                        onClick={() => setToDone(todo.id)}
                                                                        className="w-10 h-10 rounded-full bg-green-600 text-white shadow-md p-2">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                                        </svg>
                                                                    </button>
                                                            }
                                                        </>
                                                }
                                            </li>
                                        ))
                                    }
                                </ul>
                                : <p className="text-center text-slate-700">No todos found!</p>
                        }
                    </div>
            }
        </main>
    );
};
