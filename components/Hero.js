import React, { Component } from "react";

const Hero = ({ children }) => <div style={{}}>{children}</div>;

Hero.H1 = ({ children }) => <h1>{children}</h1>;
Hero.Lead = ({ children }) => <p>{children}</p>;

export default Hero;

class Generator extends Component {
	constructor() {
		super();
		this.state = {
			h1: "",
			lead: "",
			hue: 0,
		};
		this.handleInput = this.handleInput.bind(this);
		this.handleRender = this.handleRender.bind(this);
	}
	handleInput(evt) {
		this.setState({ [evt.target.name]: evt.target.value });
	}
	handleRender() {
		const { h1, lead, hue } = this.state;
		this.props.onRender(`<Hero>
    <Hero.H1>${h1}</Hero.H1>
    <Hero.Lead>${lead}</Hero.Lead>
</Hero>`);
	}
	render() {
		const { h1, lead, hue } = this.state;
		return (
			<div>
				<div>
					<label>Heading</label>
					<input name="h1" value={h1} onChange={this.handleInput} />
				</div>
				<div>
					<label>Lead</label>
					<input name="lead" value={lead} onChange={this.handleInput} />
				</div>
				<button type="button" onClick={this.handleRender}>
					Add Hero
				</button>
			</div>
		);
	}
}

export { Generator };
