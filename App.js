import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

import { Generator as HeroGenerator } from "./components/Hero.js";

const baseFetch = System.fetch;

const GENERATED_MODULE_NAME = "cool-module";

let textFile;

class App extends Component {
	constructor(props) {
		super(props);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleAddFeature = this.handleAddFeature.bind(this);
		this.handleRender = this.handleRender.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.state = {
			rendered: "",
			value: `import React from "react"

import Hero from "./components/Hero.js"

const Page = () => <div>
	
</div>
	
export default Page;
`,
		};
	}
	componentDidMount() {
		SystemJS.fetch = load => {
			if (load.name.includes(GENERATED_MODULE_NAME)) {
				return this.state.value;
			}
			return baseFetch.call(this, load);
		};
	}
	handleUpdate(evt) {
		const value = evt.target.value;
		this.setState({ value });
	}
	handleAddFeature(feature) {
		const el = this.textarea;
		var start = el.selectionStart;
		var end = el.selectionEnd;
		var text = el.value;
		var before = text.substring(0, start);
		var after = text.substring(end, text.length);
		const value = before + feature + after;
		this.setState({ value }, () => {
			el.selectionStart = el.selectionEnd = start + feature.length;
			el.focus();
		});
	}
	getComponent() {
		const normalizedName = SystemJS.normalizeSync(GENERATED_MODULE_NAME);
		if (SystemJS.has(normalizedName)) {
			SystemJS.delete(normalizedName);
		}
		return SystemJS.import(GENERATED_MODULE_NAME).then(module => {
			return React.createElement(module.default);
		});
	}
	handleRender() {
		this.getComponent().then(component => {
			ReactDOM.render(component, document.getElementById("preview"));
		});
	}
	handleSave() {
		this.getComponent().then(component => {
			const rendered = ReactDOMServer.renderToStaticMarkup(component);
			var link = document.createElement("a");
			link.setAttribute("download", "index.html");

			var data = new Blob([rendered], { type: "text/html" });

			// If we are replacing a previously generated file we need to
			// manually revoke the object URL to avoid memory leaks.
			if (textFile !== null) {
				window.URL.revokeObjectURL(textFile);
			}

			textFile = window.URL.createObjectURL(data);

			link.href = textFile;

			document.body.appendChild(link);

			// wait for the link to be added to the document
			window.requestAnimationFrame(function() {
				var event = new MouseEvent("click");
				link.dispatchEvent(event);
				document.body.removeChild(link);
			});
		});
	}
	render() {
		const { value, rendered } = this.state;
		const section = {
			display: "flex",
			flexGrow: 1,
			flexDirection: "column",
		};
		return (
			<div style={{ display: "flex", height: "100vh" }}>
				<div style={section}>
					<div>
						<h1>Editor</h1>
						<HeroGenerator onRender={this.handleAddFeature} />
					</div>
					<textarea
						ref={ref => (this.textarea = ref)}
						value={value}
						onChange={this.handleUpdate}
						style={{ flexGrow: 1 }}
					/>
				</div>
				<div style={section}>
					<div>
						<h1>Preview</h1>
						<button onClick={this.handleRender}>Render</button>
						<button onClick={this.handleSave}>Save As HTML</button>
					</div>
					<div id="preview" style={{ flexGrow: 1, border: "1px solid #ccc" }} />
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
