// src/data/imageTexts.ts

interface ImageText {
    imageName: string;
    quote: string;
    name: string;
    age: number;
    height: number;
    hair: string;
    description: string;
  }
  
  export const imageTexts: ImageText[] = [
    {
      imageName: 'cheerleader.webp',
      quote: '"¿Crees que puedes seguirme el ritmo? Te advierto, no suelo perder."',
      name: 'Brittany Summers',
      age: 18,
      height: 1.65,
      hair: 'Rubia',
      description: 'Fanática de las acrobacias y el yoga, Brittany tiene una sonrisa traviesa que acompaña su amor por los desafíos de baile. Su energía es tan contagiosa como irresistible.',
    },
    {
      imageName: 'gamer.webp',
      quote: '"¡No te preocupes! Siempre puedes intentarlo de nuevo."',
      name: 'Mia Johnson',
      age: 22,
      height: 1.70,
      hair: 'Rosa',
      description: 'Mia, con su cabello rosa y mirada traviesa, convierte cada partida en un juego de seducción. Domina los mandos con destreza y te lanza miradas capaces de desconcentrar al mejor jugador. Adora los shooters, los RPGs y verte esforzarte por seguirle el ritmo.'
    },
    {
      imageName: 'library.webp',
      quote: '"¿Te gustaría que te enseñara algo más que solo libros?"',
      name: 'Lily Adams',
      age: 25,
      height: 1.75,
      hair: 'Rosa palo',
      description: 'Lily combina intelecto y sensualidad, con una mirada que parece leer más allá de las palabras. Adora los libros, pero lo que más le gusta es jugar con el lenguaje y dejarte con ganas de más.'
    },
    {
      imageName: 'milf.webp', // mujer fatal con un vestido rojo y una copa de vino
      quote: '"¿Crees que puedes resistir la tentación? Te advierto, soy experta en romper voluntades."',
      name: 'Victoria Blake',
      age: 43,
      height: 1.72,
      hair: 'Castaño oscuro',
      description: 'Victoria, con su vestido rojo y copa en mano, exuda poder y seducción. Su mirada hipnótica y sonrisa intrigante son irresistibles. Adora las charlas profundas y mantener ese aire de misterio que te deja deseando más.'
    },
    {
      imageName: 'motocycle.webp',
      quote: '"No suelo detenerme, pero tal vez tú seas la excepción."',
      name: 'Alexandra Knight',
      age: 29,
      height: 1.68,
      hair: 'Negro azabache',
      description: 'Alexandra, con su chupa de cuero y mirada intensa, es pura rebeldía y misterio. Ama las carreteras solitarias, el viento en su rostro y la emoción de estar al mando, siempre dejando intriga tras de sí.'
    },
  ];
  