import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RolesService } from '../roles/roles.service';
import { PetTypesService } from '../pet-types/pet-types.service';
import { ServiceCategoriesService } from '../service-categories/service-categories.service';
import { AppointmentStatusesService } from '../appointment-statuses/appointment-statuses.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

async function seedInitialData() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('🌱 Iniciando configuración inicial...');

    // Servicios
    const rolesService = app.get(RolesService);
    const petTypesService = app.get(PetTypesService);
    const serviceCategoriesService = app.get(ServiceCategoriesService);
    const appointmentStatusesService = app.get(AppointmentStatusesService);
    const usersService = app.get(UsersService);

    // 1. Crear roles por defecto
    console.log('📋 Creando roles por defecto...');
    await rolesService.seedDefaultRoles();

    // 2. Crear tipos de mascotas por defecto
    console.log('🐾 Creando tipos de mascotas por defecto...');
    await petTypesService.seedDefaultPetTypes();

    // 3. Crear categorías de servicios por defecto
    console.log('🏥 Creando categorías de servicios por defecto...');
    await serviceCategoriesService.seedDefaultCategories();

    // 4. Crear estados de citas por defecto
    console.log('📅 Creando estados de citas por defecto...');
    await appointmentStatusesService.seedDefaultStatuses();

    // 5. Crear usuario administrador por defecto
    console.log('👤 Creando usuario administrador...');
    
    const adminRole = await rolesService.findByName('ADMIN');
    if (adminRole) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      
      try {
        await usersService.create({
          nombres: 'Administrador',
          apellidos: 'Sistema',
          cedula: '0000000001',
          correo: 'admin@veterinaria.com',
          contrasena: adminPassword,
          rolId: adminRole.id
        });
        console.log('✅ Usuario administrador creado: admin@veterinaria.com / admin123');
      } catch (error) {
        console.log('ℹ️ Usuario administrador ya existe');
      }
    }

    // 6. Crear usuario veterinario de ejemplo
    console.log('👨‍⚕️ Creando usuario veterinario de ejemplo...');
    
    const vetRole = await rolesService.findByName('VETERINARIO');
    if (vetRole) {
      const vetPassword = await bcrypt.hash('vet123', 10);
      
      try {
        await usersService.create({
          nombres: 'Dr. Juan',
          apellidos: 'Pérez',
          cedula: '1234567890',
          correo: 'veterinario@veterinaria.com',
          contrasena: vetPassword,
          rolId: vetRole.id
        });
        console.log('✅ Usuario veterinario creado: veterinario@veterinaria.com / vet123');
      } catch (error) {
        console.log('ℹ️ Usuario veterinario ya existe');
      }
    }

    // 7. Crear usuario cliente de ejemplo
    console.log('👤 Creando usuario cliente de ejemplo...');
    
    const clientRole = await rolesService.findByName('CLIENTE');
    if (clientRole) {
      const clientPassword = await bcrypt.hash('cliente123', 10);
      
      try {
        await usersService.create({
          nombres: 'María',
          apellidos: 'González',
          cedula: '0987654321',
          correo: 'cliente@example.com',
          contrasena: clientPassword,
          rolId: clientRole.id
        });
        console.log('✅ Usuario cliente creado: cliente@example.com / cliente123');
      } catch (error) {
        console.log('ℹ️ Usuario cliente ya existe');
      }
    }

    console.log('🎉 Configuración inicial completada exitosamente!');
    console.log('\n📋 Usuarios creados:');
    console.log('  - Admin: admin@veterinaria.com / admin123');
    console.log('  - Veterinario: veterinario@veterinaria.com / vet123');
    console.log('  - Cliente: cliente@example.com / cliente123');

  } catch (error) {
    console.error('❌ Error durante la configuración inicial:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  seedInitialData();
}

export { seedInitialData };