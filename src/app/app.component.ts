import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'chartProject';
  margin = { top: 10, right: 30, bottom: 30, left: 60 };
  width: any | undefined;
  height: any | undefined;
  svg: any;
  items = Array.from(Array(72), (_, index) => 2021);
  filteredObjs: any;

  objs: any;
  countries: any;

  constructor(private http: HttpClient) {
    this.http
      .get('assets/Countries-Continents.csv', { responseType: 'text' })
      .subscribe((data: any) => {
        this.countries = d3.csvParse(data);
        console.log(this.countries);
      });
  }
  ngOnInit() {
    this.width = 460 - this.margin.left - this.margin.right;
    this.height = 430 - this.margin.top - this.margin.bottom;

    this.svg = d3
      .select('#scatter-plot')
      .append('svg')
      .attr('width', '100%')
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 580 450')
      .classed('svg-content', true)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );

    this.http
      .get('assets/population.csv', { responseType: 'text' })
      .subscribe((data: any) => {
        this.objs = d3.csvParse(data);
        this.filteredObjs = this.objs.filter(
          (item: { [x: string]: string }) => item['Year'] === '2021'
        );
        this.createChart(this.filteredObjs);
        console.log(this.filteredObjs);
      });
    this.http
      .get('assets/Countries-Continents.csv', { responseType: 'text' })
      .subscribe((data: any) => {
        this.countries = d3.csvParse(data);
        console.log(this.countries);
      });
  }

  createChart(data: any) {
    {
      var x = d3.scaleLinear().domain([0, 800]).range([0, this.width]);
      this.svg
        .append('g')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(d3.axisBottom(x));

      var y = d3.scaleLinear().domain([-100, 100]).range([this.height, 0]);
      this.svg.append('g').call(d3.axisLeft(y));

      this.svg
        .append('text')
        .attr('x', 200)
        .attr('y', 420)
        .style('text-anchor', 'middle')
        .text('Population Density');

      this.svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - this.margin.left)
        .attr('x', 0 - this.height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Population growth (%)');

      var tooltip = d3
        .select('body')
        .append('div')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('background', '#9e9e9eab')
        .style('color', 'red')
        .style('padding', '10px')
        .style('border-radius', '10px');

      this.svg
        .append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (d: any) => x(parseInt(d[' Population_Density '])))
        .attr('cy', (d: any) =>
          y(parseFloat(d[' Population_Growth_Rate ']) * 100)
        )
        .attr('r', (d: any) => parseInt(d[' Population (000s) ']) / 100 + 3)
        .style('fill', (d: any) =>
          this.applyColor(parseInt(d[' Population (000s) ']) / 100 + 5)
        )
        .on('mouseover', function (this: any, d: any, event: any) {
          console.log(d);
          console.log(d3.pointer(event));

          d3.select(this)
            .transition()
            .duration(100)
            .attr(
              'r',
              parseInt(d.target.__data__[' Population (000s) ']) / 100 + 8
            );
          tooltip.text(d.target.__data__[' Population (000s) ']);
          // return tooltip.style('visibility', 'visible');
          return (
            tooltip.style('visibility', 'visible'),
            tooltip
              .style('top', d.pageX+300 + 'px')
              .style('left', d.pageY-300 + 'px')
          );
        })
        .on('mouseout', function (this: any, d: any, i: any) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr(
              'r',
              parseInt(d.target.__data__[' Population (000s) ']) / 100 + 3
            )
            return (
              tooltip.style('visibility', 'hidden'));
        });

      // this.svg
      //   .append('circle')
      //   .attr('cx', 200)
      //   .attr('cy', 130)
      //   .attr('r', 6)
      //   .style('fill', '#69b3a2');
      // this.svg
      //   .append('circle')
      //   .attr('cx', 200)
      //   .attr('cy', 160)
      //   .attr('r', 6)
      //   .style('fill', '#404080');
      // this.svg
      //   .append('text')
      //   .attr('x', 220)
      //   .attr('y', 130)
      //   .text('variable A')
      //   .style('font-size', '15px')
      //   .attr('alignment-baseline', 'middle');
      // this.svg
      //   .append('text')
      //   .attr('x', 220)
      //   .attr('y', 160)
      //   .text('variable B')
      //   .style('font-size', '15px')
      //   .attr('alignment-baseline', 'middle');
    }
  }

  applyColor(data: any) {
    if (data > 5 && data < 7) {
      return '#77dbbb';
    } else if (data > 8 && data < 10) {
      return '#FFC107';
    } else return '#2196F3';
  }

  // callColor(country: any){
  //   this.countries.forEach((element: any) => {
  //     if(element.Country === country){
  //       if(element.Continent === "Asia"){
  //         return "green";
  //       }else if(element.Continent === "Europe"){
  //         return "blue";
  //       }else if(element.Continent === "Africa"){
  //         return "red";
  //       }else if(element.Continent === "South America"){
  //         return "yellow";
  //       }else{
  //         return "red";
  //       }
  //     }
  //   });
  // }

  yearChange(event: any) {
    this.filteredObjs = this.objs.filter(
      (item: { [x: string]: string }) => item['Year'] == event.target.value
    );
    console.log(this.filteredObjs);
    this.svg.selectAll('circle').remove();
    this.createChart(this.filteredObjs);
  }
}
