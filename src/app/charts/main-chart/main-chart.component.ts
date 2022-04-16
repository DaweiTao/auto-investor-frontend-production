import { Component, OnDestroy, OnInit } from '@angular/core';
import { CandlestickDataStore, ChartsService, Hoverdata } from 'src/app/services/charts.service';
import * as Highcharts from "highcharts/highstock";
import HHollowCandleStick from 'highcharts/modules/hollowcandlestick';
HHollowCandleStick(Highcharts);
import { Subscription } from 'rxjs';
import { ITicker } from 'src/app/models/tickerData';
import * as moment from 'moment-timezone';


@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.css']
})
export class MainChartComponent implements OnInit, OnDestroy{
  public Highcharts: typeof Highcharts = Highcharts
  public chartOptions: Highcharts.Options | null = null
  public mainChartUpdateFlag: boolean = false
  private candlestickDataSub: Subscription = new Subscription()
  private currentCandlestickData: CandlestickDataStore | null = null

  constructor(private cs: ChartsService) { 

  }

  ngOnInit(): void {
    this.initChartOptions()
  }

  // a chart instance will be emitted when the chart is ready
  public chartCallback: Highcharts.ChartCallbackFunction = (chart: Highcharts.Chart) => {
    // reset subscription for the candlestick data
    this.candlestickDataSub.unsubscribe()
    this.candlestickDataSub = this.cs.candlestickData$.subscribe(candlestickData => {
      if (candlestickData) {
        this.currentCandlestickData = candlestickData
        if (candlestickData.candlestickData) {
          this.updateCandlestickData(chart, candlestickData.candlestickData)
        }
      }
    })
  }

  private initChartOptions() {
    this.chartOptions = {
      time: {
        useUTC: false
      },
      chart: {
        marginLeft: 80,
        backgroundColor: "rgb(0,0,0,0)",
        style: {
          fontFamily: 'sans-serif',
          color: "#d1d1d1"
        },
      },
      yAxis: [
        // candlestick
        {
          crosshair: {
            color: "orange",
            dashStyle: "Dash",
            label: {
              style:{
                fontFamily: 'sans-serif',
                fontSize:"16px"
              },
              enabled: true,
              backgroundColor: 'rgba(0,0,0,0.9)'
            }
          },
          opposite: false,
          labels: {
            align: "right",
            style: {
              fontSize: '16px',
              fontFamily: 'sans-serif',
              color: "#d1d1d1"
            }
          },
          height: "100%",
          resize: {
            enabled: true
          },
          gridLineColor: "#504e4d"
        },
      ],
      xAxis: [
        {
          crosshair: {
            color: "orange",
            dashStyle: "Dash",
            label: {
              style:{
                fontFamily: 'sans-serif',
                fontSize:"16px"
              },
              enabled: true,
              backgroundColor: 'rgba(0,0,0,0.9)'
            }
          },
          labels: {
            autoRotation: [0],
            align: "left",
            style: {
              fontFamily: 'sans-serif',
              fontSize: '16px',
              color: "#d1d1d1"
            }
          },
        }
      ],

      tooltip: {
        enabled: false
      },

      series: [
        // candlestick
        {
          type: "hollowcandlestick",
          id: "candlestick-chart",
          name: `Stock Price`,
          data: [],
          dataGrouping: {enabled: false},
          point: {
            events: {
              // update hover data
              mouseOver: ((event: any)=>{
                if (!this.currentCandlestickData?.tickerData) {
                  this.cs.hoverData$.next(null)
                  return
                }
                let hoverI = event.target.index
                let hoverTicker: ITicker = this.currentCandlestickData.tickerData[hoverI]
                let currentClose = hoverTicker.close
                let prevClose = hoverTicker.prevClose
                let change = (currentClose && prevClose) ? currentClose - prevClose : null
                let percentChange = (change && prevClose && prevClose !== 0) ?  100 * (change / prevClose) : null
                if (!change || !percentChange) {
                  this.cs.hoverData$.next(null)
                  return
                }
                let localEpoch = this.currentCandlestickData.tickerData[hoverI].epoch
                let localDateShort = moment.unix(localEpoch).tz(this.currentCandlestickData.contract.timeZoneId).format('DD/MM/YYYY')
                let localDateLong = moment.unix(localEpoch).tz(this.currentCandlestickData.contract.timeZoneId).format('DD/MM/YYYY UTC Z')
                let hoverData: Hoverdata = {
                  ...hoverTicker,
                  contract: this.currentCandlestickData.contract,
                  change: change,
                  percentChange: percentChange,
                  localDateShort: localDateShort,
                  localDateLong: localDateLong,
                }
                this.cs.hoverData$.next(hoverData)
              }).bind(this),
    
              mouseOut: (()=>{
                this.cs.hoverData$.next(null)
              }).bind(this)
            }
          },
        },
      ],

      rangeSelector: {
        selected: 2,
        enabled: true,
        allButtonsEnabled: false,
        buttonSpacing: 5,
        buttonTheme: {
          fill: 'none',
          stroke: 'none',
          'stroke-width': 0,
          r: 5,
          style: {
            fontFamily: 'sans-serif',
            fontSize: "16px",
            color: '#d1d1d1',
          },
          states: {
            hover: {
                fill: '#1979a9',
            },
            select: {
                fill: 'orange',
                style: {
                  color: '#1d2023'
                }
            }
          },
        },
        buttons: [
          {
            type: 'month',
            count: 1,
            text: '1M',
            title: 'View 1 month'
          }, 
          {
            type: 'month',
            count: 3,
            text: '3M',
            title: 'View 3 months'
          }, 
          {
            type: 'month',
            count: 6,
            text: '6M',
            title: 'View 6 months'
          }, 
          {
            type: 'year',
            count: 1,
            text: '1Y',
            title: 'View 1 year'
          }, 
          {
            type: 'year',
            count: 2,
            text: '2Y',
            title: 'View 2 years'
          }, 
          {
            type: 'year',
            count: 5,
            text: '5Y',
            title: 'View 5 years'
          }, 
          {
            type: 'ytd',
            text: 'YTD',
            title: 'View year to date'
          }, 
          {
            type: 'all',
            text: 'All',
            title: 'View All'
          }, 
        ],
        // inputBoxBorderColor: '#d1d1d1',
        inputBoxWidth: 120,
        inputBoxHeight: 18,
        inputStyle: {
          fontFamily: 'sans-serif',
          fontSize: "16px",
          color: '#d1d1d1',
          backgroundColor: '#1d2023'
        },
        labelStyle: {
          fontFamily: 'sans-serif',
          fontSize: "16px",
          color: '#d1d1d1',
          fontWeight: 'bold'
        },
      },

      plotOptions: {
        hollowcandlestick: {
            color: '#ff2b48',
            upColor: '#2fc87b',
        },
      },

      scrollbar: {
        trackBackgroundColor: 'rgba(0,0,0,0)',
        buttonBackgroundColor: 'rgba(0,0,0,0)',
        buttonArrowColor: 'orange'
      },
      
      navigator: {
        series: {
          lineColor: 'orange'
        },
        xAxis: {
          labels: {
            style: {
              fontFamily: 'sans-serif',
              fontSize: '16px',
              color: "#d1d1d1"
            }
          }
        }
      },

      // remove water mark
      credits: {
        enabled: false
      }
    }
  }

  private updateCandlestickData(chart: Highcharts.Chart, newData: number[][]): void{
    chart.series[0].setData(newData, false)
    chart.redraw(false)
  }

  ngOnDestroy(): void {
    this.candlestickDataSub.unsubscribe()
  }
}
