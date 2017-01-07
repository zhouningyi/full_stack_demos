/*
* @Author: zhouningyi
* @Date:   2017-01-06 21:02:13
* @Last Modified by:   zhouningyi
* @Last Modified time: 2017-01-06 21:13:42
*/

'use strict';

 const container = document.querySelector('#canvas-container');
 const particles = new Particles(container);

 fetch('./hillaries.json')
 .then(res => res.json())
 .then(ds => {
    particles.render(ds);
 });
