import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from "node_modules/chart.js";
import { FirestoreService } from "../../services/firestore.service";
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

Chart.register(...registerables);

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.page.html',
  styleUrls: ['./dashboards.page.scss'],
})
export class DashboardsPage implements OnInit {
  chartdata: any[] = [];
  labeldata: any[] = [];
  realdata: any[] = [];

  //barras y pie
  maxKey: number = 0;
  maxBar: number = 0;
  minBar: number = 0;
  minKey: number = 0;

  //radar
  maxHora: number = 0;
  minHora: number = 0;





  constructor(private serviciosEstaciona: FirestoreService) { }

  ngOnInit() {
    this.serviciosEstaciona.obtenerDataHistoricaEntrada().subscribe(data => {
      console.log("data", data);
      this.chartdata = data;
      if (this.chartdata != null) {
        for (let i = 0; i < this.chartdata.length; i++) {
          // console.log("infoe", this.chartdata[i].hora);
          this.labeldata.push(this.chartdata[i].nro_est);
          this.realdata.push(this.chartdata[i].hora);
        }
        this.renderChart(this.labeldata, this.realdata, 'bar', 'barchart');
        this.renderChart(this.labeldata, this.realdata, 'pie', 'piechart');
        this.renderChartFecha(this.labeldata, this.realdata);

      }
      else {
        console.log("No hay datos");
      }
    })

  }



  renderChart(labeldata: any, realdata: any, type: any, id: any) {
    console.log("labeldata", labeldata);
    //agrupar los datos 
    const unicosEst = labeldata.filter((value: any, index: any, self: any) => {
      return self.indexOf(value) === index;
    });
    //ordenar de menor a mayor
    unicosEst.sort((a: any, b: any) => a - b);

    //contar la cantidad de veces que se repite un numero
    const countMap: Record<number, number> = {};

    labeldata.forEach((value: any) => {
      if (countMap[value]) {
        countMap[value]++;
      } else {
        countMap[value] = 1;
      }
    });

    //obtener valor maximo y min de countMap con sus respectivas claves
    ;
    this.maxBar = Math.max(...Object.values(countMap));
    this.minBar = Math.min(...Object.values(countMap));
    //transformar en array el countmap 
    const keys = Object.keys(countMap);
    const values = Object.values(countMap);

    //obtener la clave con el valor maximo
    this.maxKey = parseInt(keys[values.indexOf(this.maxBar)]);
    this.minKey = parseInt(keys[values.indexOf(this.minBar)])


    let ctx = document.getElementById(id);

    if (ctx instanceof HTMLCanvasElement) {
      new Chart(ctx, {
        type: type,
        data: {
          labels: unicosEst,
          datasets: [{
            label: 'Cantidad de veces que se ha ocupado un estacionamiento',
            data: Object.values(countMap),
            borderWidth: 1,
            backgroundColor: ['#012c56', '#F2BB16', '#F2A81D', '#F2911B', '#F2F2F2'],
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  renderChartFecha(labeldata: any, realdata: any) {
    console.log("realdata", realdata);
    //obtener fecha con horas de los datos de este tipo :; Object { seconds: 1712715496, nanoseconds: 396000000 }
    const fechas = realdata.map((value: any) => {
      return new Date(value.seconds * 1000).getHours();
    });


    console.log("fechas", fechas);

    const countMap: Record<number, number> = {};

    fechas.forEach((value: any) => {
      if (countMap[value]) {
        countMap[value]++;
      } else {
        countMap[value] = 1;
      }
    });

    console.log("countMap", Object.values(countMap));

    //obtener valor maximo y min de countMap con sus respectivas claves
    const arrayFromRecord: [string, number][] = Object.entries(countMap);
    console.log("arrayFromRecord", arrayFromRecord);

    //obtener valor maximo y min de countMap con sus respectivas claves
    const keys = Object.keys(countMap);
    //transformar keys en array numerico 
    const keysNumeric = keys.map((value) => {
      return parseInt(value);
    });

    const values = Object.values(countMap);
    this.maxHora = Math.max(...keysNumeric);
    this.minHora = Math.min(...keysNumeric);




    let ctx = document.getElementById('rochart');

    if (ctx instanceof HTMLCanvasElement) {
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
          datasets: [{
            label: 'Horas en donde mas hay movimiento de vehiculos',
            data: Object.values(countMap),
            borderWidth: 1,
            backgroundColor: ['#012c56', '#F2BB16', '#F2A81D', '#F2911B', '#F2F2F2'],
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }



}

