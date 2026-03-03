const { Pool } = require('pg');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

const USERS_FILE = path.join(__dirname, 'users.json');

/**
 * Database Connection Pool
 */
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false
});

let useMock = false;

const DB_BOOKS = [
    {
        "id": 1,
        "title": "Chemical Engineering Resource Volume 1",
        "author": "Academic Author 2",
        "category": "Academic",
        "department": "Chemical Engineering",
        "isbn": "978100000002X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 2,
        "title": "Chemical Engineering Resource Volume 2",
        "author": "Academic Author 3",
        "category": "Academic",
        "department": "Chemical Engineering",
        "isbn": "978100000003X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 3,
        "title": "Chemical Engineering Resource Volume 3",
        "author": "Academic Author 4",
        "category": "Academic",
        "department": "Chemical Engineering",
        "isbn": "978100000004X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 4,
        "title": "Chemical Engineering Resource Volume 4",
        "author": "Academic Author 5",
        "category": "Academic",
        "department": "Chemical Engineering",
        "isbn": "978100000005X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 5,
        "title": "Chemical Engineering Resource Volume 5",
        "author": "Academic Author 6",
        "category": "Academic",
        "department": "Chemical Engineering",
        "isbn": "978100000006X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 6,
        "title": "Civil Engineering Resource Volume 1",
        "author": "Academic Author 7",
        "category": "Academic",
        "department": "Civil Engineering",
        "isbn": "978100000007X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 7,
        "title": "Civil Engineering Resource Volume 2",
        "author": "Academic Author 8",
        "category": "Academic",
        "department": "Civil Engineering",
        "isbn": "978100000008X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 8,
        "title": "Civil Engineering Resource Volume 3",
        "author": "Academic Author 9",
        "category": "Academic",
        "department": "Civil Engineering",
        "isbn": "978100000009X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 9,
        "title": "Civil Engineering Resource Volume 4",
        "author": "Academic Author 10",
        "category": "Academic",
        "department": "Civil Engineering",
        "isbn": "978100000010X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 10,
        "title": "Civil Engineering Resource Volume 5",
        "author": "Academic Author 11",
        "category": "Academic",
        "department": "Civil Engineering",
        "isbn": "978100000011X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 11,
        "title": "CSE Resource Volume 1",
        "author": "Academic Author 12",
        "category": "Academic",
        "department": "CSE",
        "isbn": "978100000012X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 12,
        "title": "CSE Resource Volume 2",
        "author": "Academic Author 13",
        "category": "Academic",
        "department": "CSE",
        "isbn": "978100000013X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 13,
        "title": "CSE Resource Volume 3",
        "author": "Academic Author 14",
        "category": "Academic",
        "department": "CSE",
        "isbn": "978100000014X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 14,
        "title": "CSE Resource Volume 4",
        "author": "Academic Author 15",
        "category": "Academic",
        "department": "CSE",
        "isbn": "978100000015X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 15,
        "title": "CSE Resource Volume 5",
        "author": "Academic Author 16",
        "category": "Academic",
        "department": "CSE",
        "isbn": "978100000016X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 16,
        "title": "CSBS Resource Volume 1",
        "author": "Academic Author 17",
        "category": "Academic",
        "department": "CSBS",
        "isbn": "978100000017X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 17,
        "title": "CSBS Resource Volume 2",
        "author": "Academic Author 18",
        "category": "Academic",
        "department": "CSBS",
        "isbn": "978100000018X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 18,
        "title": "CSBS Resource Volume 3",
        "author": "Academic Author 19",
        "category": "Academic",
        "department": "CSBS",
        "isbn": "978100000019X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 19,
        "title": "CSBS Resource Volume 4",
        "author": "Academic Author 20",
        "category": "Academic",
        "department": "CSBS",
        "isbn": "978100000020X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 20,
        "title": "CSBS Resource Volume 5",
        "author": "Academic Author 21",
        "category": "Academic",
        "department": "CSBS",
        "isbn": "978100000021X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 21,
        "title": "CSE-DS Resource Volume 1",
        "author": "Academic Author 22",
        "category": "Academic",
        "department": "CSE-DS",
        "isbn": "978100000022X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 22,
        "title": "CSE-DS Resource Volume 2",
        "author": "Academic Author 23",
        "category": "Academic",
        "department": "CSE-DS",
        "isbn": "978100000023X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 23,
        "title": "CSE-DS Resource Volume 3",
        "author": "Academic Author 24",
        "category": "Academic",
        "department": "CSE-DS",
        "isbn": "978100000024X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 24,
        "title": "CSE-DS Resource Volume 4",
        "author": "Academic Author 25",
        "category": "Academic",
        "department": "CSE-DS",
        "isbn": "978100000025X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 25,
        "title": "CSE-DS Resource Volume 5",
        "author": "Academic Author 26",
        "category": "Academic",
        "department": "CSE-DS",
        "isbn": "978100000026X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 26,
        "title": "CSE-AIML Resource Volume 1",
        "author": "Academic Author 27",
        "category": "Academic",
        "department": "CSE-AIML",
        "isbn": "978100000027X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 27,
        "title": "CSE-AIML Resource Volume 2",
        "author": "Academic Author 28",
        "category": "Academic",
        "department": "CSE-AIML",
        "isbn": "978100000028X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 28,
        "title": "CSE-AIML Resource Volume 3",
        "author": "Academic Author 29",
        "category": "Academic",
        "department": "CSE-AIML",
        "isbn": "978100000029X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 29,
        "title": "CSE-AIML Resource Volume 4",
        "author": "Academic Author 30",
        "category": "Academic",
        "department": "CSE-AIML",
        "isbn": "978100000030X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 30,
        "title": "CSE-AIML Resource Volume 5",
        "author": "Academic Author 31",
        "category": "Academic",
        "department": "CSE-AIML",
        "isbn": "978100000031X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 31,
        "title": "CSE-IoT Resource Volume 1",
        "author": "Academic Author 32",
        "category": "Academic",
        "department": "CSE-IoT",
        "isbn": "978100000032X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 32,
        "title": "CSE-IoT Resource Volume 2",
        "author": "Academic Author 33",
        "category": "Academic",
        "department": "CSE-IoT",
        "isbn": "978100000033X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 33,
        "title": "CSE-IoT Resource Volume 3",
        "author": "Academic Author 34",
        "category": "Academic",
        "department": "CSE-IoT",
        "isbn": "978100000034X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 34,
        "title": "CSE-IoT Resource Volume 4",
        "author": "Academic Author 35",
        "category": "Academic",
        "department": "CSE-IoT",
        "isbn": "978100000035X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 35,
        "title": "CSE-IoT Resource Volume 5",
        "author": "Academic Author 36",
        "category": "Academic",
        "department": "CSE-IoT",
        "isbn": "978100000036X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 36,
        "title": "ECE Resource Volume 1",
        "author": "Academic Author 37",
        "category": "Academic",
        "department": "ECE",
        "isbn": "978100000037X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 37,
        "title": "ECE Resource Volume 2",
        "author": "Academic Author 38",
        "category": "Academic",
        "department": "ECE",
        "isbn": "978100000038X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 38,
        "title": "ECE Resource Volume 3",
        "author": "Academic Author 39",
        "category": "Academic",
        "department": "ECE",
        "isbn": "978100000039X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 39,
        "title": "ECE Resource Volume 4",
        "author": "Academic Author 40",
        "category": "Academic",
        "department": "ECE",
        "isbn": "978100000040X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 40,
        "title": "ECE Resource Volume 5",
        "author": "Academic Author 41",
        "category": "Academic",
        "department": "ECE",
        "isbn": "978100000041X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 41,
        "title": "EEE Resource Volume 1",
        "author": "Academic Author 42",
        "category": "Academic",
        "department": "EEE",
        "isbn": "978100000042X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 42,
        "title": "EEE Resource Volume 2",
        "author": "Academic Author 43",
        "category": "Academic",
        "department": "EEE",
        "isbn": "978100000043X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 43,
        "title": "EEE Resource Volume 3",
        "author": "Academic Author 44",
        "category": "Academic",
        "department": "EEE",
        "isbn": "978100000044X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 44,
        "title": "EEE Resource Volume 4",
        "author": "Academic Author 45",
        "category": "Academic",
        "department": "EEE",
        "isbn": "978100000045X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 45,
        "title": "EEE Resource Volume 5",
        "author": "Academic Author 46",
        "category": "Academic",
        "department": "EEE",
        "isbn": "978100000046X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 46,
        "title": "Information Technology Resource Volume 1",
        "author": "Academic Author 47",
        "category": "Academic",
        "department": "Information Technology",
        "isbn": "978100000047X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 47,
        "title": "Information Technology Resource Volume 2",
        "author": "Academic Author 48",
        "category": "Academic",
        "department": "Information Technology",
        "isbn": "978100000048X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 48,
        "title": "Information Technology Resource Volume 3",
        "author": "Academic Author 49",
        "category": "Academic",
        "department": "Information Technology",
        "isbn": "978100000049X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 49,
        "title": "Information Technology Resource Volume 4",
        "author": "Academic Author 50",
        "category": "Academic",
        "department": "Information Technology",
        "isbn": "978100000050X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 50,
        "title": "Information Technology Resource Volume 5",
        "author": "Academic Author 51",
        "category": "Academic",
        "department": "Information Technology",
        "isbn": "978100000051X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 51,
        "title": "Mechanical Engineering Resource Volume 1",
        "author": "Academic Author 52",
        "category": "Academic",
        "department": "Mechanical Engineering",
        "isbn": "978100000052X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 52,
        "title": "Mechanical Engineering Resource Volume 2",
        "author": "Academic Author 53",
        "category": "Academic",
        "department": "Mechanical Engineering",
        "isbn": "978100000053X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 53,
        "title": "Mechanical Engineering Resource Volume 3",
        "author": "Academic Author 54",
        "category": "Academic",
        "department": "Mechanical Engineering",
        "isbn": "978100000054X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 54,
        "title": "Mechanical Engineering Resource Volume 4",
        "author": "Academic Author 55",
        "category": "Academic",
        "department": "Mechanical Engineering",
        "isbn": "978100000055X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 55,
        "title": "Mechanical Engineering Resource Volume 5",
        "author": "Academic Author 56",
        "category": "Academic",
        "department": "Mechanical Engineering",
        "isbn": "978100000056X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 56,
        "title": "Computer Applications Resource Volume 1",
        "author": "Academic Author 57",
        "category": "Academic",
        "department": "Computer Applications",
        "isbn": "978100000057X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 57,
        "title": "Computer Applications Resource Volume 2",
        "author": "Academic Author 58",
        "category": "Academic",
        "department": "Computer Applications",
        "isbn": "978100000058X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 58,
        "title": "Computer Applications Resource Volume 3",
        "author": "Academic Author 59",
        "category": "Academic",
        "department": "Computer Applications",
        "isbn": "978100000059X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 59,
        "title": "Computer Applications Resource Volume 4",
        "author": "Academic Author 60",
        "category": "Academic",
        "department": "Computer Applications",
        "isbn": "978100000060X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 60,
        "title": "Computer Applications Resource Volume 5",
        "author": "Academic Author 61",
        "category": "Academic",
        "department": "Computer Applications",
        "isbn": "978100000061X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 61,
        "title": "Management Sciences Resource Volume 1",
        "author": "Academic Author 62",
        "category": "Academic",
        "department": "Management Sciences",
        "isbn": "978100000062X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 62,
        "title": "Management Sciences Resource Volume 2",
        "author": "Academic Author 63",
        "category": "Academic",
        "department": "Management Sciences",
        "isbn": "978100000063X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 63,
        "title": "Management Sciences Resource Volume 3",
        "author": "Academic Author 64",
        "category": "Academic",
        "department": "Management Sciences",
        "isbn": "978100000064X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 64,
        "title": "Management Sciences Resource Volume 4",
        "author": "Academic Author 65",
        "category": "Academic",
        "department": "Management Sciences",
        "isbn": "978100000065X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 65,
        "title": "Management Sciences Resource Volume 5",
        "author": "Academic Author 66",
        "category": "Academic",
        "department": "Management Sciences",
        "isbn": "978100000066X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 66,
        "title": "Mathematics & Humanities Resource Volume 1",
        "author": "Academic Author 67",
        "category": "Academic",
        "department": "Mathematics & Humanities",
        "isbn": "978100000067X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 67,
        "title": "Mathematics & Humanities Resource Volume 2",
        "author": "Academic Author 68",
        "category": "Academic",
        "department": "Mathematics & Humanities",
        "isbn": "978100000068X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 68,
        "title": "Mathematics & Humanities Resource Volume 3",
        "author": "Academic Author 69",
        "category": "Academic",
        "department": "Mathematics & Humanities",
        "isbn": "978100000069X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 69,
        "title": "Mathematics & Humanities Resource Volume 4",
        "author": "Academic Author 70",
        "category": "Academic",
        "department": "Mathematics & Humanities",
        "isbn": "978100000070X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 70,
        "title": "Mathematics & Humanities Resource Volume 5",
        "author": "Academic Author 71",
        "category": "Academic",
        "department": "Mathematics & Humanities",
        "isbn": "978100000071X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 71,
        "title": "Chemistry Resource Volume 1",
        "author": "Academic Author 72",
        "category": "Academic",
        "department": "Chemistry",
        "isbn": "978100000072X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 72,
        "title": "Chemistry Resource Volume 2",
        "author": "Academic Author 73",
        "category": "Academic",
        "department": "Chemistry",
        "isbn": "978100000073X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 73,
        "title": "Chemistry Resource Volume 3",
        "author": "Academic Author 74",
        "category": "Academic",
        "department": "Chemistry",
        "isbn": "978100000074X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 74,
        "title": "Chemistry Resource Volume 4",
        "author": "Academic Author 75",
        "category": "Academic",
        "department": "Chemistry",
        "isbn": "978100000075X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 75,
        "title": "Chemistry Resource Volume 5",
        "author": "Academic Author 76",
        "category": "Academic",
        "department": "Chemistry",
        "isbn": "978100000076X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 76,
        "title": "Physics Resource Volume 1",
        "author": "Academic Author 77",
        "category": "Academic",
        "department": "Physics",
        "isbn": "978100000077X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 77,
        "title": "Physics Resource Volume 2",
        "author": "Academic Author 78",
        "category": "Academic",
        "department": "Physics",
        "isbn": "978100000078X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 78,
        "title": "Physics Resource Volume 3",
        "author": "Academic Author 79",
        "category": "Academic",
        "department": "Physics",
        "isbn": "978100000079X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 79,
        "title": "Physics Resource Volume 4",
        "author": "Academic Author 80",
        "category": "Academic",
        "department": "Physics",
        "isbn": "978100000080X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    },
    {
        "id": 80,
        "title": "Physics Resource Volume 5",
        "author": "Academic Author 81",
        "category": "Academic",
        "department": "Physics",
        "isbn": "978100000081X",
        "available": 1,
        "stock_count": 5,
        "rating": 4.5,
        "image_url": "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600"
    }
];

const departmentImageMap = {
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

DB_BOOKS.forEach(book => {
    if (departmentImageMap[book.department]) {
        book.image_url = departmentImageMap[book.department];
    }
});

let mockCart = [];

/**
 * Mock Query Implementation for Development
 */
const mockQuery = async (sql, params) => {
    console.log('Using Mock DB for:', sql.substring(0, 50) + '...');

    // Simple User Registration Mock
    if (sql.includes('INSERT INTO users')) {
        const [uniqueId, name, email, password, role, department] = params;
        const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8') || '[]');

        if (users.find(u => u.unique_id.toLowerCase() === uniqueId.toLowerCase() || u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error('User already exists (unique_id or email)');
        }

        const newUser = { id: Date.now(), unique_id: uniqueId, name, email, password, role, department, is_approved: role === 'admin' };
        users.push(newUser);
        await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
        return [[{ id: newUser.id }]]; // matching PG return rows[0].id
    }

    // Simple Login Mock
    if (sql.includes('SELECT * FROM users WHERE LOWER(unique_id) = LOWER($1) AND role = $2')) {
        const [uniqueId, role] = params;

        // Mock Admin Override
        if (uniqueId.toLowerCase() === 'rvrlibadmin' && role === 'admin') {
            const bcrypt = require('bcryptjs');
            const hash = await bcrypt.hash('Rvrjc@1985', 10);
            return [[{ id: 9999, unique_id: 'RVRLIBADMIN', name: 'RVR Library Admin', email: 'admin@rvrjc.ac.in', password: hash, department: null, role: 'admin', is_approved: true }]];
        }

        const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8') || '[]');
        const user = users.find(u => u.unique_id.toLowerCase() === uniqueId.toLowerCase() && u.role === role);
        return [[user || undefined].filter(x => x)];
    }

    if (sql.includes('SELECT * FROM books')) {
        return [DB_BOOKS];
    }

    if (sql.includes('SELECT * FROM users WHERE LOWER(unique_id) = LOWER($1) AND LOWER(email) = LOWER($2)')) {
        const [uniqueId, email] = params;
        const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8') || '[]');
        const user = users.find(u => u.unique_id.toLowerCase() === uniqueId.toLowerCase() && u.email.toLowerCase() === email.toLowerCase());
        return [user ? [user] : []];
    }

    if (sql.includes('UPDATE users SET password = $1 WHERE id = $2')) {
        const [newPassword, id] = params;
        const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8') || '[]');
        const userIndex = users.findIndex(u => u.id === id);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
            return [[{ affectedRows: 1 }]];
        }
        return [[{ affectedRows: 0 }]];
    }

    if (sql.includes('WHERE is_approved = FALSE')) {
        const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8') || '[]');
        const pending = users.filter(u => !u.is_approved && u.role !== 'admin');
        return [pending];
    }

    if (sql.includes('UPDATE users SET is_approved = TRUE WHERE id = $1')) {
        const [id] = params;
        const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8') || '[]');
        const userIndex = users.findIndex(u => u.id === parseInt(id));
        if (userIndex !== -1) {
            users[userIndex].is_approved = true;
            await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
            return [[{ id: users[userIndex].id }]]; // Simulate RETURNING id
        }
        return [[]]; // Not found
    }

    if (sql.includes('FROM books WHERE id = $1')) {
        const bookId = parseInt(params[0]);
        const book = DB_BOOKS.find(b => b.id === bookId);
        return [book ? [book] : []];
    }

    // Cart Mocks
    if (sql.includes('INSERT INTO cart')) {
        const [userId, bookId] = params;
        const id = Date.now();
        mockCart.push({ id, user_id: userId, book_id: bookId, added_at: new Date() });
        return [[{ id }]];
    }

    if (sql.includes('SELECT c.id as cart_id, b.*') && sql.includes('FROM cart c')) {
        const userId = params[0];
        const userCartItems = mockCart.filter(item => item.user_id === userId);
        const results = userCartItems.map(item => {
            const book = DB_BOOKS.find(b => b.id === item.book_id);
            return { cart_id: item.id, ...book };
        });
        return [results];
    }

    if (sql.includes('DELETE FROM cart WHERE id = $1 AND user_id = $2')) {
        const [cartId, userId] = params;
        const initialLen = mockCart.length;
        mockCart = mockCart.filter(c => !(c.id == cartId && c.user_id == userId));
        return [[], null, { rowCount: initialLen - mockCart.length }];
    }

    return [[]]; // Default empty
};

/**
 * Test Database Connection on Startup
 */
const testConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to the PostgreSQL database.');
        client.release();
    } catch (err) {
        console.warn('CRITICAL: Unable to connect to PostgreSQL. Falling back to Mock JSON database.');
        console.warn('Reason:', err.code || err.message);
        useMock = true;
    }
};

