// src/scripts/seed-all-in-one.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductCategoriesService } from '../product-categories/product-categories.service';
import { ProductsService } from '../products/products.service';
import { PetTypesService } from '../pet-types/pet-types.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { UsersService } from '../users/users.service';
import { PetsService } from '../pets/pets.service';
import { ServicesService } from '../services/services.service';

async function seedProductsComplete() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('🛒 Iniciando carga completa de productos...');

    const productCategoriesService = app.get(ProductCategoriesService);
    const productsService = app.get(ProductsService);
    const petTypesService = app.get(PetTypesService);

    // 1. Crear categorías por defecto
    console.log('📦 Creando categorías de productos...');
    await productCategoriesService.seedDefaultCategories();

    // 2. Obtener categorías y tipos de mascotas
    const categories = await productCategoriesService.findAll();
    const petTypes = await petTypesService.findAll();

    const alimentoCategory = categories.find(c => c.nombre === 'alimento');
    const medicamentosCategory = categories.find(c => c.nombre === 'medicamentos');
    const juguetesCategory = categories.find(c => c.nombre === 'juguetes');
    const accesoriosCategory = categories.find(c => c.nombre === 'accesorios');
    const higieneCategory = categories.find(c => c.nombre === 'higiene');
    const casaTransporteCategory = categories.find(c => c.nombre === 'casa y transporte');

    const perroType = petTypes.find(p => p.nombre === 'perro');
    const gatoType = petTypes.find(p => p.nombre === 'gato');
    const aveType = petTypes.find(p => p.nombre === 'ave');
    const reptilType = petTypes.find(p => p.nombre === 'reptil');
    const roedorType = petTypes.find(p => p.nombre === 'roedor');
    const pezType = petTypes.find(p => p.nombre === 'pez');

    // 3. Crear productos completos
     const productos = [
      // ===== ALIMENTOS =====
      // Alimentos para Perros
      {
        nombre: 'Royal Canin Adult Medium',
        descripcion: 'Alimento completo para perros adultos de raza mediana (11-25kg). Fórmula equilibrada que mantiene la vitalidad y apoya las defensas naturales. Con antioxidantes, glucosamina y condroitina.',
        precio: 45.50,
        stock: 25,
        imagen: 'royal-canin-adult-medium.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Royal Canin',
        presentacion: '15kg',
        stockMinimo: 5,
        codigoBarras: '3182550402293'
      },
      {
        nombre: 'Pedigree Cachorro',
        descripcion: 'Alimento especialmente formulado para cachorros de 2 a 12 meses. Con DHA para el desarrollo cerebral y omega 3 y 6 para pelaje brillante.',
        precio: 28.90,
        stock: 30,
        imagen: 'pedigree-cachorro.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Pedigree',
        presentacion: '8kg',
        stockMinimo: 8,
        codigoBarras: '7702018877034'
      },
      {
        nombre: 'Pro Plan Small Breed Adult',
        descripcion: 'Nutrición completa para perros adultos de razas pequeñas. Croquetas pequeñas, fáciles de masticar. Alto en proteínas.',
        precio: 38.75,
        stock: 20,
        imagen: 'proplan-small-breed.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Pro Plan',
        presentacion: '7.5kg',
        stockMinimo: 6,
        codigoBarras: '7613035121850'
      },
      {
        nombre: 'Hills Prescription Diet Obesity',
        descripcion: 'Alimento terapéutico para el manejo del peso en perros con sobrepeso. Bajo en calorías, alto en fibra.',
        precio: 52.40,
        stock: 12,
        imagen: 'hills-obesity-perros.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Hills',
        presentacion: '12kg',
        stockMinimo: 3,
        requiereReceta: true,
        codigoBarras: '7036694611281'
      },

      // Alimentos para Gatos
      {
        nombre: 'Whiskas Adult Pescado',
        descripcion: 'Alimento completo para gatos adultos con delicioso sabor a pescado. Enriquecido con vitaminas A y E.',
        precio: 22.30,
        stock: 35,
        imagen: 'whiskas-adult-pescado.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Whiskas',
        presentacion: '3kg',
        stockMinimo: 10,
        codigoBarras: '7702018478596'
      },
      {
        nombre: 'Hills Prescription Diet c/d',
        descripcion: 'Alimento terapéutico para gatos con problemas urinarios. Ayuda a disolver los cristales de estruvita y previene su formación.',
        precio: 32.80,
        stock: 15,
        imagen: 'hills-cd-gatos.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Hills',
        presentacion: '4kg',
        stockMinimo: 3,
        requiereReceta: true,
        codigoBarras: '7036694600148'
      },
      {
        nombre: 'Royal Canin Persian Adult',
        descripcion: 'Alimento específico para gatos persas adultos. Croqueta en forma de almendra, fácil de tomar. Mantiene la belleza del pelaje.',
        precio: 41.60,
        stock: 18,
        imagen: 'royal-canin-persian.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Royal Canin',
        presentacion: '4kg',
        stockMinimo: 4,
        codigoBarras: '3182550767316'
      },
      {
        nombre: 'Pro Plan Kitten',
        descripcion: 'Nutrición completa para gatitos de 6 semanas a 1 año. Con DHA del aceite de pescado para el desarrollo cerebral.',
        precio: 26.90,
        stock: 22,
        imagen: 'proplan-kitten.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Pro Plan',
        presentacion: '3kg',
        stockMinimo: 6,
        codigoBarras: '7613035123854'
      },

      // Alimentos para Aves
      {
        nombre: 'Zupreem Fruit Blend',
        descripcion: 'Alimento balanceado con frutas para loros y cacatúas. Contiene vitaminas y minerales esenciales. Sin colorantes artificiales.',
        precio: 18.75,
        stock: 12,
        imagen: 'zupreem-fruit-blend.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [aveType?.id],
        marca: 'Zupreem',
        presentacion: '1.5kg',
        stockMinimo: 3,
        codigoBarras: '7401235892034'
      },
      {
        nombre: 'Versele Laga Canarios',
        descripcion: 'Mezcla de semillas premium para canarios. Con alpiste, nabo, linaza y otros ingredientes naturales.',
        precio: 12.45,
        stock: 20,
        imagen: 'versele-laga-canarios.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [aveType?.id],
        marca: 'Versele Laga',
        presentacion: '1kg',
        stockMinimo: 5,
        codigoBarras: '5410340220108'
      },

      // Alimentos para Peces
      {
        nombre: 'Tetra Min Flakes',
        descripcion: 'Alimento en hojuelas para peces tropicales. Fórmula balanceada con vitaminas, minerales y oligoelementos.',
        precio: 8.90,
        stock: 25,
        imagen: 'tetra-min-flakes.jpg',
        categoriaId: alimentoCategory?.id,
        tiposMascotaIds: [pezType?.id],
        marca: 'Tetra',
        presentacion: '100g',
        stockMinimo: 8,
        codigoBarras: '4004218101081'
      },

      // ===== MEDICAMENTOS =====
      // Antiparasitarios
      {
        nombre: 'Bravecto Antipulgas Perros',
        descripcion: 'Comprimido masticable para el tratamiento y prevención de pulgas y garrapatas en perros por 12 semanas. Sabor a cerdo.',
        precio: 28.90,
        stock: 20,
        imagen: 'bravecto-perros.jpg',
        categoriaId: medicamentosCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'MSD',
        presentacion: '1 comprimido',
        stockMinimo: 5,
        requiereReceta: true,
        codigoBarras: '8506948321567'
      },
      {
        nombre: 'Revolution Gatos',
        descripcion: 'Solución tópica para el control de pulgas, ácaros del oído y parásitos intestinales en gatos. Aplicación mensual.',
        precio: 15.60,
        stock: 18,
        imagen: 'revolution-gatos.jpg',
        categoriaId: medicamentosCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Zoetis',
        presentacion: '3 pipetas',
        stockMinimo: 4,
        requiereReceta: true,
        codigoBarras: '9876543210987'
      },
      {
        nombre: 'Frontline Plus',
        descripcion: 'Tratamiento contra pulgas y garrapatas para perros y gatos. Mata pulgas adultas, larvas y huevos.',
        precio: 19.50,
        stock: 25,
        imagen: 'frontline-plus.jpg',
        categoriaId: medicamentosCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Boehringer',
        presentacion: '3 pipetas',
        stockMinimo: 6,
        requiereReceta: true,
        codigoBarras: '3661103032847'
      },

      // Antibióticos y Medicamentos
      {
        nombre: 'Cefavet 250mg',
        descripcion: 'Antibiótico cefalexina para infecciones bacterianas en perros y gatos. Amplio espectro.',
        precio: 24.80,
        stock: 15,
        imagen: 'cefavet-250.jpg',
        categoriaId: medicamentosCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Laboratorio Vet',
        presentacion: 'Caja x 10 comprimidos',
        stockMinimo: 3,
        requiereReceta: true,
        codigoBarras: '7890123456789'
      },
      {
        nombre: 'Meloxicam Vet 1mg/ml',
        descripcion: 'Antiinflamatorio no esteroideo para el tratamiento del dolor y la inflamación en perros y gatos.',
        precio: 18.90,
        stock: 12,
        imagen: 'meloxicam-vet.jpg',
        categoriaId: medicamentosCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Laboratorio Vet',
        presentacion: 'Frasco 20ml',
        stockMinimo: 3,
        requiereReceta: true,
        codigoBarras: '8901234567890'
      },

      // Suplementos
      {
        nombre: 'Condrovet Articulaciones',
        descripcion: 'Suplemento nutricional con glucosamina y condroitina para la salud articular en perros y gatos.',
        precio: 35.40,
        stock: 18,
        imagen: 'condrovet.jpg',
        categoriaId: medicamentosCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Vetoquinol',
        presentacion: '60 comprimidos',
        stockMinimo: 4,
        codigoBarras: '9012345678901'
      },

      // ===== JUGUETES =====
      // Juguetes para Perros
      {
        nombre: 'Kong Classic Rojo',
        descripcion: 'Juguete resistente de caucho natural para perros. Ideal para rellenar con premios y mantener entretenido. Limpia dientes.',
        precio: 12.45,
        stock: 30,
        imagen: 'kong-classic.jpg',
        categoriaId: juguetesCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Kong',
        presentacion: 'Talla M',
        stockMinimo: 8,
        codigoBarras: '3456789012345'
      },
      {
        nombre: 'Pelota de Tenis para Perros',
        descripcion: 'Pelota de tenis resistente, perfecta para juegos de buscar y traer. Material no tóxico.',
        precio: 4.50,
        stock: 45,
        imagen: 'pelota-tenis.jpg',
        categoriaId: juguetesCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'ChuckIt!',
        presentacion: 'Pack x 2',
        stockMinimo: 15,
        codigoBarras: '4567890123456'
      },
      {
        nombre: 'Cuerda de Algodón',
        descripcion: 'Juguete de cuerda 100% algodón natural. Ayuda a limpiar los dientes mientras juega.',
        precio: 6.80,
        stock: 35,
        imagen: 'cuerda-algodon.jpg',
        categoriaId: juguetesCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Mammoth',
        presentacion: '25cm',
        stockMinimo: 12,
        codigoBarras: '5678901234567'
      },

      // Juguetes para Gatos
      {
        nombre: 'Ratón de Peluche con Hierba Gatera',
        descripcion: 'Juguete suave relleno de hierba gatera orgánica. Estimula el instinto de caza de los gatos.',
        precio: 4.25,
        stock: 45,
        imagen: 'raton-hierba-gatera.jpg',
        categoriaId: juguetesCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Petstages',
        presentacion: 'Unidad',
        stockMinimo: 15,
        codigoBarras: '2345678901234'
      },
      {
        nombre: 'Varita con Plumas',
        descripcion: 'Juguete interactivo con varita extensible y plumas naturales. Estimula el ejercicio y la caza.',
        precio: 8.90,
        stock: 28,
        imagen: 'varita-plumas.jpg',
        categoriaId: juguetesCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Da Bird',
        presentacion: '90cm',
        stockMinimo: 8,
        codigoBarras: '6789012345678'
      },
      {
        nombre: 'Túnel Plegable',
        descripcion: 'Túnel de tela plegable para gatos. Estimula el juego y proporciona un lugar de escondite.',
        precio: 15.60,
        stock: 20,
        imagen: 'tunel-plegable.jpg',
        categoriaId: juguetesCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Petlinks',
        presentacion: '120cm x 25cm',
        stockMinimo: 6,
        codigoBarras: '7890123456780'
      },

      // ===== ACCESORIOS =====
      // Collares y Correas
      {
        nombre: 'Collar Ajustable Premium',
        descripcion: 'Collar de nylon resistente con hebilla de liberación rápida. Disponible en varios colores. Reflectante.',
        precio: 8.90,
        stock: 25,
        imagen: 'collar-premium.jpg',
        categoriaId: accesoriosCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Ruffwear',
        presentacion: 'Talla M',
        stockMinimo: 10,
        codigoBarras: '4567890123456'
      },
      {
        nombre: 'Correa Retráctil 5m',
        descripcion: 'Correa retráctil de alta calidad con sistema de frenado suave. Mango ergonómico antideslizante.',
        precio: 22.50,
        stock: 18,
        imagen: 'correa-retractil.jpg',
        categoriaId: accesoriosCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Flexi',
        presentacion: 'Hasta 25kg',
        stockMinimo: 5,
        codigoBarras: '8901234567891'
      },
      {
        nombre: 'Arnés Acolchado',
        descripcion: 'Arnés acolchado para perros, distribuye la presión uniformemente. Fácil de poner y quitar.',
        precio: 18.75,
        stock: 22,
        imagen: 'arnes-acolchado.jpg',
        categoriaId: accesoriosCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Julius-K9',
        presentacion: 'Talla M',
        stockMinimo: 6,
        codigoBarras: '9012345678902'
      },

      // Camas y Descanso
      {
        nombre: 'Cama Ortopédica Memory Foam',
        descripcion: 'Cama ortopédica con espuma viscoelástica. Ideal para perros mayores o con problemas articulares.',
        precio: 65.00,
        stock: 12,
        imagen: 'cama-ortopedica.jpg',
        categoriaId: accesoriosCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Big Barker',
        presentacion: '90cm x 60cm',
        stockMinimo: 3,
        codigoBarras: '0123456789012'
      },
      {
        nombre: 'Cama Suave para Gatos',
        descripcion: 'Cama circular ultra suave y acogedora para gatos. Lavable en máquina.',
        precio: 25.80,
        stock: 20,
        imagen: 'cama-gatos.jpg',
        categoriaId: accesoriosCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Best Friends',
        presentacion: '50cm diámetro',
        stockMinimo: 6,
        codigoBarras: '1234567890123'
      },

      // ===== CASA Y TRANSPORTE =====
      {
        nombre: 'Transportadora AirLine Approved',
        descripcion: 'Transportadora rígida aprobada para viajes aéreos. Incluye bebedero y ventilación lateral.',
        precio: 85.00,
        stock: 8,
        imagen: 'transportadora-airline.jpg',
        categoriaId: casaTransporteCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Petmate',
        presentacion: 'Talla L',
        stockMinimo: 2,
        codigoBarras: '5678901234567'
      },
      {
        nombre: 'Casa de Madera para Perros',
        descripcion: 'Casa de madera tratada resistente a la intemperie. Techo inclinado para evacuación de agua.',
        precio: 125.00,
        stock: 6,
        imagen: 'casa-madera.jpg',
        categoriaId: casaTransporteCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'Precision Pet',
        presentacion: '90cm x 75cm x 80cm',
        stockMinimo: 2,
        codigoBarras: '6789012345679'
      },
      {
        nombre: 'Jaula Plegable',
        descripcion: 'Jaula metálica plegable con doble puerta. Fácil montaje y almacenamiento.',
        precio: 75.50,
        stock: 10,
        imagen: 'jaula-plegable.jpg',
        categoriaId: casaTransporteCategory?.id,
        tiposMascotaIds: [perroType?.id],
        marca: 'MidWest',
        presentacion: '76cm x 48cm x 53cm',
        stockMinimo: 3,
        codigoBarras: '7890123456781'
      },

      // ===== HIGIENE =====
      {
        nombre: 'Shampoo Hipoalergénico',
        descripcion: 'Shampoo suave para pieles sensibles. Sin colorantes ni fragancias artificiales. Con avena y aloe vera.',
        precio: 14.30,
        stock: 22,
        imagen: 'shampoo-hipoalergenico.jpg',
        categoriaId: higieneCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Virbac',
        presentacion: '500ml',
        stockMinimo: 6,
        codigoBarras: '6789012345678'
      },
      {
        nombre: 'Arena Sanitaria Aglomerante',
        descripcion: 'Arena de arcilla bentonita ultra aglomerante. Control superior de olores por 7 días.',
        precio: 9.75,
        stock: 35,
        imagen: 'arena-aglomerante.jpg',
        categoriaId: higieneCategory?.id,
        tiposMascotaIds: [gatoType?.id],
        marca: 'Tidy Cats',
        presentacion: '9kg',
        stockMinimo: 12,
        codigoBarras: '7890123456789'
      },
      {
        nombre: 'Toallitas Húmedas',
        descripcion: 'Toallitas húmedas antibacterianas para limpieza rápida de patas y pelaje. Sin alcohol.',
        precio: 6.45,
        stock: 40,
        imagen: 'toallitas-humedas.jpg',
        categoriaId: higieneCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Earthbath',
        presentacion: 'Pack x 100',
        stockMinimo: 15,
        codigoBarras: '8901234567892'
      },
      {
        nombre: 'Cepillo Deslanador',
        descripcion: 'Cepillo profesional para remover pelo muerto y reducir la caída. Con cerdas de acero inoxidable.',
        precio: 16.90,
        stock: 25,
        imagen: 'cepillo-deslanador.jpg',
        categoriaId: higieneCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'FURminator',
        presentacion: 'Talla M',
        stockMinimo: 8,
        codigoBarras: '9012345678903'
      },
      {
        nombre: 'Pasta Dental para Mascotas',
        descripcion: 'Pasta dental enzimática sabor pollo. Ayuda a prevenir la formación de sarro y placa.',
        precio: 12.80,
        stock: 18,
        imagen: 'pasta-dental.jpg',
        categoriaId: higieneCategory?.id,
        tiposMascotaIds: [perroType?.id, gatoType?.id],
        marca: 'Virbac',
        presentacion: '70g',
        stockMinimo: 5,
        codigoBarras: '0123456789013'
      },

      // Productos específicos para otras mascotas
      {
        nombre: 'Sustrato para Reptiles',
        descripcion: 'Sustrato natural de corteza de pino para terrarios de reptiles. Absorbe humedad y olores.',
        precio: 18.50,
        stock: 15,
        imagen: 'sustrato-reptiles.jpg',
        categoriaId: higieneCategory?.id,
        tiposMascotaIds: [reptilType?.id],
        marca: 'Zoo Med',
        presentacion: '8.8L',
        stockMinimo: 4,
        codigoBarras: '1234567890124'
      },
      {
        nombre: 'Rueda de Ejercicio',
        descripcion: 'Rueda de ejercicio silenciosa para hámsters y roedores pequeños. Base estable antideslizante.',
        precio: 22.40,
        stock: 12,
        imagen: 'rueda-ejercicio.jpg',
        categoriaId: juguetesCategory?.id,
        tiposMascotaIds: [roedorType?.id],
        marca: 'Silent Runner',
        presentacion: '20cm diámetro',
        stockMinimo: 3,
        codigoBarras: '2345678901235'
      },
      {
        nombre: 'Filtro para Acuario',
        descripcion: 'Filtro interno para acuarios de hasta 100 litros. Con sistema de filtración mecánica y biológica.',
        precio: 35.90,
        stock: 10,
        imagen: 'filtro-acuario.jpg',
        categoriaId: accesoriosCategory?.id,
        tiposMascotaIds: [pezType?.id],
        marca: 'Fluval',
        presentacion: 'Hasta 100L',
        stockMinimo: 3,
        codigoBarras: '3456789012346'
      }
    ];

    // 4. Crear productos
    console.log('🏷️ Creando productos...');
    let productosCreados = 0;
    let productosExistentes = 0;

    for (const productData of productos) {
      // Skip product if categoriaId is undefined (should not happen if categories are seeded correctly)
      if (typeof productData.categoriaId !== 'number') {
        console.log(`❌ Producto omitido por falta de categoría: ${productData.nombre}`);
        continue;
      }
      try {
        const tiposMascotaIds = productData.tiposMascotaIds?.filter(id => id !== undefined) || [];
        
        await productsService.create({
          ...productData,
          categoriaId: productData.categoriaId as number,
          tiposMascotaIds
        });
        console.log(`✅ Producto creado: ${productData.nombre} - $${productData.precio}`);
        productosCreados++;
      } catch (error) {
        console.log(`⚠️ Producto ya existe: ${productData.nombre}`);
        productosExistentes++;
      }
    }

    // 5. Mostrar estadísticas
    console.log('\n🎉 Carga de productos completada!');
    console.log('📊 Estadísticas:');
    console.log(`  - Productos creados: ${productosCreados}`);
    console.log(`  - Productos existentes: ${productosExistentes}`);
    console.log(`  - Total intentados: ${productos.length}`);
    
    // Aquí irían las estadísticas de productos por categoría y otras métricas
    // ...

  } catch (error) {
    console.error('❌ Error cargando productos:', error);
  } finally {
    await app.close();
  }
}

