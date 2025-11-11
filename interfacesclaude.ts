// models/trazabilidad-sanduches.model.ts

export interface FacturaIngreso {
  id: string; // UUID
  numeroFactura: string;
  proveedor: {
    nit: string;
    nombre: string;
    direccion: string;
    telefono?: string;
  };
  fecha: Date;
  fechaVencimiento?: Date;
  items: ItemFactura[];
  subtotal: number;
  iva: number;
  total: number;
  estado: EstadoFactura;
  documentoElectronico?: string; // URL o CUFE
}

export interface ItemFactura {
  codigo: string;
  descripcion: string;
  unidad: string; // PZA, KG, UN, etc.
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  productoId?: string; // Referencia al producto en el sistema
}

export interface RecepcionMateriaPrima {
  id: string;
  facturaId: string;
  fechaRecepcion: Date;
  numeroRemision?: string;
  lotes: LoteMateriaPrima[];
  inspeccionCalidad: InspeccionCalidad;
  responsable: string;
  observaciones?: string;
  estado: EstadoRecepcion;
}

export interface LoteMateriaPrima extends Lote {
  facturaItemId: string; // Relación con item de factura
  producto: ProductoMateriaPrima;
  cantidadRecibida: number;
  cantidadDisponible: number;
  condicionesAlmacenamiento: CondicionAlmacenamiento;
  ubicacionBodega?: string;
}

export interface ProductoMateriaPrima {
  id: string;
  codigo: string;
  nombre: string;
  categoria: CategoriaProducto;
  unidadMedida: string;
  requiereRefrigeracion: boolean;
  tiempoVidaUtil?: number; // días
  especificaciones?: Record<string, any>;
}

export interface InspeccionCalidad {
  id: string;
  fecha: Date;
  inspector: string;
  temperaturaTransporte?: ControlTemperatura;
  temperaturaRecepcion?: ControlTemperatura;
  gradosBrix?: number; // °Bx para jugos
  controles: ControlCalidad[];
  resultado: ResultadoInspeccion;
  observaciones?: string;
  reclamos?: string;
  firma?: string; // URL imagen firma
}

export interface ControlTemperatura {
  tipo: TipoTemperatura; // BAJA/FRIA/CONGELACION/AMBIENTE
  valor: number; // °C
  cumpleEspecificacion: boolean;
}

export interface ControlCalidad {
  aspecto: string; // Visual, olor, textura
  parametro: string;
  valorEsperado: string;
  valorObtenido: string;
  cumple: boolean;
}

export enum TipoTemperatura {
  AMBIENTE = 'AMBIENTE',
  BAJA = 'BAJA', // 10-15°C
  FRIA = 'FRIA', // 0-8°C
  CONGELACION = 'CONGELACION', // <0°C
}

export enum CategoriaProducto {
  BEBIDAS = 'BEBIDAS',
  LACTEOS = 'LACTEOS',
  EMPAQUES = 'EMPAQUES',
  CARNES = 'CARNES',
  VEGETALES = 'VEGETALES',
  CONDIMENTOS = 'CONDIMENTOS',
  PANES = 'PANES',
}

export enum EstadoFactura {
  PENDIENTE_RECEPCION = 'PENDIENTE_RECEPCION',
  RECEPCIONADA_PARCIAL = 'RECEPCIONADA_PARCIAL',
  RECEPCIONADA_COMPLETA = 'RECEPCIONADA_COMPLETA',
  RECHAZADA = 'RECHAZADA',
}

export enum EstadoRecepcion {
  APROBADA = 'APROBADA',
  APROBADA_CON_OBSERVACIONES = 'APROBADA_CON_OBSERVACIONES',
  RECHAZADA = 'RECHAZADA',
}

export enum ResultadoInspeccion {
  CONFORME = 'CONFORME',
  NO_CONFORME = 'NO_CONFORME',
  CONFORME_CON_OBSERVACIONES = 'CONFORME_CON_OBSERVACIONES',
}

export interface CondicionAlmacenamiento {
  temperaturaRequerida: TipoTemperatura;
  humedad?: string;
  ventilacion?: boolean;
  proteccionLuz?: boolean;
}

// Modelo específico para sándwiches
export interface RecetaSanduche {
  id: string;
  nombre: string; // Ej: "Sándwich de Jamón y Queso"
  codigo: string;
  ingredientes: IngredienteReceta[];
  rendimiento: number; // Cuántas unidades produce
  tiempoPreparacion: number; // minutos
  instrucciones?: string;
  costoEstimado?: number;
}

export interface IngredienteReceta {
  productoId: string;
  nombre: string;
  cantidad: number;
  unidad: string;
  esOpcional: boolean;
}

export interface ProduccionSanduche {
  id: string;
  recetaId: string;
  loteProduccion: string;
  fechaProduccion: Date;
  cantidadProducida: number;
  materiaPrimaConsumida: ConsumoMateriaPrima[];
  operarios: string[];
  turno?: string;
  observaciones?: string;
  estado: EstadoProduccion;
}

export interface ConsumoMateriaPrima extends Consumo {
  productoId: string;
  nombreProducto: string;
  loteOrigenId: string;
  cantidadConsumida: number;
  unidad: string;
  temperaturaUso?: number;
}

export enum EstadoProduccion {
  PLANIFICADA = 'PLANIFICADA',
  EN_PROCESO = 'EN_PROCESO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
}
