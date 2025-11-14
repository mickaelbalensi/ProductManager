/** @type {import('jest').Config} */
module.exports = {
  // Utilise ts-jest pour compiler TypeScript à la volée
  preset: 'ts-jest',
  
  // Environnement Node.js (pas browser)
  testEnvironment: 'node',
  
  // Dossiers où chercher les tests
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  
  // Patterns pour trouver les fichiers de test
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // Comment transformer les fichiers TypeScript
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
  // Fichiers à inclure dans le coverage
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  
  // Configuration globale avant les tests
  // setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Extensions de fichiers à reconnaître
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Timeout par défaut pour les tests
  testTimeout: 10000,
};
