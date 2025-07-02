// src/scripts/seed-services.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ServiceCategoriesService } from '../service-categories/service-categories.service';
import { ServicesService } from '../services/services.service';
import { ServicePetTypesService } from '../service-pet-types/service-pet-types.service';

async function seedServices() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('🏥 Iniciando carga de servicios...');

    const serviceCategoriesService = app.get(ServiceCategoriesService);
    const servicesService = app.get(ServicesService);
    const servicePetTypesService = app.get(ServicePetTypesService);

    // 1. Crear categorías por defecto
    console.log('📋 Creando categorías de servicios...');
    await serviceCategoriesService.seedDefaultCategories();

    // 2. Obtener categorías
    const categories = await serviceCategoriesService.findAll();

    const consultaCategory = categories.find(c => c.nombre === 'consulta general');
    const vacunacionCategory = categories.find(c => c.nombre === 'vacunación');
    const cirugiaCategory = categories.find(c => c.nombre === 'cirugía');
    const odontologiaCategory = categories.find(c => c.nombre === 'odontología');
    const emergenciasCategory = categories.find(c => c.nombre === 'emergencias');
    const esteticaCategory = categories.find(c => c.nombre === 'estética');

    // 3. Crear servicios de ejemplo
    const servicios = [
      // Consultas Generales
      {
        nombre: 'Consulta General',
        descripcion: 'Examen físico completo, evaluación del estado de salud general y asesoramiento veterinario.',
        precio: 25.00,
        imagen: 'consulta-general.jpg',
        duracionMinutos: 30,
        categoriaId: consultaCategory?.id
      },
      {
        nombre: 'Consulta de Seguimiento',
        descripcion: 'Revisión de tratamientos en curso y evaluación de la evolución del paciente.',
        precio: 20.00,
        imagen: 'consulta-seguimiento.jpg',
        duracionMinutos: 20,
        categoriaId: consultaCategory?.id
      },
      {
        nombre: 'Primera Consulta Cachorro/Gatito',
        descripcion: 'Examen completo para mascotas jóvenes, plan de vacunación y consejos de cuidado.',
        precio: 30.00,
        imagen: 'primera-consulta.jpg',
        duracionMinutos: 45,
        categoriaId: consultaCategory?.id
      },

      // Vacunación
      {
        nombre: 'Vacuna Múltiple Perros',
        descripcion: 'Vacuna pentavalente que protege contra distemper, hepatitis, parainfluenza, parvovirus y coronavirus.',
        precio: 18.00,
        imagen: 'vacuna-multiple-perros.jpg',
        duracionMinutos: 15,
        categoriaId: vacunacionCategory?.id
      },
      {
        nombre: 'Vacuna Antirrábica',
        descripcion: 'Vacuna obligatoria contra la rabia para perros y gatos.',
        precio: 12.00,
        imagen: 'vacuna-antirrabica.jpg',
        duracionMinutos: 10,
        categoriaId: vacunacionCategory?.id
      },
      {
        nombre: 'Vacuna Triple Felina',
        descripcion: 'Protección contra rinotraqueitis, calicivirus y panleucopenia felina.',
        precio: 16.00,
        imagen: 'vacuna-triple-felina.jpg',
        duracionMinutos: 15,
        categoriaId: vacunacionCategory?.id
      },

      // Cirugía
      {
        nombre: 'Esterilización Hembra',
        descripcion: 'Cirugía de esterilización (ovariohisterectomía) para hembras caninas y felinas.',
        precio: 120.00,
        imagen: 'esterilizacion-hembra.jpg',
        duracionMinutos: 90,
        categoriaId: cirugiaCategory?.id
      },
      {
        nombre: 'Castración Macho',
        descripcion: 'Cirugía de castración (orquiectomía) para machos caninos y felinos.',
        precio: 80.00,
        imagen: 'castracion-macho.jpg',
        duracionMinutos: 60,
        categoriaId: cirugiaCategory?.id
      },
      {
        nombre: 'Cirugía de Emergencia',
        descripcion: 'Intervención quirúrgica de urgencia para casos críticos.',
        precio: 200.00,
        imagen: 'cirugia-emergencia.jpg',
        duracionMinutos: 120,
        categoriaId: cirugiaCategory?.id
      },

      // Odontología
      {
        nombre: 'Limpieza Dental',
        descripcion: 'Profilaxis dental con ultrasonido y pulimento. Incluye evaluación de la salud oral.',
        precio: 60.00,
        imagen: 'limpieza-dental.jpg',
        duracionMinutos: 60,
        categoriaId: odontologiaCategory?.id
      },
      {
        nombre: 'Extracción Dental Simple',
        descripcion: 'Extracción de piezas dentales dañadas o problemáticas.',
        precio: 45.00,
        imagen: 'extraccion-dental.jpg',
        duracionMinutos: 45,
        categoriaId: odontologiaCategory?.id
      },

      // Emergencias
      {
        nombre: 'Atención de Emergencia',
        descripcion: 'Atención inmediata para casos críticos y urgencias médicas.',
        precio: 50.00,
        imagen: 'emergencia.jpg',
        duracionMinutos: 30,
        categoriaId: emergenciasCategory?.id
      },

      // Estética
      {
        nombre: 'Baño y Secado',
        descripcion: 'Baño completo con champú especializado, secado y cepillado.',
        precio: 15.00,
        imagen: 'bano-secado.jpg',
        duracionMinutos: 45,
        categoriaId: esteticaCategory?.id
      },
      {
        nombre: 'Corte de Uñas',
        descripcion: 'Corte profesional de uñas para perros y gatos.',
        precio: 8.00,
        imagen: 'corte-unas.jpg',
        duracionMinutos: 15,
        categoriaId: esteticaCategory?.id
      },
      {
        nombre: 'Corte de Pelo',
        descripcion: 'Corte de pelo estético y sanitario según la raza y preferencias del propietario.',
        precio: 25.00,
        imagen: 'corte-pelo.jpg',
        duracionMinutos: 60,
        categoriaId: esteticaCategory?.id
      }
    ];

    // 4. Crear servicios
    console.log('🔧 Creando servicios...');
    for (const servicioData of servicios) {
      if (typeof servicioData.categoriaId !== 'number') {
        console.log(`❌ No se pudo crear el servicio "${servicioData.nombre}" porque la categoría no existe.`);
        continue;
      }
      // Excluir categoriaId si es undefined (ya filtrado arriba)
      const { categoriaId, ...rest } = servicioData;
      try {
        await servicesService.create({
          ...rest,
          categoriaId: servicioData.categoriaId as number
        });
        console.log(`✅ Servicio creado: ${servicioData.nombre}`);
      } catch (error) {
        console.log(`⚠️ Servicio ya existe: ${servicioData.nombre}`);
      }
    }

    // 5. Crear relaciones por defecto
    console.log('🔗 Creando relaciones servicios-tipos de mascotas...');
    await servicePetTypesService.seedDefaultRelations();

    console.log('🎉 Servicios cargados exitosamente!');

  } catch (error) {
    console.error('❌ Error cargando servicios:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  seedServices();
}

export { seedServices };