/*
* @Author: zhouningyi
* @Date:   2017-01-06 21:02:13
* @Last Modified by:   zhouningyi
* @Last Modified time: 2017-01-06 22:33:44
*/

'use strict';

  class Particle{
    constructor(ctx){
      this.ctx = ctx;
      this.x = Math.random() * 1000;
      this.y = Math.random() * 500;
      this.vx = (Math.random() - 0.5 ) * 0;
      this.vy = (Math.random() - 0.5 ) * 0;
      this.r  = 5;
      this.ax = 0;
      this.ay = 0;
      ctx.fillStyle = 'rgba(0,255,255,.3)';
    }
    draw(){
      const {ctx} = this;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      ctx.fill();
      ctx.closePath();
    }
    render(node){
    	this.data = node;
    }
    update(a){
      this.check();
      const k = -0.41; /////////////////////////阻力
      let aXresistance = this.vx * k;
      let aYresistance = this.vy * k;

      //向心力
      const {width, height} = this.ctx.canvas;
      const cx = width / 2;
      const cy = height / 2;
      const dx = cx - this.x;
      const dy = cy - this.y;
      const dist = Math.max(1, Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)));
      const g = 5;
      const aXcenter = g * dx / dist;
      const aYcenter = g * dy / dist;
      //
      this.vx += (a.ax + aXresistance + aXcenter);
      this.vy += (a.ay + aYresistance + aYcenter);
      this.x += this.vx;
      this.y += this.vy;
    }
    check(){//检测是否碰壁了
      const {width, height} = this.ctx.canvas;
      if (this.x - this.r < 0 || this.x + this.r > width)  this.vx *= -1;
      if (this.y - this.r < 0 || this.y + this.r > height) this.vy *= -1;
    }
  }

    window.Particle = Particle;
