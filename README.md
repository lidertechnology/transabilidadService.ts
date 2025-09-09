# transabilidadService.ts

# Informe de TrazabilidadService y su Uso en Componentes
El TrazabilidadService es el cerebro de la lógica de negocio en tus aplicaciones Lidertech. 
Su diseño se basa en el principio de responsabilidad única, lo que lo hace sumamente eficiente y reutilizable.

Análisis Detallado del Servicio
El servicio TrazabilidadService es una herramienta puramente lógica. 
No tiene dependencias de la base de datos, no realiza operaciones de escritura o lectura y tampoco gestiona estados. 
Su única función es la generación de IDs únicos para cada entidad en tu sistema de trazabilidad, como productos, lotes y entregas.

# Métodos del Servicio:

* generarIdProducto(tipo: string): Crea un ID único para una materia prima o un producto terminado.

* generarIdLote(tipoProductoFinal: string): Genera un ID para un grupo de productos en una misma producción.

* generarIdConsumo(): Asigna un ID a una transacción donde se consume un ingrediente.

* generarIdProductoTerminado(nombreProducto: string): Crea un ID para un producto final listo para la venta.

* generarIdSalida(): Genera un ID para el registro de la salida de un producto del inventario.

* generarIdProductoDefectuoso(): Crea un ID para un producto registrado como defectuoso.

Este diseño desacoplado asegura que tu aplicación sea flexible y fácil de mantener.

# Uso del Servicio en un Componente
El componente actúa como el orquestador. Su rol es unir la lógica del TrazabilidadService con las operaciones de base de datos del WriteService. 
El componente maneja el estado de la UI y controla el flujo de la información.

A continuación, se muestra un ejemplo detallado de cómo usar el TrazabilidadService en un componente de registro de productos.

TypeScript

    // src/app/componentes/registro-producto/registro-producto.component.ts
    import { Component, signal, WritableSignal } from '@angular/core';
    import { TrazabilidadService } from '../../servicios/trazabilidad.service';
    import { WriteService } from '../../servicios/write.service';
    import { StatesEnum } from '../../enums/states.enum';
    import { FormsModule } from '@angular/forms';
    
    @Component({
      selector: 'app-registro-producto',
      standalone: true,
      imports: [FormsModule],
      template: `
        <div [ngSwitch]="states()">
          <div *ngSwitchCase="StatesEnum.LOADING">Registrando...</div>
          <div *ngSwitchCase="StatesEnum.SUCCESS">Producto registrado con éxito.</div>
          <div *ngSwitchCase="StatesEnum.ERROR">Error al registrar el producto.</div>
          <div *ngSwitchCase="StatesEnum.DEFAULT">
            <form (ngSubmit)="registrarProducto()">
              <label>Nombre del Producto:</label>
              <input type="text" [(ngModel)]="nombre" name="nombre">
              <label>Cantidad:</label>
              <input type="number" [(ngModel)]="cantidad" name="cantidad">
              <label>Unidad:</label>
              <input type="text" [(ngModel)]="unidad" name="unidad">
              <button type="submit">Registrar</button>
            </form>
          </div>
        </div>
      `,
    })
    export class RegistroProductoComponent {
      public states: WritableSignal<StatesEnum> = signal(StatesEnum.DEFAULT);
      public nombre: string;
      public cantidad: number;
      public unidad: string;
    
      constructor(
        private trazabilidadService: TrazabilidadService,
        private writeService: WriteService
      ) {}
    
      public async registrarProducto(): Promise<void> {
        this.states.set(StatesEnum.LOADING);
        try {
          const tipo = 'materia_prima';
          const idProducto = this.trazabilidadService.generarIdProducto(tipo);
    
          const datosProducto = {
            id: idProducto,
            nombre: this.nombre,
            cantidad: this.cantidad,
            unidad: this.unidad,
            fechaEntrada: new Date(),
            tipo: tipo,
          };
    
          await this.writeService.crearDocumento('productos', idProducto, datosProducto);
    
          this.states.set(StatesEnum.SUCCESS);
        } catch (error) {
          this.states.set(StatesEnum.ERROR);
        }
      }
    }
