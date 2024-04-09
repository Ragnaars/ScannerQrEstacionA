import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from "../../services/firestore.service";
import { Pipe, PipeTransform } from '@angular/core';


@Component({
  selector: 'app-vista-est',
  templateUrl: './vista-est.page.html',
  styleUrls: ['./vista-est.page.scss'],
})
export class VistaEstPage implements OnInit {

  data: any = [];
  disponibles: any = [];
  contador: number = 0;


  constructor(private router: Router, private fireService: FirestoreService) { }

  ngOnInit() {
    this.fireService.obtenerDoc().subscribe(doc => {
      console.log(doc);
      this.data = doc;
      this.data.id.forEach((element: any) => { this.contador += 1; });
    });
  }


  obtenerDisponibles() {
    this.fireService.obtenerDoc().subscribe(doc => {
      console.log(doc);
      // Filtra los documentos con 'disponible' igual a true
      this.disponibles = doc.filter(item => item.disponible === true);
      console.log(this.disponibles);
    });
  }

  goScanner() {
    this.router.navigate(['/scanner'])
  }
}
