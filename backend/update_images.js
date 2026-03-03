const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false
});

const imageMap = {
    'Chemical Engineering': 'https://images.unsplash.com/photo-1532153955177-f59af40d6472?q=80&w=600',
    'Civil Engineering': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600',
    'CSE': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600',
    'CSBS': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600',
    'CSE-DS': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
    'CSE-AIML': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600',
    'CSE-IoT': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600',
    'ECE': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600',
    'EEE': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600',
    'Information Technology': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600',
    'Mechanical Engineering': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600',
    'Computer Applications': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600',
    'Management Sciences': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600',
    'Mathematics & Humanities': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600',
    'Chemistry': 'https://images.unsplash.com/photo-1603126857599-f6e157826815?q=80&w=600',
    'Physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600'
};

async function update() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();

        for (const [dept, img] of Object.entries(imageMap)) {
            const res = await client.query('UPDATE books SET image_url = $1 WHERE department = $2', [img, dept]);
            console.log(`Updated ${res.rowCount || 0} images for ${dept}`);
        }

        client.release();
        console.log('Done mapping images in Postgres!');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        pool.end();
    }
}
update();
