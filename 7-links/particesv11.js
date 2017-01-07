/*
* @Author: zhouningyi
* @Date:   2017-01-06 21:02:13
* @Last Modified by:   zhouningyi
* @Last Modified time: 2017-01-07 00:05:34
*/

'use strict';
  class Particles{
    constructor(container){
      this.container = container;
      this.init();
    }
    init(){
      this.initCanvas();
    }
    clean(){
      const{ctx, canvas} = this;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
    initCanvas(){
      const {container} = this;
      const canvas = this.canvas = document.createElement('canvas');
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
      container.appendChild(canvas);
      this.ctx = canvas.getContext('2d');
    }
    initParticles(){
      const particles = this.particles = [];
      const {ctx} = this;
      for(let i = 0; i < this.nodes.length; i++){
        let particle = new Particle(ctx);
        particle.render();
        particles.push(particle);
      }
    }
    getForce(i){//计算万有引力
      let ax = 0;
      let ay = 0;
      let particleSource = this.particles[i];
      let xSource = particleSource.x;
      let ySource = particleSource.y;
      this.particles.forEach((particle, j) => {
        if(i !== j){
          let xTarget = particle.x;
          let yTarget = particle.y;
          let dx = xTarget - xSource;
          let dy = yTarget - ySource;
          let distance2 = Math.pow(dx, 2) + Math.pow(dy, 2);
          distance2 = Math.max(distance2, 400);
          let distance = Math.sqrt(distance2);
          //引力部分
          let f = 50 / distance2;
          let vnormalX = dx / distance;
          let vnormalY = dy / distance;
          ax += .01 * vnormalX;
          ay += .01 * vnormalY;
          //弹簧力部分
          let minDistance = 250;
          let k = .001;
          let fSpring = Math.min(k * (distance - minDistance), .001);
          ax += fSpring * vnormalX;
          ay += fSpring * vnormalY;
        }
      });
      return {ax, ay};
    }
    updateParticles(){
      this.clean();
      this.particles.forEach((particle, i) => {
        const f = this.getForce(i);
        particle.update(f);
        particle.draw();
      })
    }
    data(ds){
      const nodes = ds.nodes;
      this.nodes = ds.nodes;
      this.links = ds.links;
    }
    drawLines(){
      this.links.forEach(link => {
      });
    }
    render(ds){
      this.data(ds);
      this.initParticles();
      this.drawLines();
      this.loop();
    }
    loop(){
      this.updateParticles();
      window.requestAnimationFrame(() => this.loop())
    }
  };

  window.Particles = Particles;