import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from "node_modules/chart.js";
import { FirestoreService } from "../../services/firestore.service";


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

  //barras



  constructor(private serviciosEstaciona: FirestoreService) { }

  ngOnInit() {
    this.serviciosEstaciona.obtenerDataHistoricaEntrada().subscribe(data => {
      console.log("data", data);
      this.chartdata = data;
      if (this.chartdata != null) {
        for (let i = 0; i < this.chartdata.length; i++) {
          // console.log("infoe", this.chartdata[i].hora);
          this.labeldata.push(this.chartdata[i].nro_est);
          this.realdata.push(this.chartdata[i].hora);;
        }
        this.renderChart(this.labeldata, this.realdata);
      }
      else {
        console.log("No hay datos");
      }
    })

  }



  renderChart(labeldata: any, realdata: any) {
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

    console.log("countMap", countMap);


    const ctx = document.getElementById('piechart');

    if (ctx instanceof HTMLCanvasElement) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: unicosEst,
          datasets: [{
            label: '# of Votes',
            data: Object.values(countMap),
            borderWidth: 1,
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

