// Script de siembra de datos para la demo en vivo.
// Uso: npm run seed

const { sequelize, Libro, Editorial, Idioma, EstadoLibro } = require('./models');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  await EstadoLibro.bulkCreate(
    [
      { nombre: 'ACTIVO' },
      { nombre: 'DADO_DE_BAJA' },
      { nombre: 'EN_REPARACION' },
      { nombre: 'PERDIDO' },
    ],
    { ignoreDuplicates: true }
  );

  await Editorial.bulkCreate(
    [
      { nombre: 'Prentice Hall', paisOrigen: 'Estados Unidos' },
      { nombre: 'Addison-Wesley', paisOrigen: 'Estados Unidos' },
      { nombre: 'Debolsillo', paisOrigen: 'España' },
      { nombre: 'Debate', paisOrigen: 'España' },
      { nombre: 'Plaza & Janés', paisOrigen: 'España' },
    ],
    { ignoreDuplicates: true }
  );

  await Idioma.bulkCreate(
    [
      { nombre: 'Español', codigoIso: 'es' },
      { nombre: 'Inglés', codigoIso: 'en' },
    ],
    { ignoreDuplicates: true }
  );

  const estadoActivo = await EstadoLibro.findOne({ where: { nombre: 'ACTIVO' } });
  const debolsillo = await Editorial.findOne({ where: { nombre: 'Debolsillo' } });
  const espanol = await Idioma.findOne({ where: { nombre: 'Español' } });

  await Libro.bulkCreate(
    [
      {
        isbn: '9788420471839',
        titulo: 'Rayuela',
        resumen: 'Novela de Julio Cortázar, hito del boom latinoamericano.',
        anioPublicacion: 1963,
        editorialId: debolsillo.id,
        idiomaId: espanol.id,
        estadoId: estadoActivo.id,
        stockTotal: 5,
        stockDisponible: 5,
        ubicacionFisica: 'A-12',
      },
      {
        isbn: '9788439720100',
        titulo: 'Cien años de soledad',
        resumen: 'Novela de Gabriel García Márquez.',
        anioPublicacion: 1967,
        editorialId: debolsillo.id,
        idiomaId: espanol.id,
        estadoId: estadoActivo.id,
        stockTotal: 3,
        stockDisponible: 3,
        ubicacionFisica: 'A-13',
      },
    ],
    { ignoreDuplicates: true }
  );

  console.log('Seed completado: estados_libro, editoriales, idiomas y libros de ejemplo.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error al ejecutar el seed:', error);
  process.exit(1);
});