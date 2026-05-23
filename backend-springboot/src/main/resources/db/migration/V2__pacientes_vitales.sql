-- Columnas de signos vitales para instalaciones creadas antes de Flyway
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS peso_nacer DOUBLE;
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS frecuencia_cardiaca INT;
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS escala_glasgow INT;
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS temperatura DOUBLE;
ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS nivel_dolor INT;
