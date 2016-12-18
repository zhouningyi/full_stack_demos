

import {forceCenter,forceCollide,forceLink,forceManyBody,forceSimulation,forceX,forceY} from 'd3-force'
import {select} from 'd3-selection'

class Circles {
	constructor(container) {
		this.container = container;
		this.width = container.offsetWidth;
		this.height = container.offsetHeight;
	}
	render(ds) {
		const { width, height} = this;
		const nodesize = (d) => Math.max(d.value / 100, 2)

		const g = 
			select(this.container).append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('fill', '#222')

		const node = this.nodes = g
			.selectAll("circle")
			.data(ds, d => d.id)
			.enter()
			.append('circle')
			.attr('r', nodesize)
			.attr("fill", 'rgba(255,0,0,0.8)');
		//

		const fManyBody = forceManyBody().strength(() => 5);
		const fCollide = forceCollide(nodesize).strength(1);

		const update = () => node.attr('cx', d => d.x).attr('cy', d => d.y);

		const simulation = this.simulation =
			forceSimulation(ds)
			.force('charge', fManyBody)
			.force('collide', fCollide)
			.force('center', forceCenter(width / 2, height / 2))
			.on('tick', update);
	}
}

const container = document.getElementById('main-container')
const circles = new Circles(container)

fetch('/8-graph/nodes.json')
	.then(res => res.json())
	.then(ds => ds.filter(d => d.value > 100))
	.then(ds => circles.render(ds));

