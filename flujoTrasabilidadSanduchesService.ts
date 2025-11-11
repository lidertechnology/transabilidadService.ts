// services/flujo-trazabilidad-sanduches.service.ts
import { Injectable } from '@angular/core';
import { TrazabilidadService } from './trazabilidad.service';

@Injectable({
  providedIn: 'root',
})
export class FlujoTrazabilidadSanduchesService {
  constructor(private trazabilidadService: TrazabilidadService) {}

  // PASO 1: Registrar Factura de Ingreso
  registrarFacturaIngreso(facturaData: any): FacturaIngreso {
    const factura: FacturaIngreso = {
      id: this.trazabilidadService.generarId('FACTURA'),
      numeroFactura: facturaData.numeroFactura,
      proveedor: facturaData.proveedor,
      fecha: new Date(facturaData.fecha),
      items: facturaData.items,
      subtotal: facturaData.subtotal,
      iva: facturaData.iva,
      total: facturaData.total,
      estado: EstadoFactura.PENDIENTE_RECEPCION,
    };

    // Registrar acción de trazabilidad
    this.trazabilidadService.registrarAccion(
      factura.id,
      TipoAccion.ENTRADA,
      {
        proveedor: factura.proveedor.nombre,
        total: factura.total,
      }
    );

    return factura;
  }

  // PASO 2: Recepcionar Materia Prima con Inspección de Calidad
  recepcionarMateriaPrima(
    facturaId: string,
    datosRecepcion: any
  ): RecepcionMateriaPrima {
    const recepcion: RecepcionMateriaPrima = {
      id: this.trazabilidadService.generarId('RECEPCION'),
      facturaId,
      fechaRecepcion: new Date(),
      lotes: [],
      inspeccionCalidad: datosRecepcion.inspeccion,
      responsable: datosRecepcion.responsable,
      observaciones: datosRecepcion.observaciones,
      estado: datosRecepcion.inspeccion.resultado === ResultadoInspeccion.CONFORME
        ? EstadoRecepcion.APROBADA
        : EstadoRecepcion.RECHAZADA,
    };

    // Crear lotes para cada producto recibido
    datosRecepcion.productos.forEach((prod: any) => {
      const lote = this.crearLoteMateriaPrima(prod, recepcion.id);
      recepcion.lotes.push(lote);

      // Registrar entrada de lote
      this.trazabilidadService.registrarAccion(
        lote.id,
        TipoAccion.ENTRADA,
        {
          producto: lote.producto.nombre,
          cantidad: lote.cantidadRecibida,
          factura: facturaId,
        },
        [facturaId] // Padre: la factura
      );
    });

    return recepcion;
  }

  // PASO 3: Crear Lotes de Materia Prima
  private crearLoteMateriaPrima(
    productoData: any,
    recepcionId: string
  ): LoteMateriaPrima {
    const lote = this.trazabilidadService.crearLote(
      productoData.productoId,
      productoData.cantidad,
      productoData.unidad,
      {
        facturaItemId: productoData.facturaItemId,
        recepcionId,
        fechaVencimiento: productoData.fechaVencimiento,
      }
    ) as LoteMateriaPrima;

    lote.producto = productoData.producto;
    lote.cantidadRecibida = productoData.cantidad;
    lote.cantidadDisponible = productoData.cantidad;
    lote.condicionesAlmacenamiento = productoData.condiciones;

    return lote;
  }

  // PASO 4: Producir Sándwiches Consumiendo Materia Prima
  producirSanduches(
    recetaId: string,
    cantidadProducir: number,
    lotesDisponibles: LoteMateriaPrima[]
  ): ProduccionSanduche {
    const produccion: ProduccionSanduche = {
      id: this.trazabilidadService.generarId('PRODUCCION'),
      recetaId,
      loteProduccion: this.trazabilidadService.generarId('LOTE_PROD'),
      fechaProduccion: new Date(),
      cantidadProducida: cantidadProducir,
      materiaPrimaConsumida: [],
      operarios: [],
      estado: EstadoProduccion.EN_PROCESO,
    };

    // Consumir materia prima según receta
    // (aquí deberías cargar la receta y calcular cantidades)
    lotesDisponibles.forEach((lote) => {
      const consumo = this.trazabilidadService.registrarConsumo(
        lote.id,
        produccion.loteProduccion,
        10, // cantidad consumida (calcular según receta)
        {
          productoNombre: lote.producto.nombre,
        }
      );

      produccion.materiaPrimaConsumida.push({
        ...consumo,
        productoId: lote.producto.id,
        nombreProducto: lote.producto.nombre,
        unidad: lote.unidadMedida,
      });

      // Actualizar cantidad disponible
      lote.cantidadDisponible -= 10;

      // Registrar consumo en trazabilidad
      this.trazabilidadService.registrarAccion(
        consumo.id,
        TipoAccion.CONSUMO,
        {
          loteOrigen: lote.id,
          loteDestino: produccion.loteProduccion,
          cantidad: 10,
        },
        [lote.id], // Padre: lote origen
        [produccion.loteProduccion] // Hijo: producción
      );
    });

    return produccion;
  }

  // PASO 5: Consultar Trazabilidad Completa
  consultarTrazabilidadProducto(
    productoTerminadoId: string,
    registros: RegistroTrazabilidad[]
  ) {
    return {
      haciaAtras: this.trazabilidadService.construirCadenaTrazabilidadHaciaAtras(
        registros,
        productoTerminadoId
      ),
      haciaAdelante: this.trazabilidadService.construirCadenaTrazabilidadHaciaAdelante(
        registros,
        productoTerminadoId
      ),
    };
  }
}
```

### 5. **Relación entre Documentos**
```
FACTURA (Proveedor)
    ↓
RECEPCIÓN (Control de Calidad + Formato Manual)
    ↓
LOTES DE MATERIA PRIMA (Con trazabilidad individual)
    ↓
CONSUMO (Producción de Sándwiches)
    ↓
PRODUCTO TERMINADO (Sándwich con trazabilidad completa)
    ↓
SALIDA/DESPACHO
