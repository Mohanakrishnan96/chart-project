import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { area } from 'd3';
export type DataType = { year: any; population: any };
@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    var dataset = [
      { year: 1950, population: 200 },
      { year: 1980, population: 250 },
      { year: 1990, population: 300 },
      { year: 2000, population: 350 },
      { year: 2005, population: 550 },
      { year: 2009, population: 600 },
      { year: 2010, population: 620 },
      { year: 2012, population: 650 },
      { year: 2015, population: 680 },
      { year: 2021, population: 700 },
    ];
    console.log(dataset);

    var margin = { top: 40, right: 40, bottom: 40, left: 60 },
      width = 250 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

    var x = d3.scaleTime().range([0, width]);

    var y = d3.scaleLinear().range([height, 0]);

    var line = d3
      .line<DataType>()
      .x(function (d) {
        return x(d.year);
      })
      .y(function (d) {
        return y(d.population);
      });

    var svg = d3
      .select('#line_chart')
      .append('svg')

      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain([1950, 2021]);
    y.domain([0, 1000]);

    svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(2));

    svg.append('g').attr('class', 'axis axis--y').call(d3.axisLeft(y).ticks(0));

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .attr(
        'transform',
        'translate(' + (margin.left - 94) + ',' + height / 2 + ')rotate(-90)'
      )
      .text('Population growth');

    svg
      .append('text')
      .style('font-size', '14px')
      .attr('text-anchor', 'middle')
      .attr(
        'transform',
        'translate(' + width / 2 + ',' + (height - (margin.bottom - 74)) + ')'
      )
      .text('year');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 20 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text('Population');

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .attr('x', 20)
      .attr('y', 125)
      .text('2.5Bn');

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .attr('x', 170)
      .attr('y', 45)
      // .attr(
      //   'transform',
      //   'translate(' + (margin.left - 94) + ',' + height / 2 + ')rotate(-90)'
      // )
      .text('7.8Bn');

    svg
      .append('path')
      .datum(dataset)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', '3px');

    // svg
    //   .append('path')
    //   .datum(dataset)
    //   // .attr('d', area)
    //   .attr('fill', '#69b3a2')
    //   .attr('fill-opacity', 0.3)
    //   .attr('stroke', 'none');
    // // .attr("d", d3.area()
    // //     .x((d)=> { return x(d.year) })
    // //     .y0( height )
    // //     .y1((d) =>{ return y(d.pizza) })
    // //     )
  }
}
