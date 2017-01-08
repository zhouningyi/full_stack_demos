
/*
  增加drag交互
*/
import {forceCenter,forceCollide,forceLink,forceManyBody,forceSimulation,forceX,forceY} from 'd3-force';
import {select, event} from 'd3-selection';
import {drag} from 'd3-drag';
import './index.css';

class Circles {
	constructor(container) {
		this.container = container;
		this.width = container.offsetWidth;
		this.height = container.offsetHeight;
	}
	render(ds) {
		const {width, height} = this;
		const nodesize = (d) => Math.max(d.value / 50, 2)

		const g = 
			select(this.container).append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('fill', '#222');

		function dragstarted(d) {
			event.sourceEvent.stopPropagation();
			simulation.alpha(.1).restart();
			select(this).classed('dragging', true);
		}

		function dragged(d) {
			 select(this).attr('cx', d.x = event.x).attr('cy', d.y = event.y);
		}

		function dragended(d) {
			select(this).classed('dragging', false);
			simulation.alpha(.1).restart();
		}

	  const dragf = drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);

		const node = this.nodes = g
			.selectAll("circle")
			.data(ds, d => d.id)
			.enter();
    
    //圆圈部分
		const circle = node
			.append('circle')
			.classed('circle', true)
			.attr('r', nodesize)
			.call(dragf);

    //文字部分
    const clip = text => text.split('@')[0].substring(0, 6)
		const text = node
			.append('text')
			.attr('x', 0)
      .attr('y', 0)
      .classed('text', true)
      .attr('text-anchor', 'middle')
      .text(d => (nodesize(d) > 20) ? clip(d.id) : null);

		const fManyBody = forceManyBody().strength(() => 25);
		const fCollide  = forceCollide(nodesize).strength(2);

		const update = () => {
			circle.attr('cx', d => d.x).attr('cy', d => d.y);
			text.attr('x', d => d.x).attr('y', function(d, e, f) {
				return d.y + 6;
			});
		};

		const simulation = this.simulation =
			forceSimulation(ds)
			.velocityDecay(0.9)
			.force('charge', fManyBody)
			.force('collide', fCollide)
			.force('center', forceCenter(width / 2, height / 2))
			.on('tick', update);
	}
}


const container = document.getElementById('main-container')
const circles = new Circles(container)

fetch('/8-graph/data/nodes.json')
	.then(res => res.json())
	.then(ds => ds.filter(d => d.value > 100))
	.then(ds => circles.render(ds));

