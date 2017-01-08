import Event from 'bcore/event';
import Utils from 'bcore/utils';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
require('./index.css');

//
const count = 50;
class Cloud extends Event {
  constructor(container, options) {
    super()
    this.options = Utils.deepMerge(Cloud.options, options)
    this.container = container
    this.init()
  }
  init() {
    // var fill = d3.scale.category20();
    const container = this.container
    const w = this.w = container.offsetWidth
    const h = this.h = container.offsetHeight
      //
    const svg = this.svg = d3.select(container)
      .append('svg')
      .attr('width',  w)
      .attr('height', h)
  }
  render(ds) {
    if(!ds || !ds.length) return
    let {w,h} = this
    const g = this.g =
      this.svg.append('g')
      .attr('width', w)
      .attr('height', h)
      .attr('id', 'cloud-botton')
      .append('g')
      //
    if (!w || !h) return console.log('w,h不能为0')
    const words = ds.map(d => ({
      text: d.word,
      size: Math.pow(d.v01, 0.6) * 40,
      nentry: d.nentry,
      ndoc: d.ndoc
    }))
    const layout = this.layout = cloud()
      .size([w, h])
      .words(words)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 0)
      .fontSize(d => d.size)
      .spiral('rectangular')
      .on('end', words => this.draw(words));
    layout.start();
  }
  draw(words) {
    const fill = (i) => `rgba(255,0,0,${ 1 - 0.5 * i / count})`
    const layout = this.layout
    const self = this
    this.g
      .attr("transform", "translate(" + this.w / 2 + "," + this.h / 2 + ")")
      .selectAll("text")
      .data(words)
      .enter().append("text")
      .style("font-size", function(d) {
        return d.size + "px";
      })
      .style('font-family', 'Arial')
      .style('font-weight', 'bold')
      .style('fill', (d, i) => fill(i))
      .attr('text-anchor', 'middle')
      .attr('transform', d => 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')')
      .on('mouseover', function(d){
        self._wordMouseover(d, d3.select(this))
      })
      .on('mouseout', function(d){
        self._wordMouseout(d, d3.select(this))
      })
      .text(d => d.text);
  }
  _wordMouseover(d, node){
    node
    .attr('___fill', node.style('fill'))
    .style('fill', '#fff')
  }
  _wordMouseout(d, node){
    node.style('fill', node.attr('___fill'))
  }
  clean() {
    if (this.g) this.svg.select('#cloud-botton').remove()
  }
}

const clooud = new Cloud(document.querySelector('#main-container'));
clooud.render([{"word":"democrat","ndoc":1145,"nentry":5085,"v01":1},{"word":"trump","ndoc":450,"nentry":4607,"v01":0.8782165605095541},{"word":"lui","ndoc":1235,"nentry":4561,"v01":0.8664968152866243},{"word":"miranda","ndoc":1233,"nentry":4118,"v01":0.7536305732484077},{"word":"committe","ndoc":1075,"nentry":3697,"v01":0.6463694267515924},{"word":"may","ndoc":979,"nentry":3651,"v01":0.6346496815286624},{"word":"parti","ndoc":624,"nentry":3415,"v01":0.5745222929936306},{"word":"nation","ndoc":1100,"nentry":3338,"v01":0.5549044585987262},{"word":"re","ndoc":925,"nentry":3306,"v01":0.5467515923566879},{"word":"subject","ndoc":1211,"nentry":3209,"v01":0.5220382165605095},{"word":"pm","ndoc":953,"nentry":3172,"v01":0.5126114649681529},{"word":"state","ndoc":554,"nentry":2898,"v01":0.44280254777070066},{"word":"campaign","ndoc":504,"nentry":2646,"v01":0.3785987261146497},{"word":"dnc","ndoc":716,"nentry":2491,"v01":0.3391082802547771},{"word":"republican","ndoc":346,"nentry":2228,"v01":0.2721019108280255},{"word":"sander","ndoc":287,"nentry":1871,"v01":0.18114649681528663},{"word":"director","ndoc":964,"nentry":1810,"v01":0.16560509554140126},{"word":"202","ndoc":959,"nentry":1799,"v01":0.16280254777070063},{"word":"mark","ndoc":656,"nentry":1715,"v01":0.14140127388535031},{"word":"said","ndoc":408,"nentry":1676,"v01":0.13146496815286624},{"word":"communic","ndoc":914,"nentry":1621,"v01":0.11745222929936305},{"word":"convent","ndoc":341,"nentry":1598,"v01":0.11159235668789809},{"word":"chair","ndoc":472,"nentry":1574,"v01":0.10547770700636942},{"word":"cc","ndoc":595,"nentry":1507,"v01":0.08840764331210191},{"word":"www.democrats.org","ndoc":796,"nentry":1501,"v01":0.08687898089171975},{"word":"elect","ndoc":458,"nentry":1432,"v01":0.06929936305732484},{"word":"paustenbach","ndoc":575,"nentry":1422,"v01":0.0667515923566879},{"word":"donald","ndoc":328,"nentry":1417,"v01":0.06547770700636943},{"word":"get","ndoc":623,"nentry":1378,"v01":0.05554140127388535},{"word":"call","ndoc":650,"nentry":1377,"v01":0.055286624203821653},{"word":"clinton","ndoc":258,"nentry":1374,"v01":0.054522292993630574},{"word":"make","ndoc":542,"nentry":1368,"v01":0.05299363057324841},{"word":"-863","ndoc":833,"nentry":1293,"v01":0.033885350318471334},{"word":"one","ndoc":570,"nentry":1280,"v01":0.030573248407643312},{"word":"april","ndoc":408,"nentry":1266,"v01":0.02700636942675159},{"word":"messag","ndoc":617,"nentry":1260,"v01":0.025477707006369428},{"word":"thank","ndoc":594,"nentry":1252,"v01":0.023439490445859874},{"word":"candid","ndoc":354,"nentry":1244,"v01":0.02140127388535032},{"word":"-8148","ndoc":817,"nentry":1232,"v01":0.018343949044585986},{"word":"support","ndoc":358,"nentry":1229,"v01":0.017579617834394906},{"word":"go","ndoc":552,"nentry":1213,"v01":0.013503184713375796},{"word":"like","ndoc":510,"nentry":1190,"v01":0.007643312101910828},{"word":"wrote","ndoc":525,"nentry":1175,"v01":0.003821656050955414},{"word":"time","ndoc":528,"nentry":1169,"v01":0.0022929936305732482},{"word":"want","ndoc":629,"nentry":1160,"v01":0}]);