async function seedSampleAppointments() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('📅 Creando citas de ejemplo...');

    const appointmentsService = app.get(AppointmentsService);
    const usersService = app.get(UsersService);
    const petsService = app.get(PetsService);
    const servicesService = app.get(ServicesService);

    const cliente = await usersService.findByEmail('cliente@example.com');
    if (!cliente) {
      console.log('❌ Usuario cliente no encontrado. Ejecuta el seed inicial primero.');
      return;
    }

    const pets = await petsService.findByOwner(cliente.id, cliente.id, 'CLIENTE');
    let mascota;
    
    if (pets.length === 0) {
      console.log('🐕 Creando mascota de ejemplo...');
      mascota = await petsService.create({
        nombre: 'Max',
        raza: 'Labrador',
        edad: 3,
        sexo: 'macho',
        color: 'dorado',
        peso: 28.5,
        tipoId: 1, // Asumiendo que el ID 1 es perro
        observaciones: 'Mascota muy activa y amigable'
      }, cliente.id, 'CLIENTE');
    } else {
      mascota = pets[0];
    }

    const services = await servicesService.findAll();
    const consultaGeneral = services.find(s => s.nombre.toLowerCase().includes('consulta'));
    const vacuna = services.find(s => s.nombre.toLowerCase().includes('vacuna'));

    if (!consultaGeneral || !vacuna) {
      console.log('❌ Servicios no encontrados. Ejecuta el seed de servicios primero.');
      return;
    }

    const citasEjemplo = [
      {
        mascotaId: mascota.id,
        servicioId: consultaGeneral.id,
        fecha: '2025-01-15',
        hora: '10:00',
        observaciones: 'Revisión general de rutina'
      },
      {
        mascotaId: mascota.id,
        servicioId: vacuna.id,
        fecha: '2025-01-20',
        hora: '14:30',
        observaciones: 'Aplicación de vacuna anual'
      }
    ];

    for (const citaData of citasEjemplo) {
      try {
        await appointmentsService.create(citaData, cliente.id, 'CLIENTE');
        console.log(`✅ Cita creada: ${citaData.fecha} a las ${citaData.hora}`);
      } catch (error) {
        console.log(`⚠️ Error creando cita: ${error.message}`);
      }
    }

    console.log('🎉 Citas de ejemplo creadas exitosamente!');

  } catch (error) {
    console.error('❌ Error creando citas de ejemplo:', error);
  } finally {
    await app.close();
  }
}

