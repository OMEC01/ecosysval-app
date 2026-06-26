import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateEmpleoDto {
  @IsString()
  @MaxLength(140)
  titulo: string;

  @IsString()
  @MaxLength(140)
  empresa: string;

  @IsString()
  @MaxLength(120)
  ubicacion: string;

  @IsOptional()
  @IsString()
  salario?: string;

  @IsOptional()
  @IsString()
  modalidad?: string;

  @IsOptional()
  @IsString()
  contrato?: string;

  @IsOptional()
  @IsString()
  jornada?: string;

  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  requisitos?: string;

  @IsOptional()
  @IsString()
  beneficios?: string;

  @IsOptional()
  @IsString()
  contacto?: string;

  @IsOptional()
  @IsBoolean()
  urgente?: boolean;
}