/**
 * Initialize Database Schema
 */
const initDB = async () => {
    try {
        await testConnection();
        if (useMock) return;

        const client = await pool.connect();

        // Users Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                unique_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                department VARCHAR(100),
                role VARCHAR(20) DEFAULT 'student',
                is_approved BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Books Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS books (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                department VARCHAR(100),
                isbn VARCHAR(20) UNIQUE,
                available BOOLEAN DEFAULT TRUE,
                stock_count INT DEFAULT 1,
                rating DECIMAL(2,1) DEFAULT 4.0,
                image_url TEXT
            )
        `);

        // Issued Books Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS issued_books (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                book_id INT NOT NULL,
                branch VARCHAR(100),
                issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                due_date TIMESTAMP,
                returned_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
            )
        `);

        // Add columns for existing databases
        try { await client.query('ALTER TABLE issued_books ADD COLUMN IF NOT EXISTS branch VARCHAR(100);'); } catch (e) { console.warn('Could not alter issued_books branch', e.message); }
        try { await client.query('ALTER TABLE issued_books ADD COLUMN IF NOT EXISTS due_date TIMESTAMP;'); } catch (e) { console.warn('Could not alter issued_books due_date', e.message); }

        // Cart Table
        await client.query(`
            CREATE TABLE IF NOT EXISTS cart (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                book_id INT NOT NULL,
                added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
            )
        `);

        const res = await client.query('SELECT COUNT(*) as count FROM books');
        if (parseInt(res.rows[0].count) === 0) {
            for (const book of DB_BOOKS) {
                await client.query(
                    'INSERT INTO books (id, title, author, category, department, isbn, available, stock_count, rating, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING',
                    [book.id, book.title, book.author, book.category, book.department, book.isbn, book.available, book.stock_count, book.rating, book.image_url]
                );
            }
            console.log('Seeded books table with ' + DB_BOOKS.length + ' books.');
        }

        // Seed Default Admin User
        const adminCheck = await client.query('SELECT id FROM users WHERE unique_id = $1', ['RVRLIBADMIN']);
        if (adminCheck.rows.length === 0) {
            const bcrypt = require('bcryptjs');
            const adminPassword = await bcrypt.hash('Rvrjc@1985', 10);
            await client.query(
                'INSERT INTO users (unique_id, name, email, password, role, is_approved) VALUES ($1, $2, $3, $4, $5, $6)',
                ['RVRLIBADMIN', 'RVR Library Admin', 'admin@rvrjc.ac.in', adminPassword, 'admin', true]
            );
            console.log('Seeded default admin user: RVRLIBADMIN');
        }

        client.release();
        console.log('Database tables verified/created successfully.');

    } catch (err) {
        console.error('Error during database initialization:', err);
    }
};

// Run initialization
initDB();

const mockConnection = {
    query: mockQuery,
    beginTransaction: async () => console.log('Mock Transaction Started'),
    commit: async () => console.log('Mock Transaction Committed'),
    rollback: async () => console.log('Mock Transaction Rolled Back'),
    release: () => { }
};

module.exports = {
    query: async (sql, params) => {
        if (useMock) return mockQuery(sql, params);
        const result = await pool.query(sql, params);
        return [result.rows, result.fields, result];
    },
    getConnection: async () => {
        if (useMock) return mockConnection;
        const client = await pool.connect();
        return {
            query: async (sql, params) => {
                const result = await client.query(sql, params);
                return [result.rows, result.fields, result];
            },
            beginTransaction: () => client.query('BEGIN'),
            commit: () => client.query('COMMIT'),
            rollback: () => client.query('ROLLBACK'),
            release: () => client.release()
        };
    },
    pool
};