async function checkSystemStatus() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('🔍 Verificando estado del sistema...\n');

    const usersService = app.get(UsersService);
    const petTypesService = app.get(PetTypesService);
    const productsService = app.get(ProductsService);
    const servicesService = app.get(ServicesService);
    const appointmentsService = app.get(AppointmentsService);

    const userStats = await usersService.getUserStats();
    console.log('👥 USUARIOS:');
    console.log(`  - Total usuarios: ${userStats.totalUsers}`);
    console.log(`  - Usuarios activos: ${userStats.activeUsers}`);
    console.log(`  - Por rol:`);
    userStats.usersByRole.forEach((role: any) => {
      console.log(`    • ${role.rolNombre}: ${role.cantidad}`);
    });

    const petTypes = await petTypesService.findAll();
    console.log(`\n🐾 TIPOS DE MASCOTAS: ${petTypes.length}`);
    petTypes.forEach(type => {
      console.log(`  - ${type.nombre}`);
    });

    const productStats = await productsService.getProductStats();
    console.log(`\n🛒 PRODUCTOS:`);
    console.log(`  - Total productos: ${productStats.totalProducts}`);
    console.log(`  - Stock bajo: ${productStats.lowStockCount}`);
    console.log(`  - Sin stock: ${productStats.outOfStockCount}`);
    console.log(`  - Valor total inventario: ${productStats.totalStockValue}`);

    const serviceStats = await servicesService.getServiceStats();
    console.log(`\n🏥 SERVICIOS:`);
    console.log(`  - Total servicios: ${serviceStats.totalServices}`);
    console.log(`  - Precio promedio: ${serviceStats.averagePrice}`);

    const appointmentStats = await appointmentsService.getAppointmentStats();
    console.log(`\n📅 CITAS (últimos 30 días):`);
    console.log(`  - Total citas: ${appointmentStats.totalAppointments}`);

    console.log('\n✅ Verificación del sistema completada');

  } catch (error) {
    console.error('❌ Error verificando el sistema:', error);
  } finally {
    await app.close();
  }
}

// Función principal para ejecutar todos los seeds
async function seedAllData() {
  console.log('🌱 Iniciando configuración completa del sistema...\n');

  try {
    // 1. Datos iniciales (roles, tipos de mascotas, usuarios, etc.)
    console.log('1️⃣ === DATOS INICIALES ===');
    // Aquí llamas a la función que se encarga de los datos iniciales
    // await seedInitialData();

    // Esperar un poco entre seeds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 2. Servicios
    console.log('\n2️⃣ === SERVICIOS ===');
    // Aquí llamas a la función que se encarga de los servicios
    // await seedServices();

    // Esperar un poco entre seeds
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Productos
    console.log('\n3️⃣ === PRODUCTOS ===');
    await seedProductsComplete();

    // 4. Citas de ejemplo
    console.log('\n4️⃣ === CITAS DE EJEMPLO ===');
    await seedSampleAppointments();

    console.log('\n🎉 ¡CONFIGURACIÓN COMPLETA FINALIZADA!');
    console.log('\n🚀 ¡Tu sistema veterinario está listo para usar!');

  } catch (error) {
    console.error('❌ Error en la configuración completa:', error);
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  seedAllData();
}

export { seedAllData, seedProductsComplete, seedSampleAppointments, checkSystemStatus };

 

