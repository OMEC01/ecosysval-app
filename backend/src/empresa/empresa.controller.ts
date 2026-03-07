import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { EmpresaService } from './empresa.service';
import { EmpresaReportService } from './empresa.report.service';

@Controller('empresas')
export class EmpresaController {
  constructor(
    private readonly empresaService: EmpresaService,
    private readonly empresaReportService: EmpresaReportService, // generador de PDF
  ) {}

  @Post()
  crear(@Body() body: any) {
    return this.empresaService.crear(body);
  }

  @Get()
  obtenerTodas() {
    return this.empresaService.obtenerTodas();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.empresaService.obtenerPorId(id);
  }

  @Put(':id')
  actualizar(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.empresaService.actualizar(id, body);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.empresaService.eliminar(id);
  }

  // ✅ NUEVO: subir/actualizar logo de la empresa
  @Patch(':id/logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/logos',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async uploadLogo(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      return {
        success: false,
        message: 'No se recibió archivo de logo',
      };
    }

    const logoPath = `/uploads/logos/${file.filename}`;

    const empresa = await this.empresaService.actualizar(id, { logo: logoPath });

    return {
      success: true,
      logo: logoPath,
      empresa,
    };
  }

  // ✅ Generar y devolver URL del PDF del perfil empresarial
  @Get(':id/reporte')
  async generarReporte(@Param('id', ParseIntPipe) id: number) {
    const empresa = await this.empresaService.obtenerPorId(id);
    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    const url = await this.empresaReportService.generarPDF(empresa);
    return {
      success: true,
      url, // p.ej. "/uploads/empresa_3.pdf"
    };
  }
}