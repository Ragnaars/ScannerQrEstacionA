import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from "../../services/firestore.service";
import { Pipe, PipeTransform } from '@angular/core';
import { FireUsuariosService } from "../../services/fire-usuarios.service"


@Component({
  selector: 'app-vista-est',
  templateUrl: './vista-est.page.html',
  styleUrls: ['./vista-est.page.scss'],
})
export class VistaEstPage implements OnInit {

  data: any = [];

  disponibles: any = [];
  contador: number = 0;



  constructor(private router: Router, private fireService: FirestoreService, private fireUsuarios: FireUsuariosService) { }

  ngOnInit() {
    this.fireService.obtenerDoc().subscribe(doc => {
      console.log("doc", doc);
      this.data = doc;
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

  resetEst(nro_est: any) {
    console.log("ejecutando")
    this.fireUsuarios.obtenerDoc().subscribe(doc => {
      // Encontrar usuario estacionado
      const datos = doc.find((item: any) => item.id_est === nro_est);
      console.log("UE", datos);

      // Verificar si se encontraron datos
      if (datos) {
        console.log("ejecutando 2");
        console.log("datosUE", datos);

        // Actualizar usuario estacionado
        this.fireUsuarios.updateDoc(datos.id, { id_est: '', nro_est: 0 });
        this.fireService.updateDoc(nro_est, { disponible: true, email: '', patente: '' });

        // Crear registro de salida
        const regEstHist = {
          nro_est: datos.nro_est,
          hora: new Date(),
          usuario: datos.email,
        };

        this.fireService.createDocRegHistoricoEstSalida(regEstHist);

        console.log("Estacionamiento reseteado con éxito");
        // Recargar la página pero antes espera 2 segundos
        setTimeout(() => {
          location.reload();
        }, 1300);
      } else {
        console.log("No se encontraron datos para el usuario estacionado.");
      }

    });
  }


  goScanner() {
    this.router.navigate(['/scanner'])
  }
}
