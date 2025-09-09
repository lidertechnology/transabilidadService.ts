// lidertechLibCentralModule/servicios/trazabilidad.service.ts
import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class TrazabilidadService {
  public generarIdProducto(tipo: string): string {
    return `${tipo.toUpperCase().replace(/\s/g, '_')}_${uuidv4()}`;
  }

  public generarIdLote(tipoProductoFinal: string): string {
    return `${tipoProductoFinal.toUpperCase().replace(/\s/g, '_')}_${uuidv4()}`;
  }

  public generarIdConsumo(): string {
    return uuidv4();
  }

  public generarIdProductoTerminado(nombreProducto: string): string {
    return `${nombreProducto.toUpperCase().replace(/\s/g, '_')}_${uuidv4()}`;
  }

  public generarIdSalida(): string {
    return uuidv4();
  }

  public generarIdProductoDefectuoso(): string {
    return uuidv4();
  }
}
