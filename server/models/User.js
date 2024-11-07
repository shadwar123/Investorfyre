const pool = require('../config/db');

const User = {
    async initialize() {
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    first_name VARCHAR(255) NOT NULL,
                    last_name VARCHAR(255) NOT NULL,
                    country VARCHAR(255),
                    company_website VARCHAR(255),
                    social1 VARCHAR(255),
                    social2 VARCHAR(255),
                    profile_picture VARCHAR(1000)
                );
            `);
            console.log('Users table checked/created');
        } catch (err) {
            console.error('Error initializing users table:', err);
            throw err;
        }
    },    

    async findByEmail(email) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },

    
    async create(email, firstName, lastName) {
        const result = await pool.query(
            'INSERT INTO users (email, first_name, last_name) VALUES ($1, $2, $3) RETURNING *',
            [email, firstName, lastName]
        );
        return result.rows[0];
    },
    async findById(id) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    },
    // async updateProfile(email, updates) {
    //     const { first_name, last_name, country, company_website, social1, social2 } = updates;
    //     const result = await pool.query(
    //         'UPDATE users SET first_name = $1, last_name = $2, country = $3, company_website = $4, social1 = $5, social2 = $6 WHERE email = $7 RETURNING *',
    //         [first_name, last_name, country, company_website, social1, social2, email]
    //     );
    //     return result.rows[0];
    // } 
    async updateProfile(email, updates) {
        const { first_name, last_name, country, company_website, social1, social2, profile_picture } = updates;
    
        let query = `
            UPDATE users 
            SET first_name = $1, 
                last_name = $2, 
                country = $3, 
                company_website = $4, 
                social1 = $5, 
                social2 = $6
        `;
        const params = [first_name, last_name, country, company_website, social1, social2, email];
    
        // Add profile_picture to the query if it is provided
        if (profile_picture) {
            query += `, profile_picture = $7 `;
            params.splice(-1, 0, profile_picture);  // Insert profile_picture as the second-to-last parameter
        }
        
        query += ` WHERE email = $${params.length} RETURNING *`;
    
        const result = await pool.query(query, params);
        return result.rows[0];
    }
       


};

module.exports = User;
