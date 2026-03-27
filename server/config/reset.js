import { pool } from './database.js'

const createTable = async () => {
    await pool.query(`
        DROP TABLE IF EXISTS bottles;
        CREATE TABLE bottles (
            id          SERIAL PRIMARY KEY,
            name        VARCHAR(100) NOT NULL,
            color       VARCHAR(50)  NOT NULL,
            size        VARCHAR(20)  NOT NULL,
            cap_type    VARCHAR(50)  NOT NULL,
            material    VARCHAR(50)  NOT NULL,
            price       NUMERIC(6,2) NOT NULL,
            created_at  TIMESTAMP DEFAULT NOW()
        );
    `)
    console.log('Table created ✓')
}

const seedTable = async () => {
    await pool.query(`
        INSERT INTO bottles (name, color, size, cap_type, material, price) VALUES
            ('Alpine Flask',      'Navy Blue',    'Large',  'Screw-top',  'Stainless Steel', 38.99),
            ('Morning Glow',      'Sunrise Pink', 'Medium', 'Flip-top',   'Plastic',         19.99),
            ('Forest Sipper',     'Forest Green', 'Small',  'Straw',      'Glass',           27.49),
            ('Midnight Chug',     'Matte Black',  'Large',  'Sport Cap',  'Stainless Steel', 42.99),
            ('Citrus Burst',      'Lemon Yellow', 'Medium', 'Screw-top',  'Plastic',         15.99);
    `)
    console.log('Table seeded ✓')
}

const reset = async () => {
    await createTable()
    await seedTable()
    await pool.end()
    console.log('Database reset complete.')
}

reset().catch(err => {
    console.error('Reset failed:', err)
    pool.end()
})