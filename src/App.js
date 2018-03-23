import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from 'react-dom/server';
import { transform } from "@babel/standalone";
import "./App.css";

class App extends Component {
	state = {
		rendered: "",
		value: `
(function(React) {

const Heading = ({ children }) => <h1>{children}</h1>

const Page = () => <div>
	<Heading>hello</Heading>
</div>

	
return Page;
})
`,
	};
	handleUpdate = evt => {
		const value = evt.target.value;
		this.setState({ value });
	};
	handleAddFeature = () => {
		const feature = "\n<h1>something</h1>";
		this.setState(state => ({ value: state.value + feature }));
	};
	getElement = () => {
		const codeString = transform(this.state.value, { presets: ["react"] }).code;
		const getPage = eval(codeString);
		return React.createElement(getPage(React))
	}
	handlePreview = () => {
		ReactDOM.render(
			this.getElement(),
			document.getElementById("preview")
		);
	};
	handleRender = () => {
		const rendered = ReactDOMServer.renderToStaticMarkup(this.getElement())
		this.setState({ rendered });
	}
	render() {
		const { value, rendered } = this.state;
		return (
			<div className="app">
				<div className="section">
					<div>
						<h1>Editor</h1>
						<button onClick={this.handleAddFeature}>Add Feature</button>
					</div>
					<textarea
						value={value}
						onChange={this.handleUpdate}
						className="grow"
					/>
				</div>
				<div className="section">
					<div>
						<h1>Preview</h1>
						<button onClick={this.handlePreview}>Preview</button>
						<button onClick={this.handleRender}>Render</button>
					</div>
					<div id="preview" className="grow" />
					<textarea value={rendered} className="grow" />
				</div>
			</div>
		);
	}
}

export default App;
