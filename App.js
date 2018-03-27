import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

const baseFetch = System.fetch;

const GENERATED_MODULE_NAME = "cool-module";

class App extends Component {
	constructor(props) {
		super(props);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleAddFeature = this.handleAddFeature.bind(this);
		this.handlePreview = this.handlePreview.bind(this);
		this.handleRender = this.handleRender.bind(this);
		this.state = {
			rendered: "",
			value: `import React from "react"

const Heading = ({ children }) => <h1>{children}</h1>

const Page = () => <div>
	<Heading>hello</Heading>
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
	handleAddFeature() {
		const feature = "\n<Heading>hello</Heading>";
		this.setState(state => ({ value: state.value + feature }));
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
	handlePreview() {
		this.getComponent().then(component => {
			ReactDOM.render(component, document.getElementById("preview"));
		});
	}
	handleRender() {
		this.getComponent().then(component => {
			const rendered = ReactDOMServer.renderToStaticMarkup(component);
			this.setState({ rendered });
		});
	}
	render() {
		const { value, rendered } = this.state;
		const section = { display: "flex", flexGrow: 1, flexDirection: "column" };
		return (
			<div style={{ display: "flex", height: "100vh" }}>
				<div style={section}>
					<div>
						<h1>Editor</h1>
						<button onClick={this.handleAddFeature}>Add Feature</button>
					</div>
					<textarea
						value={value}
						onChange={this.handleUpdate}
						style={{ flexGrow: 1 }}
					/>
				</div>
				<div style={section}>
					<div>
						<h1>Preview</h1>
						<button onClick={this.handlePreview}>Preview</button>
						<button onClick={this.handleRender}>Render</button>
					</div>
					<div id="preview" style={{ flexGrow: 1 }} />
					<textarea value={rendered} style={{ flexGrow: 1 }} />
				</div>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
