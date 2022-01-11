/*
 * @Author: water.li
 * @Date: 2021-10-24 17:09:39
 * @Description: 
 * @FilePath: \notebook\React\基础\react-redux-hooks\App.js
 */
import React from 'react';
import SimpleCounter from './views/SimpleCounter';
import TodoList from './views/TodoList';
import NameCard from './views/NameCard';


function App() {

	return (
		<div className="App">
			<main className="container">

				{/* Please check /views/SimpleCounter.js for detail*/}
				<SimpleCounter />

				<div className="divider"></div>

				{/* Please check /views/NameCard.js for detail*/}
				<NameCard />

				<div className="divider"></div>

				{/* Please check /views/TodoList.js for detail*/}
				<TodoList />
			</main>
		</div>
	);
}

export default App;
