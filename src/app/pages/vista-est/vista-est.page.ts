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
      //encontrar usuario estacionado
      const usuarioEstacionado: any = doc.find((item: any) => item.id_est === nro_est);
      console.log("UE", usuarioEstacionado);

      this.fireUsuarios.updateDoc(usuarioEstacionado.id, { id_est: '', nro_est: 0 });
      //actualizar usuario estacionado
      this.fireService.updateDoc(nro_est, { disponible: true, email: '', patente: '' });


      //CREAR REGISTRO DE SALIDA
      const regEstHist = {
        nro_est: nro_est,
        hora: new Date(),
        usuario: usuarioEstacionado.email,
      }
      this.fireService.createDocRegHistoricoEstSalida(usuarioEstacionado);

      console.log("Estacionamiento reseteado con éxito");
    });

  }


  goScanner() {
    this.router.navigate(['/scanner'])
  }
}
